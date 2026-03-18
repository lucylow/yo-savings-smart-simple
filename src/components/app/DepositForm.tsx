import React, { useState } from 'react';
import { useDeposit } from '../../lib/yo-protocol-mock';
import { useWallet } from '../../hooks/useWallet';
import { useVaultContext } from '../../contexts/VaultContext';
import AppButton from './AppButton';
import ErrorDisplay from './ErrorDisplay';

const STEP_LABELS: Record<string, string> = {
  idle: '',
  'switching-chain': 'Switching network...',
  approving: 'Approving token...',
  depositing: 'Confirming deposit...',
  waiting: 'Waiting for confirmation...',
  success: 'Deposit successful!',
  error: 'Deposit failed',
};

const DepositForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const { account } = useWallet();
  const { selectedVault } = useVaultContext();

  const vaultId = (selectedVault as any)?.address || (selectedVault as any)?.name || '';

  const {
    deposit,
    step = 'idle',
    isLoading = false,
    isSuccess = false,
    hash,
    approveHash,
    error: depositError,
    reset,
  } = useDeposit({ vault: vaultId } as any) as any;

  const handleDeposit = async () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    try {
      // Convert to smallest unit (assuming 18 decimals for ETH, 6 for USDC)
      const decimals = (selectedVault as any)?.decimals ?? 18;
      const amountRaw = BigInt(Math.floor(num * 10 ** decimals));

      await deposit({
        amount: amountRaw,
        // token address would come from vault config in production
      });
      setAmount('');
    } catch {
      // Error is captured in depositError
    }
  };

  const handleReset = () => {
    reset?.();
    setAmount('');
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

      {/* Step indicator */}
      {step !== 'idle' && step !== 'success' && step !== 'error' && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {STEP_LABELS[step] || step}
        </div>
      )}

      {/* Success */}
      {isSuccess && (
        <div className="space-y-1">
          <p className="text-xs text-primary font-medium">✓ Deposit confirmed!</p>
          {hash && (
            <a
              href={`https://basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-muted-foreground underline hover:text-foreground"
            >
              View transaction →
            </a>
          )}
          <button onClick={handleReset} className="text-[10px] text-primary underline">
            Make another deposit
          </button>
        </div>
      )}

      {/* Error */}
      {depositError && (
        <ErrorDisplay
          error={depositError}
          onRetry={handleReset}
          retryLabel="Try again"
        />
      )}

      {!isSuccess && !depositError && (
        <AppButton variant="primary" onClick={handleDeposit} isLoading={isLoading} className="w-full">
          Deposit
        </AppButton>
      )}

      <p className="text-[10px] text-muted-foreground leading-relaxed">
        Funds are deposited into the YO vault and start earning yield immediately.
      </p>
    </div>
  );
};

export default DepositForm;
