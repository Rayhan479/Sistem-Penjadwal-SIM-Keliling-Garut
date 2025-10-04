"use client";
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Search, 
  ChevronDown,
  Edit,
  FileCheck,
  CreditCard,
  Clock3,
  ExternalLink
} from 'lucide-react';
import LocationDetailModal from '@/components/LocationDetailModal';
import SearchModal from '@/components/SearchModal';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });

interface JadwalItem {
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

interface PengumumanItem {
  id: number;
  judul: string;
  isi: string;
  gambar?: string;
  tanggal: string;
}

interface BoundaryMember {
  type: string;
  geometry?: Array<{ lat: number; lon: number }>;
}

const procedures = [
  {
    icon: <Edit size={48} className="text-[#2622FF]" />,
    title: 'Pendaftaran',
    description: 'Isi formulir pendaftaran dengan lengkap'
  },
  {
    icon: <FileCheck size={48} className="text-[#2622FF]" />,
    title: 'Verifikasi Pendaftaran',
    description: 'Petugas akan memeriksa kelengkapan dokumen Anda'
  },
  {
    icon: <CreditCard size={48} className="text-[#2622FF]" />,
    title: 'Membayar Biaya Perpanjangan',
    description: 'Lakukan pembayaran sesuai ketentuan'
  },
  {
    icon: <Clock3 size={48} className="text-[#2622FF]" />,
    title: 'Tunggu dan Ambil SIM Baru',
    description: 'Tunggu hingga SIM baru Anda diproses'
  }
];



export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [upcomingSchedules, setUpcomingSchedules] = useState<JadwalItem[]>([]);
  const [locations, setLocations] = useState<string[]>(['Semua Lokasi']);
  const [pengumuman, setPengumuman] = useState<PengumumanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<JadwalItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [garutBoundary, setGarutBoundary] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcomingRes, locationsRes, pengumumanRes] = await Promise.all([
          fetch('/api/jadwal/upcoming'),
          fetch('/api/jadwal/locations'),
          fetch('/api/pengumuman')
        ]);
        
        const upcomingData = await upcomingRes.json();
        const locationsData = await locationsRes.json();
        const pengumumanData = await pengumumanRes.json();
        
        setUpcomingSchedules(upcomingData);
        setLocations(['Semua Lokasi', ...locationsData]);
        setPengumuman(pengumumanData.slice(0, 2)); // Ambil 2 pengumuman terbaru
        
        // Fetch Garut boundary
        const boundaryRes = await fetch('https://overpass-api.de/api/interpreter?data=[out:json];relation(14925429);out geom;');
        const boundaryData = await boundaryRes.json();
        if (boundaryData.elements && boundaryData.elements.length > 0) {
          const relation = boundaryData.elements[0];
          if (relation.members) {
            const coordinates = relation.members
              .filter((member: BoundaryMember) => member.type === 'way' && member.geometry)
              .map((member: BoundaryMember) => member.geometry!.map((point: { lat: number; lon: number }) => [point.lat, point.lon]));
            
            if (coordinates.length > 0) {
              setGarutBoundary({
                type: 'Feature',
                geometry: {
                  type: 'MultiPolygon',
                  coordinates: [coordinates]
                }
              });
            }
          }
        }
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

  const handleViewDetail = (schedule: JadwalItem) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  const handleSearch = () => {
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section 
        className="relative h-96 bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=1200")'
        }}
      >
        <div className="text-center max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Jadwal SIM Keliling Kabupaten Garut
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Temukan jadwal dan lokasi layanan SIM Keliling di Kabupaten Garut dengan mudah dan praktis
          </p>
        </div>
      </section>

      {/* Jadwal Yang Akan Datang */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Calendar className="mr-3 text-[#2622FF]" size={32} />
              Jadwal Yang Akan Datang
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            ) : upcomingSchedules.length > 0 ? (
              upcomingSchedules.map((schedule) => (
                <div key={schedule.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <Image 
                    src={schedule.gambar || 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                    alt={schedule.judul}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{schedule.judul}</h3>
                    <div className="space-y-2 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        <span className="text-sm">{formatDate(schedule.tanggal)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2" />
                        <span className="text-sm">{schedule.waktuMulai} - {schedule.waktuSelesai}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2" />
                        <span className="text-sm">{schedule.lokasi}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleViewDetail(schedule)}
                      className="w-full bg-[#2622FF] text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Lihat Lokasi Detail
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">Tidak ada jadwal yang akan datang</p>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <a href="/jadwal" className="text-[#2622FF] hover:text-blue-900 font-medium flex items-center justify-center">
              Lihat Jadwal Lengkap
              <ExternalLink size={16} className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Section Jelajah */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Search className="mr-3 text-[#2622FF]" size={32} />
              Jelajah
            </h2>
            <p className="text-gray-600">Cari Berdasarkan</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="">Pilih Status</option>
                    <option value="terjadwal">Terjadwal</option>
                    <option value="berlangsung">Berlangsung</option>
                    <option value="selesai">Selesai</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Lokasi</label>
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              
              <button 
                onClick={handleSearch}
                className="w-full bg-[#2622FF] text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Cari
              </button>
            </div>
            
            <div className="bg-gray-100 rounded-xl overflow-hidden" style={{ height: '400px' }}>
              <MapContainer
                center={[-7.2, 107.9]}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {garutBoundary && (
                  <GeoJSON
                    data={garutBoundary}
                    style={{
                      color: '#2622FF',
                      weight: 2,
                      fillColor: '#2622FF',
                      fillOpacity: 0.1
                    }}
                  />
                )}
              </MapContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Prosedure Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Prosedure</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {procedures.map((procedure, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4 flex justify-center">
                  {procedure.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{procedure.title}</h3>
                <p className="text-gray-600 text-sm">{procedure.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Berita Terkini */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Berita Terkini</h2>
          </div>
          
          <div className="space-y-8">
            {pengumuman.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="md:w-1/3">
                  <Image 
                    src={item.gambar || 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                    alt={item.judul}
                    width={400}
                    height={192}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.judul}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.isi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tentang Layanan Kami */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Tentang Layanan Kami</h2>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-600 leading-relaxed">
              Layanan SIM Keliling Kabupaten Garut hadir untuk memberikan kemudahan bagi masyarakat dalam mengurus perpanjangan SIM. Dengan tim yang profesional dan berpengalaman, kami berkomitmen untuk memberikan pelayanan terbaik. Anda dapat mengecek jadwal dan lokasi layanan SIM Keliling melalui website ini untuk memudahkan perencanaan kunjungan Anda.
            </p>
          </div>
        </div>
      </section>
      
      <LocationDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        schedule={selectedSchedule}
      />
      
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        searchFilters={{
          date: selectedDate,
          status: selectedStatus,
          location: selectedLocation
        }}
        onViewDetail={handleViewDetail}
      />
    </div>
  );
}