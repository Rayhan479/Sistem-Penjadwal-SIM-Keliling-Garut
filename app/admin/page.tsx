"use client";
import React, { useState, useEffect } from 'react';
import { Car, Calendar, Users, FileText, MapPin, Megaphone } from 'lucide-react';
import ReportModal from '@/app/admin/laporan/tambah/page';
import AnnouncementModal from '@/app/admin/pengumuman/tambah/page';



export default function MainContent() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [stats, setStats] = useState([
    { title: 'Total Layanan', value: '0', icon: <Car size={24} />, color: 'bg-blue-500' },
    { title: 'Jadwal Aktif', value: '0', icon: <Calendar size={24} />, color: 'bg-green-500' },
    { title: 'Total Pengumuman', value: '0', icon: <Megaphone size={24} />, color: 'bg-purple-500' },
    { title: 'Laporan Selesai', value: '0', icon: <FileText size={24} />, color: 'bg-orange-500' },
  ]);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jadwalRes, pengumumanRes, laporanRes] = await Promise.all([
          fetch('/api/jadwal'),
          fetch('/api/pengumuman'),
          fetch('/api/laporan')
        ]);
        
        const jadwalData = await jadwalRes.json();
        const pengumumanData = await pengumumanRes.json();
        const laporanData = await laporanRes.json();
        
        const totalLayanan = laporanData.reduce((sum: number, laporan: any) => sum + laporan.jumlah, 0);
        const jadwalAktif = jadwalData.filter((jadwal: any) => jadwal.status === 'terjadwal' || jadwal.status === 'berlangsung').length;
        const laporanSelesai = laporanData.filter((laporan: any) => laporan.status === 'selesai').length;
        
        setStats([
          { title: 'Total Layanan', value: totalLayanan.toString(), icon: <Car size={24} />, color: 'bg-blue-500' },
          { title: 'Jadwal Aktif', value: jadwalAktif.toString(), icon: <Calendar size={24} />, color: 'bg-green-500' },
          { title: 'Total Pengumuman', value: pengumumanData.length.toString(), icon: <Megaphone size={24} />, color: 'bg-purple-500' },
          { title: 'Laporan Selesai', value: laporanSelesai.toString(), icon: <FileText size={24} />, color: 'bg-orange-500' },
        ]);
        
        // Fetch recent reports
        const sortedReports = laporanData
          .sort((a: any, b: any) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
          .slice(0, 5);
        setRecentReports(sortedReports);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  const handleSaveAnnouncement = async (announcementData: any) => {
    try {
      await fetch('/api/pengumuman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementData)
      });
      setIsAnnouncementModalOpen(false);
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleSaveReport = async (reportData: any) => {
    try {
      await fetch('/api/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      setIsReportModalOpen(false);
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Laporan Terbaru</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah Dilayani
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentReports.map((report, index) => (
                  <tr key={report.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(report.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <MapPin size={14} className="text-gray-400 mr-2" />
                        {report.lokasi}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <Users size={14} className="text-gray-400 mr-2" />
                        {report.jumlah} orang
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === 'selesai' ? 'bg-green-100 text-green-800' :
                        report.status === 'berlangsung' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status === 'selesai' ? 'Selesai' :
                         report.status === 'berlangsung' ? 'Berlangsung' : 'Dibatalkan'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


      

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 ">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Aksi Cepat</h3>
          </div>
          <div className="p-6 space-y-3 ">
            <button 
              onClick={() => setIsScheduleModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
              <Calendar size={20}/>
              <span>Buat Jadwal Baru</span> 
            </button>
            <button 
              onClick={() => setIsAnnouncementModalOpen(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
              <Megaphone size={20}/>
              <span>Buat Pengumuman</span>
            </button>
            <button 
              onClick={() => setIsReportModalOpen(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
              <FileText size={20}/>
              <span>Buat Laporan</span> 
            </button>
            
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSave={handleSaveAnnouncement}
        editingAnnouncement={null}
      />
      
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSave={handleSaveReport}
        editingReport={null}
      />
    </div>
  );
}