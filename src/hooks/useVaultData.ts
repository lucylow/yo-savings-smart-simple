import { useVaultState, useUserPosition, useVaultSnapshot } from '@yo-protocol/react';
import { useWallet } from './useWallet';
import { useVaultContext } from '../contexts/VaultContext';

export const useVaultData = () => {
  const { account } = useWallet();
  const { selectedVault } = useVaultContext();

  const vaultId = selectedVault?.address || selectedVault?.name || '';

  const {
    vaultState,
    isLoading: stateLoading,
    error: stateError,
    refetch: refetchState,
  } = useVaultState(vaultId as any, { enabled: !!vaultId }) as any;

  const {
    position,
    isLoading: positionLoading,
    error: positionError,
    refetch: refetchPosition,
  } = useUserPosition(vaultId as any, account as any, {
    enabled: !!(vaultId && account),
  }) as any;

  // Try to get snapshot for additional data (APY, TVL)
  const {
    snapshot,
    isLoading: snapshotLoading,
  } = (useVaultSnapshot as any)?.(vaultId as any, { enabled: !!vaultId }) ?? { snapshot: null, isLoading: false };

  const error = stateError || positionError;

  const refetch = () => {
    refetchState?.();
    refetchPosition?.();
  };

  return {
    vaultState,
    position,
    snapshot,
    isLoading: stateLoading || positionLoading || snapshotLoading,
    error,
    refetch,
    selectedVault,
    account,
  };
};
