"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link href="/persyaratan" className="hover:text-blue-200 transition-colors">Persyaratan</Link>
            <Link href="/tentang" className="hover:text-blue-200 transition-colors">Tentang Kami</Link>
            <Link href="/pengumuman" className="hover:text-blue-200 transition-colors">Pengumuman</Link>
            <Link href="/faq" className="hover:text-blue-200 transition-colors">FAQ</Link>
            <Link href="/login" className="bg-white text-[#2622FF] px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Masuk
            </Link>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-blue-400">
            <div className="flex flex-col space-y-4 pt-4">
              <Link href="/jadwal" className="hover:text-blue-200 transition-colors" onClick={() => setIsMenuOpen(false)}>Jadwal</Link>
              <Link href="/persyaratan" className="hover:text-blue-200 transition-colors" onClick={() => setIsMenuOpen(false)}>Persyaratan</Link>
              <Link href="/tentang" className="hover:text-blue-200 transition-colors" onClick={() => setIsMenuOpen(false)}>Tentang Kami</Link>
              <Link href="/pengumuman" className="hover:text-blue-200 transition-colors" onClick={() => setIsMenuOpen(false)}>Pengumuman</Link>
              <Link href="/faq" className="hover:text-blue-200 transition-colors" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
              <Link href="/login" className="bg-white text-[#2622FF] px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors w-fit" onClick={() => setIsMenuOpen(false)}>
                Masuk
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}