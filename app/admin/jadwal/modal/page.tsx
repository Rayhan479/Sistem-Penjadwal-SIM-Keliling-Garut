import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import LocationMap from '@/components/LocationMap';
import Image from 'next/image';

interface Schedule {
  id: number;
  judul: string;
  tanggal: string;
  lokasi: string;
  alamatLengkap?: string;
  latitude?: number;
  longitude?: number;
  waktuMulai: string;
  waktuSelesai: string;
  jumlahKuota: number;
  status: string;
  gambar?: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: Omit<Schedule, 'id'>) => void;
  editingSchedule?: Schedule | null;
}

export default function ScheduleModal({ isOpen, onClose, onSave, editingSchedule }: ScheduleModalProps) {
  const [formData, setFormData] = useState({
    judul: '',
    tanggal: '',
    lokasi: '',
    alamatLengkap: '',
    latitude: -7.2,
    longitude: 107.9,
    waktuMulai: '',
    waktuSelesai: '',
    jumlahKuota: 100,
    status: 'terjadwal',
    gambar: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingSchedule) {
      const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };
      
      setFormData({
        judul: editingSchedule.judul,
        tanggal: formatDateForInput(editingSchedule.tanggal),
        lokasi: editingSchedule.lokasi,
        alamatLengkap: editingSchedule.alamatLengkap || '',
        latitude: editingSchedule.latitude || -7.2,
        longitude: editingSchedule.longitude || 107.9,
        waktuMulai: editingSchedule.waktuMulai,
        waktuSelesai: editingSchedule.waktuSelesai,
        jumlahKuota: editingSchedule.jumlahKuota || 100,
        status: editingSchedule.status,
        gambar: editingSchedule.gambar || ''
      });
      setPreviewUrl(editingSchedule.gambar || '');
    } else {
      setFormData({
        judul: '',
        tanggal: '',
        lokasi: '',
        alamatLengkap: '',
        latitude: -7.2,
        longitude: 107.9,
        waktuMulai: '',
        waktuSelesai: '',
        jumlahKuota: 100,
        status: 'terjadwal',
        gambar: ''
      });
      setPreviewUrl('');
    }
    setSelectedFile(null);
    setErrors({});
  }, [editingSchedule, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.judul.trim()) {
      newErrors.judul = 'Judul harus diisi';
    }

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
      const submitData = { ...formData };
      if (selectedFile) {
        submitData.gambar = URL.createObjectURL(selectedFile);
      }
      onSave(submitData);
      setTimeout(() => onClose(), 100);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData(prev => ({ ...prev, gambar: url }));
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, gambar: '' }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul
            </label>
            <input
              type="text"
              value={formData.judul}
              onChange={(e) => handleInputChange('judul', e.target.value)}
              placeholder="Masukkan judul jadwal"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.judul ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.judul && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.judul}
              </p>
            )}
          </div>

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

          {/* Alamat Lengkap */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat Lengkap
            </label>
            <textarea
              value={formData.alamatLengkap}
              onChange={(e) => handleInputChange('alamatLengkap', e.target.value)}
              placeholder="Masukkan alamat lengkap (opsional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Lokasi Map */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-2" />
              Lokasi Map
            </label>
            <LocationMap
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationChange={handleLocationChange}
            />
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

          {/* Jumlah Kuota */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Kuota
            </label>
            <input
              type="number"
              min="1"
              value={formData.jumlahKuota}
              onChange={(e) => handleInputChange('jumlahKuota', e.target.value)}
              placeholder="Masukkan jumlah kuota"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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

          {/* Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon size={16} className="inline mr-2" />
              Gambar Lokasi (Opsional)
            </label>
            
            {!previewUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Klik untuk upload gambar</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG hingga 5MB</p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
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
              {editingSchedule ? 'Simpan Perubahan' : 'Tambah Jadwal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}