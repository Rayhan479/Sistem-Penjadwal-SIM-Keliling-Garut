"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, FileText, FileDown  } from 'lucide-react';
import ReportModal from '@/app/admin/laporan/tambah/page';

interface Report {
  id: number;
  tanggal: string;
  lokasi: string;
  jumlah: string;
  status: string;
}

export default function ReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  const handleAddReport = () => {
    setEditingReport(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const report = reports.find(r => r.id === id);
    if (report) {
      setEditingReport(report);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        await fetch(`/api/laporan/${id}`, { method: 'DELETE' });
        fetchReports();
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/laporan');
      const data = await response.json();
      setReports(data.map((item: any) => ({
        ...item,
        tanggal: item.tanggal.split('T')[0],
        jumlah: item.jumlah.toString()
      })));
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleSaveReport = async (reportData: Omit<Report, 'id'>) => {
    try {
      if (editingReport) {
        await fetch(`/api/laporan/${editingReport.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportData)
        });
      } else {
        await fetch('/api/laporan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportData)
        });
      }
      fetchReports();
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReport(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      terjadwal: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Terjadwal' },
      berlangsung: { bg: 'bg-green-100', text: 'text-green-800', label: 'Berlangsung' },
      selesai: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' },
      dibatalkan: { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FileText className="mr-3 text-blue-600" size={28} />
              Laporan SIM Keliling
            </h1>
            <p className="text-gray-600 mt-1">Kelola Laporan layanan SIM Keliling</p>
          </div>
          <div className='flex space-x-3'>
            <button
                onClick={handleAddReport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
            >
                <Plus size={20} />
                <span>Tambah Laporan</span>
            </button>

            <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
            >
                <FileDown  size={20} />
                <span>Unduh Laporan</span>
            </button>
          </div>
          
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Laporan</h3>
          <p className="text-sm text-gray-600 mt-1">Total {reports.length} laporan</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Dilayani
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(report.tanggal)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {report.tanggal}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin size={14} className="text-gray-400 mr-2" />
                      {report.lokasi}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700">
                      {report.jumlah}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(report.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveReport}
        editingReport={editingReport}
      />
    </div>
  );
}