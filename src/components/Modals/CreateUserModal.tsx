'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, UserPlus } from 'lucide-react';
import { userApi } from '@/lib/api';

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
  standalone?: boolean;
}

export default function CreateUserModal({ onClose, onSuccess, standalone = false }: CreateUserModalProps) {
  const [fullName, setFullName] = useState('');

  const createMutation = useMutation({
    mutationFn: (data: { full_name: string }) => userApi.create(data),
    onSuccess: () => {
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim()) {
      createMutation.mutate({ full_name: fullName });
    }
  };

  const modalContent = (
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tambah User</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-purple-50 rounded-lg p-4 mb-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm text-purple-700">User baru akan dibuat dengan saldo awal</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">Rp0</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Masukkan nama"
            required
          />
        </div>

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
            disabled={createMutation.isPending}
            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {createMutation.isPending ? 'Loading...' : 'Simpan'}
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