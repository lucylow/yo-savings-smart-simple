import { useWalletContext } from '../contexts/WalletContext';

export const useWallet = () => {
  const { account, provider, signer, chainId, connect, connectMock, disconnect, signIn, signOut, isConnecting, isAuthenticated, isMock, error } = useWalletContext();
  return { account, provider, signer, chainId, connect, connectMock, disconnect, signIn, signOut, isConnecting, isAuthenticated, isMock, error };
};
