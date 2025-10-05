"use client";
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  CreditCard,
  Clock,
  Users,
  Car,
  MessageCircle,
  Eye,
  Camera,
  MapPin,
  Bike
} from 'lucide-react';

interface Requirement {
  id: number;
  title: string;
  items: string[];
  notes?: string[];
}

interface SimType {
  type: string;
  name: string;
  description: string;
  price: string;
  icon: React.ReactNode;
  color: string;
}

const defaultSimTypes: SimType[] = [
  {
    type: 'A',
    name: 'SIM A',
    description: 'Kendaraan bermotor roda empat (mobil)',
    price: '',
    icon: <Car size={32} />,
    color: 'bg-blue-500'
  },
  {
    type: 'B1',
    name: 'SIM B1',
    description: 'Kendaraan bermotor roda dua (motor) di atas 250cc',
    price: '',
    icon: <Bike size={32} />,
    color: 'bg-green-500'
  },
  {
    type: 'B2',
    name: 'SIM B2',
    description: 'Kendaraan bermotor roda dua (motor) di bawah 250cc',
    price: '',
    icon: <Bike size={32} />,
    color: 'bg-purple-500'
  },
  {
    type: 'C',
    name: 'SIM C',
    description: 'Kendaraan bermotor umum',
    price: '',
    icon: <Bike size={32} />,
    color: 'bg-orange-500'
  }
];

const generalRequirements: Requirement[] = [
  {
    id: 1,
    title: 'Dokumen Identitas',
    items: [
      'KTP asli dan fotokopi (1 lembar)',
      'Kartu Keluarga asli dan fotokopi (1 lembar)',
      'SIM lama (asli)'
    ],
    notes: [
      'KTP harus masih berlaku',
      'Fotokopi harus jelas dan tidak buram'
    ]
  },
  {
    id: 2,
    title: 'Surat Keterangan Kesehatan',
    items: [
      'Surat keterangan sehat jasmani dari dokter',
      'Surat keterangan sehat rohani dari dokter',
      'Surat keterangan tidak buta warna (untuk SIM A dan B1)'
    ],
    notes: [
      'Surat kesehatan berlaku maksimal 1 bulan',
      'Harus dari dokter yang memiliki izin praktik'
    ]
  },
  {
    id: 3,
    title: 'Pas Foto',
    items: [
      'Pas foto 4x6 cm sebanyak 2 lembar',
      'Latar belakang merah',
      'Foto terbaru (maksimal 6 bulan)',
      'Tampak muka, tidak memakai kacamata hitam'
    ],
    notes: [
      'Foto harus jelas dan tidak buram',
      'Pakaian sopan dan rapi'
    ]
  },
  {
    id: 4,
    title: 'Formulir dan Administrasi',
    items: [
      'Formulir permohonan yang telah diisi lengkap',
      'Biaya perpanjangan sesuai jenis SIM',
      'Materai 10.000 (jika diperlukan)'
    ],
    notes: [
      'Formulir dapat diisi di lokasi',
      'Pembayaran dapat tunai atau non-tunai'
    ]
  }
];

const procedures = [
  {
    step: 1,
    title: 'Persiapan Dokumen',
    description: 'Siapkan semua dokumen yang diperlukan sesuai dengan jenis SIM yang akan diperpanjang',
    icon: <FileText size={24} />,
    color: 'bg-blue-500'
  },
  {
    step: 2,
    title: 'Datang ke Lokasi',
    description: 'Kunjungi lokasi SIM Keliling sesuai jadwal yang telah ditentukan',
    icon: <MapPin size={24} />,
    color: 'bg-green-500'
  },
  {
    step: 3,
    title: 'Pendaftaran',
    description: 'Daftar dan serahkan dokumen kepada petugas untuk verifikasi',
    icon: <Users size={24} />,
    color: 'bg-purple-500'
  },
  {
    step: 4,
    title: 'Pemeriksaan Kesehatan',
    description: 'Ikuti tes kesehatan mata dan pemeriksaan fisik lainnya',
    icon: <Eye size={24} />,
    color: 'bg-pink-500'
  },
  {
    step: 5,
    title: 'Foto dan Sidik Jari',
    description: 'Pengambilan foto dan sidik jari untuk SIM baru',
    icon: <Camera size={24} />,
    color: 'bg-indigo-500'
  },
  {
    step: 6,
    title: 'Pembayaran',
    description: 'Lakukan pembayaran biaya perpanjangan SIM',
    icon: <CreditCard size={24} />,
    color: 'bg-yellow-500'
  },
  {
    step: 7,
    title: 'Menunggu Proses',
    description: 'Tunggu proses pencetakan SIM baru (30-45 menit)',
    icon: <Clock size={24} />,
    color: 'bg-orange-500'
  },
  {
    step: 8,
    title: 'Pengambilan SIM',
    description: 'Ambil SIM baru dan pastikan data sudah benar',
    icon: <CheckCircle size={24} />,
    color: 'bg-green-600'
  }
];

const importantNotes = [
  'Perpanjangan SIM harus dilakukan oleh pemilik SIM yang bersangkutan',
  'Tidak dapat diwakilkan kepada orang lain',
  'SIM yang sudah mati lebih dari 1 tahun harus mengikuti tes ulang',
  'Bawa dokumen asli untuk verifikasi',
  'Datang sesuai jadwal yang telah ditentukan',
  'Proses perpanjangan memakan waktu 30-45 menit'
];

