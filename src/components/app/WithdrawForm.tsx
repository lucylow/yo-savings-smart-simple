import React, { useState } from 'react';
import { useRedeem } from '../../lib/yo-protocol-mock';
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

const MOCK_AVAILABLE = 0.8;
const MOCK_TOTAL = 1.2;

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

  const assetSymbol = (selectedVault as any)?.assetSymbol || 'ETH';
  const totalBalance = MOCK_TOTAL;
  const availableNow = MOCK_AVAILABLE;

  const parsedAmount = parseFloat(amount) || 0;
  const exceedsAvailable = parsedAmount > availableNow;
  const immediateAmount = exceedsAvailable ? availableNow : parsedAmount;
  const queuedAmount = exceedsAvailable ? parsedAmount - availableNow : 0;

  const setQuickAmount = (pct: number) => {
    setAmount((totalBalance * pct).toFixed(4));
  };

  const handleWithdraw = async () => {
    if (parsedAmount <= 0 || parsedAmount > totalBalance) return;

    try {
      const decimals = (selectedVault as any)?.decimals ?? 18;
      const amountRaw = BigInt(Math.floor(parsedAmount * 10 ** decimals));
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
    <div className="space-y-4">
      {/* Balance info */}
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
          Withdraw
        </label>
        <span className="text-[10px] text-muted-foreground">
          Total: {totalBalance} {assetSymbol}
        </span>
      </div>

      {/* Available breakdown */}
      <div className="p-3 rounded-xl bg-secondary border border-border">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Instantly available</span>
          <span className="text-xs text-foreground font-medium tabular-nums">{availableNow} {assetSymbol}</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${(availableNow / totalBalance) * 100}%` }} />
        </div>
      </div>

      {/* Amount input */}
      <div className="relative">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full h-14 px-4 pr-16 bg-secondary border border-border rounded-xl text-lg font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 tabular-nums transition-all"
          disabled={isLoading}
          step="0.01"
          min="0"
          max={totalBalance}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
          {assetSymbol}
        </span>
      </div>

      {/* Quick amount buttons */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: '25%', pct: 0.25 },
          { label: '50%', pct: 0.5 },
          { label: '75%', pct: 0.75 },
          { label: 'Max', pct: 1 },
        ].map((q) => (
          <button
            key={q.label}
            onClick={() => setQuickAmount(q.pct)}
            disabled={isLoading}
            className="h-9 rounded-lg bg-card border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 active:scale-95 transition-all disabled:opacity-50"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Withdrawal type indicator */}
      {parsedAmount > 0 && step === 'idle' && !isSuccess && !redeemError && (
        <div className="space-y-2">
          {exceedsAvailable ? (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-400 font-medium">⚠ Partial async withdrawal</p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                {immediateAmount.toFixed(4)} {assetSymbol} withdrawn immediately.
                {queuedAmount.toFixed(4)} {assetSymbol} queued for async redemption (~1-2 hours).
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs text-primary font-medium">✓ Instant withdrawal available</p>
            </div>
          )}

          {/* Preview */}
          <div className="p-3.5 rounded-xl bg-card border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Withdraw</span>
              <span className="text-xs text-foreground font-medium tabular-nums">{parsedAmount.toFixed(4)} {assetSymbol}</span>
            </div>
            {exceedsAvailable && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Immediate</span>
                  <span className="text-xs text-foreground tabular-nums">{immediateAmount.toFixed(4)} {assetSymbol}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Queued</span>
                  <span className="text-xs text-amber-400 tabular-nums">{queuedAmount.toFixed(4)} {assetSymbol}</span>
                </div>
              </>
            )}
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-medium">Remaining</span>
              <span className="text-xs text-foreground font-bold tabular-nums">{(totalBalance - parsedAmount).toFixed(4)} {assetSymbol}</span>
            </div>
          </div>
        </div>
      )}

      {/* Step indicator */}
      {step !== 'idle' && step !== 'success' && step !== 'error' && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary border border-border">
          <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-xs text-foreground font-medium">{STEP_LABELS[step] || step}</span>
        </div>
      )}

      {/* Success */}
      {isSuccess && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
          {instant ? (
            <p className="text-sm text-primary font-bold">✓ Withdrawal completed!</p>
          ) : (
            <>
              <p className="text-sm text-primary font-bold">⏳ Redemption queued</p>
              <p className="text-xs text-muted-foreground">Processing asynchronously. Usually completes in 1-2 hours.</p>
            </>
          )}
          {hash && (
            <a href={`https://basescan.org/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground underline hover:text-foreground">
              View on BaseScan →
            </a>
          )}
          <button onClick={handleReset} className="block text-xs text-primary font-medium">New withdrawal</button>
        </div>
      )}

      {redeemError && <ErrorDisplay error={redeemError} onRetry={handleReset} retryLabel="Try again" />}

      {!isSuccess && !redeemError && (
        <AppButton variant="secondary" onClick={handleWithdraw} isLoading={isLoading} className="w-full" disabled={parsedAmount <= 0 || parsedAmount > totalBalance}>
          {parsedAmount > 0 ? `Withdraw ${parsedAmount.toFixed(4)} ${assetSymbol}` : 'Enter amount'}
        </AppButton>
      )}
    </div>
  );
};

export default WithdrawForm;
