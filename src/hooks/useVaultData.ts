import { useVaultState, useUserPosition } from '@yo-protocol/react';
import { useWallet } from './useWallet';
import { useVaultContext } from '../contexts/VaultContext';

export const useVaultData = () => {
  const { account } = useWallet();
  const { selectedVault } = useVaultContext();

  const vaultId = selectedVault?.address || selectedVault?.name || '';

  // Use the SDK hooks with proper typing
  const { vaultState, isLoading: stateLoading } = useVaultState(vaultId as any, { enabled: !!vaultId }) as any;
  const { position, isLoading: positionLoading } = useUserPosition(vaultId as any, account as any, { enabled: !!(vaultId && account) }) as any;

  return {
    vaultState,
    position,
    isLoading: stateLoading || positionLoading,
    selectedVault,
    account,
  };
};
