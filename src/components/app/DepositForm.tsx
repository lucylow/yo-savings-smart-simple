import React, { useState } from 'react';
import { useDeposit } from '@yo-protocol/react';
import { useWallet } from '../../hooks/useWallet';
import { useVaultContext } from '../../contexts/VaultContext';
import AppButton from './AppButton';

const DepositForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const { account } = useWallet();
  const { selectedVault } = useVaultContext();

  const vaultId = (selectedVault as any)?.address || (selectedVault as any)?.name || '';
  const { deposit, isLoading } = useDeposit(vaultId as any) as any;

  const handleDeposit = async () => {
    setError('');
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Enter a valid amount');
      return;
    }

    try {
      setStatus('pending');
      // Convert to token amount (assuming 18 decimals)
      const amountWei = BigInt(Math.floor(num * 1e18));
      await deposit(amountWei);
      setAmount('');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
      setStatus('error');
    }
  };

  if (!account) {
    return <p className="text-xs text-muted-foreground text-center py-4">Connect wallet to deposit</p>;
  }

  return (
    <div className="space-y-3">
      <label className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
        Deposit Amount
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
      {status === 'success' && <p className="text-xs text-primary">Deposit successful!</p>}
      <AppButton variant="primary" onClick={handleDeposit} isLoading={isLoading} className="w-full">
        Deposit
      </AppButton>
    </div>
  );
};

export default DepositForm;
