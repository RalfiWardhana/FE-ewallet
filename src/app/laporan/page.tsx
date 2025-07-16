'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Calendar, ChevronDown, X } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { userApi, transactionApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

type TabType = 'saldo' | 'topup' | 'transfer';

export default function LaporanPage() {
  const [activeTab, setActiveTab] = useState<TabType>('saldo');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    selectedOption: 'all'
  });

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  const { data: users = [], refetch: refetchUsers } = useQuery({
    queryKey: ['users', dateFilter.startDate, dateFilter.endDate],
    queryFn: async () => {
      const response = await userApi.getAll();
      let filteredData = response.data;
      
      // Filter by date if date filter is active
      if (dateFilter.startDate || dateFilter.endDate) {
        filteredData = response.data.filter((user: any) => {
          const userDate = new Date(user.created_at).toISOString().split('T')[0];
          
          if (dateFilter.startDate && dateFilter.endDate) {
            return userDate >= dateFilter.startDate && userDate <= dateFilter.endDate;
          } else if (dateFilter.startDate) {
            return userDate >= dateFilter.startDate;
          } else if (dateFilter.endDate) {
            return userDate <= dateFilter.endDate;
          }
          return true;
        });
      }
      
      return filteredData;
    },
    enabled: activeTab === 'saldo',
  });

  const { data: topupHistory = [], refetch: refetchTopup } = useQuery({
    queryKey: ['topupHistory', selectedUserId, dateFilter.startDate, dateFilter.endDate],
    queryFn: async () => {
      const response = await transactionApi.getTopupHistory(
        selectedUserId ? Number(selectedUserId) : undefined,
        dateFilter.startDate || undefined,
        dateFilter.endDate || undefined
      );
      return response.data;
    },
    enabled: activeTab === 'topup',
  });

  const { data: transferHistory = [], refetch: refetchTransfer } = useQuery({
    queryKey: ['transferHistory', selectedUserId, dateFilter.startDate, dateFilter.endDate],
    queryFn: async () => {
      const response = await transactionApi.getTransferHistory(
        selectedUserId ? Number(selectedUserId) : undefined,
        dateFilter.startDate || undefined,
        dateFilter.endDate || undefined
      );
      return response.data;
    },
    enabled: activeTab === 'transfer',
  });

  const handleSearch = () => {
    if (activeTab === 'saldo') refetchUsers();
    else if (activeTab === 'topup') refetchTopup();
    else if (activeTab === 'transfer') refetchTransfer();
  };

  const handleDateFilter = (option: string) => {
    const today = new Date();
    let startDate = '';
    let endDate = today.toISOString().split('T')[0];

    switch (option) {
      case 'today':
        startDate = endDate;
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = endDate = yesterday.toISOString().split('T')[0];
        break;
      case 'week':
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        startDate = lastWeek.toISOString().split('T')[0];
        break;
      case 'month':
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        startDate = lastMonth.toISOString().split('T')[0];
        break;
      case 'all':
        startDate = '';
        endDate = '';
        break;
      default:
        return;
    }

    setDateFilter({ startDate, endDate, selectedOption: option });
  };

  // Filter data based on search term
  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTopup = topupHistory.filter(item =>
    item.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransfer = transferHistory.filter(item =>
    item.from_user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.to_user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Purple Header */}
        <div className="bg-[#6E32B9] text-white py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-2xl font-bold text-center">Laporan</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-4 pb-16">
          {/* Tabs */}
          <div className="flex mb-2 gap-0.5">
            {(['saldo', 'topup', 'transfer'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-32 text-sm font-semibold px-6 py-2 ${
                  activeTab === tab
                    ? 'bg-[#7322C4] text-white'
                    : 'bg-[#F3E7FF] text-[#7322C4]'
                } ${tab === 'saldo' ? 'rounded-l-xl' : tab === 'transfer' ? 'rounded-r-xl' : ''}`}
              >
                {tab === 'saldo' ? 'Saldo' : tab === 'topup' ? 'Top Up' : 'Transfer'}
              </button>
            ))}
          </div>

          {/* Search + Table Box */}
          <div className="bg-white shadow-sm border border-[#F3E7FF] rounded-xl overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-[#F3E7FF]">
              <p className="text-xs text-[#5E5E5E] mb-2 font-medium">Pencarian</p>
              <div className="flex items-center gap-3">
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9B9B9B] text-sm">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Cari nama"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm text-[#3D3D3D] placeholder-[#9B9B9B] border border-[#C9AFFF] rounded-lg focus:outline-none"
                  />
                </div>
                
                <button 
                  onClick={() => setShowDateModal(true)}
                  className="flex items-center gap-2 bg-[#7322C4] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#6320A7]"
                >
                  <Calendar className="w-4 h-4" />
                  Tanggal
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {dateFilter.selectedOption !== 'all' && (
                <p className="text-xs text-gray-500 mt-2">
                  Filter: {dateFilter.selectedOption === 'custom' 
                    ? `${dateFilter.startDate || 'Start'} - ${dateFilter.endDate || 'End'}`
                    : dateFilter.selectedOption === 'today' ? 'Hari Ini'
                    : dateFilter.selectedOption === 'yesterday' ? 'Kemarin'
                    : dateFilter.selectedOption === 'week' ? '7 Hari Terakhir'
                    : dateFilter.selectedOption === 'month' ? '30 Hari Terakhir'
                    : dateFilter.selectedOption
                  }
                </p>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                {/* Table Head */}
                {activeTab === 'saldo' && (
                  <thead className="bg-[#F9FAFB] text-left text-[#667085]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Nama</th>
                      <th className="px-4 py-3 font-semibold">Rekening</th>
                      <th className="px-4 py-3 font-semibold">Tanggal Daftar</th>
                      <th className="px-4 py-3 font-semibold">Saldo</th>
                    </tr>
                  </thead>
                )}
                {activeTab === 'topup' && (
                  <thead className="bg-[#F9FAFB] text-left text-[#667085]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Nama</th>
                      <th className="px-4 py-3 font-semibold">Rekening</th>
                      <th className="px-4 py-3 font-semibold">Tanggal</th>
                      <th className="px-4 py-3 font-semibold">Nominal</th>
                    </tr>
                  </thead>
                )}
                {activeTab === 'transfer' && (
                  <thead className="bg-[#F9FAFB] text-left text-[#667085]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Pengirim</th>
                      <th className="px-4 py-3 font-semibold">Penerima</th>
                      <th className="px-4 py-3 font-semibold">Rekening Penerima</th>
                      <th className="px-4 py-3 font-semibold">Tanggal</th>
                      <th className="px-4 py-3 font-semibold">Nominal</th>
                    </tr>
                  </thead>
                )}

                {/* Table Body */}
                <tbody>
                  {activeTab === 'saldo' && filteredUsers.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                      <td className="px-4 py-3 text-[#101828]">{item.full_name || '-'}</td>
                      <td className="px-4 py-3 text-[#101828] font-mono">{item.rekening || '-'}</td>
                      <td className="px-4 py-3 text-[#101828]">{formatDate(item.created_at)}</td>
                      <td className="px-4 py-3 text-[#101828] font-semibold">
                        {formatCurrency(Number(item.balance))}
                      </td>
                    </tr>
                  ))}

                  {activeTab === 'topup' && filteredTopup.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 ? 'bg-[#FAFAFA]' : 'bg-white'}>
                      <td className="px-4 py-3 text-[#101828]">{item.user?.full_name || '-'}</td>
                      <td className="px-4 py-3 text-[#101828] font-mono">{item.user?.rekening || '-'}</td>
                      <td className="px-4 py-3 text-[#101828]">{formatDate(item.created_at)}</td>
                      <td className="px-4 py-3 text-[#101828] font-semibold">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}

                  {activeTab === 'transfer' && filteredTransfer.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 ? 'bg-[#FAFAFA]' : 'bg-white'}>
                      <td className="px-4 py-3 text-[#101828]">{item.from_user?.full_name || '-'}</td>
                      <td className="px-4 py-3 text-[#101828]">{item.to_user?.full_name || '-'}</td>
                      <td className="px-4 py-3 text-[#101828] font-mono">{item.to_user?.rekening || '-'}</td>
                      <td className="px-4 py-3 text-[#101828]">{formatDate(item.created_at)}</td>
                      <td className="px-4 py-3 text-[#101828] font-semibold">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {((activeTab === 'saldo' && filteredUsers.length === 0) ||
                (activeTab === 'topup' && filteredTopup.length === 0) ||
                (activeTab === 'transfer' && filteredTransfer.length === 0)) && (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada data yang ditemukan
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Date Filter Modal */}
      {showDateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Filter Tanggal</h3>
              <button 
                onClick={() => setShowDateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleDateFilter('all');
                    setShowDateModal(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm hover:bg-gray-100 ${
                    dateFilter.selectedOption === 'all' ? 'bg-purple-50 text-purple-700 font-medium' : ''
                  }`}
                >
                  Semua Tanggal
                </button>
                <button
                  onClick={() => {
                    handleDateFilter('today');
                    setShowDateModal(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm hover:bg-gray-100 ${
                    dateFilter.selectedOption === 'today' ? 'bg-purple-50 text-purple-700 font-medium' : ''
                  }`}
                >
                  Hari Ini
                </button>
                <button
                  onClick={() => {
                    handleDateFilter('yesterday');
                    setShowDateModal(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm hover:bg-gray-100 ${
                    dateFilter.selectedOption === 'yesterday' ? 'bg-purple-50 text-purple-700 font-medium' : ''
                  }`}
                >
                  Kemarin
                </button>
                <button
                  onClick={() => {
                    handleDateFilter('week');
                    setShowDateModal(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm hover:bg-gray-100 ${
                    dateFilter.selectedOption === 'week' ? 'bg-purple-50 text-purple-700 font-medium' : ''
                  }`}
                >
                  7 Hari Terakhir
                </button>
                <button
                  onClick={() => {
                    handleDateFilter('month');
                    setShowDateModal(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm hover:bg-gray-100 ${
                    dateFilter.selectedOption === 'month' ? 'bg-purple-50 text-purple-700 font-medium' : ''
                  }`}
                >
                  30 Hari Terakhir
                </button>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Range</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600">Dari Tanggal</label>
                    <input
                      type="date"
                      value={dateFilter.startDate}
                      max={today}
                      onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value, selectedOption: 'custom' })}
                      className="w-full mt-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Sampai Tanggal</label>
                    <input
                      type="date"
                      value={dateFilter.endDate}
                      max={today}
                      onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value, selectedOption: 'custom' })}
                      className="w-full mt-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setShowDateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      setShowDateModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}