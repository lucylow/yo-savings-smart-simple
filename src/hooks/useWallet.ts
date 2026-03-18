import { useWalletContext } from '../contexts/WalletContext';

export const useWallet = () => {
  const { account, provider, signer, chainId, connect, disconnect, signIn, signOut, isConnecting, isAuthenticated, error } = useWalletContext();
  return { account, provider, signer, chainId, connect, disconnect, signIn, signOut, isConnecting, isAuthenticated, error };
};
