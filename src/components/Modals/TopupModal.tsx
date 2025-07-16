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

export default function TopupModal({
  user,
  onClose,
  onSuccess,
  standalone = false,
}: TopupModalProps) {
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
    <div className="bg-white rounded-xl w-full max-w-sm shadow-lg relative">
      {/* Close Button */}
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-800 hover:text-gray-600">
        <X className="w-6 h-6" />
      </button>

      {/* Header */}
      <div className="pt-6 px-6 text-center pb-2">
        <h2 className="text-lg font-semibold text-gray-900">Top Up</h2>
      </div>
      <div className="px-6">
        <hr className="border-t border-gray-200 mt-2 mb-2" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 pt-6 pb-6">
        {selectedUser && (
          <>
            {/* Nominal Input */}
            <div className="mb-6">
              <label className="text-sm text-gray-900 font-medium block mb-2">
                Nominal Top Up
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  Rp
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  min="1"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-purple-600 text-purple-600 rounded-xl text-sm font-semibold hover:bg-[#6E32B9] transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={topupMutation.isPending || !selectedUser}
            className="flex-1 py-3 bg-[#6E32B9] text-white rounded-xl text-sm font-semibold hover:bg-[#6E32B9] disabled:opacity-50"
          >
            {topupMutation.isPending ? 'Loading...' : 'Top Up'}
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
