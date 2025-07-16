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


const { data: balanceHistory = [], refetch: refetchBalance } = useQuery({
  queryKey: ['users'],
    queryFn: async () => {
      const response = await userApi.getAll();
      return response.data;
    },
  enabled: activeTab === 'saldo',
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
                className={`w-32 text-sm font-semibold px-6 py-2 ${activeTab === tab
                  ? 'bg-[#7322C4] text-white'
                  : 'bg-[#F3E7FF] text-[#7322C4]'
                  } ${tab === 'saldo' ? 'rounded-l-xl' : tab === 'transfer' ? 'rounded-r-xl' : ''
                  }`}
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
                    placeholder="Cari"
                    className="w-full pl-9 pr-4 py-2.5 text-sm text-[#3D3D3D] placeholder-[#9B9B9B] border border-[#C9AFFF] rounded-lg focus:outline-none"
                  />
                </div>
                <button className="flex items-center gap-2 bg-[#7322C4] text-white text-sm font-medium px-4 py-2.5 rounded-lg">
                   Tanggal
                </button>

              </div>
            </div>

            {/* Table */}
            <div>
              <table className="w-full text-sm">
                {/* Table Head */}
                {activeTab === 'saldo' && (
                  <thead className="bg-[#F9FAFB] text-left text-[#667085]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Nama</th>
                      <th className="px-4 py-3 font-semibold">Tanggal</th>
                      <th className="px-4 py-3 font-semibold">Bank</th>
                      <th className="px-4 py-3 font-semibold">Saldo</th>
                    </tr>
                  </thead>
                )}
                {activeTab === 'topup' && (
                  <thead className="bg-[#F9FAFB] text-left text-[#667085]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Nama</th>
                      <th className="px-4 py-3 font-semibold">Tanggal</th>
                      <th className="px-4 py-3 font-semibold">Nominal</th>
                    </tr>
                  </thead>
                )}
                {activeTab === 'transfer' && (
                  <thead className="bg-[#F9FAFB] text-left text-[#667085]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Nama Pengirim</th>
                      <th className="px-4 py-3 font-semibold">Nama Penerima</th>
                      <th className="px-4 py-3 font-semibold">Tanggal</th>
                    </tr>
                  </thead>
                )}

                {/* Table Body */}
                <tbody>
                  {activeTab === 'saldo' && users.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                      <td className="px-4 py-3 text-[#101828]">
                        {item?.full_name || '-'}
                      </td>
                      <td className="px-4 py-3 text-[#101828]">{formatDate(item.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={`/bank-icons/${item.bank_code}.png`}
                            alt={item.bank_code}
                            className="w-6 h-6"
                          />
                          <span className="text-[#101828]">{item.bank_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#101828]">
                        {formatCurrency(item?.balance)}
                      </td>
                    </tr>
                  ))}

                  {activeTab === 'topup' && topupHistory.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 ? 'bg-[#FAFAFA]' : 'bg-white'}>
                      <td className="px-4 py-3 text-[#101828]">{item.user?.full_name || '-'}</td>
                      <td className="px-4 py-3 text-[#101828]">{formatDate(item.created_at)}</td>
                      <td className="px-4 py-3 text-[#101828]">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}

                  {activeTab === 'transfer' && transferHistory.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 ? 'bg-[#FAFAFA]' : 'bg-white'}>
                      <td className="px-4 py-3 text-[#101828]">{item.from_user?.full_name || '-'}</td>
                      <td className="px-4 py-3 text-[#101828]">{item.to_user?.full_name || '-'}</td>
                      <td className="px-4 py-3 text-[#101828]">{formatDate(item.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
