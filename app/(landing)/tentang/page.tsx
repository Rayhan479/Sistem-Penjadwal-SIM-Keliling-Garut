import React from 'react';
import { 
  Car, 
  Clock, 
  MapPin, 
  Users, 
  Shield, 
  Award,
  Star,
  // MessageCircle,
  Target,
  Heart,
  Zap
} from 'lucide-react';

const services = [
  {
    icon: <Car className="text-blue-600" size={48} />,
    title: 'Perpanjangan SIM A',
    description: 'Layanan perpanjangan SIM A untuk kendaraan bermotor roda empat dengan proses yang cepat dan mudah.'
  },
  {
    icon: <Car className="text-blue-600" size={48} />,
    title: 'Perpanjangan SIM B',
    description: 'Layanan perpanjangan SIM B1 dan B2 untuk kendaraan bermotor roda dua dengan pelayanan profesional.'
  },
  {
    icon: <Car className="text-blue-600" size={48} />,
    title: 'Perpanjangan SIM C',
    description: 'Layanan perpanjangan SIM C untuk kendaraan bermotor umum dengan standar pelayanan terbaik.'
  },
  {
    icon: <Shield className="text-blue-600" size={48} />,
    title: 'SIM Hilang',
    description: 'Pengurusan SIM baru untuk mengganti SIM yang hilang dengan prosedur yang jelas dan terpercaya.'
  }
];

const advantages = [
  {
    icon: <MapPin className="text-green-600" size={32} />,
    title: 'Layanan Jemput Bola',
    description: 'Kami datang langsung ke lokasi-lokasi strategis di seluruh Kabupaten Garut untuk memudahkan masyarakat.'
  },
  {
    icon: <Clock className="text-green-600" size={32} />,
    title: 'Proses Cepat',
    description: 'Waktu pemrosesan hanya 30-45 menit dengan sistem yang efisien dan terorganisir dengan baik.'
  },
  {
    icon: <Users className="text-green-600" size={32} />,
    title: 'Petugas Profesional',
    description: 'Tim petugas yang berpengalaman, terlatih, dan berkomitmen memberikan pelayanan terbaik.'
  },
  {
    icon: <Shield className="text-green-600" size={32} />,
    title: 'Aman & Terpercaya',
    description: 'Layanan resmi dari Kepolisian dengan jaminan keamanan data dan dokumen Anda.'
  },
  {
    icon: <Award className="text-green-600" size={32} />,
    title: 'Standar Nasional',
    description: 'Mengikuti standar pelayanan nasional dengan kualitas yang konsisten di setiap lokasi.'
  },
  {
    icon: <Zap className="text-green-600" size={32} />,
    title: 'Teknologi Modern',
    description: 'Menggunakan teknologi terkini untuk mempercepat proses dan meningkatkan akurasi data.'
  }
];

const stats = [
  { number: '50+', label: 'Lokasi Layanan', icon: <MapPin size={24} /> },
  { number: '10,000+', label: 'SIM Diproses', icon: <Users size={24} /> },
  { number: '98%', label: 'Kepuasan Pelanggan', icon: <Star size={24} /> },
  { number: '5+', label: 'Tahun Pengalaman', icon: <Award size={24} /> }
];

const values = [
  {
    icon: <Target className="text-blue-600" size={40} />,
    title: 'Visi',
    description: 'Menjadi layanan SIM Keliling terdepan di Kabupaten Garut yang memberikan kemudahan, kecepatan, dan kepuasan maksimal kepada masyarakat.'
  },
  {
    icon: <Heart className="text-red-600" size={40} />,
    title: 'Misi',
    description: 'Memberikan layanan perpanjangan SIM yang mudah diakses, cepat, aman, dan profesional dengan menjangkau seluruh wilayah Kabupaten Garut.'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tentang SIM Keliling Garut
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Layanan SIM Keliling Kabupaten Garut hadir untuk memberikan kemudahan dan kenyamanan 
            bagi masyarakat dalam mengurus perpanjangan SIM dengan standar pelayanan terbaik
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Visi & Misi Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Komitmen kami dalam memberikan layanan terbaik untuk masyarakat Kabupaten Garut
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="mb-6 flex items-center justify-center">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Layanan Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berbagai jenis layanan perpanjangan SIM yang kami sediakan dengan standar pelayanan terbaik
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="mb-4 flex justify-center">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Keunggulan Layanan Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mengapa memilih SIM Keliling Garut? Berikut adalah keunggulan yang kami tawarkan
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  {advantage.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{advantage.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{advantage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Proses Layanan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Langkah mudah untuk mendapatkan layanan SIM Keliling
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Cek Jadwal</h3>
              <p className="text-gray-600 text-sm">Lihat jadwal SIM Keliling di lokasi terdekat</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Siapkan Dokumen</h3>
              <p className="text-gray-600 text-sm">Lengkapi semua persyaratan yang diperlukan</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Datang ke Lokasi</h3>
              <p className="text-gray-600 text-sm">Kunjungi lokasi sesuai jadwal yang tersedia</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Selesai</h3>
              <p className="text-gray-600 text-sm">Terima SIM baru Anda dalam 30-45 menit</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {/* <div className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Mengurus SIM Anda?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Jangan tunggu lagi! Cek jadwal SIM Keliling terdekat dan nikmati kemudahan layanan kami
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
             
             className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Lihat Jadwal
            </button>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={20} />
              <span>Hubungi Kami</span>
            </a>
          </div>
        </div>
      </div> */}
    </div>
  );
}