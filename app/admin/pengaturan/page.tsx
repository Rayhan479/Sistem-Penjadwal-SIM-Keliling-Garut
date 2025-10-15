"use client";
import React, { useState } from "react";
import {
  Settings,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  MessageCircle,
  User,
  Lock,
} from "lucide-react";
import FAQModal from "@/app/admin/pengaturan/modal/page";

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

interface SimCategory {
  id: number;
  code: string;
  name: string;
  description: string | null;
  price: number;
  isDefault: boolean;
}

interface SmtpSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  secure: boolean;
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
    phone: "",
    email: "",
    whatsapp: "",
    address: "",
  });
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [simCategories, setSimCategories] = useState<SimCategory[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({ code: '', name: '', description: '', price: 0 });
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    username: "",
  });
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileFormData, setProfileFormData] = useState<UserProfile>({
    name: "",
    email: "",
    username: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [notification, setNotification] = useState<{show: boolean; message: string}>({show: false, message: ''});
  const [smtpSettings, setSmtpSettings] = useState<SmtpSettings>({
    host: '',
    port: 587,
    username: '',
    password: '',
    secure: false,
  });
  const [isSmtpEditing, setIsSmtpEditing] = useState(false);
  const [smtpFormData, setSmtpFormData] = useState<SmtpSettings>({
    host: '',
    port: 587,
    username: '',
    password: '',
    secure: false,
  });

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUserRole(data.user.role);
          setUserProfile({
            name: data.user.name,
            email: data.user.email,
            username: data.user.username,
          });
          setProfileFormData({
            name: data.user.name,
            email: data.user.email,
            username: data.user.username,
          });
        }
      });
  }, []);

  const fetchData = async () => {
    try {
      const [faqResponse, contactResponse, categoriesResponse, smtpResponse] = await Promise.all([
        fetch("/api/faq"),
        fetch("/api/contact"),
        fetch("/api/sim-categories"),
        fetch("/api/smtp"),
      ]);

      if (faqResponse.ok) {
        const faqData = await faqResponse.json();
        setFAQs(faqData);
      } else {
        console.error("FAQ fetch failed:", faqResponse.status);
      }

      if (contactResponse.ok) {
        const contactData = await contactResponse.json();
        if (contactData) {
          setContactInfo(contactData);
        }
      } else {
        console.error("Contact fetch failed:", contactResponse.status);
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setSimCategories(categoriesData);
      } else {
        console.error("Categories fetch failed:", categoriesResponse.status);
      }

      if (smtpResponse.ok) {
        const smtpData = await smtpResponse.json();
        setSmtpSettings(smtpData);
        setSmtpFormData(smtpData);
      } else {
        console.error("SMTP fetch failed:", smtpResponse.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
    phone: "",
    email: "",
    whatsapp: "",
    address: "",
  });

  const handleContactEdit = () => {
    setContactFormData(contactInfo);
    setIsContactEditing(true);
  };

  const handleContactSave = async () => {
    try {
      const response = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactFormData),
      });

      if (response.ok) {
        const updatedContact = await response.json();
        setContactInfo(updatedContact);
        setIsContactEditing(false);
        setNotification({show: true, message: 'Informasi kontak berhasil diperbarui'});
        setTimeout(() => setNotification({show: false, message: ''}), 3000);
      }
    } catch (error) {
      console.error("Error saving contact info:", error);
    }
  };

  const handleContactCancel = () => {
    setContactFormData(contactInfo);
    setIsContactEditing(false);
  };

  const handleContactInputChange = (
    field: keyof ContactInfo,
    value: string
  ) => {
    setContactFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCategory = () => {
    setCategoryFormData({ code: '', name: '', description: '', price: 0 });
    setIsAddingCategory(true);
  };

  const handleEditCategory = (category: SimCategory) => {
    setCategoryFormData({ code: category.code, name: category.name, description: category.description || '', price: category.price });
    setEditingCategoryId(category.id);
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategoryId) {
        const response = await fetch(`/api/sim-categories/${editingCategoryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryFormData),
        });
        if (response.ok) {
          const updated = await response.json();
          setSimCategories(prev => prev.map(c => c.id === editingCategoryId ? updated : c));
          setEditingCategoryId(null);
          setNotification({show: true, message: 'Kategori SIM berhasil diperbarui'});
        }
      } else {
        const response = await fetch("/api/sim-categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryFormData),
        });
        if (response.ok) {
          const newCategory = await response.json();
          setSimCategories(prev => [...prev, newCategory]);
          setIsAddingCategory(false);
          setNotification({show: true, message: 'Kategori SIM berhasil ditambahkan'});
        }
      }
      setTimeout(() => setNotification({show: false, message: ''}), 3000);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      try {
        const response = await fetch(`/api/sim-categories/${id}`, { method: "DELETE" });
        if (response.ok) {
          setSimCategories(prev => prev.filter(c => c.id !== id));
          setNotification({show: true, message: 'Kategori SIM berhasil dihapus'});
          setTimeout(() => setNotification({show: false, message: ''}), 3000);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleCancelCategory = () => {
    setIsAddingCategory(false);
    setEditingCategoryId(null);
  };

  const handleAddFAQ = () => {
    setEditingFAQ(null);
    setIsFAQModalOpen(true);
  };

  const handleEditFAQ = (id: number) => {
    const faq = faqs.find((f) => f.id === id);
    if (faq) {
      setEditingFAQ(faq);
      setIsFAQModalOpen(true);
    }
  };

  const handleDeleteFAQ = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus FAQ ini?")) {
      try {
        const response = await fetch(`/api/faq/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setFAQs((prev) => prev.filter((faq) => faq.id !== id));
          setNotification({show: true, message: 'FAQ berhasil dihapus'});
          setTimeout(() => setNotification({show: false, message: ''}), 3000);
        }
      } catch (error) {
        console.error("Error deleting FAQ:", error);
      }
    }
  };

  const handleSaveFAQ = async (faqData: Omit<FAQ, "id">) => {
    try {
      if (editingFAQ) {
        const response = await fetch(`/api/faq/${editingFAQ.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faqData),
        });
        if (response.ok) {
          const updatedFaq = await response.json();
          setFAQs((prev) =>
            prev.map((faq) => (faq.id === editingFAQ.id ? updatedFaq : faq))
          );
          setNotification({show: true, message: 'FAQ berhasil diperbarui'});
          setTimeout(() => setNotification({show: false, message: ''}), 3000);
        }
      } else {
        const response = await fetch("/api/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faqData),
        });
        if (response.ok) {
          const newFaq = await response.json();
          setFAQs((prev) => [newFaq, ...prev]);
          setNotification({show: true, message: 'FAQ berhasil ditambahkan'});
          setTimeout(() => setNotification({show: false, message: ''}), 3000);
        }
      }
    } catch (error) {
      console.error("Error saving FAQ:", error);
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
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileFormData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setUserProfile(updatedProfile.user);
        setIsProfileEditing(false);
        setNotification({show: true, message: 'Profil berhasil diperbarui'});
        setTimeout(() => setNotification({show: false, message: ''}), 3000);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Terjadi kesalahan saat menyimpan profil");
    }
  };

  const handleProfileCancel = () => {
    setProfileFormData(userProfile);
    setIsProfileEditing(false);
  };

  const handleProfileInputChange = (
    field: keyof UserProfile,
    value: string
  ) => {
    setProfileFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert("Password baru minimal 6 karakter");
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsChangingPassword(false);
        setNotification({show: true, message: 'Password berhasil diubah'});
        setTimeout(() => setNotification({show: false, message: ''}), 3000);
      } else {
        const data = await response.json();
        alert(data.error || "Gagal mengubah password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Terjadi kesalahan saat mengubah password");
    }
  };

  const handleSmtpEdit = () => {
    setSmtpFormData(smtpSettings);
    setIsSmtpEditing(true);
  };

  const handleSmtpSave = async () => {
    try {
      const response = await fetch("/api/smtp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(smtpFormData),
      });

      if (response.ok) {
        const updatedSmtp = await response.json();
        setSmtpSettings(updatedSmtp);
        setIsSmtpEditing(false);
        setNotification({show: true, message: 'Pengaturan SMTP berhasil diperbarui'});
        setTimeout(() => setNotification({show: false, message: ''}), 3000);
      }
    } catch (error) {
      console.error("Error saving SMTP settings:", error);
    }
  };

  const handleSmtpCancel = () => {
    setSmtpFormData(smtpSettings);
    setIsSmtpEditing(false);
  };

  const handleSmtpInputChange = (field: keyof SmtpSettings, value: string | number | boolean) => {
    setSmtpFormData((prev) => ({ ...prev, [field]: value }));
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : (
          <div className="flex items-center">
            <Settings className="mr-3 text-blue-600" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>
              <p className="text-gray-600 mt-1">
                Kelola informasi kontak dan FAQ sistem
              </p>
            </div>
          </div>
        )}
      </div>

      {/* User Profile Section - Available for All Roles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="animate-pulse p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
        <>
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
                onChange={(e) =>
                  handleProfileInputChange("name", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                {userProfile.name}
              </p>
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
                onChange={(e) =>
                  handleProfileInputChange("email", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                {userProfile.email}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
              {userProfile.username}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Username tidak dapat diubah
            </p>
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
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
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
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
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
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
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
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
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
        </>
        )}
      </div>

      {/* Contact Information Section - Only for Super Admin */}
      {currentUserRole === "super_admin" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="animate-pulse p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
          <>
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Informasi Kontak
              </h3>
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
                  onChange={(e) =>
                    handleContactInputChange("phone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                  {contactInfo.phone}
                </p>
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
                  onChange={(e) =>
                    handleContactInputChange("email", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                  {contactInfo.email}
                </p>
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
                  onChange={(e) =>
                    handleContactInputChange("whatsapp", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                  {contactInfo.whatsapp}
                </p>
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
                  onChange={(e) =>
                    handleContactInputChange("address", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                />
              ) : (
                <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                  {contactInfo.address}
                </p>
              )}
            </div>
          </div>
          </>
          )}
        </div>
      )}

      {/* SMTP Settings Section - Only for Super Admin */}
      {currentUserRole === "super_admin" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="animate-pulse p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
          <>
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Mail className="mr-2 text-blue-600" size={20} />
                  Pengaturan SMTP
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Konfigurasi email server untuk pengiriman OTP
                </p>
              </div>
              {!isSmtpEditing ? (
                <button
                  onClick={handleSmtpEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSmtpSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Save size={16} />
                    <span>Simpan</span>
                  </button>
                  <button
                    onClick={handleSmtpCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Host
                </label>
                {isSmtpEditing ? (
                  <input
                    type="text"
                    value={smtpFormData.host}
                    onChange={(e) => handleSmtpInputChange('host', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="smtp.gmail.com"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                    {smtpSettings.host}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Port
                </label>
                {isSmtpEditing ? (
                  <input
                    type="number"
                    value={smtpFormData.port}
                    onChange={(e) => handleSmtpInputChange('port', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="587"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                    {smtpSettings.port}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username / Email
              </label>
              {isSmtpEditing ? (
                <input
                  type="text"
                  value={smtpFormData.username}
                  onChange={(e) => handleSmtpInputChange('username', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your-email@gmail.com"
                />
              ) : (
                <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                  {smtpSettings.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password / App Password
              </label>
              {isSmtpEditing ? (
                <input
                  type="password"
                  value={smtpFormData.password}
                  onChange={(e) => handleSmtpInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Kosongkan jika tidak ingin mengubah"
                />
              ) : (
                <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                  {smtpSettings.password}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="secure"
                checked={isSmtpEditing ? smtpFormData.secure : smtpSettings.secure}
                onChange={(e) => isSmtpEditing && handleSmtpInputChange('secure', e.target.checked)}
                disabled={!isSmtpEditing}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="secure" className="ml-2 text-sm text-gray-700">
                Gunakan SSL/TLS (Port 465)
              </label>
            </div>
          </div>
          </>
          )}
        </div>
      )}

      {/* SIM Categories Section - Only for Super Admin */}
      {currentUserRole === "super_admin" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Kategori & Biaya SIM</h3>
              <button onClick={handleAddCategory} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Plus size={16} />
                <span>Tambah Kategori</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Biaya</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {simCategories.map((category) => (
                  editingCategoryId === category.id ? (
                    <tr key={category.id}>
                      <td className="px-6 py-4">{category.code}</td>
                      <td className="px-6 py-4"><input type="text" value={categoryFormData.name} onChange={(e) => setCategoryFormData(prev => ({...prev, name: e.target.value}))} className="w-full px-2 py-1 border rounded" /></td>
                      <td className="px-6 py-4"><input type="text" value={categoryFormData.description} onChange={(e) => setCategoryFormData(prev => ({...prev, description: e.target.value}))} className="w-full px-2 py-1 border rounded" /></td>
                      <td className="px-6 py-4"><input type="number" value={categoryFormData.price} onChange={(e) => setCategoryFormData(prev => ({...prev, price: parseInt(e.target.value)}))} className="w-full px-2 py-1 border rounded" /></td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button onClick={handleSaveCategory} className="p-2 text-green-600 hover:bg-green-50 rounded"><Save size={16} /></button>
                          <button onClick={handleCancelCategory} className="p-2 text-gray-600 hover:bg-gray-50 rounded">✕</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={category.id}>
                      <td className="px-6 py-4 font-medium">{category.code}</td>
                      <td className="px-6 py-4">{category.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{category.description}</td>
                      <td className="px-6 py-4">Rp {category.price.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditCategory(category)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                          {!category.isDefault && <button onClick={() => handleDeleteCategory(category.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>}
                        </div>
                      </td>
                    </tr>
                  )
                ))}
                {isAddingCategory && (
                  <tr>
                    <td className="px-6 py-4"><input type="text" value={categoryFormData.code} onChange={(e) => setCategoryFormData(prev => ({...prev, code: e.target.value}))} className="w-full px-2 py-1 border rounded" placeholder="C1" /></td>
                    <td className="px-6 py-4"><input type="text" value={categoryFormData.name} onChange={(e) => setCategoryFormData(prev => ({...prev, name: e.target.value}))} className="w-full px-2 py-1 border rounded" placeholder="SIM C1" /></td>
                    <td className="px-6 py-4"><input type="text" value={categoryFormData.description} onChange={(e) => setCategoryFormData(prev => ({...prev, description: e.target.value}))} className="w-full px-2 py-1 border rounded" placeholder="Deskripsi" /></td>
                    <td className="px-6 py-4"><input type="number" value={categoryFormData.price} onChange={(e) => setCategoryFormData(prev => ({...prev, price: parseInt(e.target.value)}))} className="w-full px-2 py-1 border rounded" placeholder="0" /></td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button onClick={handleSaveCategory} className="p-2 text-green-600 hover:bg-green-50 rounded"><Save size={16} /></button>
                        <button onClick={handleCancelCategory} className="p-2 text-gray-600 hover:bg-gray-50 rounded">✕</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
              <p className="text-sm text-gray-600 mt-1">
                Total {faqs.length} pertanyaan
              </p>
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
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat data...</p>
                  </td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Belum ada FAQ
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr
                    key={faq.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {faq.question}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {faq.category || "Umum"}
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
                ))
              )}
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
