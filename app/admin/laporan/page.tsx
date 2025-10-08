"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  FileText,
  FileDown,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import * as XLSX from "xlsx";

interface Report {
  id: number;
  tanggal: string;
  lokasi: string;
  jumlah: string;
  status: string;
}

interface ApiReport {
  id: number;
  tanggal: string;
  lokasi: string;
  jumlah: number;
  status: string;
}

export default function ReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterPeriod, setFilterPeriod] = useState<
    "all" | "weekly" | "monthly"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortField, setSortField] = useState<keyof Report | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');



  const fetchReports = useCallback(async () => {
    try {
      const response = await fetch("/api/laporan");
      const data = await response.json();
      const formattedReports = data.map((item: ApiReport) => ({
        ...item,
        tanggal: item.tanggal.split("T")[0],
        jumlah: item.jumlah.toString(),
      }));
      setReports(formattedReports);
      applyFilter(formattedReports, filterPeriod);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, [filterPeriod]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    applyFilter(reports, filterPeriod);
  }, [sortField, sortDirection]);

  const handleSort = (field: keyof Report) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const applyFilter = (
    reportsData: Report[],
    period: "all" | "weekly" | "monthly"
  ) => {
    const now = new Date();
    let filtered = reportsData;

    if (period === "weekly") {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = reportsData.filter(
        (report) => new Date(report.tanggal) >= oneWeekAgo
      );
    } else if (period === "monthly") {
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      filtered = reportsData.filter(
        (report) => new Date(report.tanggal) >= oneMonthAgo
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (!sortField) return 0;
      
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredReports(sorted);
  };

  const handleFilterChange = (period: "all" | "weekly" | "monthly") => {
    setFilterPeriod(period);
    applyFilter(reports, period);
    setCurrentPage(1);
  };

  const handleDownloadExcel = () => {
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const monthlyReports = reports.filter(
      (report) => new Date(report.tanggal) >= oneMonthAgo
    );

    const excelData = monthlyReports.map((report) => ({
      Tanggal: formatDate(report.tanggal),
      Lokasi: report.lokasi,
      "Jumlah Dilayani": report.jumlah,
      Status:
        report.status === "selesai"
          ? "Selesai"
          : report.status === "berlangsung"
          ? "Berlangsung"
          : "Dibatalkan",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Bulanan");

    const fileName = `Laporan_SIM_Keliling_${now.getFullYear()}_${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };



  const getStatusBadge = (status: string) => {
    const statusConfig = {
      terjadwal: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Terjadwal",
      },
      berlangsung: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Berlangsung",
      },
      selesai: { bg: "bg-green-100", text: "text-green-800", label: "Selesai" },
      dibatalkan: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Dibatalkan",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FileText className="mr-3 text-blue-600" size={28} />
              Laporan SIM Keliling
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola Laporan layanan SIM Keliling
            </p>
          </div>
          <button
            onClick={handleDownloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
          >
            <FileDown size={20} />
            <span>Unduh Laporan</span>
          </button>
        </div>
        )}
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <Filter size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Filter Periode:
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filterPeriod === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => handleFilterChange("weekly")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filterPeriod === "weekly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Mingguan
            </button>
            <button
              onClick={() => handleFilterChange("monthly")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filterPeriod === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Bulanan
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            Daftar Laporan
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Menampilkan {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredReports.length)} dari {filteredReports.length} laporan
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('tanggal')} className="flex items-center space-x-1 hover:text-gray-700">
                    <span>Tanggal</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('lokasi')} className="flex items-center space-x-1 hover:text-gray-700">
                    <span>Lokasi</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('jumlah')} className="flex items-center space-x-1 hover:text-gray-700">
                    <span>Jumlah Dilayani</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('status')} className="flex items-center space-x-1 hover:text-gray-700">
                    <span>Status</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat data...</p>
                  </td>
                </tr>
              ) : (
              filteredReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 transition-colors"
                >
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
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredReports.length > itemsPerPage && (
          <div className="p-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredReports.length)} dari {filteredReports.length} laporan
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>
                
                {Array.from({ length: Math.ceil(filteredReports.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredReports.length / itemsPerPage), prev + 1))}
                  disabled={currentPage === Math.ceil(filteredReports.length / itemsPerPage)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
