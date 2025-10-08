import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, Search, Filter, Users } from 'lucide-react';

interface Schedule {
  id: number;
  judul: string;
  tanggal: string;
  lokasi: string;
  alamatLengkap?: string;
  waktuMulai: string;
  waktuSelesai: string;
  status: string;
  gambar?: string;
  jumlahKuota?: number;
  sisaKuota?: number;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchFilters: {
    date: string;
    status: string;
    location: string;
  };
  onViewDetail: (schedule: Schedule) => void;
}

export default function SearchModal({ isOpen, onClose, searchFilters, onViewDetail }: SearchModalProps) {
  const [filteredResults, setFilteredResults] = useState<Schedule[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      performSearch();
    }
  }, [isOpen, searchFilters]);

  const performSearch = async () => {
    setIsSearching(true);
    
    try {
      const response = await fetch('/api/jadwal/with-quota');
      const scheduleData = await response.json();
      
      let results = scheduleData;

      // Filter by date
      if (searchFilters.date) {
        results = results.filter((schedule: Schedule) => {
          const scheduleDate = new Date(schedule.tanggal).toISOString().split('T')[0];
          return scheduleDate === searchFilters.date;
        });
      }

      // Filter by status
      if (searchFilters.status) {
        results = results.filter((schedule: Schedule) => schedule.status === searchFilters.status);
      }

      // Filter by location
      if (searchFilters.location && searchFilters.location !== 'Semua Lokasi') {
        results = results.filter((schedule: Schedule) => 
          schedule.lokasi.toLowerCase().includes(searchFilters.location.toLowerCase())
        );
      }

      setFilteredResults(results);
    } catch (error) {
      console.error('Error searching schedules:', error);
      setFilteredResults([]);
    } finally {
      setIsSearching(false);
    }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#2622FF] text-white">
          <div className="flex items-center space-x-3">
            <Search size={24} />
            <h2 className="text-xl font-semibold">Hasil Pencarian Jadwal</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-900 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Filters Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Filter size={20} className="mr-2 text-[#2622FF]" />
            Filter Pencarian
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2 text-[#2622FF]" />
              <span className="font-medium">Tanggal: </span>
              <span className="ml-1">{searchFilters.date || 'Semua Tanggal'}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2 text-[#2622FF]" />
              <span className="font-medium">Status: </span>
              <span className="ml-1">{searchFilters.status || 'Semua Status'}</span>
            </div>
            <div className="flex items-center">
              <MapPin size={16} className="mr-2 text-[#2622FF]" />
              <span className="font-medium">Lokasi: </span>
              <span className="ml-1">{searchFilters.location || 'Semua Lokasi'}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-96">
          {isSearching ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2622FF] mx-auto mb-4"></div>
              <p className="text-gray-600">Mencari jadwal...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Hasil Pencarian
                </h3>
                <p className="text-gray-600">
                  Ditemukan {filteredResults.length} jadwal sesuai kriteria pencarian
                </p>
              </div>

              {filteredResults.length === 0 ? (
                <div className="text-center py-12">
                  <Search size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Tidak ada jadwal ditemukan
                  </h3>
                  <p className="text-gray-500">
                    Coba ubah kriteria pencarian Anda
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredResults.map((schedule) => (
                    <div key={schedule.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <img 
                        src={schedule.gambar || 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                        alt={schedule.judul}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          {getStatusBadge(schedule.status)}
                          {(schedule.sisaKuota ?? schedule.jumlahKuota ?? 0) > 0 ? (
                            <div className="flex items-center text-gray-600">
                              <Users size={14} className="mr-1" />
                              <span className="text-xs font-medium">{schedule.sisaKuota ?? schedule.jumlahKuota} Kuota</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <Users size={14} className="mr-1" />
                              <span className="text-xs font-medium">Kuota Habis</span>
                            </div>
                          )}
                        </div>
                        
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">
                          {schedule.judul}
                        </h4>
                        
                        <div className="space-y-2 text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-2 text-[#2622FF]" />
                            <span className="text-sm">{formatDate(schedule.tanggal)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-2 text-[#2622FF]" />
                            <span className="text-sm">{schedule.waktuMulai} - {schedule.waktuSelesai}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-2 text-[#2622FF]" />
                            <span className="text-sm">{schedule.lokasi}</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => onViewDetail(schedule)}
                          className="w-full bg-[#2622FF] hover:bg-blue-900 text-white py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                          Lihat Detail Lokasi
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-600">
            Butuh bantuan? <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-[#2622FF] hover:text-blue-950">Hubungi kami</a>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              Tutup
            </button>
            <a
              href="/jadwal"
              className="px-4 py-2 bg-[#2622FF] hover:bg-blue-900 text-white rounded-lg font-medium transition-colors"
            >
              Lihat Semua Jadwal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}