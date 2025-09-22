import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, AlertCircle } from 'lucide-react';

interface Schedule {
  id: number;
  tanggal: string;
  lokasi: string;
  waktuMulai: string;
  waktuSelesai: string;
  status: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: Omit<Schedule, 'id'>) => void;
  editingSchedule?: Schedule | null;
}

export default function ScheduleModal({ isOpen, onClose, onSave, editingSchedule }: ScheduleModalProps) {
  const [formData, setFormData] = useState({
    tanggal: '',
    lokasi: '',
    waktuMulai: '',
    waktuSelesai: '',
    status: 'terjadwal'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingSchedule) {
      setFormData({
        tanggal: editingSchedule.tanggal,
        lokasi: editingSchedule.lokasi,
        waktuMulai: editingSchedule.waktuMulai,
        waktuSelesai: editingSchedule.waktuSelesai,
        status: editingSchedule.status
      });
    } else {
      setFormData({
        tanggal: '',
        lokasi: '',
        waktuMulai: '',
        waktuSelesai: '',
        status: 'terjadwal'
      });
    }
    setErrors({});
  }, [editingSchedule, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal harus diisi';
    }

    if (!formData.lokasi.trim()) {
      newErrors.lokasi = 'Lokasi harus diisi';
    }

    if (!formData.waktuMulai) {
      newErrors.waktuMulai = 'Waktu mulai harus diisi';
    }

    if (!formData.waktuSelesai) {
      newErrors.waktuSelesai = 'Waktu selesai harus diisi';
    }

    if (formData.waktuMulai && formData.waktuSelesai && formData.waktuMulai >= formData.waktuSelesai) {
      newErrors.waktuSelesai = 'Waktu selesai harus lebih besar dari waktu mulai';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingSchedule ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
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
          {/* Tanggal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-2" />
              Tanggal
            </label>
            <input
              type="date"
              value={formData.tanggal}
              onChange={(e) => handleInputChange('tanggal', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.tanggal ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.tanggal && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.tanggal}
              </p>
            )}
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-2" />
              Lokasi
            </label>
            <input
              type="text"
              value={formData.lokasi}
              onChange={(e) => handleInputChange('lokasi', e.target.value)}
              placeholder="Masukkan lokasi (contoh: Kelurahan Menteng)"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.lokasi ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lokasi && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.lokasi}
              </p>
            )}
          </div>

          {/* Waktu Mulai */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-2" />
              Waktu Mulai
            </label>
            <input
              type="time"
              value={formData.waktuMulai}
              onChange={(e) => handleInputChange('waktuMulai', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.waktuMulai ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.waktuMulai && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.waktuMulai}
              </p>
            )}
          </div>

          {/* Waktu Selesai */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-2" />
              Waktu Selesai
            </label>
            <input
              type="time"
              value={formData.waktuSelesai}
              onChange={(e) => handleInputChange('waktuSelesai', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.waktuSelesai ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.waktuSelesai && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.waktuSelesai}
              </p>
            )}
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
              <option value="terjadwal">Terjadwal</option>
              <option value="berlangsung">Berlangsung</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
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
              {editingSchedule ? 'Simpan Perubahan' : 'Tambah Jadwal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}