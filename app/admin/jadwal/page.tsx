"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Calendar,
  Image as ImageIcon,
  UserCheck,
  ArrowUpDown,
} from "lucide-react";
import ScheduleModal from "@/app/admin/jadwal/modal/page";
import Image from "next/image";

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
  jumlahKuota: number;
  status: string;
  gambar?: string;
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isServedModalOpen, setIsServedModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [jumlahDilayani, setJumlahDilayani] = useState('');
  const [notification, setNotification] = useState<{show: boolean; message: string}>({show: false, message: ''});
  const [sisaKuota, setSisaKuota] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortField, setSortField] = useState<keyof Schedule | null>('tanggal');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const updateScheduleStatuses = useCallback(async () => {
    try {
      await fetch("/api/jadwal/update-status", {
        method: "POST",
      });

      // Refresh schedules after status update
      const response = await fetch("/api/jadwal");
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error("Error updating schedule statuses:", error);
    }
  }, []);

  const handleSort = (field: keyof Schedule) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const fetchSchedules = useCallback(async () => {
    try {
      const response = await fetch("/api/jadwal");
      const data = await response.json();
      setSchedules(data);

      // Update statuses immediately after fetching
      setTimeout(() => updateScheduleStatuses(), 100);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  }, [updateScheduleStatuses]);

  useEffect(() => {
    fetchSchedules();

    // Set up interval to check and update status every minute
    const interval = setInterval(() => {
      updateScheduleStatuses();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [fetchSchedules, updateScheduleStatuses]);

  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const schedule = schedules.find((s) => s.id === id);
    if (schedule) {
      setEditingSchedule(schedule);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      try {
        await fetch(`/api/jadwal/${id}`, { method: "DELETE" });
        setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
      } catch (error) {
        console.error("Error deleting schedule:", error);
      }
    }
  };

  const handleSaveSchedule = async (scheduleData: Omit<Schedule, "id">) => {
    try {
      if (editingSchedule) {
        const response = await fetch(`/api/jadwal/${editingSchedule.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(scheduleData),
        });
        const updatedSchedule = await response.json();
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule.id === editingSchedule.id ? updatedSchedule : schedule
          )
        );
        setNotification({show: true, message: 'Jadwal berhasil diperbarui'});
      } else {
        const response = await fetch("/api/jadwal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(scheduleData),
        });
        const newSchedule = await response.json();
        setSchedules((prev) => [...prev, newSchedule]);
        setNotification({show: true, message: 'Jadwal berhasil ditambahkan'});
      }
      setTimeout(() => setNotification({show: false, message: ''}), 3000);
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
  };

  const handleAddServed = async (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setJumlahDilayani('');
    
    // Fetch sisa kuota
    try {
      const scheduleTanggal = new Date(schedule.tanggal).toISOString().split('T')[0];
      
      const response = await fetch('/api/laporan');
      const laporan = await response.json();
      const totalDilayani = laporan
        .filter((l: any) => {
          const laporanTanggal = new Date(l.tanggal).toISOString().split('T')[0];
          return laporanTanggal === scheduleTanggal &&
            l.lokasi === schedule.lokasi &&
            l.status === 'selesai';
        })
        .reduce((sum: number, l: any) => sum + l.jumlah, 0);
      
      const sisa = schedule.jumlahKuota - totalDilayani;
      setSisaKuota(sisa > 0 ? sisa : 0);
    } catch (error) {
      console.error('Error fetching sisa kuota:', error);
      setSisaKuota(schedule.jumlahKuota);
    }
    
    setIsServedModalOpen(true);
  };

  const handleSaveServed = async () => {
    if (!selectedSchedule || !jumlahDilayani) return;

    try {
      const response = await fetch('/api/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tanggal: selectedSchedule.tanggal,
          lokasi: selectedSchedule.lokasi,
          jumlah: parseInt(jumlahDilayani),
          status: 'selesai'
        })
      });

      if (response.ok) {
        alert('Jumlah dilayani berhasil ditambahkan');
        setIsServedModalOpen(false);
        fetchSchedules(); // Refresh to get updated status
      }
    } catch (error) {
      console.error('Error saving served count:', error);
      alert('Gagal menyimpan data');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      terjadwal: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Terjadwal",
      },
      berlangsung: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Berlangsung",
      },
      selesai: { bg: "bg-gray-100", text: "text-gray-800", label: "Selesai" },
      dibatalkan: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Dibatalkan",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
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

  const truncateText = (text: string | undefined, maxLength: number = 30) => {
    if (!text) return "-";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const sortedSchedules = [...schedules].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Calendar className="mr-3 text-blue-600" size={28} />
              Jadwal SIM Keliling
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola jadwal layanan SIM Keliling
            </p>
          </div>
          <button
            onClick={handleAddSchedule}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Plus size={20} />
            <span>Tambah Jadwal</span>
          </button>
        </div>
        )}
      </div>
      

      {/* Schedule Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Jadwal</h3>
          <p className="text-sm text-gray-600 mt-1">
            Menampilkan {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, sortedSchedules.length)} dari {sortedSchedules.length} jadwal
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('judul')} className="flex items-center space-x-1 hover:text-gray-700">
                    <span>Judul</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('tanggal')} className="flex items-center space-x-1 hover:text-gray-700">
                    <span>Tanggal</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('lokasi')} className="flex items-center space-x-1 hover:text-gray-700">
                    <span>Lokasi & Alamat Lengkap</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi Map
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gambar
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('waktuMulai')} className="flex items-center space-x-1 hover:text-gray-700">
                    <span>Waktu Mulai & Selesai</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('jumlahKuota')} className="flex items-center space-x-1 hover:text-gray-700">
                    <span>Jumlah Kuota</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('status')} className="flex items-center space-x-1 hover:text-gray-700">
                    <span>Status</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat data...</p>
                  </td>
                </tr>
              ) : (
              sortedSchedules.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((schedule) => (
                <tr
                  key={schedule.id}
                  className="hover:bg-gray-50 transition-colors"
                >
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
                    <div
                      className="text-sm text-gray-700"
                      title={schedule.alamatLengkap || "-"}
                    >
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
                      <Image
                        src={schedule.gambar}
                        alt="Gambar lokasi"
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700">
                      <Clock size={14} className="text-gray-400 mr-2" />
                      {schedule.waktuMulai} - {schedule.waktuSelesai}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {schedule.jumlahKuota || 0} orang
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(schedule.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {schedule.status === 'berlangsung' && (
                        <button
                          onClick={() => handleAddServed(schedule)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Tambah Jumlah Dilayani"
                        >
                          <UserCheck size={16} />
                        </button>
                      )}
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
              ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sortedSchedules.length > itemsPerPage && (
          <div className="p-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, sortedSchedules.length)} dari {sortedSchedules.length} jadwal
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>
                
                {Array.from({ length: Math.ceil(sortedSchedules.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
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
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(sortedSchedules.length / itemsPerPage), prev + 1))}
                  disabled={currentPage === Math.ceil(sortedSchedules.length / itemsPerPage)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSchedule}
        editingSchedule={editingSchedule}
      />

      {/* Served Count Modal */}
      {isServedModalOpen && selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Tambah Jumlah Dilayani
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jadwal
                </label>
                <p className="text-sm text-gray-600">{selectedSchedule.judul}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(selectedSchedule.tanggal)} - {selectedSchedule.lokasi}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kuota Maksimal
                </label>
                <p className="text-sm font-semibold text-blue-600">
                  {selectedSchedule.jumlahKuota} orang
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kuota Tersisa
                </label>
                <p className="text-sm font-semibold text-green-600">
                  {sisaKuota} orang
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah yang Dilayani
                </label>
                <input
                  type="number"
                  value={jumlahDilayani}
                  onChange={(e) => setJumlahDilayani(e.target.value)}
                  placeholder="Masukkan jumlah"
                  min="1"
                  max={sisaKuota}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maksimal: {sisaKuota} orang
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsServedModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveServed}
                disabled={!jumlahDilayani || parseInt(jumlahDilayani) <= 0 || parseInt(jumlahDilayani) > sisaKuota}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
