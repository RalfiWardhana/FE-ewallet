'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { userApi } from '@/lib/api';
import { User } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface TopupModalProps {
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
  standalone?: boolean;
}

export default function TopupModal({ user, onClose, onSuccess, standalone = false }: TopupModalProps) {
  const [amount, setAmount] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(user);

  const topupMutation = useMutation({
    mutationFn: (data: { userId: number; amount: number }) => 
      userApi.topup(data.userId, data.amount),
    onSuccess: () => {
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && Number(amount) > 0) {
      topupMutation.mutate({ userId: selectedUser.id, amount: Number(amount) });
    }
  };

  const modalContent = (
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Top Up</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {standalone && !user && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih User
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Pilih user</option>
            </select>
          </div>
        )}

        {selectedUser && (
          <>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">
                    {selectedUser.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedUser.full_name}</p>
                  <p className="text-sm text-gray-500">ID: {selectedUser.id}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">Saldo Saat Ini</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(Number(selectedUser.balance))}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nominal Top Up
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  Rp
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0"
                  required
                  min="1"
                />
              </div>
            </div>
          </>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={topupMutation.isPending || !selectedUser}
            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {topupMutation.isPending ? 'Loading...' : 'Top Up'}
          </button>
        </div>
      </form>
    </div>
  );

  if (standalone) {
    return modalContent;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {modalContent}
    </div>
  );
}