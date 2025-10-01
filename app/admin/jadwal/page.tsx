"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Clock, Calendar, Image } from 'lucide-react';
import ScheduleModal from '@/app/admin/jadwal/tambah/page';

interface Schedule {
  id: number;
  judul: string;
  tanggal: string;
  lokasi: string;
  alamatLengkap?: string;
  latitude?: number;
  longitude?: number;
  waktuMulai: string;
  waktuSelesai: string;
  status: string;
  gambar?: string;
}



export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    fetchSchedules();
    
    // Set up interval to check and update status every minute
    const interval = setInterval(() => {
      updateScheduleStatuses();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const updateScheduleStatuses = async () => {
    try {
      await fetch('/api/jadwal/update-status', {
        method: 'POST'
      });
      
      // Refresh schedules after status update
      const response = await fetch('/api/jadwal');
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error updating schedule statuses:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/jadwal');
      const data = await response.json();
      setSchedules(data);
      
      // Update statuses immediately after fetching
      setTimeout(() => updateScheduleStatuses(), 100);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      try {
        await fetch(`/api/jadwal/${id}`, { method: 'DELETE' });
        setSchedules(prev => prev.filter(schedule => schedule.id !== id));
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const handleSaveSchedule = async (scheduleData: Omit<Schedule, 'id'>) => {
    try {
      if (editingSchedule) {
        const response = await fetch(`/api/jadwal/${editingSchedule.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scheduleData)
        });
        const updatedSchedule = await response.json();
        setSchedules(prev => prev.map(schedule => 
          schedule.id === editingSchedule.id ? updatedSchedule : schedule
        ));
      } else {
        const response = await fetch('/api/jadwal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scheduleData)
        });
        const newSchedule = await response.json();
        setSchedules(prev => [...prev, newSchedule]);
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
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

  const truncateText = (text: string | undefined, maxLength: number = 30) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

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
                  Judul
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alamat Lengkap
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi Map
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gambar
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu Mulai & Selesai
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
                      {schedule.judul}
                    </div>
                  </td>
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
                    <div className="text-sm text-gray-700" title={schedule.alamatLengkap || '-'}>
                      {truncateText(schedule.alamatLengkap)}
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
                      {schedule.waktuMulai} - {schedule.waktuSelesai}
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