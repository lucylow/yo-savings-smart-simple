import React, { useState } from 'react';
import { useTransactions } from '../../contexts/TransactionContext';

type FilterType = 'all' | 'deposit' | 'withdraw' | 'redeem';

const filters: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'deposit', label: 'Deposits' },
  { id: 'withdraw', label: 'Withdrawals' },
];

const TransactionHistory: React.FC = () => {
  const { transactions, loading, error } = useTransactions();
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter((tx) => tx.type === filter);

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
        Transaction History
      </h3>

      {/* Filter tabs */}
      <div className="flex gap-1.5 p-1 bg-secondary rounded-xl border border-border">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              filter === f.id
                ? 'bg-card-elevated text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-secondary rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p className="text-xs text-destructive text-center py-4">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center mx-auto">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">No transactions yet</p>
          <p className="text-[10px] text-muted-foreground">Your transaction history will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((tx) => (
            <a
              key={tx._id || tx.txHash}
              href={`https://basescan.org/tx/${tx.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-secondary rounded-xl border border-border hover:border-primary/20 transition-colors active:scale-[0.99] group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                    tx.type === 'deposit'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {tx.type === 'deposit' ? '↓' : '↑'}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground capitalize">{tx.type}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleDateString()} · <span className={`${
                      tx.status === 'confirmed' ? 'text-primary' : tx.status === 'failed' ? 'text-destructive' : 'text-muted-foreground'
                    }`}>{tx.status}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium tabular-nums text-foreground">
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount} {tx.asset}
                  </p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
