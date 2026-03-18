import React, { useState } from 'react';
import { useRedeem } from '@yo-protocol/react';
import { useWallet } from '../../hooks/useWallet';
import { useVaultContext } from '../../contexts/VaultContext';
import AppButton from './AppButton';

const WithdrawForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const { account } = useWallet();
  const { selectedVault } = useVaultContext();

  const vaultId = (selectedVault as any)?.address || (selectedVault as any)?.name || '';
  const { redeem, isLoading } = useRedeem(vaultId as any) as any;

  const handleWithdraw = async () => {
    setError('');
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Enter a valid amount');
      return;
    }

    try {
      setStatus('pending');
      const amountWei = BigInt(Math.floor(num * 1e18));
      await redeem(amountWei);
      setAmount('');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
      setStatus('error');
    }
  };

  if (!account) {
    return <p className="text-xs text-muted-foreground text-center py-4">Connect wallet to withdraw</p>;
  }

  return (
    <div className="space-y-3">
      <label className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
        Withdraw Amount
      </label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary tabular-nums"
        disabled={isLoading}
        step="0.01"
        min="0"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {status === 'success' && <p className="text-xs text-primary">Withdrawal successful!</p>}
      <AppButton variant="secondary" onClick={handleWithdraw} isLoading={isLoading} className="w-full">
        Withdraw
      </AppButton>
    </div>
  );
};

export default WithdrawForm;
