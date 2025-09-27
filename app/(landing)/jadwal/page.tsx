"use client";
import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Search, Filter, ChevronDown } from 'lucide-react';


interface Schedule {
  id: number;
  tanggal: string;
  lokasi: string;
  waktuMulai: string;
  waktuSelesai: string;
  tempat: string;
  status: string;
  image: string;
}

const scheduleData: Schedule[] = [
  {
    id: 1,
    tanggal: '2025-01-20',
    lokasi: 'Jadwal SIM Keliling Di Cikajang',
    waktuMulai: '08:00',
    waktuSelesai: '16:00',
    tempat: 'Kantor Desa Cikajang',
    status: 'terjadwal',
    image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    tanggal: '2025-01-21',
    lokasi: 'Jadwal SIM Keliling Di Cibatu',
    waktuMulai: '08:00',
    waktuSelesai: '16:00',
    tempat: 'Kantor Desa Cibatu',
    status: 'berlangsung',
    image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    tanggal: '2025-01-22',
    lokasi: 'Jadwal SIM Keliling Di Cisewu',
    waktuMulai: '08:00',
    waktuSelesai: '16:00',
    tempat: 'Kantor Desa Cisewu',
    status: 'terjadwal',
    image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 4,
    tanggal: '2025-01-23',
    lokasi: 'Jadwal SIM Keliling Di Garut Kota',
    waktuMulai: '08:00',
    waktuSelesai: '16:00',
    tempat: 'Kantor Kecamatan Garut Kota',
    status: 'terjadwal',
    image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 5,
    tanggal: '2025-01-24',
    lokasi: 'Jadwal SIM Keliling Di Tarogong Kidul',
    waktuMulai: '08:00',
    waktuSelesai: '16:00',
    tempat: 'Kantor Kecamatan Tarogong Kidul',
    status: 'selesai',
    image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 6,
    tanggal: '2025-01-25',
    lokasi: 'Jadwal SIM Keliling Di Leles',
    waktuMulai: '08:00',
    waktuSelesai: '16:00',
    tempat: 'Kantor Desa Leles',
    status: 'terjadwal',
    image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 7,
    tanggal: '2025-01-26',
    lokasi: 'Jadwal SIM Keliling Di Banyuresmi',
    waktuMulai: '08:00',
    waktuSelesai: '16:00',
    tempat: 'Kantor Desa Banyuresmi',
    status: 'terjadwal',
    image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 8,
    tanggal: '2025-01-27',
    lokasi: 'Jadwal SIM Keliling Di Malangbong',
    waktuMulai: '08:00',
    waktuSelesai: '16:00',
    tempat: 'Kantor Kecamatan Malangbong',
    status: 'dibatalkan',
    image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const locations = [
  'Semua Lokasi',
  'Cikajang',
  'Cibatu',
  'Cisewu',
  'Garut Kota',
  'Tarogong Kidul',
  'Leles',
  'Banyuresmi',
  'Malangbong'
];

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
  const [filteredSchedules, setFilteredSchedules] = useState(scheduleData);

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

    setFilteredSchedules(filtered);
  };

  const resetFilter = () => {
    setSelectedDate('');
    setSelectedStatus('Semua Status');
    setSelectedLocation('Semua Lokasi');
    setFilteredSchedules(scheduleData);
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
          <div className="flex flex-col lg:flex-row gap-4 items-end">
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
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
            Menampilkan {filteredSchedules.length} dari {scheduleData.length} jadwal
          </p>
        </div>

        {filteredSchedules.length === 0 ? (
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
            {filteredSchedules.map((schedule) => (
              <div key={schedule.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img 
                  src={schedule.image} 
                  alt={schedule.lokasi}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="mb-3">
                    {getStatusBadge(schedule.status)}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {schedule.lokasi}
                  </h3>
                  
                  <div className="space-y-2 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-blue-600" />
                      <span className="text-sm">{formatDate(schedule.tanggal)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-blue-600" />
                      <span className="text-sm">{schedule.waktuMulai} - {schedule.waktuSelesai}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2 text-blue-600" />
                      <span className="text-sm">{schedule.tempat}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                    Lihat Detail Lokasi
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}