export default function RequirementsPage() {
  const [activeTab, setActiveTab] = useState('persyaratan');
  const [simTypes, setSimTypes] = useState<SimType[]>(defaultSimTypes);
  const [loadingPrices, setLoadingPrices] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await fetch('/api/fees');
        if (response.ok) {
          const fees = await response.json();
          const updatedSimTypes = defaultSimTypes.map(sim => {
            switch (sim.type) {
              case 'A':
                return { ...sim, price: `Rp ${fees.simA.toLocaleString('id-ID')}` };
              case 'B1':
                return { ...sim, price: `Rp ${fees.simB1.toLocaleString('id-ID')}` };
              case 'B2':
                return { ...sim, price: `Rp ${fees.simB2.toLocaleString('id-ID')}` };
              case 'C':
                return { ...sim, price: `Rp ${fees.simC.toLocaleString('id-ID')}` };
              default:
                return sim;
            }
          });
          setSimTypes(updatedSimTypes);
        }
      } catch (error) {
        console.error('Error fetching fees:', error);
      } finally {
        setLoadingPrices(false);
      }
    };

    fetchFees();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
            <FileText className="mr-4" size={48} />
            Persyaratan & Prosedur
          </h1>
          <p className="text-xl opacity-90">
            Panduan lengkap persyaratan dan prosedur perpanjangan SIM Keliling
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('persyaratan')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'persyaratan'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Persyaratan
            </button>
            <button
              onClick={() => setActiveTab('prosedur')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'prosedur'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Prosedur
            </button>
            <button
              onClick={() => setActiveTab('biaya')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'biaya'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Biaya
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Persyaratan Tab */}
        {activeTab === 'persyaratan' && (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Persyaratan Perpanjangan SIM
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pastikan Anda mempersiapkan semua dokumen berikut untuk mempercepat proses perpanjangan SIM
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {generalRequirements.map((requirement) => (
                <div key={requirement.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <CheckCircle className="mr-3 text-green-600" size={24} />
                    {requirement.title}
                  </h3>
                  
                  <ul className="space-y-2 mb-4">
                    {requirement.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {requirement.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                        <AlertCircle size={16} className="mr-2" />
                        Catatan Penting:
                      </h4>
                      <ul className="space-y-1">
                        {requirement.notes.map((note, index) => (
                          <li key={index} className="text-sm text-yellow-700">
                            • {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Important Notes */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
                <AlertCircle className="mr-3" size={24} />
                Hal Penting yang Perlu Diperhatikan
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {importantNotes.map((note, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-red-700">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Prosedur Tab */}
        {activeTab === 'prosedur' && (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Prosedur Perpanjangan SIM
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ikuti langkah-langkah berikut untuk proses perpanjangan SIM yang lancar dan cepat
              </p>
            </div>

            <div className="space-y-8">
              {procedures.map((procedure, index) => (
                <div key={procedure.step} className="flex items-start space-x-6">
                  <div className={`${procedure.color} text-white p-4 rounded-full flex-shrink-0`}>
                    {procedure.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                        Langkah {procedure.step}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {procedure.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {procedure.description}
                    </p>
                  </div>
                  {index < procedures.length - 1 && (
                    <div className="absolute left-8 mt-16 w-0.5 h-8 bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Process Timeline */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <Clock className="mr-3" size={24} />
                Estimasi Waktu Proses
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">5-10 menit</div>
                  <div className="text-sm text-blue-700">Verifikasi Dokumen</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">10-15 menit</div>
                  <div className="text-sm text-blue-700">Tes Kesehatan & Foto</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">15-20 menit</div>
                  <div className="text-sm text-blue-700">Pencetakan SIM</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Biaya Tab */}
        {activeTab === 'biaya' && (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Biaya Perpanjangan SIM
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Tarif resmi perpanjangan SIM sesuai dengan ketentuan yang berlaku
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {simTypes.map((sim) => (
                <div key={sim.type} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                  <div className={`${sim.color} text-white p-4 rounded-full inline-flex mb-4`}>
                    {sim.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {sim.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {sim.description}
                  </p>
                  <div className="text-2xl font-bold text-blue-600">
                    {loadingPrices ? (
                      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      sim.price
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Costs */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Biaya Tambahan (Jika Diperlukan)
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Surat Keterangan Sehat</span>
                    <span className="font-semibold text-gray-800">Rp 50.000 - Rp 100.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Pas Foto 4x6</span>
                    <span className="font-semibold text-gray-800">Rp 10.000 - Rp 20.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Fotokopi Dokumen</span>
                    <span className="font-semibold text-gray-800">Rp 2.000 - Rp 5.000</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Materai 10.000</span>
                    <span className="font-semibold text-gray-800">Rp 10.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Tes Buta Warna</span>
                    <span className="font-semibold text-gray-800">Rp 25.000 - Rp 50.000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                <CreditCard className="mr-3" size={24} />
                Metode Pembayaran
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Tunai</h4>
                  <p className="text-green-600 text-sm">Pembayaran langsung dengan uang tunai</p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Non-Tunai</h4>
                  <p className="text-green-600 text-sm">Transfer bank, e-wallet, atau kartu debit</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Mengurus SIM Anda?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Pastikan semua persyaratan sudah lengkap dan cek jadwal SIM Keliling terdekat
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Lihat Jadwal
            </button>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={20} />
              <span>Tanya Petugas</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}