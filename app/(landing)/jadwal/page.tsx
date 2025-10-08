"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Clock, Search, Filter, ChevronDown, Users } from 'lucide-react';
import LocationDetailModal from '@/components/LocationDetailModal';

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
  sisaKuota?: number;
}

const statusOptions = [
  'Semua Status',
  'Terjadwal',
  'Berlangsung',
  'Selesai',
  'Dibatalkan'
];

export default function LandingSchedulePage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [selectedLocation, setSelectedLocation] = useState('Semua Lokasi');
  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
  const [locations, setLocations] = useState<string[]>(['Semua Lokasi']);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedulesRes, locationsRes] = await Promise.all([
          fetch('/api/jadwal/with-quota'),
          fetch('/api/jadwal/locations')
        ]);
        
        const schedulesData = await schedulesRes.json();
        const locationsData = await locationsRes.json();
        
        const formattedSchedules = schedulesData.map((item: Schedule) => ({
          ...item,
          tanggal: new Date(item.tanggal).toISOString().split('T')[0]
        }));
        
        setScheduleData(formattedSchedules);
        setFilteredSchedules(sortByStatus(formattedSchedules));
        setLocations(['Semua Lokasi', ...locationsData]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const sortByStatus = (schedules: Schedule[]) => {
    const statusOrder = { berlangsung: 1, terjadwal: 2, selesai: 3, dibatalkan: 4 };
    return schedules.sort((a, b) => 
      (statusOrder[a.status as keyof typeof statusOrder] || 99) - 
      (statusOrder[b.status as keyof typeof statusOrder] || 99)
    );
  };

  const handleFilter = () => {
    let filtered = scheduleData;

    if (selectedDate) {
      filtered = filtered.filter(schedule => schedule.tanggal === selectedDate);
    }

    if (selectedStatus !== 'Semua Status') {
      filtered = filtered.filter(schedule => 
        schedule.status === selectedStatus.toLowerCase()
      );
    }

    if (selectedLocation !== 'Semua Lokasi') {
      filtered = filtered.filter(schedule => 
        schedule.lokasi.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredSchedules(sortByStatus(filtered));
    setCurrentPage(1);
  };

  const resetFilter = () => {
    setSelectedDate('');
    setSelectedStatus('Semua Status');
    setSelectedLocation('Semua Lokasi');
    setFilteredSchedules(sortByStatus([...scheduleData]));
    setCurrentPage(1);
  };

  const handleViewDetail = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSchedules = filteredSchedules.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Jadwal SIM Keliling
          </h1>
          <p className="text-xl opacity-90">
            Temukan jadwal lengkap layanan SIM Keliling di Kabupaten Garut
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Tanggal
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Filter size={16} className="inline mr-2" />
                  Status
                </label>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-2" />
                  Lokasi
                </label>
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleFilter}
                className="bg-[#2622FF] hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Search size={16} />
                <span>Cari</span>
              </button>
              <button
                onClick={resetFilter}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Daftar Jadwal SIM Keliling
          </h2>
          <p className="text-gray-600">
            Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSchedules.length)} dari {filteredSchedules.length} jadwal
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Tidak ada jadwal ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah filter pencarian Anda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedSchedules.map((schedule) => (
              <div key={schedule.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <Image 
                  src={schedule.gambar || 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                  alt={schedule.judul}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    {getStatusBadge(schedule.status)}
                    {(schedule.sisaKuota ?? schedule.jumlahKuota) > 0 ? (
                      <div className="flex items-center text-gray-600">
                        <Users size={16} className="mr-1" />
                        <span className="text-sm font-medium">{schedule.sisaKuota ?? schedule.jumlahKuota} Kuota Tersedia</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <Users size={16} className="mr-1" />
                        <span className="text-sm font-medium">Kuota Habis</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {schedule.judul}
                  </h3>
                  
                  <div className="space-y-2 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-[#2622FF]" />
                      <span className="text-sm">{formatDate(schedule.tanggal)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-[#2622FF]" />
                      <span className="text-sm">{schedule.waktuMulai} - {schedule.waktuSelesai}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2 text-[#2622FF]" />
                      <span className="text-sm">{schedule.lokasi}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleViewDetail(schedule)}
                    className="w-full bg-[#2622FF] hover:bg-blue-900 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Lihat Detail Lokasi
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        
      </div>
      
      <LocationDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        schedule={selectedSchedule}
      />
    </div>
  );
}