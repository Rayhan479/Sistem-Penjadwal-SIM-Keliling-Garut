"use client";
import React from 'react';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter,
  MessageCircle,
  ExternalLink
} from 'lucide-react';


const contactInfo = {
  address: 'Jl. Jenderal Sudirman No. 123, Garut, Jawa Barat 44151',
  email: 'info@simkelilinggarut.go.id',
  phone: '(0262) 1500-000',
  whatsapp: '+62 812-3456-7890'
};

const workingHours = [
  { day: 'Senin - Jumat', hours: '08:00 - 16:00 WIB' },
  { day: 'Sabtu', hours: '08:00 - 12:00 WIB' },
  { day: 'Minggu', hours: 'Tutup' },
  { day: 'Hari Libur Nasional', hours: 'Tutup' }
];

const socialMedia = [
  {
    name: 'Facebook',
    icon: <Facebook size={24} />,
    url: 'https://facebook.com/simkelilinggarut',
    color: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    name: 'Instagram',
    icon: <Instagram size={24} />,
    url: 'https://instagram.com/simkelilinggarut',
    color: 'bg-pink-600 hover:bg-pink-700'
  },
  {
    name: 'Twitter',
    icon: <Twitter size={24} />,
    url: 'https://twitter.com/simkelilinggarut',
    color: 'bg-blue-400 hover:bg-blue-500'
  }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Hubungi Kami
          </h1>
          <p className="text-xl opacity-90">
            Kami siap membantu Anda dengan layanan SIM Keliling terbaik
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Phone className="mr-3 text-blue-600" size={28} />
                Informasi Kontak
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MapPin className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Alamat</h3>
                    <p className="text-gray-600 leading-relaxed">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Phone className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Telepon</h3>
                    <a 
                      href={`tel:${contactInfo.phone}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <MessageCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">WhatsApp</h3>
                    <a 
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 transition-colors flex items-center"
                    >
                      {contactInfo.whatsapp}
                      <ExternalLink size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Clock className="mr-3 text-blue-600" size={28} />
                Jam Kerja
              </h2>
              
              <div className="space-y-4">
                {workingHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-800">{schedule.day}</span>
                    <span className={`font-semibold ${
                      schedule.hours === 'Tutup' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Catatan:</strong> Layanan SIM Keliling beroperasi sesuai jadwal yang telah ditentukan. 
                  Silakan cek jadwal terbaru di halaman jadwal.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Media Sosial
              </h2>
              
              <p className="text-gray-600 mb-6">
                Ikuti media sosial kami untuk mendapatkan informasi terbaru tentang jadwal dan layanan SIM Keliling.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} text-white p-4 rounded-lg transition-colors flex flex-col items-center space-y-2 hover:transform hover:scale-105 transition-transform`}
                  >
                    {social.icon}
                    <span className="font-medium">{social.name}</span>
                  </a>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  Dapatkan update jadwal terbaru, tips berkendara, dan informasi penting lainnya melalui media sosial kami.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Lokasi Kantor
              </h2>
              
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin size={48} className="mx-auto mb-4" />
                  <p className="text-lg font-medium">Peta Lokasi</p>
                  <p className="text-sm">Kantor SIM Keliling Garut</p>
                </div>
              </div>
              
              <div className="mt-4">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink size={16} className="mr-2" />
                  Buka di Google Maps
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Kirim Pesan Cepat
              </h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan email Anda"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                    placeholder="Tulis pesan atau pertanyaan Anda..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      
      
    </div>
  );
}