"use client";
import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Clock, Calendar, Image } from 'lucide-react';
import ScheduleModal from '@/app/admin/jadwal/tambah/page';

interface Schedule {
  id: number;
  tanggal: string;
  lokasi: string;
  latitude?: number;
  longitude?: number;
  waktuMulai: string;
  waktuSelesai: string;
  status: string;
  gambar?: string;
}

const scheduleData: Schedule[] = [
  {
    id: 1,
    tanggal: '2025-01-20',
    lokasi: 'Kelurahan Menteng',
    latitude: -7.2,
    longitude: 107.9,
    waktuMulai: '08:00',
    waktuSelesai: '16:00',
    status: 'terjadwal',
    gambar: undefined
  },
  {
    id: 2,
    tanggal: '2025-01-21',
    lokasi: 'Kelurahan Kemang',
    latitude: -7.21,
    longitude: 107.91,
    waktuMulai: '09:00',
    waktuSelesai: '15:00',
    status: 'berlangsung'
  },
  {
    id: 3,
    tanggal: '2025-01-22',
    lokasi: 'Kelurahan Senayan',
    latitude: -7.19,
    longitude: 107.89,
    waktuMulai: '08:30',
    waktuSelesai: '16:30',
    status: 'terjadwal'
  },
  {
    id: 4,
    tanggal: '2025-01-23',
    lokasi: 'Kelurahan Kuningan',
    latitude: -7.22,
    longitude: 107.92,
    waktuMulai: '08:00',
    waktuSelesai: '15:30',
    status: 'selesai'
  },
  {
    id: 5,
    tanggal: '2025-01-24',
    lokasi: 'Kelurahan Cikini',
    latitude: -7.18,
    longitude: 107.88,
    waktuMulai: '09:30',
    waktuSelesai: '17:00',
    status: 'dibatalkan'
  },
  {
    id: 6,
    tanggal: '2025-01-25',
    lokasi: 'Kelurahan Tebet',
    latitude: -7.23,
    longitude: 107.93,
    waktuMulai: '08:00',
    waktuSelesai: '16:00',
    status: 'terjadwal'
  }
];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState(scheduleData);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const schedule = schedules.find(s => s.id === id);
    if (schedule) {
      setEditingSchedule(schedule);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    }
  };

  const handleSaveSchedule = (scheduleData: Omit<Schedule, 'id'>) => {
    if (editingSchedule) {
      // Update existing schedule
      setSchedules(prev => prev.map(schedule => 
        schedule.id === editingSchedule.id 
          ? { ...scheduleData, id: editingSchedule.id }
          : schedule
      ));
    } else {
      // Add new schedule
      const newId = Math.max(...schedules.map(s => s.id)) + 1;
      setSchedules(prev => [...prev, { ...scheduleData, id: newId }]);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      terjadwal: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Terjadwal' },
      berlangsung: { bg: 'bg-green-100', text: 'text-green-800', label: 'Berlangsung' },
      selesai: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Selesai' },
      dibatalkan: { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
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
              <Calendar className="mr-3 text-blue-600" size={28} />
              Jadwal SIM Keliling
            </h1>
            <p className="text-gray-600 mt-1">Kelola jadwal layanan SIM Keliling</p>
          </div>
          <button
            onClick={handleAddSchedule}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Plus size={20} />
            <span>Tambah Jadwal</span>
          </button>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Jadwal</h3>
          <p className="text-sm text-gray-600 mt-1">Total {schedules.length} jadwal</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi Map
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gambar
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu Mulai
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu Selesai
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(schedule.tanggal)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {schedule.tanggal}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin size={14} className="text-gray-400 mr-2" />
                      {schedule.lokasi}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-600">
                      {schedule.latitude && schedule.longitude ? (
                        <div>
                          <div>Lat: {schedule.latitude.toFixed(6)}</div>
                          <div>Lng: {schedule.longitude.toFixed(6)}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Belum diset</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {schedule.gambar ? (
                      <img
                        src={schedule.gambar}
                        alt="Gambar lokasi"
                        className="w-16 h-12 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image size={16} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700">
                      <Clock size={14} className="text-gray-400 mr-2" />
                      {schedule.waktuMulai}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700">
                      <Clock size={14} className="text-gray-400 mr-2" />
                      {schedule.waktuSelesai}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(schedule.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(schedule.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
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

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSchedule}
        editingSchedule={editingSchedule}
      />
    </div>
  );
}