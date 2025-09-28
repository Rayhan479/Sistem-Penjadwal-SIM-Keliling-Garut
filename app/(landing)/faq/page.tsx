"use client";
import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Phone,
  MessageCircle,
} from 'lucide-react';

interface FAQ {
  id: number;
  pertanyaan: string;
  jawaban: string;
  kategori: string;
}

const faqData: FAQ[] = [
  {
    id: 1,
    pertanyaan: 'Apa saja syarat untuk perpanjangan SIM?',
    jawaban: 'Syarat perpanjangan SIM meliputi: 1) KTP asli dan fotokopi, 2) SIM lama, 3) Surat keterangan sehat dari dokter, 4) Pas foto 4x6 latar belakang merah sebanyak 2 lembar, 5) Formulir permohonan yang telah diisi lengkap.',
    kategori: 'Persyaratan'
  },
  {
    id: 2,
    pertanyaan: 'Berapa lama proses perpanjangan SIM?',
    jawaban: 'Proses perpanjangan SIM memakan waktu sekitar 30-45 menit, tergantung antrian dan kelengkapan dokumen yang dibawa. Pastikan semua dokumen sudah lengkap untuk mempercepat proses.',
    kategori: 'Proses'
  },
  {
    id: 3,
    pertanyaan: 'Apakah bisa perpanjangan SIM untuk orang lain?',
    jawaban: 'Perpanjangan SIM harus dilakukan oleh pemilik SIM yang bersangkutan. Tidak dapat diwakilkan kepada orang lain karena diperlukan verifikasi langsung dan tes kesehatan.',
    kategori: 'Prosedur'
  },
  {
    id: 4,
    pertanyaan: 'Bagaimana cara mengetahui jadwal SIM Keliling?',
    jawaban: 'Jadwal SIM Keliling dapat dilihat di website resmi ini, aplikasi mobile, atau menghubungi call center di nomor (0262) 1500-000. Jadwal juga diumumkan melalui media sosial resmi.',
    kategori: 'Informasi'
  },
  {
    id: 5,
    pertanyaan: 'Berapa biaya perpanjangan SIM?',
    jawaban: 'Biaya perpanjangan SIM sesuai dengan tarif resmi yang berlaku: SIM A: Rp 120.000, SIM B1: Rp 100.000, SIM B2: Rp 100.000, SIM C: Rp 75.000. Biaya sudah termasuk administrasi.',
    kategori: 'Biaya'
  },
  {
    id: 6,
    pertanyaan: 'Apa yang harus dilakukan jika SIM hilang?',
    jawaban: 'Jika SIM hilang, Anda harus membuat laporan kehilangan di kepolisian terlebih dahulu, kemudian membawa surat keterangan hilang beserta dokumen persyaratan lainnya untuk pengurusan SIM baru.',
    kategori: 'Prosedur'
  },
  {
    id: 7,
    pertanyaan: 'Apakah ada batasan umur untuk perpanjangan SIM?',
    jawaban: 'Untuk SIM A dan B1, berlaku hingga usia 60 tahun. Setelah usia 60 tahun, diperlukan tes kesehatan tambahan. Untuk SIM C, berlaku hingga usia 65 tahun.',
    kategori: 'Persyaratan'
  },
  {
    id: 8,
    pertanyaan: 'Bagaimana jika dokumen tidak lengkap saat datang ke lokasi?',
    jawaban: 'Jika dokumen tidak lengkap, proses perpanjangan tidak dapat dilakukan. Anda harus melengkapi dokumen terlebih dahulu dan datang kembali sesuai jadwal yang tersedia.',
    kategori: 'Prosedur'
  },
  {
    id: 9,
    pertanyaan: 'Apakah layanan SIM Keliling gratis?',
    jawaban: 'Layanan SIM Keliling tidak gratis. Anda tetap harus membayar biaya perpanjangan sesuai tarif resmi. Yang gratis adalah layanan jemput bola ke lokasi-lokasi tertentu.',
    kategori: 'Biaya'
  },
  {
    id: 10,
    pertanyaan: 'Jam berapa layanan SIM Keliling beroperasi?',
    jawaban: 'Layanan SIM Keliling beroperasi dari pukul 08:00 - 16:00 WIB pada hari kerja, dan 08:00 - 12:00 WIB pada hari Sabtu. Minggu dan hari libur nasional tutup.',
    kategori: 'Informasi'
  }
];

const categories = ['Semua', 'Persyaratan', 'Proses', 'Prosedur', 'Informasi', 'Biaya'];

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const filteredFAQs = selectedCategory === 'Semua' 
    ? faqData 
    : faqData.filter(faq => faq.kategori === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
            <HelpCircle className="mr-4" size={48} />
            Frequently Asked Questions
          </h1>
          <p className="text-xl opacity-90">
            Temukan jawaban atas pertanyaan yang sering diajukan tentang layanan SIM Keliling
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Filter Berdasarkan Kategori
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#2622FF] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-[#2622FF]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <p className="text-gray-600 text-center">
              Menampilkan {filteredFAQs.length} dari {faqData.length} pertanyaan
            </p>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl"
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-[#2622FF] rounded-full mr-3">
                        {faq.kategori}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {faq.pertanyaan}
                    </h3>
                  </div>
                  <div className="ml-4">
                    {openFAQ === faq.id ? (
                      <ChevronUp className="text-[#2622FF]" size={24} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={24} />
                    )}
                  </div>
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.jawaban}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Tidak Menemukan Jawaban yang Anda Cari?
          </h3>
          <p className="text-gray-600 mb-6">
            Hubungi kami langsung untuk mendapatkan bantuan lebih lanjut
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <a
              href="tel:(0262)1500000"
              className="flex items-center space-x-2 bg-[#2622FF] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors"
            >
              <Phone size={20} />
              <span>(0262) 1500-000</span>
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={20} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}