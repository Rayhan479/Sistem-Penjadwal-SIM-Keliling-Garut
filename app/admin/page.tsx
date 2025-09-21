import React from 'react';
import { Car, Calendar, Users, FileText, MapPin } from 'lucide-react';

const stats = [
  { title: 'Total Layanan', value: '1,247', icon: <Car size={24} />, color: 'bg-blue-500' },
  { title: 'Jadwal Aktif', value: '23', icon: <Calendar size={24} />, color: 'bg-green-500' },
  { title: 'Total Pendaftar', value: '892', icon: <Users size={24} />, color: 'bg-purple-500' },
  { title: 'Laporan Selesai', value: '156', icon: <FileText size={24} />, color: 'bg-orange-500' },
];

const recentReports = [
  { tanggal: '15 Jan 2025', lokasi: 'Kelurahan Menteng', jumlahPendaftar: 45, status: 'selesai' },
  { tanggal: '14 Jan 2025', lokasi: 'Kelurahan Kemang', jumlahPendaftar: 32, status: 'berlangsung' },
  { tanggal: '13 Jan 2025', lokasi: 'Kelurahan Senayan', jumlahPendaftar: 28, status: 'selesai' },
  { tanggal: '12 Jan 2025', lokasi: 'Kelurahan Kuningan', jumlahPendaftar: 51, status: 'selesai' },
  { tanggal: '11 Jan 2025', lokasi: 'Kelurahan Cikini', jumlahPendaftar: 39, status: 'dibatalkan' },
];

export default function MainContent() {
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
                    Jumlah Pendaftar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentReports.map((report, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.tanggal}
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
                        {report.jumlahPendaftar} orang
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Aksi Cepat</h3>
          </div>
          <div className="p-6 space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors">
              Tambah Jadwal Baru
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-medium transition-colors">
              Buat Pengumuman
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-medium transition-colors">
              Buat Laporan
            </button>
            <button className="w-full border bg-black hover:bg-gray-800 text-white p-3 rounded-lg font-medium transition-colors">
              Pengaturan Sistem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}