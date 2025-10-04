import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-[#2622FF] text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <Link href='/' className="text-[#2622FF] font-bold text-sm">SIM</Link>
            </div>
            <Link href="/" className="text-xl font-bold">SIM Keliling Garut</Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/jadwal" className="hover:text-blue-200 transition-colors">Jadwal</Link>
            <Link href="/tentang" className="hover:text-blue-200 transition-colors">Tentang Kami</Link>
            <Link href="/persyaratan" className="hover:text-blue-200 transition-colors">Persyaratan</Link>
            <Link href="/faq" className="hover:text-blue-200 transition-colors">FAQ</Link>
            {/* <a href="/kontak" className="hover:text-blue-200 transition-colors">Kontak</a> */}
            <Link href="/login" className="bg-white text-[#2622FF] px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Masuk
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}