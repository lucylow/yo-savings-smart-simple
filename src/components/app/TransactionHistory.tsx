import React, { useEffect, useState } from 'react';
import { transactionsApi } from '../../utils/api';
import { authApi } from '../../utils/api';

interface Transaction {
  _id: string;
  txHash: string;
  type: 'deposit' | 'withdraw' | 'redeem';
  amount: string;
  asset: string;
  vaultAddress: string;
  status: string;
  timestamp: string;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authApi.isAuthenticated()) return;

    setLoading(true);
    transactionsApi
      .getAll()
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!authApi.isAuthenticated()) {
    return (
      <p className="text-xs text-muted-foreground text-center py-4">
        Sign in to view transaction history
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
        Recent Transactions
      </h3>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-secondary rounded-lg animate-pulse" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6">No transactions yet</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx._id}
              className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    tx.type === 'deposit'
                      ? 'bg-lime-dim text-primary'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {tx.type === 'deposit' ? '↓' : '↑'}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground capitalize">{tx.type}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium tabular-nums text-foreground">
                  {tx.type === 'deposit' ? '+' : '-'}
                  {tx.amount} {tx.asset}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(tx.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
