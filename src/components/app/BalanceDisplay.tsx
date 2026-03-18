import React from 'react';
import { useVaultData } from '../../hooks/useVaultData';
import ErrorDisplay from './ErrorDisplay';

const BalanceDisplay: React.FC = () => {
  const { vaultState, position, snapshot, isLoading, error, refetch } = useVaultData();

  const totalAssets = position?.assets ?? position?.balance ?? 0;
  const apy = snapshot?.apy ?? vaultState?.apy ?? 0;

  const formatNum = (val: any): string => {
    if (!val) return '$0.00';
    const num = typeof val === 'bigint' ? Number(val) / 1e18 : typeof val === 'number' ? val : parseFloat(String(val));
    if (isNaN(num)) return '$0.00';
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const assetsNum = typeof totalAssets === 'bigint' ? Number(totalAssets) / 1e18 : typeof totalAssets === 'number' ? totalAssets : parseFloat(String(totalAssets)) || 0;
  const dailyYield = (assetsNum * (Number(apy) / 100)) / 365;

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refetch}
        retryLabel="Reload vault data"
      />
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
        Total Savings
      </p>
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-10 w-40 bg-secondary rounded animate-pulse" />
          <div className="h-4 w-28 bg-secondary rounded animate-pulse" />
        </div>
      ) : (
        <>
          <h2 className="text-4xl font-medium tracking-tighter tabular-nums text-foreground">
            {formatNum(totalAssets)}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">+{formatNum(dailyYield)} daily</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-lime-dim text-primary text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              {apy ? `${Number(apy).toFixed(1)}%` : '--'} APY
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default BalanceDisplay;
