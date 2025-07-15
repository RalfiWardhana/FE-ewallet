'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { userApi, transactionApi } from '@/lib/api';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';

type TabType = 'saldo' | 'topup' | 'transfer';

export default function LaporanPage() {
  const [activeTab, setActiveTab] = useState<TabType>('saldo');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userApi.getAll();
      return response.data;
    },
  });

  const { data: balanceHistory = [], refetch: refetchBalance } = useQuery({
    queryKey: ['balanceHistory', selectedUserId, selectedDate],
    queryFn: async () => {
      if (!selectedUserId) return [];
      const response = await transactionApi.getBalanceHistory(
        Number(selectedUserId),
        selectedDate || undefined
      );
      return response.data;
    },
    enabled: activeTab === 'saldo' && !!selectedUserId,
  });

  const { data: topupHistory = [], refetch: refetchTopup } = useQuery({
    queryKey: ['topupHistory', selectedUserId],
    queryFn: async () => {
      const response = await transactionApi.getTopupHistory(
        selectedUserId ? Number(selectedUserId) : undefined
      );
      return response.data;
    },
    enabled: activeTab === 'topup',
  });

  const { data: transferHistory = [], refetch: refetchTransfer } = useQuery({
    queryKey: ['transferHistory', selectedUserId],
    queryFn: async () => {
      const response = await transactionApi.getTransferHistory(
        selectedUserId ? Number(selectedUserId) : undefined
      );
      return response.data;
    },
    enabled: activeTab === 'transfer',
  });

  const handleSearch = () => {
    if (activeTab === 'saldo') refetchBalance();
    else if (activeTab === 'topup') refetchTopup();
    else if (activeTab === 'transfer') refetchTransfer();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Purple Header */}
        <div className="bg-purple-700 text-white py-12">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold text-center">Laporan</h1>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-lg">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('saldo')}
                  className={`px-8 py-4 font-medium text-sm transition-all ${
                    activeTab === 'saldo'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Saldo
                </button>
                <button
                  onClick={() => setActiveTab('topup')}
                  className={`px-8 py-4 font-medium text-sm transition-all ${
                    activeTab === 'topup'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Top Up
                </button>
                <button
                  onClick={() => setActiveTab('transfer')}
                  className={`px-8 py-4 font-medium text-sm transition-all ${
                    activeTab === 'transfer'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Transfer
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pengguna
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Cari</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                {activeTab === 'saldo' && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}

                <button 
                  onClick={handleSearch}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Tampil
                </button>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              {activeTab === 'saldo' && (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Nama</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Tanggal</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Bank</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {balanceHistory.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-12 text-gray-500">
                          {selectedUserId ? 'Tidak ada data' : 'Pilih user terlebih dahulu'}
                        </td>
                      </tr>
                    ) : (
                      balanceHistory.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-4 px-6">
                            {item.to_user?.full_name || item.from_user?.full_name || '-'}
                          </td>
                          <td className="py-4 px-6">{formatDate(item.created_at)}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                              item.type === 'TOPUP' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {item.type === 'TOPUP' ? 'BCA/BNI' : 'TRANSFER'}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-medium">
                            {formatCurrency(Number(item.balance_after))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'topup' && (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Nama</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Tanggal</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topupHistory.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-12 text-gray-500">
                          Tidak ada data topup
                        </td>
                      </tr>
                    ) : (
                      topupHistory.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-4 px-6">{item.user.full_name}</td>
                          <td className="py-4 px-6">{formatDateTime(item.created_at)}</td>
                          <td className="py-4 px-6 font-medium text-green-600">
                            +{formatCurrency(Number(item.amount))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'transfer' && (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Nama Pengirim</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Nama Penerima</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Tanggal</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transferHistory.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-12 text-gray-500">
                          Tidak ada data transfer
                        </td>
                      </tr>
                    ) : (
                      transferHistory.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-4 px-6">{item.from_user.full_name}</td>
                          <td className="py-4 px-6">{item.to_user.full_name}</td>
                          <td className="py-4 px-6">{formatDateTime(item.created_at)}</td>
                          <td className="py-4 px-6 font-medium">
                            {formatCurrency(Number(item.amount))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}