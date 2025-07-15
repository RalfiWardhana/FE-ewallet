'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import WalletCard from '@/components/Wallet/WalletCard';
import TransactionList from '@/components/Wallet/TransactionList';
import { userApi, transactionApi } from '@/lib/api';
import { User } from '@/types';

export default function WalletPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userApi.getAll();
      return response.data;
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser) return [];
      const response = await transactionApi.getBalanceHistory(selectedUser.id);
      return response.data;
    },
    enabled: !!selectedUser,
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Purple Header Section */}
        <div className="bg-purple-700 text-white py-12">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold text-center">Wallet</h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Wallet Card */}
            <WalletCard 
              users={users}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              isLoading={isLoading}
            />
            
            {/* Transaction List */}
            <TransactionList 
              transactions={transactions}
              selectedUser={selectedUser}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}