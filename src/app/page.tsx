'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { userApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import TopupModal from '@/components/Modals/TopupModal';
import TransferModal from '@/components/Modals/TransferModal';
import CreateUserModal from '@/components/Modals/CreateUserModal';

export default function WalletPage() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userApi.getAll();
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const currentUser = users.find(u => u.id === selectedUser);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-purple-700 text-white rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Wallet</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* User List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Pengguna</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
                Tambah User
              </button>
            </div>

            <div className="space-y-2">
              {isLoading ? (
                <p className="text-center py-4">Loading...</p>
              ) : users.length === 0 ? (
                <p className="text-center py-4 text-gray-500">Belum ada user</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedUser === user.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedUser(user.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-sm text-gray-600">
                          Saldo: {formatCurrency(Number(user.balance))}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Hapus user ini?')) {
                            deleteMutation.mutate(user.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* User Detail */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {currentUser ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {currentUser.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{currentUser.full_name}</h3>
                      <p className="text-gray-600">ID: {currentUser.id}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Saldo Saat Ini</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {formatCurrency(Number(currentUser.balance))}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowTopupModal(true)}
                    className="bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Top Up
                  </button>
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Transfer
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Pilih user untuk melihat detail</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {showTopupModal && currentUser && (
        <TopupModal
          user={currentUser}
          onClose={() => setShowTopupModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setShowTopupModal(false);
          }}
        />
      )}

      {showTransferModal && currentUser && (
        <TransferModal
          user={currentUser}
          users={users.filter(u => u.id !== currentUser.id)}
          onClose={() => setShowTransferModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setShowTransferModal(false);
          }}
        />
      )}

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}