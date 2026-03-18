import React, { useEffect, useState } from 'react';
import { useVaults } from '../../lib/yo-protocol-mock';
import { useWallet } from '../../hooks/useWallet';
import { NETWORKS, type NetworkId, getExplorerAddressUrl } from '../../config/networks';
import ErrorDisplay from './ErrorDisplay';

interface PortfolioPosition {
  vaultName: string;
  vaultAddress: string;
  network: NetworkId;
  balance: string;
  apy: string;
  value: string;
}

const PortfolioView: React.FC = () => {
  const { account } = useWallet();
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch vaults from SDK (Base is the primary chain)
  const { vaults, isLoading: vaultsLoading } = useVaults() as any;

  useEffect(() => {
    if (!account || !vaults || (vaults as any[]).length === 0) return;

    setLoading(true);
    setError(null);

    // Build positions from available vault data
    try {
      const pos: PortfolioPosition[] = (vaults as any[])
        .filter((v: any) => v && (v.tvl || v.totalAssets))
        .map((v: any) => ({
          vaultName: v.name || v.symbol || 'Unknown Vault',
          vaultAddress: v.address || '',
          network: 'base' as NetworkId,
          balance: v.userBalance?.formatted || '0.00',
          apy: v.apy ? `${Number(v.apy).toFixed(2)}%` : '--',
          value: v.userAssets?.formatted || '0.00',
        }));

      setPositions(pos);
    } catch (err: any) {
      setError(err.message || 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  }, [account, vaults]);

  if (!account) {
    return (
      <p className="text-xs text-muted-foreground text-center py-4">
        Connect wallet to view portfolio
      </p>
    );
  }

  const totalValue = positions.reduce(
    (sum, p) => sum + (parseFloat(p.value) || 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
          Portfolio Overview
        </h3>
        {positions.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {positions.length} vault{positions.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Total value */}
      <div className="p-4 rounded-lg bg-secondary border border-border">
        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold mb-1">
          Total Value
        </p>
        {loading || vaultsLoading ? (
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        ) : (
          <p className="text-2xl font-medium tracking-tighter tabular-nums text-foreground">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        )}
      </div>

      {error && <ErrorDisplay error={error} />}

      {/* Position list */}
      {loading || vaultsLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-secondary rounded-lg animate-pulse" />
          ))}
        </div>
      ) : positions.length === 0 ? (
        <div className="text-center py-6 space-y-2">
          <p className="text-sm text-muted-foreground">No vault positions yet</p>
          <p className="text-[10px] text-muted-foreground">
            Deposit into a YO vault to start earning yield
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {positions.map((pos, i) => (
            <div
              key={`${pos.vaultAddress}-${i}`}
              className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border hover:border-primary/20 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{pos.vaultName}</p>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-lime-dim text-primary text-[10px] font-medium">
                    {pos.apy} APY
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{NETWORKS[pos.network].name}</span>
                  {pos.vaultAddress && (
                    <a
                      href={getExplorerAddressUrl(pos.network, pos.vaultAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-muted-foreground underline hover:text-foreground"
                    >
                      {pos.vaultAddress.slice(0, 6)}...{pos.vaultAddress.slice(-4)}
                    </a>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium tabular-nums text-foreground">
                  ${parseFloat(pos.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-muted-foreground tabular-nums">
                  {pos.balance} shares
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Network breakdown */}
      {positions.length > 0 && (
        <div className="pt-2 border-t border-border">
          <p className="text-[10px] text-muted-foreground">
            All YO vaults are deployed on Base. Cross-chain deposits from 6 networks are supported via Enso routing.
          </p>
        </div>
      )}
    </div>
  );
};

export default PortfolioView;
