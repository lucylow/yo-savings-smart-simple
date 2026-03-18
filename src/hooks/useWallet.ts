import { useWalletContext } from '../contexts/WalletContext';

export const useWallet = () => {
  const { account, provider, signer, chainId, connect, disconnect, isConnecting, error } = useWalletContext();
  return { account, provider, signer, chainId, connect, disconnect, isConnecting, error };
};
