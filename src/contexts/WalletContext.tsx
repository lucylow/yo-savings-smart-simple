import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  account: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disconnect = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    if ((window as any).ethereum) {
      (window as any).ethereum.removeAllListeners?.('accountsChanged');
      (window as any).ethereum.removeAllListeners?.('chainChanged');
    }
  }, []);

  const connect = useCallback(async () => {
    if (!(window as any).ethereum) {
      setError('No wallet detected. Please install MetaMask or another wallet.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const web3Provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await web3Provider.send('eth_requestAccounts', []);
      const web3Signer = web3Provider.getSigner();
      const addr = await web3Signer.getAddress();
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(addr);
      setChainId(network.chainId);

      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      });

      (window as any).ethereum.on('chainChanged', (newChainId: string) => {
        setChainId(parseInt(newChainId, 16));
      });
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [disconnect]);

  useEffect(() => {
    if ((window as any).ethereum?.selectedAddress) {
      connect();
    }
    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeAllListeners?.('accountsChanged');
        (window as any).ethereum.removeAllListeners?.('chainChanged');
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{ account, provider, signer, chainId, connect, disconnect, isConnecting, error }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWalletContext must be used within WalletProvider');
  return context;
};
