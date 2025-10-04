import React, { useState, useEffect } from 'react';
import { X, FileText, Calendar, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Announcement {
  id: number;
  judul: string;
  tanggal: string;
  isi: string;
  gambar?: string;
}

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (announcement: Omit<Announcement, 'id'>) => void;
  editingAnnouncement?: Announcement | null;
}

export default function AnnouncementModal({ isOpen, onClose, onSave, editingAnnouncement }: AnnouncementModalProps) {
  const [formData, setFormData] = useState({
    judul: '',
    tanggal: '',
    isi: '',
    gambar: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingAnnouncement) {
      setFormData({
        judul: editingAnnouncement.judul,
        tanggal: editingAnnouncement.tanggal,
        isi: editingAnnouncement.isi,
        gambar: editingAnnouncement.gambar || ''
      });
      setPreviewUrl(editingAnnouncement.gambar || '');
    } else {
      setFormData({
        judul: '',
        tanggal: '',
        isi: '',
        gambar: ''
      });
      setPreviewUrl('');
    }
    setSelectedFile(null);
    setErrors({});
  }, [editingAnnouncement, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.judul.trim()) {
      newErrors.judul = 'Judul harus diisi';
    }

    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal harus diisi';
    }

    if (!formData.isi.trim()) {
      newErrors.isi = 'Isi pengumuman harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = { ...formData };
      if (selectedFile) {
        // In real app, upload file and get URL
        submitData.gambar = URL.createObjectURL(selectedFile);
      }
      onSave(submitData);
      onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingAnnouncement ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'}
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
              <FileText size={16} className="inline mr-2" />
              Judul Pengumuman
            </label>
            <input
              type="text"
              value={formData.judul}
              onChange={(e) => handleInputChange('judul', e.target.value)}
              placeholder="Masukkan judul pengumuman"
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
              Tanggal Pengumuman
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

          {/* Isi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Isi Pengumuman
            </label>
            <textarea
              value={formData.isi}
              onChange={(e) => handleInputChange('isi', e.target.value)}
              placeholder="Masukkan isi pengumuman..."
              rows={6}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
                errors.isi ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.isi && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.isi}
              </p>
            )}
          </div>

          {/* Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon size={16} className="inline mr-2" />
              Gambar Pengumuman (Opsional)
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
              {editingAnnouncement ? 'Simpan Perubahan' : 'Tambah Pengumuman'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}