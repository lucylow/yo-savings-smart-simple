import React from 'react';
import { useVaultContext } from '../../contexts/VaultContext';

const VaultSelector: React.FC = () => {
  const { vaults, selectedVault, setSelectedVault, loading } = useVaultContext();

  return (
    <div className="space-y-3">
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
        Select Vault
      </h3>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-secondary rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {vaults.map((vault: any) => {
            const isSelected = (selectedVault as any)?.address === vault.address;
            return (
              <button
                key={vault.address || vault.name}
                onClick={() => setSelectedVault(vault)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'bg-primary/5 border-primary/30 shadow-glow'
                    : 'bg-secondary border-border hover:border-primary/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                    isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {vault.assetSymbol?.[0] || 'Y'}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{vault.name}</p>
                    <p className="text-[10px] text-muted-foreground">{vault.assetSymbol} · Base</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-lime-dim text-primary text-xs font-bold">
                    {vault.apy ? `${Number(vault.apy).toFixed(1)}%` : '--'} APY
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VaultSelector;
