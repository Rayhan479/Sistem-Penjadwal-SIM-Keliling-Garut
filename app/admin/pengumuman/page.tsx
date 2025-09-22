"use client";
import React, { useState } from 'react';
import { Plus, Edit, Trash2, FileText, Calendar } from 'lucide-react';
import AnnouncementModal from '@/app/admin/pengumuman/tambah/page';

interface Announcement {
  id: number;
  judul: string;
  tanggal: string;
  isi: string;
}

const announcementData: Announcement[] = [
  {
    id: 1,
    judul: 'Perubahan Jadwal SIM Keliling Minggu Ini',
    tanggal: '2025-01-15',
    isi: 'Diinformasikan kepada seluruh masyarakat bahwa jadwal SIM Keliling untuk minggu ini mengalami perubahan. Layanan di Kelurahan Menteng dipindahkan dari tanggal 20 Januari menjadi 22 Januari 2025. Mohon perhatian dan terima kasih atas pengertiannya.'
  },
  {
    id: 2,
    judul: 'Syarat Perpanjangan SIM yang Perlu Dipersiapkan',
    tanggal: '2025-01-12',
    isi: 'Untuk mempercepat proses perpanjangan SIM, pastikan Anda membawa: 1) KTP asli dan fotokopi, 2) SIM lama, 3) Surat keterangan sehat dari dokter, 4) Pas foto 4x6 latar belakang merah sebanyak 2 lembar. Proses perpanjangan memakan waktu sekitar 30-45 menit.'
  },
  {
    id: 3,
    judul: 'Pembukaan Layanan SIM Keliling di Lokasi Baru',
    tanggal: '2025-01-10',
    isi: 'Mulai bulan ini, layanan SIM Keliling akan hadir di 3 lokasi baru: Kelurahan Pancoran, Kelurahan Mampang, dan Kelurahan Pasar Minggu. Jadwal lengkap dapat dilihat di halaman jadwal atau menghubungi call center kami di 021-1500-000.'
  },
  {
    id: 4,
    judul: 'Libur Layanan SIM Keliling Hari Raya',
    tanggal: '2025-01-08',
    isi: 'Dalam rangka memperingati Hari Raya Nyepi, layanan SIM Keliling akan diliburkan pada tanggal 29 Maret 2025. Layanan akan kembali normal pada tanggal 30 Maret 2025. Mohon maaf atas ketidaknyamanan ini.'
  },
  {
    id: 5,
    judul: 'Tips Keselamatan Berkendara di Musim Hujan',
    tanggal: '2025-01-05',
    isi: 'Memasuki musim hujan, kami mengingatkan pentingnya keselamatan berkendara. Pastikan kondisi ban dalam keadaan baik, gunakan lampu saat hujan, jaga jarak aman dengan kendaraan lain, dan hindari genangan air yang dalam. Keselamatan adalah prioritas utama.'
  }
];

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState(announcementData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const handleAddAnnouncement = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
      setEditingAnnouncement(announcement);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
    }
  };

  const handleSaveAnnouncement = (announcementData: Omit<Announcement, 'id'>) => {
    if (editingAnnouncement) {
      // Update existing announcement
      setAnnouncements(prev => prev.map(announcement => 
        announcement.id === editingAnnouncement.id 
          ? { ...announcementData, id: editingAnnouncement.id }
          : announcement
      ));
    } else {
      // Add new announcement
      const newId = Math.max(...announcements.map(a => a.id)) + 1;
      setAnnouncements(prev => [...prev, { ...announcementData, id: newId }]);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FileText className="mr-3 text-blue-600" size={28} />
              Pengumuman
            </h1>
            <p className="text-gray-600 mt-1">Kelola pengumuman layanan SIM Keliling</p>
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
          <h3 className="text-lg font-semibold text-gray-800">Daftar Pengumuman</h3>
          <p className="text-sm text-gray-600 mt-1">Total {announcements.length} pengumuman</p>
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
                  Isi
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {announcement.judul}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700">
                      <Calendar size={14} className="text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium">{formatDate(announcement.tanggal)}</div>
                        <div className="text-xs text-gray-500">{announcement.tanggal}</div>
                      </div>
                    </div>
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