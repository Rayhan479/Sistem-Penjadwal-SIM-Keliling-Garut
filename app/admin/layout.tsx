"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AnnouncementPage from "@/app/admin/pengumuman/page";
import SchedulePage from "@/app/admin/jadwal/page";
import ReportPage from "@/app/admin/laporan/page";
import UserManagementPage from "@/app/admin/user/page";
import SettingsPage from "@/app/admin/pengaturan/page";
import "../globals.css";
import MainContent from "@/app/admin/page";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminLayout() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("beranda");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          router.push('/login');
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (!user) {
    return (
      <html>
        <body>
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </body>
      </html>
    );
  }
  

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "jadwal":
        return <SchedulePage />;
      case "pengumuman":
        return <AnnouncementPage />;
      case "user":
        return <UserManagementPage />;
      case "laporan":
        return <ReportPage />;
      case "pengaturan":
        return <SettingsPage userRole={user?.role} />;
      case "beranda":
      default:
        return <MainContent />;
    }
  };
  return (
    <html>
      <body>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            userRole={user?.role}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
            <Header onMenuToggle={toggleSidebar} currentPage={currentPage} user={user} onLogout={handleLogout} />
            <main className="flex-1 overflow-y-auto">{renderCurrentPage()}</main>
          </div>
        </div>
      </body>
    </html>
    
  );
}


