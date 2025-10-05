import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  Megaphone, 
  FileText, 
  Settings,  
  X,
  User,
  Car,
  LogOut
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const menuItems: MenuItem[] = [
  { id: 'beranda', label: 'Beranda', icon: <Home size={20} />, active: true },
  { id: 'jadwal', label: 'Jadwal', icon: <Calendar size={20} /> },
  { id: 'pengumuman', label: 'Pengumuman', icon: <Megaphone size={20} /> },
  { id: 'laporan', label: 'Laporan', icon: <FileText size={20} /> },
  { id: 'user', label: 'User Manajemen', icon: <User size={20} /> },
  { id: 'pengaturan', label: 'Pengaturan', icon: <Settings size={20} /> },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Sidebar({ isOpen, onToggle, currentPage, onPageChange }: SidebarProps) {

  const handleMenuClick = (itemId: string) => {
    onPageChange(itemId);
    // Close sidebar on mobile after selecting menu
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-xl
        w-64 flex flex-col
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SIM Keliling</h1>
                <p className="text-sm text-gray-500">Layanan Mobile</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left
                transition-all duration-200 ease-in-out group
                ${currentPage === item.id
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1'
                }
              `}
            >
              <span className={`
                transition-colors duration-200
                ${currentPage === item.id ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}
              `}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => {
              localStorage.removeItem('isAuthenticated');
              window.location.href = '/login';
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mt-4">
            <p className="text-sm text-gray-600 text-center">
              © 2025 SIM Keliling
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              Kemudahan Layanan Dimana Saja
            </p>
          </div>
        </div>
      </div>
    </>
  );
}