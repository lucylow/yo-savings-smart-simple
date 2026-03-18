import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useWalletContext } from './WalletContext';
import { userApi, recurringApi, type ApiUser, type RecurringDeposit } from '../utils/api';

interface UserContextType {
  profile: ApiUser | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updatePreferredVault: (vault: { address: string; network: string; name: string }) => Promise<void>;
  updateRecurringDeposit: (settings: Partial<RecurringDeposit>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { account, isAuthenticated } = useWalletContext();
  const [profile, setProfile] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!isAuthenticated || !account) return;
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.getProfile();
      setProfile(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, account]);

  const updatePreferredVault = useCallback(async (vault: { address: string; network: string; name: string }) => {
    await userApi.updatePreferredVault(vault.address, vault.network, vault.name);
    await refreshProfile();
  }, [refreshProfile]);

  const updateRecurringDeposit = useCallback(async (settings: Partial<RecurringDeposit>) => {
    await recurringApi.updateSettings(
      settings.enabled ?? false,
      settings.amount ?? '0',
      settings.frequency ?? 'weekly'
    );
    await refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    if (isAuthenticated && account) {
      refreshProfile();
    } else {
      setProfile(null);
    }
  }, [isAuthenticated, account, refreshProfile]);

  return (
    <UserContext.Provider value={{ profile, loading, error, refreshProfile, updatePreferredVault, updateRecurringDeposit }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
