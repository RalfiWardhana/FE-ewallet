'use client';

import { Transaction, User } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  selectedUser: User | null;
}

export default function TransactionList({ transactions, selectedUser }: TransactionListProps) {
  if (!selectedUser) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Riwayat Transaksi</h3>
        <div className="text-center py-12 text-gray-500">
          <p>Pilih user untuk melihat riwayat transaksi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Riwayat Transaksi</h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.length === 0 ? (
          <p className="text-center py-8 text-gray-500">Belum ada transaksi</p>
        ) : (
          transactions.map((transaction) => {
            const isReceived = transaction.to_user?.id === selectedUser.id;
            const isSent = transaction.from_user?.id === selectedUser.id;
            const isTopup = transaction.type === 'TOPUP';

            return (
              <div key={transaction.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      isTopup ? 'bg-green-100' : 
                      isReceived ? 'bg-blue-100' : 'bg-red-100'
                    }`}>
                      {isTopup ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : isReceived ? (
                        <ArrowDownLeft className="w-5 h-5 text-blue-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {isTopup ? 'Top Up' : 
                         isReceived ? `Transfer dari ${transaction.from_user?.full_name}` :
                         `Transfer ke ${transaction.to_user?.full_name}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      isTopup || isReceived ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isTopup || isReceived ? '+' : '-'}
                      {formatCurrency(Number(transaction.amount))}
                    </p>
                    <p className="text-sm text-gray-500">
                      Saldo: {formatCurrency(Number(transaction.balance_after))}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}