import React, { useState } from 'react';
import { useRedeem } from '@yo-protocol/react';
import { useWallet } from '../../hooks/useWallet';
import { useVaultContext } from '../../contexts/VaultContext';
import { useVaultData } from '../../hooks/useVaultData';
import AppButton from './AppButton';
import ErrorDisplay from './ErrorDisplay';

const STEP_LABELS: Record<string, string> = {
  idle: '',
  approving: 'Approving...',
  redeeming: 'Processing withdrawal...',
  waiting: 'Waiting for confirmation...',
  success: 'Withdrawal complete!',
  error: 'Withdrawal failed',
};

const WithdrawForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const { account } = useWallet();
  const { selectedVault } = useVaultContext();
  const { position } = useVaultData();

  const vaultId = (selectedVault as any)?.address || (selectedVault as any)?.name || '';

  const {
    redeem,
    step = 'idle',
    isLoading = false,
    isSuccess = false,
    hash,
    instant,
    assetsOrRequestId,
    error: redeemError,
    reset,
  } = useRedeem({ vault: vaultId } as any) as any;

  // Estimate available balance from position
  const totalAssets = position?.assets;
  const maxAmount = totalAssets
    ? typeof totalAssets === 'bigint'
      ? Number(totalAssets) / 1e18
      : parseFloat(String(totalAssets)) || 0
    : 0;

  const handleWithdraw = async () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;
    if (num > maxAmount) return;

    try {
      const decimals = (selectedVault as any)?.decimals ?? 18;
      const amountRaw = BigInt(Math.floor(num * 10 ** decimals));

      await redeem({ shares: amountRaw });
      setAmount('');
    } catch {
      // Error captured in redeemError
    }
  };

  const handleReset = () => {
    reset?.();
    setAmount('');
  };

  if (!account) {
    return <p className="text-xs text-muted-foreground text-center py-4">Connect wallet to withdraw</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
          Withdraw Amount
        </label>
        {maxAmount > 0 && (
          <button
            onClick={() => setAmount(maxAmount.toFixed(6))}
            className="text-[10px] text-primary font-medium hover:underline"
          >
            Max: {maxAmount.toFixed(4)}
          </button>
        )}
      </div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary tabular-nums"
        disabled={isLoading}
        step="0.01"
        min="0"
        max={maxAmount}
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

      {/* Success with async/instant distinction */}
      {isSuccess && (
        <div className="space-y-1.5">
          {instant ? (
            <p className="text-xs text-primary font-medium">✓ Withdrawal completed instantly!</p>
          ) : (
            <div className="p-3 rounded-lg bg-lime-dim border border-primary/20">
              <p className="text-xs text-primary font-medium">⏳ Redemption queued</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Your withdrawal has been requested and will be processed asynchronously.
                This usually takes a few hours.
              </p>
              {assetsOrRequestId && (
                <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                  Request ID: {String(assetsOrRequestId).slice(0, 10)}...
                </p>
              )}
            </div>
          )}
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
            Make another withdrawal
          </button>
        </div>
      )}

      {/* Error */}
      {redeemError && (
        <ErrorDisplay
          error={redeemError}
          onRetry={handleReset}
          retryLabel="Try again"
        />
      )}

      {!isSuccess && !redeemError && (
        <AppButton variant="secondary" onClick={handleWithdraw} isLoading={isLoading} className="w-full">
          Withdraw
        </AppButton>
      )}
    </div>
  );
};

export default WithdrawForm;
