import React, { useState, useEffect } from 'react';
import { X, FileText, Calendar, MapPin, Users, AlertCircle } from 'lucide-react';

interface Report {
  id: number;
  tanggal: string;
  lokasi: string;
  jumlah: string;
  status: string;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: Omit<Report, 'id'>) => void;
  editingReport?: Report | null;
}

export default function ReportModal({ isOpen, onClose, onSave, editingReport }: ReportModalProps) {
  const [formData, setFormData] = useState({
    tanggal: '',
    lokasi: '',
    jumlah: '',
    status: 'selesai'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingReport) {
      setFormData({
        tanggal: editingReport.tanggal,
        lokasi: editingReport.lokasi,
        jumlah: editingReport.jumlah,
        status: 'selesai'
      });
    } else {
      setFormData({
        tanggal: '',
        lokasi: '',
        jumlah: '',
        status: 'selesai'
      });
    }
    setErrors({});
  }, [editingReport, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal harus diisi';
    }

    if (!formData.lokasi.trim()) {
      newErrors.lokasi = 'Lokasi harus diisi';
    }

    if (!formData.jumlah.trim()) {
      newErrors.jumlah = 'Jumlah dilayani harus diisi';
    } else if (isNaN(Number(formData.jumlah)) || Number(formData.jumlah) < 0) {
      newErrors.jumlah = 'Jumlah harus berupa angka positif';
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingReport ? 'Edit Laporan' : 'Tambah Laporan Baru'}
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
              Tanggal Layanan
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
              Lokasi Layanan
            </label>
            <input
              type="text"
              value={formData.lokasi}
              onChange={(e) => handleInputChange('lokasi', e.target.value)}
              placeholder="Masukkan lokasi layanan"
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

          {/* Jumlah Dilayani */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users size={16} className="inline mr-2" />
              Jumlah Dilayani
            </label>
            <input
              type="number"
              value={formData.jumlah}
              onChange={(e) => handleInputChange('jumlah', e.target.value)}
              placeholder="Masukkan jumlah yang dilayani"
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.jumlah ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.jumlah && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.jumlah}
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
              {editingReport ? 'Simpan Perubahan' : 'Tambah Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}