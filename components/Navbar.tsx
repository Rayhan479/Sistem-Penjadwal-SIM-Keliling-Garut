import React from 'react';

export default function Navbar() {
  return (
    <header className="bg-[#2622FF] text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <span className="text-[#2622FF] font-bold text-sm">SIM</span>
            </div>
            <span className="text-xl font-bold">SIM Keliling Garut</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/jadwal" className="hover:text-blue-200 transition-colors">Jadwal</a>
            <a href="#tentang" className="hover:text-blue-200 transition-colors">Tentang Kami</a>
            <a href="#persyaratan" className="hover:text-blue-200 transition-colors">Persyaratan</a>
            <a href="/faq" className="hover:text-blue-200 transition-colors">FAQ</a>
            <a href="/kontak" className="hover:text-blue-200 transition-colors">Kontak</a>
            <a href="/login" className="bg-white text-[#2622FF] px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Masuk
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}