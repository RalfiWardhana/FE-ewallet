export interface User {
  id: number;
  full_name: string;
  balance: number;
  created_at: string;
  updated_at: string;
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
  };
  to_user?: {
    id: number;
    full_name: string;
  };
}

export interface TransferHistory {
  id: number;
  amount: number;
  from_user: {
    id: number;
    full_name: string;
  };
  to_user: {
    id: number;
    full_name: string;
  };
  created_at: string;
}

export interface TopupHistory {
  id: number;
  amount: number;
  user: {
    id: number;
    full_name: string;
  };
  created_at: string;
}