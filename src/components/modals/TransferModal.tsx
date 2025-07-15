'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { userApi } from '@/lib/api';
import { User } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface TransferModalProps {
  user: User;
  users: User[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function TransferModal({ user, users, onClose, onSuccess }: TransferModalProps) {
  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState('');

  const transferMutation = useMutation({
    mutationFn: ({ toUserId, amount }: { toUserId: number; amount: number }) => 
      userApi.transfer(user.id, toUserId, amount),
    onSuccess: () => {
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    const numToUserId = Number(toUserId);
    if (numAmount > 0 && numToUserId) {
      transferMutation.mutate({ toUserId: numToUserId, amount: numAmount });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Transfer</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">Nama Pengirim</p>
          <p className="font-medium">{user.full_name}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">Saldo</p>
          <p className="font-medium">{formatCurrency(Number(user.balance))}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Penerima
            </label>
            <select
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Pilih penerima</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nominal
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Masukkan nominal"
              required
              min="1"
              max={user.balance}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={transferMutation.isPending}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {transferMutation.isPending ? 'Loading...' : 'Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}