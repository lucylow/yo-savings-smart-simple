import { useState, useCallback } from 'react';
import { SiweMessage } from 'siwe';
import { ethers } from 'ethers';
import { authApi, userApi } from '../utils/api';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: authApi.isAuthenticated(),
    user: null,
    isLoading: false,
    error: null,
  });

  const signIn = useCallback(async (address: string, signer: ethers.Signer) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      // 1. Get nonce from backend
      const { nonce } = await authApi.getNonce(address);

      // 2. Create SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to YO Savings Widget',
        uri: window.location.origin,
        version: '1',
        chainId: 1,
        nonce,
      });

      const messageToSign = message.prepareMessage();

      // 3. Sign message with wallet
      const signature = await signer.signMessage(messageToSign);

      // 4. Verify with backend and get JWT
      const data = await authApi.verify(messageToSign, signature);

      setState({
        isAuthenticated: true,
        user: data.user,
        isLoading: false,
        error: null,
      });

      return data;
    } catch (err: any) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err.message || 'Sign-in failed',
      }));
      throw err;
    }
  }, []);

  const signOut = useCallback(() => {
    authApi.logout();
    setState({ isAuthenticated: false, user: null, isLoading: false, error: null });
  }, []);

  const loadProfile = useCallback(async () => {
    if (!authApi.isAuthenticated()) return;
    try {
      const user = await userApi.getProfile();
      setState((s) => ({ ...s, user, isAuthenticated: true }));
    } catch {
      // Token may be expired
      authApi.logout();
      setState((s) => ({ ...s, isAuthenticated: false, user: null }));
    }
  }, []);

  return { ...state, signIn, signOut, loadProfile };
};
