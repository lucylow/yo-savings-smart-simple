import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useVaults } from '@yo-protocol/react';
import type { VaultInfo, SupportedNetwork } from '../types';
import { DEFAULT_NETWORK } from '../utils/constants';

interface VaultContextType {
  selectedVault: VaultInfo | null;
  setSelectedVault: (vault: VaultInfo) => void;
  vaults: VaultInfo[];
  loading: boolean;
  error: string | null;
  network: SupportedNetwork;
  setNetwork: (network: SupportedNetwork) => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<SupportedNetwork>(DEFAULT_NETWORK);
  const [selectedVault, setSelectedVault] = useState<VaultInfo | null>(null);

  const { vaults, loading, error } = useVaults({ network, includeTestnets: import.meta.env.DEV } as any);

  useEffect(() => {
    if (vaults && (vaults as any[]).length > 0 && !selectedVault) {
      setSelectedVault((vaults as any[])[0]);
    }
  }, [vaults, selectedVault]);

  return (
    <VaultContext.Provider value={{
      selectedVault,
      setSelectedVault,
      vaults: (vaults || []) as VaultInfo[],
      loading,
      error: (error as any)?.message || null,
      network,
      setNetwork
    }}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVaultContext = () => {
  const context = useContext(VaultContext);
  if (!context) throw new Error('useVaultContext must be used within VaultProvider');
  return context;
};
