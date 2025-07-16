'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import CreateUserModal from '@/components/Modals/CreateUserModal';
import TopupModal from '@/components/Modals/TopupModal';
import TransferModal from '@/components/Modals/TransferModal';
import { userApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Search, MoreVertical, Plus } from 'lucide-react';
import { User } from '@/types';

export default function WalletPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<'transfer' | 'topup' | 'create' | null>(null);
  const [dropdownUserId, setDropdownUserId] = useState<number | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userApi.getAll();
      return response.data;
    },
  });

  const filteredUsers = users.filter((user) =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals based on filtered users
  const filteredTotalBalance = filteredUsers.reduce((sum, user) => sum + Number(user.balance || 0), 0);
  const filteredUserCount = filteredUsers.length;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* HEADER UNGU */}
        <div className="bg-[#6E32B9] text-white py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-2xl font-bold text-center">Wallet</h1>
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="bg-white shadow-xl rounded-xl p-6 border">
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#6E32B9] rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total Uang</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(filteredTotalBalance)}
                      </p>
                      {searchTerm && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          dari {filteredUserCount} user
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#6E32B9] rounded-lg flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total User</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {filteredUserCount}
                      </p>
                      {searchTerm && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          dari {users.length} total
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEARCH & BUTTON */}
            <div className="mb-6">
              <p className="text-xs text-gray-600 font-medium mb-2">Pencarian</p>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setModalType('create')}
                  className="bg-[#6E32B9] text-white px-4 py-2.5 rounded-lg hover:bg-[#5a2a9a] transition text-sm font-medium"
                >
                  + Tambah User
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-white border-b">
                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Nama</th>
                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Rekening</th>
                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Saldo</th>
                    <th className="py-3 px-6 text-center text-sm font-medium text-gray-600">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-500">Loading...</td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-500">
                        {searchTerm ? 'Tidak ada user yang cocok dengan pencarian' : 'Data tidak ditemukan'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-4 px-6 text-sm text-gray-900">{user.full_name}</td>
                        <td className="py-4 px-6 font-mono text-sm text-gray-600">{user.rekening || '-'}</td>
                        <td className="py-4 px-6 text-sm font-semibold text-gray-900">{formatCurrency(Number(user.balance))}</td>
                        <td className="py-4 px-6 text-center relative">
                          <div className="relative inline-block text-left">
                            <button
                              onClick={() =>
                                setDropdownUserId(dropdownUserId === user.id ? null : user.id)
                              }
                              className="text-gray-500 hover:text-gray-800 p-1"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            {dropdownUserId === user.id && (
                              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setModalType('transfer');
                                    setDropdownUserId(null);
                                  }}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left first:rounded-t-lg"
                                >
                                  Transfer
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setModalType('topup');
                                    setDropdownUserId(null);
                                  }}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left last:rounded-b-lg"
                                >
                                  Top Up
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* MODALS */}
      {modalType === 'create' && (
        <CreateUserModal
          onClose={() => setModalType(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setModalType(null);
          }}
        />
      )}

      {modalType === 'topup' && selectedUser && (
        <TopupModal
          user={selectedUser}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setModalType(null);
          }}
        />
      )}

      {modalType === 'transfer' && selectedUser && (
        <TransferModal
          user={selectedUser}
          users={users.filter(u => u.id !== selectedUser.id)}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setModalType(null);
          }}
        />
      )}
    </div>
  );
}