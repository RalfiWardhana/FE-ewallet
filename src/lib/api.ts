import axios from 'axios';
import { User, Transaction, TransferHistory, TopupHistory } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  getAll: () => api.get<User[]>('/users'),
  getOne: (id: number) => api.get<User>(`/users/${id}`),
  create: (data: { full_name: string }) => api.post<User>('/users', data),
  topup: (id: number, amount: number) => 
    api.post(`/users/${id}/topup`, { amount }),
  transfer: (id: number, to_user_id: number, amount: number) => 
    api.post(`/users/${id}/transfer`, { to_user_id, amount }),
  delete: (id: number) => api.delete(`/users/${id}`),
};

export const transactionApi = {
  getBalanceHistory: (userId: number, date?: string) => 
    api.get<Transaction[]>('/transactions/balance-history', {
      params: { userId, date }
    }),
  getTransferHistory: (userId?: number) => 
    api.get<TransferHistory[]>('/transactions/transfers', {
      params: { userId }
    }),
  getTopupHistory: (userId?: number) => 
    api.get<TopupHistory[]>('/transactions/topups', {
      params: { userId }
    }),
};