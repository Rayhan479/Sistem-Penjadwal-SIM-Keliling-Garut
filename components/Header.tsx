import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  currentPage: string;
  user?: any;
  onLogout?: () => void;
}

export default function Header({ onMenuToggle, currentPage, user, onLogout }: HeaderProps) {
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
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
            <User size={18} className="text-gray-600" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">{user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</p>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium hidden sm:block">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}