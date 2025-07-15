'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, ArrowRight } from 'lucide-react';
import { userApi } from '@/lib/api';
import { User } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface TransferModalProps {
  user: User | null;
  users: User[];
  onClose: () => void;
  onSuccess: () => void;
  standalone?: boolean;
}

export default function TransferModal({ user, users, onClose, onSuccess, standalone = false }: TransferModalProps) {
  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedFromUser, setSelectedFromUser] = useState<User | null>(user);

  const transferMutation = useMutation({
    mutationFn: ({ fromUserId, toUserId, amount }: { fromUserId: number; toUserId: number; amount: number }) => 
      userApi.transfer(fromUserId, toUserId, amount),
    onSuccess: () => {
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFromUser && toUserId && Number(amount) > 0) {
      transferMutation.mutate({ 
        fromUserId: selectedFromUser.id, 
        toUserId: Number(toUserId), 
        amount: Number(amount) 
      });
    }
  };

  const selectedToUser = users.find(u => u.id === Number(toUserId));

  const modalContent = (
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Transfer User</h2>
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
              Dari User
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Pilih pengirim</option>
            </select>
          </div>
        )}

        {selectedFromUser && (
          <>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">
                    {selectedFromUser.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Pengirim</p>
                  <p className="font-medium text-gray-900">{selectedFromUser.full_name}</p>
                  <p className="text-sm text-gray-500">
                    Saldo: {formatCurrency(Number(selectedFromUser.balance))}
                  </p>
                </div>
              </div>

              {selectedToUser && (
                <>
                  <div className="flex justify-center my-3">
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">
                        {selectedToUser.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Penerima</p>
                      <p className="font-medium text-gray-900">{selectedToUser.full_name}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Penerima
              </label>
              <select
                value={toUserId}
                onChange={(e) => setToUserId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nominal Transfer
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
                  max={selectedFromUser.balance}
                />
              </div>
              {Number(amount) > Number(selectedFromUser.balance) && (
                <p className="mt-1 text-sm text-red-600">Saldo tidak mencukupi</p>
              )}
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
            disabled={
              transferMutation.isPending || 
              !selectedFromUser || 
              Number(amount) > Number(selectedFromUser.balance)
            }
            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {transferMutation.isPending ? 'Loading...' : 'Transfer'}
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