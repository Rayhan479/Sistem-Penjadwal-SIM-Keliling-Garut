import React from 'react';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin} from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#2622FF] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white p-2 rounded-lg">
                <span className="text-blue-600 font-bold text-sm">SIM</span>
              </div>
              <span className="text-xl font-bold">Keliling Garut</span>
            </div>
            <p className="text-blue-100 mb-4 text-sm">
              Layanan SIM Keliling Kabupaten Garut hadir untuk memberikan kemudahan bagi masyarakat dalam mengurus perpanjangan SIM dengan pelayanan yang profesional dan terpercaya.
            </p>
            <div className="flex space-x-3">
              <Facebook size={20} className="hover:text-blue-200 cursor-pointer" />
              <Instagram size={20} className="hover:text-blue-200 cursor-pointer" />
              <Twitter size={20} className="hover:text-blue-200 cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Menu</h3>
            <ul className="space-y-2 text-blue-100">
              <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="/jadwal" className="hover:text-white transition-colors">Jadwal</Link></li>
              <li><Link href="/persyaratan" className="hover:text-white transition-colors">Persyaratan</Link></li>
              <li><Link href="/tentang" className="hover:text-white transition-colors">Tentang</Link></li>
              <li><Link href="/pengumuman" className="hover:text-white transition-colors">Pengumuman</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              {/* <li><Link href="/kontak" className="hover:text-white transition-colors">Kontak</Link></li> */}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2 text-blue-100">
              <li><span className="text-sm">Perpanjangan SIM A</span></li>
              <li><span className="text-sm">Perpanjangan SIM B1</span></li>
              <li><span className="text-sm">Perpanjangan SIM B2</span></li>
              <li><span className="text-sm">Perpanjangan SIM C</span></li>
              <li><span className="text-sm">SIM Hilang/Rusak</span></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <div className="space-y-3 text-blue-100">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span className="text-sm">(0262) 1500-000</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span className="text-sm">info@simkeliling-garut.id</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1" />
                <span className="text-sm">Kabupaten Garut, Jawa Barat</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-500 mt-8 pt-8 text-center">
          <p className="text-blue-100">© 2025 SIM Keliling Kabupaten Garut - Kemudahan Layanan Dimana Saja</p>
        </div>
      </div>
    </footer>
  );
}