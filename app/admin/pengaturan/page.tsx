"use client";
import React, { useState } from 'react';
import { Settings, Phone, Mail, MapPin, HelpCircle, Plus, Edit, Trash2, Save } from 'lucide-react';
import FAQModal from '@/app/admin/pengaturan/tambah/page';

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

interface FAQ {
  id: number;
  pertanyaan: string;
  jawaban: string;
}

const initialContactInfo: ContactInfo = {
  phone: '021-1500-000',
  email: 'info@simkeliling.go.id',
  address: 'Jl. Jenderal Sudirman No. 123, Jakarta Pusat 10270'
};

const initialFAQs: FAQ[] = [
  {
    id: 1,
    pertanyaan: 'Apa saja syarat untuk perpanjangan SIM?',
    jawaban: 'Syarat perpanjangan SIM meliputi: KTP asli dan fotokopi, SIM lama, surat keterangan sehat dari dokter, dan pas foto 4x6 latar belakang merah sebanyak 2 lembar.'
  },
  {
    id: 2,
    pertanyaan: 'Berapa lama proses perpanjangan SIM?',
    jawaban: 'Proses perpanjangan SIM memakan waktu sekitar 30-45 menit, tergantung antrian dan kelengkapan dokumen yang dibawa.'
  },
  {
    id: 3,
    pertanyaan: 'Apakah bisa perpanjangan SIM untuk orang lain?',
    jawaban: 'Perpanjangan SIM harus dilakukan oleh pemilik SIM yang bersangkutan. Tidak dapat diwakilkan kepada orang lain.'
  },
  {
    id: 4,
    pertanyaan: 'Bagaimana cara mengetahui jadwal SIM Keliling?',
    jawaban: 'Jadwal SIM Keliling dapat dilihat di website resmi, aplikasi mobile, atau menghubungi call center di nomor 021-1500-000.'
  },
  {
    id: 5,
    pertanyaan: 'Apakah ada biaya untuk layanan SIM Keliling?',
    jawaban: 'Biaya perpanjangan SIM sesuai dengan tarif resmi yang berlaku. Untuk SIM A: Rp 120.000, SIM B1: Rp 100.000, SIM C: Rp 75.000.'
  }
];

export default function SettingsPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo);
  const [faqs, setFAQs] = useState<FAQ[]>(initialFAQs);
  const [isContactEditing, setIsContactEditing] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [contactFormData, setContactFormData] = useState<ContactInfo>(initialContactInfo);

  const handleContactEdit = () => {
    setContactFormData(contactInfo);
    setIsContactEditing(true);
  };

  const handleContactSave = () => {
    setContactInfo(contactFormData);
    setIsContactEditing(false);
  };

  const handleContactCancel = () => {
    setContactFormData(contactInfo);
    setIsContactEditing(false);
  };

  const handleContactInputChange = (field: keyof ContactInfo, value: string) => {
    setContactFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddFAQ = () => {
    setEditingFAQ(null);
    setIsFAQModalOpen(true);
  };

  const handleEditFAQ = (id: number) => {
    const faq = faqs.find(f => f.id === id);
    if (faq) {
      setEditingFAQ(faq);
      setIsFAQModalOpen(true);
    }
  };

  const handleDeleteFAQ = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
      setFAQs(prev => prev.filter(faq => faq.id !== id));
    }
  };

  const handleSaveFAQ = (faqData: Omit<FAQ, 'id'>) => {
    if (editingFAQ) {
      // Update existing FAQ
      setFAQs(prev => prev.map(faq => 
        faq.id === editingFAQ.id 
          ? { ...faqData, id: editingFAQ.id }
          : faq
      ));
    } else {
      // Add new FAQ
      const newId = Math.max(...faqs.map(f => f.id)) + 1;
      setFAQs(prev => [...prev, { ...faqData, id: newId }]);
    }
  };

  const handleCloseFAQModal = () => {
    setIsFAQModalOpen(false);
    setEditingFAQ(null);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center">
          <Settings className="mr-3 text-blue-600" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>
            <p className="text-gray-600 mt-1">Kelola informasi kontak dan FAQ sistem</p>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Informasi Kontak</h3>
            {!isContactEditing ? (
              <button
                onClick={handleContactEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleContactSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Simpan</span>
                </button>
                <button
                  onClick={handleContactCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone size={16} className="inline mr-2" />
              Nomor Telepon
            </label>
            {isContactEditing ? (
              <input
                type="text"
                value={contactFormData.phone}
                onChange={(e) => handleContactInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">{contactInfo.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} className="inline mr-2" />
              Email
            </label>
            {isContactEditing ? (
              <input
                type="email"
                value={contactFormData.email}
                onChange={(e) => handleContactInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">{contactInfo.email}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-2" />
              Alamat
            </label>
            {isContactEditing ? (
              <textarea
                value={contactFormData.address}
                onChange={(e) => handleContactInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">{contactInfo.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <HelpCircle className="mr-2 text-blue-600" size={20} />
                FAQ (Frequently Asked Questions)
              </h3>
              <p className="text-sm text-gray-600 mt-1">Total {faqs.length} pertanyaan</p>
            </div>
            <button
              onClick={handleAddFAQ}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Tambah FAQ</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pertanyaan
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jawaban
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {faqs.map((faq) => (
                <tr key={faq.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {faq.pertanyaan}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-md">
                      {truncateText(faq.jawaban, 100)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditFAQ(faq.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteFAQ(faq.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Modal */}
      <FAQModal
        isOpen={isFAQModalOpen}
        onClose={handleCloseFAQModal}
        onSave={handleSaveFAQ}
        editingFAQ={editingFAQ}
      />
    </div>
  );
}