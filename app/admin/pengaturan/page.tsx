"use client";
import React, { useState } from 'react';
import { Settings, Phone, Mail, MapPin, HelpCircle, Plus, Edit, Trash2, Save, MessageCircle, User, Lock } from 'lucide-react';
import FAQModal from '@/app/admin/pengaturan/tambah/page';

interface ContactInfo {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface Fee {
  simA: number;
  simB1: number;
  simB2: number;
  simC: number;
}

interface UserProfile {
  name: string;
  email: string;
  username: string;
}

interface SettingsPageProps {
  userRole?: string;
}

export default function SettingsPage({ userRole }: SettingsPageProps = {}) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '',
    email: '',
    whatsapp: '',
    address: ''
  });
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState<Fee>({
    simA: 0,
    simB1: 0,
    simB2: 0,
    simC: 0
  });
  const [isFeeEditing, setIsFeeEditing] = useState(false);
  const [feeFormData, setFeeFormData] = useState<Fee>({
    simA: 0,
    simB1: 0,
    simB2: 0,
    simC: 0
  });
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', email: '', username: '' });
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileFormData, setProfileFormData] = useState<UserProfile>({ name: '', email: '', username: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  React.useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUserRole(data.user.role);
          setUserProfile({ name: data.user.name, email: data.user.email, username: data.user.username });
          setProfileFormData({ name: data.user.name, email: data.user.email, username: data.user.username });
        }
      });
  }, []);

  const fetchData = async () => {
    try {
      const [faqResponse, contactResponse, feeResponse] = await Promise.all([
        fetch('/api/faq'),
        fetch('/api/contact'),
        fetch('/api/fees')
      ]);
      
      if (faqResponse.ok) {
        const faqData = await faqResponse.json();
        setFAQs(faqData);
      } else {
        console.error('FAQ fetch failed:', faqResponse.status);
      }
      
      if (contactResponse.ok) {
        const contactData = await contactResponse.json();
        if (contactData) {
          setContactInfo(contactData);
        }
      } else {
        console.error('Contact fetch failed:', contactResponse.status);
      }
      
      if (feeResponse.ok) {
        const feeData = await feeResponse.json();
        setFees(feeData);
        setFeeFormData(feeData);
      } else {
        console.error('Fee fetch failed:', feeResponse.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);
  const [isContactEditing, setIsContactEditing] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [contactFormData, setContactFormData] = useState<ContactInfo>({
    phone: '',
    email: '',
    whatsapp: '',
    address: ''
  });

  const handleContactEdit = () => {
    setContactFormData(contactInfo);
    setIsContactEditing(true);
  };

  const handleContactSave = async () => {
    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactFormData)
      });
      
      if (response.ok) {
        const updatedContact = await response.json();
        setContactInfo(updatedContact);
        setIsContactEditing(false);
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
    }
  };

  const handleContactCancel = () => {
    setContactFormData(contactInfo);
    setIsContactEditing(false);
  };

  const handleContactInputChange = (field: keyof ContactInfo, value: string) => {
    setContactFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeeEdit = () => {
    setFeeFormData(fees);
    setIsFeeEditing(true);
  };

  const handleFeeSave = async () => {
    try {
      const response = await fetch('/api/fees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feeFormData)
      });
      
      if (response.ok) {
        const updatedFees = await response.json();
        setFees(updatedFees);
        setIsFeeEditing(false);
      }
    } catch (error) {
      console.error('Error saving fees:', error);
    }
  };

  const handleFeeCancel = () => {
    setFeeFormData(fees);
    setIsFeeEditing(false);
  };

  const handleFeeInputChange = (field: keyof Fee, value: string) => {
    const numValue = parseInt(value) || 0;
    setFeeFormData(prev => ({ ...prev, [field]: numValue }));
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

  const handleDeleteFAQ = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
      try {
        const response = await fetch(`/api/faq/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setFAQs(prev => prev.filter(faq => faq.id !== id));
        }
      } catch (error) {
        console.error('Error deleting FAQ:', error);
      }
    }
  };

  const handleSaveFAQ = async (faqData: Omit<FAQ, 'id'>) => {
    try {
      if (editingFAQ) {
        const response = await fetch(`/api/faq/${editingFAQ.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(faqData)
        });
        if (response.ok) {
          const updatedFaq = await response.json();
          setFAQs(prev => prev.map(faq => 
            faq.id === editingFAQ.id ? updatedFaq : faq
          ));
        }
      } else {
        const response = await fetch('/api/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(faqData)
        });
        if (response.ok) {
          const newFaq = await response.json();
          setFAQs(prev => [newFaq, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  const handleCloseFAQModal = () => {
    setIsFAQModalOpen(false);
    setEditingFAQ(null);
  };

  const handleProfileEdit = () => {
    setProfileFormData(userProfile);
    setIsProfileEditing(true);
  };

  const handleProfileSave = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileFormData)
      });
      
      if (response.ok) {
        const updatedProfile = await response.json();
        setUserProfile(updatedProfile.user);
        setIsProfileEditing(false);
        alert('Profil berhasil diperbarui');
      } else {
        alert('Gagal memperbarui profil');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Terjadi kesalahan saat menyimpan profil');
    }
  };

  const handleProfileCancel = () => {
    setProfileFormData(userProfile);
    setIsProfileEditing(false);
  };

  const handleProfileInputChange = (field: keyof UserProfile, value: string) => {
    setProfileFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password baru minimal 6 karakter');
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      if (response.ok) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsChangingPassword(false);
        alert('Password berhasil diubah');
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal mengubah password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Terjadi kesalahan saat mengubah password');
    }
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

      {/* User Profile Section - Available for All Roles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <User className="mr-2 text-blue-600" size={20} />
              Profil Pengguna
            </h3>
            {!isProfileEditing ? (
              <button
                onClick={handleProfileEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleProfileSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Simpan</span>
                </button>
                <button
                  onClick={handleProfileCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            {isProfileEditing ? (
              <input
                type="text"
                value={profileFormData.name}
                onChange={(e) => handleProfileInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">{userProfile.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            {isProfileEditing ? (
              <input
                type="email"
                value={profileFormData.email}
                onChange={(e) => handleProfileInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">{userProfile.email}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">{userProfile.username}</p>
            <p className="text-xs text-gray-500 mt-1">Username tidak dapat diubah</p>
          </div>

          {/* Change Password */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                <Lock className="mr-2 text-blue-600" size={16} />
                Ubah Password
              </h4>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ubah Password
                </button>
              )}
            </div>

            {isChangingPassword && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Saat Ini
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan password saat ini"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Minimal 6 karakter"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ulangi password baru"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePasswordChange}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Simpan Password
                  </button>
                  <button
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information Section - Only for Super Admin */}
      {currentUserRole === 'super_admin' && (
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

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageCircle size={16} className="inline mr-2" />
              Nomor WhatsApp
            </label>
            {isContactEditing ? (
              <input
                type="text"
                value={contactFormData.whatsapp}
                onChange={(e) => handleContactInputChange('whatsapp', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">{contactInfo.whatsapp}</p>
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
      )}

      {/* Fee Management Section - Only for Super Admin */}
      {currentUserRole === 'super_admin' && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Biaya SIM</h3>
              {currentUserRole !== 'super_admin' && (
                <p className="text-xs text-gray-500 mt-1">Hanya Super Admin yang dapat mengedit biaya</p>
              )}
            </div>
            {currentUserRole === 'super_admin' && (
              !isFeeEditing ? (
                <button
                  onClick={handleFeeEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleFeeSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Save size={16} />
                    <span>Simpan</span>
                  </button>
                  <button
                    onClick={handleFeeCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Batal
                  </button>
                </div>
              )
            )}
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SIM A */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biaya SIM A
            </label>
            {isFeeEditing ? (
              <input
                type="number"
                value={feeFormData.simA}
                onChange={(e) => handleFeeInputChange('simA', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">Rp {fees.simA.toLocaleString('id-ID')}</p>
            )}
          </div>

          {/* SIM B1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biaya SIM B1
            </label>
            {isFeeEditing ? (
              <input
                type="number"
                value={feeFormData.simB1}
                onChange={(e) => handleFeeInputChange('simB1', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">Rp {fees.simB1.toLocaleString('id-ID')}</p>
            )}
          </div>

          {/* SIM B2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biaya SIM B2
            </label>
            {isFeeEditing ? (
              <input
                type="number"
                value={feeFormData.simB2}
                onChange={(e) => handleFeeInputChange('simB2', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">Rp {fees.simB2.toLocaleString('id-ID')}</p>
            )}
          </div>

          {/* SIM C */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biaya SIM C
            </label>
            {isFeeEditing ? (
              <input
                type="number"
                value={feeFormData.simC}
                onChange={(e) => handleFeeInputChange('simC', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">Rp {fees.simC.toLocaleString('id-ID')}</p>
            )}
          </div>
        </div>
      </div>
      )}

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
                  Kategori
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Belum ada FAQ
                  </td>
                </tr>
              ) : faqs.map((faq) => (
                <tr key={faq.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {faq.question}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {faq.category || 'Umum'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-md">
                      {truncateText(faq.answer, 100)}
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