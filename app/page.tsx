"use client";
import React, { useState } from 'react';
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
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const upcomingSchedules = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Jadwal SIM Keliling Di Cikajang',
    date: 'Rabu 24 September 2025',
    time: '08:00 - 16:00',
    venue: 'Kantor Desa'
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Jadwal SIM Keliling Di Cibatu',
    date: 'Kamis 25 September 2025',
    time: '08:00 - 16:00',
    venue: 'Kantor Desa'
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Jadwal SIM Keliling Di Cisewu',
    date: 'Jumat 26 September 2025',
    time: '08:00 - 16:00',
    venue: 'Kantor Desa'
  }
];

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

const newsItems = [
  {
    id: 1,
    title: 'Pengumuman Layanan SIM Keliling Libur',
    description: 'Pengumuman dengan hormat bahwa layanan SIM Keliling akan diliburkan pada tanggal 17 Agustus 2025. Layanan akan kembali beroperasi normal pada tanggal 18 Agustus 2025.',
    image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    title: 'Tips Perpanjangan SIM',
    description: 'Pastikan Anda membawa dokumen yang diperlukan seperti KTP asli, SIM lama, surat keterangan sehat dari dokter, dan pas foto untuk kelancaran proses perpanjangan.',
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
  'Banyuresmi'
];

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

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
            {upcomingSchedules.map((schedule) => (
              <div key={schedule.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img 
                  src={schedule.image} 
                  alt={schedule.location}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{schedule.location}</h3>
                  <div className="space-y-2 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      <span className="text-sm">{schedule.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2" />
                      <span className="text-sm">{schedule.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2" />
                      <span className="text-sm">{schedule.venue}</span>
                    </div>
                  </div>
                  <button className="w-full bg-[#2622FF] text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Lihat Lokasi Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <a href="#" className="text-[#2622FF] hover:text-blue-900 font-medium flex items-center justify-center">
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
              
              <button className="w-full bg-[#2622FF] text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Cari
              </button>
            </div>
            
            <div className="bg-gray-100 rounded-xl p-8 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin size={64} className="mx-auto mb-4" />
                <p className="text-lg">Peta Kabupaten Garut</p>
                <p className="text-sm">Visualisasi lokasi akan ditampilkan di sini</p>
              </div>
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
            {newsItems.map((news) => (
              <div key={news.id} className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="md:w-1/3">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{news.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{news.description}</p>
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

      <Footer />

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-colors">
          <MessageCircle size={24} />
        </button>
      </div>
    </div>
  );
}