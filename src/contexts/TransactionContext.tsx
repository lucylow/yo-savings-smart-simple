import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useWalletContext } from './WalletContext';
import { transactionsApi } from '../utils/api';

export interface Transaction {
  _id?: string;
  txHash: string;
  type: 'deposit' | 'withdraw' | 'redeem';
  amount: string;
  asset: string;
  vaultAddress: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  addTransaction: (tx: { txHash: string; type: string; amount: string; asset: string; vaultAddress: string }) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useWalletContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshTransactions = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await transactionsApi.getAll();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addTransaction = useCallback(async (tx: { txHash: string; type: string; amount: string; asset: string; vaultAddress: string }) => {
    const newTx = await transactionsApi.add(tx.txHash, tx.type, tx.amount, tx.asset, tx.vaultAddress);
    setTransactions(prev => [newTx, ...prev]);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshTransactions();
    } else {
      setTransactions([]);
    }
  }, [isAuthenticated, refreshTransactions]);

  return (
    <TransactionContext.Provider value={{ transactions, loading, error, addTransaction, refreshTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactions must be used within TransactionProvider');
  return context;
};
