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
  const [rekening, setRekening] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: (data: { full_name: string; rekening: string }) => userApi.create(data),
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('rekening')) {
          setErrors({ rekening: 'Nomor rekening sudah terdaftar' });
        } else {
          setErrors({ general: error.response.data.message });
        }
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) {
      newErrors.full_name = 'Nama wajib diisi';
    }
    
    if (!rekening.trim()) {
      newErrors.rekening = 'Nomor rekening wajib diisi';
    } else if (!/^\d{10,16}$/.test(rekening)) {
      newErrors.rekening = 'Nomor rekening harus 10-16 digit angka';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    createMutation.mutate({ full_name: fullName, rekening: rekening });
  };

  const handleRekeningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      setRekening(value);
      if (errors.rekening) {
        setErrors({ ...errors, rekening: '' });
      }
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
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.full_name) {
                setErrors({ ...errors, full_name: '' });
              }
            }}
            className={`w-full px-4 py-3 bg-gray-100 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.full_name ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Masukkan nama"
            required
          />
          {errors.full_name && (
            <p className="mt-1 text-xs text-red-600">{errors.full_name}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-900 font-medium block mb-2">Rekening</label>
          <input
            type="text"
            value={rekening}
            onChange={handleRekeningChange}
            className={`w-full px-4 py-3 bg-gray-100 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.rekening ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Masukkan rekening (10-16 digit)"
            maxLength={16}
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            {rekening.length}/16 digit
          </p>
          {errors.rekening && (
            <p className="mt-1 text-xs text-red-600">{errors.rekening}</p>
          )}
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700">{errors.general}</p>
          </div>
        )}

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
            className="flex-1 py-3 bg-[#6E32B9] text-white rounded-xl text-sm font-semibold hover:bg-[#5a2a9a] disabled:opacity-50"
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