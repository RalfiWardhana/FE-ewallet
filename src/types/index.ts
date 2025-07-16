// src/types/index.ts
export interface User {
  id: number;
  full_name: string;
  rekening: string;
  balance: number;
  created_at: string;
  updated_at: string;
  bank_name?: string;
  bank_code?: string;
}

export interface Transaction {
  id: number;
  type: 'TOPUP' | 'TRANSFER';
  amount: number;
  balance_after: number;
  created_at: string;
  from_user?: {
    id: number;
    full_name: string;
    rekening: string;
  };
  to_user?: {
    id: number;
    full_name: string;
    rekening: string;
  };
}

export interface TransferHistory {
  id: number;
  amount: number;
  created_at: string;
  from_user: {
    id: number;
    full_name: string;
    rekening: string;
  };
  to_user: {
    id: number;
    full_name: string;
    rekening: string;
  };
}

export interface TopupHistory {
  id: number;
  amount: number;
  created_at: string;
  user: {
    id: number;
    full_name: string;
    rekening: string;
  };
}