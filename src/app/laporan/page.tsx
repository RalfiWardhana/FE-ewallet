'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { userApi, transactionApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

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

  const { data: balanceHistory = [] } = useQuery({
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

  const { data: topupHistory = [] } = useQuery({
    queryKey: ['topupHistory', selectedUserId],
    queryFn: async () => {
      const response = await transactionApi.getTopupHistory(
        selectedUserId ? Number(selectedUserId) : undefined
      );
      return response.data;
    },
    enabled: activeTab === 'topup',
  });

  const { data: transferHistory = [] } = useQuery({
    queryKey: ['transferHistory', selectedUserId],
    queryFn: async () => {
      const response = await transactionApi.getTransferHistory(
        selectedUserId ? Number(selectedUserId) : undefined
      );
      return response.data;
    },
    enabled: activeTab === 'transfer',
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-purple-700 text-white rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Laporan</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          {/* Tabs */}
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('saldo')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'saldo'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Saldo
              </button>
              <button
                onClick={() => setActiveTab('topup')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'topup'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Top Up
              </button>
              <button
                onClick={() => setActiveTab('transfer')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'transfer'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Transfer
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pengguna
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Semua</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              <button className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Tampil
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="p-6">
            {activeTab === 'saldo' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Nama</th>
                      <th className="text-left py-3 px-4">Tanggal</th>
                      <th className="text-left py-3 px-4">Bank</th>
                      <th className="text-left py-3 px-4">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {balanceHistory.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-gray-500">
                          {selectedUserId ? 'Tidak ada data' : 'Pilih user terlebih dahulu'}
                        </td>
                      </tr>
                    ) : (
                      balanceHistory.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-3 px-4">
                            {item.to_user?.full_name || item.from_user?.full_name || '-'}
                          </td>
                          <td className="py-3 px-4">{formatDate(item.created_at)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              item.type === 'TOPUP' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {formatCurrency(Number(item.balance_after))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'topup' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Nama</th>
                      <th className="text-left py-3 px-4">Tanggal</th>
                      <th className="text-left py-3 px-4">Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topupHistory.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-gray-500">
                          Tidak ada data
                        </td>
                      </tr>
                    ) : (
                      topupHistory.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-3 px-4">{item.user.full_name}</td>
                          <td className="py-3 px-4">{formatDate(item.created_at)}</td>
                          <td className="py-3 px-4">
                            {formatCurrency(Number(item.amount))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'transfer' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Nama Pengirim</th>
                      <th className="text-left py-3 px-4">Nama Penerima</th>
                      <th className="text-left py-3 px-4">Tanggal</th>
                      <th className="text-left py-3 px-4">Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transferHistory.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-gray-500">
                          Tidak ada data
                        </td>
                      </tr>
                    ) : (
                      transferHistory.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-3 px-4">{item.from_user.full_name}</td>
                          <td className="py-3 px-4">{item.to_user.full_name}</td>
                          <td className="py-3 px-4">{formatDate(item.created_at)}</td>
                          <td className="py-3 px-4">
                            {formatCurrency(Number(item.amount))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}