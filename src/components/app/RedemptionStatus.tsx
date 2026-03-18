import React from 'react';
import { useVaultData } from '../../hooks/useVaultData';

const RedemptionStatus: React.FC = () => {
  const { position } = useVaultData();

  // The SDK's useUserPosition may include pendingRedemption data
  const pending = (position as any)?.pendingRedemption ?? (position as any)?.pendingRedeem;

  if (!pending) return null;

  const formatAssets = (val: any): string => {
    if (!val) return '0.00';
    // Handle both raw bigint and formatted object { raw, formatted }
    if (typeof val === 'object' && val.formatted) return val.formatted;
    if (typeof val === 'bigint') return (Number(val) / 1e18).toFixed(4);
    return String(val);
  };

  const requestTime = pending.requestTime || pending.timestamp;

  return (
    <div className="space-y-3">
      <h3 className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
        Pending Redemption
      </h3>

      <div className="p-4 rounded-lg bg-lime-dim border border-primary/20 space-y-3">
        {/* Progress indicator */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {formatAssets(pending.assets)} being processed
            </p>
            <p className="text-[10px] text-muted-foreground">
              Shares: {formatAssets(pending.shares)}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2 pl-2 border-l-2 border-primary/30">
          <div className="flex items-center gap-2 pl-3">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div>
              <p className="text-[10px] text-foreground font-medium">Redemption requested</p>
              {requestTime && (
                <p className="text-[10px] text-muted-foreground">
                  {new Date(requestTime).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 pl-3">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-pulse" />
            <div>
              <p className="text-[10px] text-muted-foreground">Processing — usually completes within a few hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedemptionStatus;
