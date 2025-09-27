"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AnnouncementPage from "@/app/admin/pengumuman/page";
import SchedulePage from "@/app/admin/jadwal/page";
import ReportPage from "@/app/admin/laporan/page";
import SettingsPage from "@/app/admin/pengaturan/page";
import "../globals.css";
import MainContent from "@/app/admin/page";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("beranda");
  

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "jadwal":
        return <SchedulePage />;
      case "pengumuman":
        return <AnnouncementPage />;
      // Add other cases for different pages as needed
      case "laporan":
        return <ReportPage />;
      case "pengaturan":
        return <SettingsPage />;
      case "beranda":
      default:
        return <MainContent />;
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header onMenuToggle={toggleSidebar} currentPage={currentPage} />
        <main className="flex-1 overflow-y-auto">{renderCurrentPage()}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
