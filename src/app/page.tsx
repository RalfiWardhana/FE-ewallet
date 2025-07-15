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
import { MoreVertical, Plus } from 'lucide-react';
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

  const totalBalance = users.reduce((sum, user) => sum + Number(user.balance || 0), 0);

  const filteredUsers = users.filter((user) =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* HEADER UNGU */}
        <div className="bg-purple-700 text-white py-14 relative">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold text-center">Wallet</h1>
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 container mx-auto px-6 pt-16 pb-12">
          <div className="bg-white shadow-xl rounded-xl p-6 border">
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Uang</p>
                  <p className="text-2xl font-semibold text-purple-700">
                    {formatCurrency(totalBalance)}
                  </p>
                </div>
                <div className="bg-purple-100 text-purple-700 p-3 rounded-full">💰</div>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total User</p>
                  <p className="text-2xl font-semibold text-purple-700">{users.length}</p>
                </div>
                <div className="bg-purple-100 text-purple-700 p-3 rounded-full">👥</div>
              </div>
            </div>

            {/* SEARCH & BUTTON */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
              <input
                type="text"
                placeholder="Pencarian"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[300px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => setModalType('create')}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
              >
                + Tambah User
              </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="py-3 px-6 text-gray-700 font-medium">Nama</th>
                    <th className="py-3 px-6 text-gray-700 font-medium">Bank</th>
                    <th className="py-3 px-6 text-gray-700 font-medium">Saldo</th>
                    <th className="py-3 px-6 text-gray-700 font-medium text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-gray-500">Loading...</td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-gray-500">Data tidak ditemukan</td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6">{user.full_name}</td>
                        <td className="py-4 px-6">{user.bank_name || '-'}</td>
                        <td className="py-4 px-6 font-semibold">{formatCurrency(Number(user.balance))}</td>
                        <td className="py-4 px-6 text-center relative">
                          <div className="relative inline-block text-left">
                            <button
                              onClick={() =>
                                setDropdownUserId(dropdownUserId === user.id ? null : user.id)
                              }
                              className="text-gray-500 hover:text-gray-800"
                            >
                              <MoreVertical />
                            </button>
                            {dropdownUserId === user.id && (
                              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setModalType('transfer');
                                    setDropdownUserId(null);
                                  }}
                                  className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                                >
                                  Transfer
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setModalType('topup');
                                    setDropdownUserId(null);
                                  }}
                                  className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
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
