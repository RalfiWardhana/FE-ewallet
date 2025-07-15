'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { userApi } from '@/lib/api';

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
  standalone?: boolean;
}

export default function CreateUserModal({ onClose, onSuccess, standalone = false }: CreateUserModalProps) {
  const [fullName, setFullName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const createMutation = useMutation({
    mutationFn: (data: { full_name: string; account_number: string }) => userApi.create(data),
    onSuccess: () => {
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() && accountNumber.trim()) {
      createMutation.mutate({ full_name: fullName, account_number: accountNumber });
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
        <h2 className="text-lg font-semibold text-gray-900">Tambah User</h2>
      </div>
      <div className="px-6">
        <hr className="border-t border-gray-200 mt-2 mb-2" />
      </div>


      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 pt-6 pb-6">
        <div className="mb-4">
          <label className="text-sm text-gray-900 font-medium block mb-2">Nama</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Masukkan nama"
            required
          />
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-900 font-medium block mb-2">Rekening</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Masukkan rekening"
            required
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
            disabled={createMutation.isPending}
            className="flex-1 py-3 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
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
