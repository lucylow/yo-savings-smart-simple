import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useWalletContext } from './WalletContext';
import { transactionsApi, type ApiTransaction } from '../utils/api';

export type Transaction = ApiTransaction;

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  addTransaction: (tx: { txHash: string; type: string; amount: string; asset: string; vaultAddress: string }) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  loadMore: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useWalletContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const refreshTransactions = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await transactionsApi.getAll(1);
      setTransactions(data.transactions);
      setPage(1);
      setHasMore(data.pagination.page < data.pagination.pages);
    } catch (err: unknown) {
      // Gracefully handle when backend is unavailable
      if (err instanceof Error) setError(err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadMore = useCallback(async () => {
    if (!isAuthenticated || !hasMore || loading) return;
    const nextPage = page + 1;
    try {
      const data = await transactionsApi.getAll(nextPage);
      setTransactions(prev => [...prev, ...data.transactions]);
      setPage(nextPage);
      setHasMore(data.pagination.page < data.pagination.pages);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  }, [isAuthenticated, hasMore, loading, page]);

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
    <TransactionContext.Provider value={{ transactions, loading, error, hasMore, addTransaction, refreshTransactions, loadMore }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactions must be used within TransactionProvider');
  return context;
};
