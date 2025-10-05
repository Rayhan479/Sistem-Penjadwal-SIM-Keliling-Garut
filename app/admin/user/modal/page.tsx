"use client";
import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface User {
  id: number;
  nama: string;
  email: string;
  telepon: string;
  role: string;
  status: string;
  tanggalDibuat: string;
  terakhirLogin: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'tanggalDibuat' | 'terakhirLogin'>) => void;
  editingUser?: User | null;
}

export default function UserModal({ isOpen, onClose, onSave, editingUser }: UserModalProps) {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    role: 'petugas',
    status: 'aktif',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        nama: editingUser.nama,
        email: editingUser.email,
        telepon: editingUser.telepon,
        role: editingUser.role,
        status: editingUser.status,
        password: '',
        confirmPassword: ''
      });
    } else {
      setFormData({
        nama: '',
        email: '',
        telepon: '',
        role: 'petugas',
        status: 'aktif',
        password: '',
        confirmPassword: ''
      });
    }
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [editingUser, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Nama validation
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama harus diisi';
    } else if (formData.nama.trim().length < 3) {
      newErrors.nama = 'Nama minimal 3 karakter';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Telepon validation
    if (!formData.telepon.trim()) {
      newErrors.telepon = 'Nomor telepon harus diisi';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.telepon)) {
      newErrors.telepon = 'Format nomor telepon tidak valid';
    }

    // Password validation (only for new users or when password is provided)
    if (!editingUser || formData.password) {
      if (!formData.password) {
        newErrors.password = 'Password harus diisi';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password minimal 6 karakter';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const { password, confirmPassword, ...userData } = formData;
      onSave(userData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const roleOptions = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'operator', label: 'Operator' },
    { value: 'petugas', label: 'Petugas' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingUser ? 'Edit User' : 'Tambah User Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-2" />
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => handleInputChange('nama', e.target.value)}
              placeholder="Masukkan nama lengkap"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.nama ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nama && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.nama}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Masukkan alamat email"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Telepon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone size={16} className="inline mr-2" />
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={formData.telepon}
              onChange={(e) => handleInputChange('telepon', e.target.value)}
              placeholder="Masukkan nomor telepon"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.telepon ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.telepon && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.telepon}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Shield size={16} className="inline mr-2" />
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password {editingUser && <span className="text-gray-500">(kosongkan jika tidak ingin mengubah)</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder={editingUser ? 'Masukkan password baru' : 'Masukkan password'}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Konfirmasi password"
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {editingUser ? 'Simpan Perubahan' : 'Tambah User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}