"use client";
import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Users, Search, Filter, Eye, EyeOff, Shield, User, Mail, Phone } from 'lucide-react';
import UserModal from '@/app/admin/user/modal/page';

interface User {
  id: number;
  nama: string;
  email: string;
  telepon: string;
  role: string;
  status: string;
  tanggalDibuat: string;
  terakhirLogin: string;
}

const userData: User[] = [
  {
    id: 1,
    nama: 'Admin Utama',
    email: 'admin@simkelilinggarut.go.id',
    telepon: '081234567890',
    role: 'super_admin',
    status: 'aktif',
    tanggalDibuat: '2024-01-15',
    terakhirLogin: '2025-01-20 09:30'
  },
  {
    id: 2,
    nama: 'Operator SIM Keliling',
    email: 'operator1@simkelilinggarut.go.id',
    telepon: '081234567891',
    role: 'operator',
    status: 'aktif',
    tanggalDibuat: '2024-02-10',
    terakhirLogin: '2025-01-20 08:15'
  },
  {
    id: 3,
    nama: 'Petugas Lapangan 1',
    email: 'petugas1@simkelilinggarut.go.id',
    telepon: '081234567892',
    role: 'petugas',
    status: 'aktif',
    tanggalDibuat: '2024-03-05',
    terakhirLogin: '2025-01-19 16:45'
  },
  {
    id: 4,
    nama: 'Petugas Lapangan 2',
    email: 'petugas2@simkelilinggarut.go.id',
    telepon: '081234567893',
    role: 'petugas',
    status: 'nonaktif',
    tanggalDibuat: '2024-03-20',
    terakhirLogin: '2025-01-18 14:20'
  },
  {
    id: 5,
    nama: 'Supervisor Operasional',
    email: 'supervisor@simkelilinggarut.go.id',
    telepon: '081234567894',
    role: 'supervisor',
    status: 'aktif',
    tanggalDibuat: '2024-01-25',
    terakhirLogin: '2025-01-20 07:30'
  },
  {
    id: 6,
    nama: 'Admin Jadwal',
    email: 'jadwal@simkelilinggarut.go.id',
    telepon: '081234567895',
    role: 'admin',
    status: 'aktif',
    tanggalDibuat: '2024-04-12',
    terakhirLogin: '2025-01-19 18:00'
  }
];

const roleOptions = ['Semua Role', 'Super Admin', 'Admin', 'Supervisor', 'Operator', 'Petugas'];
const statusOptions = ['Semua Status', 'Aktif', 'Nonaktif'];

export default function UserManagementPage() {
  const [users, setUsers] = useState(userData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Semua Role');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setEditingUser(user);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user && window.confirm(`Apakah Anda yakin ingin menghapus user "${user.nama}"?`)) {
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setUsers(prev => prev.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'aktif' ? 'nonaktif' : 'aktif' }
        : user
    ));
  };

  const handleSaveUser = (userData: Omit<User, 'id' | 'tanggalDibuat' | 'terakhirLogin'>) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { 
              ...userData, 
              id: editingUser.id,
              tanggalDibuat: editingUser.tanggalDibuat,
              terakhirLogin: editingUser.terakhirLogin
            }
          : user
      ));
    } else {
      // Add new user
      const newId = Math.max(...users.map(u => u.id)) + 1;
      const currentDate = new Date().toISOString().split('T')[0];
      setUsers(prev => [...prev, { 
        ...userData, 
        id: newId,
        tanggalDibuat: currentDate,
        terakhirLogin: '-'
      }]);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'Semua Role' || 
                       user.role === selectedRole.toLowerCase().replace(' ', '_');
    const matchesStatus = selectedStatus === 'Semua Status' || 
                         user.status === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      super_admin: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Super Admin' },
      admin: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Admin' },
      supervisor: { bg: 'bg-green-100', text: 'text-green-800', label: 'Supervisor' },
      operator: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Operator' },
      petugas: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Petugas' }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.petugas;
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        status === 'aktif' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {status === 'aktif' ? 'Aktif' : 'Nonaktif'}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    if (dateString === '-') return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Users className="mr-3 text-blue-600" size={28} />
              Manajemen User
            </h1>
            <p className="text-gray-600 mt-1">Kelola pengguna sistem SIM Keliling</p>
          </div>
          <button
            onClick={handleAddUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Plus size={20} />
            <span>Tambah User</span>
          </button>
        </div>
      </div>

      

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div className="w-full lg:w-48">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Daftar User</h3>
          <p className="text-sm text-gray-600 mt-1">
            Menampilkan {filteredUsers.length} dari {users.length} user
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontak
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Terakhir Login
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.nama}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {user.id} • Dibuat: {formatDate(user.tanggalDibuat)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      <div className="flex items-center mb-1">
                        <Mail size={14} className="text-gray-400 mr-2" />
                        {user.email}
                      </div>
                      <div className="flex items-center">
                        <Phone size={14} className="text-gray-400 mr-2" />
                        {user.telepon}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(user.terakhirLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === 'aktif'
                            ? 'text-orange-600 hover:bg-orange-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={user.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {user.status === 'aktif' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus User"
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Tidak ada user ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah kata kunci pencarian atau filter
            </p>
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        editingUser={editingUser}
      />
    </div>
  );
}