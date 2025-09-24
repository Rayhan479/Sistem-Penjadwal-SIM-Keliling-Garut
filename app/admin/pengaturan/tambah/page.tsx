import React, { useState, useEffect } from 'react';
import { X, HelpCircle, MessageSquare, AlertCircle } from 'lucide-react';

interface FAQ {
  id: number;
  pertanyaan: string;
  jawaban: string;
}

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faq: Omit<FAQ, 'id'>) => void;
  editingFAQ?: FAQ | null;
}

export default function FAQModal({ isOpen, onClose, onSave, editingFAQ }: FAQModalProps) {
  const [formData, setFormData] = useState({
    pertanyaan: '',
    jawaban: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingFAQ) {
      setFormData({
        pertanyaan: editingFAQ.pertanyaan,
        jawaban: editingFAQ.jawaban
      });
    } else {
      setFormData({
        pertanyaan: '',
        jawaban: ''
      });
    }
    setErrors({});
  }, [editingFAQ, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.pertanyaan.trim()) {
      newErrors.pertanyaan = 'Pertanyaan harus diisi';
    }

    if (!formData.jawaban.trim()) {
      newErrors.jawaban = 'Jawaban harus diisi';
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
            {editingFAQ ? 'Edit FAQ' : 'Tambah FAQ Baru'}
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
          {/* Pertanyaan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <HelpCircle size={16} className="inline mr-2" />
              Pertanyaan
            </label>
            <input
              type="text"
              value={formData.pertanyaan}
              onChange={(e) => handleInputChange('pertanyaan', e.target.value)}
              placeholder="Masukkan pertanyaan yang sering ditanyakan"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.pertanyaan ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.pertanyaan && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.pertanyaan}
              </p>
            )}
          </div>

          {/* Jawaban */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare size={16} className="inline mr-2" />
              Jawaban
            </label>
            <textarea
              value={formData.jawaban}
              onChange={(e) => handleInputChange('jawaban', e.target.value)}
              placeholder="Masukkan jawaban untuk pertanyaan tersebut..."
              rows={6}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
                errors.jawaban ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.jawaban && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.jawaban}
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
              {editingFAQ ? 'Simpan Perubahan' : 'Tambah FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}