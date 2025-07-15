'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, User as UserIcon } from 'lucide-react';
import { User } from '@/types';
import { userApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import CreateUserModal from '@/components/Modals/CreateUserModal';
import TopupModal from '@/components/Modals/TopupModal';
import TransferModal from '@/components/Modals/TransferModal';

interface WalletCardProps {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User | null) => void;
  isLoading: boolean;
}

export default function WalletCard({ users, selectedUser, onSelectUser, isLoading }: WalletCardProps) {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onSelectUser(null);
    },
  });

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Wallet</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Tambah User
            </button>
          </div>

          {selectedUser && (
            <div>
              <p className="text-purple-100 text-sm mb-1">Saldo Saat Ini</p>
              <p className="text-4xl font-bold text-white">
                {formatCurrency(Number(selectedUser.balance))}
              </p>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Pilih Pengguna</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {isLoading ? (
                <p className="text-center py-4 text-gray-500">Loading...</p>
              ) : users.length === 0 ? (
                <p className="text-center py-4 text-gray-500">Belum ada user</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => onSelectUser(user)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedUser?.id === user.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.full_name}</p>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(Number(user.balance))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedUser && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowTopupModal(true)}
                className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Top Up
              </button>
              <button
                onClick={() => setShowTransferModal(true)}
                className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Transfer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setShowCreateModal(false);
          }}
        />
      )}

      {showTopupModal && selectedUser && (
        <TopupModal
          user={selectedUser}
          onClose={() => setShowTopupModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setShowTopupModal(false);
          }}
        />
      )}

      {showTransferModal && selectedUser && (
        <TransferModal
          user={selectedUser}
          users={users.filter(u => u.id !== selectedUser.id)}
          onClose={() => setShowTransferModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setShowTransferModal(false);
          }}
        />
      )}
    </>
  );
}