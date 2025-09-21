import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  currentPage: string;
}

export default function Header({ onMenuToggle, currentPage }: HeaderProps) {
  const getPageTitle = (page: string) => {
    const titles = {
      beranda: 'Dashboard',
      jadwal: 'Jadwal',
      pengumuman: 'Pengumuman',
      laporan: 'Laporan',
      pengaturan: 'Pengaturan'
    };
    return titles[page as keyof typeof titles] || 'Dashboard';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{getPageTitle(currentPage)}</h2>
            <p className="text-sm text-gray-500">Selamat datang di SIM Keliling</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
            <User size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}