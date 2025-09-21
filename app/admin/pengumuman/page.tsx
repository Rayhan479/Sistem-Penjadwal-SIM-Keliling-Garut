"use client";
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Megaphone  } from 'lucide-react';

const announcementData = [
  {
    id: 1,
    tanggal: '2025-01-20',
    judul: 'Pengumuman Libur Lebaran',
    isi: 'Pelayanan SIM Keliling libur selama Hari Raya Idul Fitri.',
  },
  {
    id: 2,
    tanggal: '2025-01-21',
    judul: 'Pengumuman Perubahan Jadwal',
    isi: 'Pelayanan SIM Keliling libur selama Hari Raya Idul Fitri.',
  },
  {
    id: 3,
    tanggal: '2025-01-22',
    judul: 'Pengumuman Pelayanan Tambahan',
    isi: 'Pelayanan SIM Keliling libur selama Hari Raya Idul Fitri.',
  },
  
];

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState(announcementData);

  const handleAddAnnouncement = () => {
    // TODO: Implement add schedule modal/form
    console.log('Add new announcement');
  };

  const handleEdit = (id: number) => {
    // TODO: Implement edit schedule
    console.log('Edit announcement:', id);
  };

  const handleDelete = (id: number) => {
    // TODO: Implement delete confirmation
    console.log('Delete announcement:', id);
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

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Megaphone  className="mr-3 text-blue-600" size={28} />
              Pengumuman SIM Keliling
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

      {/* Schedule Table */}
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
                  Isi
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50 transition-colors">
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-sm text-gray-900">
                      {announcement.judul}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700">
                      {announcement.isi}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(announcement.tanggal)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {announcement.tanggal}
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
    </div>
  );
}