"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import AnnouncementModal from "@/app/admin/pengumuman/modal/page";

interface Announcement {
  id: number;
  judul: string;
  tanggal: string;
  isi: string;
  gambar?: string;
  category?: string;
}

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [notification, setNotification] = useState<{show: boolean; message: string}>({show: false, message: ''});

  const handleAddAnnouncement = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const announcement = announcements.find((a) => a.id === id);
    if (announcement) {
      setEditingAnnouncement(announcement);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
      try {
        await fetch(`/api/pengumuman/${id}`, { method: "DELETE" });
        fetchAnnouncements();
        setNotification({show: true, message: 'Pengumuman berhasil dihapus'});
        setTimeout(() => setNotification({show: false, message: ''}), 3000);
      } catch (error) {
        console.error("Error deleting announcement:", error);
      }
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/pengumuman");
      const data = await response.json();
      if (Array.isArray(data)) {
        setAnnouncements(
          data.map((item: Announcement) => ({
            ...item,
            tanggal: item.tanggal.split("T")[0],
          }))
        );
      } else {
        setAnnouncements([]);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnouncements([]);
    }
  };

  const handleSaveAnnouncement = async (
    announcementData: Omit<Announcement, "id">
  ) => {
    try {
      if (editingAnnouncement) {
        await fetch(`/api/pengumuman/${editingAnnouncement.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(announcementData),
        });
        setNotification({show: true, message: 'Pengumuman berhasil diperbarui'});
      } else {
        await fetch("/api/pengumuman", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(announcementData),
        });
        setNotification({show: true, message: 'Pengumuman berhasil ditambahkan'});
      }
      fetchAnnouncements();
      setTimeout(() => setNotification({show: false, message: ''}), 3000);
    } catch (error) {
      console.error("Error saving announcement:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    // Strip HTML tags for display
    const plainText = text.replace(/<[^>]*>/g, "");
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FileText className="mr-3 text-blue-600" size={28} />
              Pengumuman
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola pengumuman layanan SIM Keliling
            </p>
          </div>
          <button
            onClick={handleAddAnnouncement}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Plus size={20} />
            <span>Tambah Pengumuman</span>
          </button>
        </div>
      </div>

      {/* Announcements Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            Daftar Pengumuman
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Menampilkan {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, announcements.length)} dari {announcements.length} pengumuman
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gambar
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Isi
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((announcement) => (
                <tr
                  key={announcement.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {announcement.judul}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700">
                      <Calendar size={14} className="text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium">
                          {formatDate(announcement.tanggal)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {announcement.tanggal}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {announcement.category || "Pengumuman"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {announcement.gambar ? (
                      <Image
                        src={announcement.gambar}
                        alt="Gambar pengumuman"
                        width={64}
                        height={48}
                        className="w-16 h-12 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon size={16} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-md">
                      {truncateText(announcement.isi, 100)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(announcement.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
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

        {/* Pagination */}
        {announcements.length > itemsPerPage && (
          <div className="p-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, announcements.length)} dari {announcements.length} pengumuman
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>
                
                {Array.from({ length: Math.ceil(announcements.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(announcements.length / itemsPerPage), prev + 1))}
                  disabled={currentPage === Math.ceil(announcements.length / itemsPerPage)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Announcement Modal */}
      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAnnouncement}
        editingAnnouncement={editingAnnouncement}
      />
    </div>
  );
}
