import React, { useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Navigation } from 'lucide-react';
import dynamic from 'next/dynamic';
import L from 'leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

interface LocationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule | null;
}

export default function LocationDetailModal({ isOpen, onClose, schedule }: LocationDetailModalProps) {
  if (!isOpen || !schedule) return null;

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

  const alamatLengkap = schedule.alamatLengkap || `${schedule.lokasi}, Kabupaten Garut, Jawa Barat 44151`;
  const mapsDirectionUrl = `https://maps.google.com/?q=${encodeURIComponent(alamatLengkap)}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            Detail Lokasi SIM Keliling
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col lg:flex-row h-[600px]">
          {/* Left Side - Map */}
          <div className="lg:w-1/2 h-64 lg:h-full bg-gray-100 relative">
            {schedule.latitude && schedule.longitude ? (
              <MapContainer
                center={[schedule.latitude, schedule.longitude]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[schedule.latitude, schedule.longitude]}>
                  <Popup>
                    <div className="text-center">
                      <strong>{schedule.judul}</strong><br />
                      {schedule.lokasi}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin size={64} className="mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Peta Lokasi</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {schedule.lokasi}
                  </p>
                  <p className="text-xs text-gray-400">Koordinat tidak tersedia</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Details */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Status Badge */}
              <div>
                {getStatusBadge(schedule.status)}
              </div>

              {/* Title */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {schedule.judul}
                </h3>
                <p className="text-gray-600">
                  Layanan SIM Keliling Kabupaten Garut
                </p>
              </div>

              {/* Schedule Information */}
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <Calendar size={20} className="mr-2" />
                    Informasi Jadwal
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <Calendar size={16} className="mr-3 text-blue-600" />
                      <div>
                        <span className="font-medium">Tanggal: </span>
                        <span>{formatDate(schedule.tanggal)}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock size={16} className="mr-3 text-blue-600" />
                      <div>
                        <span className="font-medium">Waktu: </span>
                        <span>{schedule.waktuMulai} - {schedule.waktuSelesai} WIB</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <MapPin size={20} className="mr-2" />
                    Informasi Lokasi
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Tempat: </span>
                      <span className="text-gray-600">{schedule.lokasi}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Alamat Lengkap: </span>
                      <span className="text-gray-600">{alamatLengkap}</span>
                    </div>
                  </div>
                </div>

                {/* Service Information */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-3">
                    Informasi Layanan
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Layanan perpanjangan SIM A, B1, B2, dan C</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Proses pembuatan SIM baru untuk yang hilang</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Waktu proses: 30-45 menit</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Pastikan membawa dokumen lengkap</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Informasi Kontak
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Telepon: </span>
                      <a href="tel:(0262)1500000" className="text-blue-600 hover:text-blue-800">
                        (0262) 1500-000
                      </a>
                    </div>
                    <div>
                      <span className="font-medium">WhatsApp: </span>
                      <a 
                        href="https://wa.me/6281234567890" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800"
                      >
                        +62 812-3456-7890
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <a
                  href={mapsDirectionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center flex items-center justify-center space-x-2"
                >
                  <Navigation size={16} />
                  <span>Petunjuk Arah</span>
                </a>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center flex items-center justify-center space-x-2"
                >
                  <span>💬</span>
                  <span>Hubungi Petugas</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}