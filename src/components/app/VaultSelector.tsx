import React from 'react';
import { useVaultContext } from '../../contexts/VaultContext';
import type { SupportedNetwork } from '../../types';
import { NETWORK_NAMES } from '../../utils/constants';

const VaultSelector: React.FC = () => {
  const { vaults, selectedVault, setSelectedVault, network, setNetwork, loading } = useVaultContext();

  return (
    <div className="space-y-4">
      {/* Network selector */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">Network</label>
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value as SupportedNetwork)}
          className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {(Object.entries(NETWORK_NAMES) as [SupportedNetwork, string][]).map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
      </div>

      {/* Vault selector */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">Vault</label>
        {loading ? (
          <p className="text-xs text-muted-foreground">Loading vaults...</p>
        ) : (
          <select
            value={(selectedVault as any)?.address || ''}
            onChange={(e) => {
              const vault = vaults.find((v: any) => v.address === e.target.value);
              if (vault) setSelectedVault(vault);
            }}
            className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {vaults.map((vault: any) => (
              <option key={vault.address || vault.name} value={vault.address}>
                {vault.name || vault.address}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default VaultSelector;
