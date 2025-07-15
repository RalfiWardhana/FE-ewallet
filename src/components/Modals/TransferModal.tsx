'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { userApi } from '@/lib/api';
import { User } from '@/types';

interface TransferModalProps {
  user: User | null;
  users: User[];
  onClose: () => void;
  onSuccess: () => void;
  standalone?: boolean;
}

export default function TransferModal({
  user,
  users,
  onClose,
  onSuccess,
  standalone = false,
}: TransferModalProps) {
  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState('');

  const transferMutation = useMutation({
    mutationFn: () => userApi.transfer(user?.id!, Number(toUserId), Number(amount)),
    onSuccess: onSuccess,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !toUserId || !amount) return;
    transferMutation.mutate();
  };

  const modalContent = (
    <div className="bg-white rounded-xl w-full max-w-sm shadow-lg relative">
      {/* Close Button */}
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-800 hover:text-gray-600">
        <X className="w-6 h-6" />
      </button>

      {/* Header */}
      <div className="pt-6 px-6 text-center pb-2">
        <h2 className="text-lg font-semibold text-gray-900">Kirim ke</h2>
      </div>
      <div className="px-6">
        <hr className="border-t border-gray-200 mt-2 mb-2" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 pt-6 pb-6">
        <div className="mb-4">
          <label className="text-sm text-gray-900 font-medium block mb-2">Nama Penerima</label>
          <select
            value={toUserId}
            onChange={(e) => setToUserId(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Pilih penerima</option>
            {users
              .filter((u) => u.id !== user?.id)
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-900 font-medium block mb-2">Nominal</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={1}
            required
            placeholder="Masukkan nominal"
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-purple-600 text-purple-600 rounded-xl text-sm font-semibold hover:bg-purple-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={transferMutation.isPending}
            className="flex-1 py-3 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            {transferMutation.isPending ? 'Mengirim...' : 'Transfer'}
          </button>
        </div>
      </form>
    </div>
  );

  if (standalone) return modalContent;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      {modalContent}
    </div>
  );
}
