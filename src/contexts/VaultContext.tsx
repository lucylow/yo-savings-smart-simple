import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useVaults } from '../lib/yo-protocol-mock';
import type { SupportedNetwork } from '../types';
import { DEFAULT_NETWORK } from '../utils/constants';

interface VaultItem {
  address?: string;
  name?: string;
  apy?: number;
  tvl?: string;
  network?: string;
  assetSymbol?: string;
  [key: string]: any;
}

interface VaultContextType {
  selectedVault: VaultItem | null;
  setSelectedVault: (vault: VaultItem) => void;
  vaults: VaultItem[];
  loading: boolean;
  error: string | null;
  network: SupportedNetwork;
  setNetwork: (network: SupportedNetwork) => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<SupportedNetwork>(DEFAULT_NETWORK);
  const [selectedVault, setSelectedVault] = useState<VaultItem | null>(null);

  const { vaults, isLoading, error } = useVaults() as any;

  useEffect(() => {
    const list = (vaults || []) as VaultItem[];
    if (list.length > 0 && !selectedVault) {
      setSelectedVault(list[0]);
    }
  }, [vaults, selectedVault]);

  return (
    <VaultContext.Provider value={{
      selectedVault,
      setSelectedVault,
      vaults: (vaults || []) as VaultItem[],
      loading: isLoading ?? false,
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
