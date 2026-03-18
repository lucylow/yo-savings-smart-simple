import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { authApi } from '../utils/api';

const MOCK_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // vitalik.eth

interface WalletContextType {
  account: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  chainId: number | null;
  connect: () => Promise<void>;
  connectMock: () => void;
  disconnect: () => void;
  signIn: () => Promise<void>;
  signOut: () => void;
  isConnecting: boolean;
  isAuthenticated: boolean;
  isMock: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => authApi.isAuthenticated());
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signOut = useCallback(() => {
    authApi.logout();
    setIsAuthenticated(false);
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    signOut();
    if ((window as any).ethereum) {
      (window as any).ethereum.removeAllListeners?.('accountsChanged');
      (window as any).ethereum.removeAllListeners?.('chainChanged');
    }
  }, [signOut]);

  const signInWithProvider = useCallback(async (web3Provider: ethers.providers.Web3Provider, address: string) => {
    try {
      const { nonce } = await authApi.getNonce(address);

      const network = await web3Provider.getNetwork();
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to YO Savings Widget',
        uri: window.location.origin,
        version: '1',
        chainId: network.chainId,
        nonce,
      });

      const messageToSign = message.prepareMessage();
      const signature = await web3Provider.getSigner().signMessage(messageToSign);

      await authApi.verify(messageToSign, signature);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      // Don't block wallet connection if sign-in fails
    }
  }, []);

  const signIn = useCallback(async () => {
    if (!provider || !account) return;
    setError(null);
    try {
      await signInWithProvider(provider, account);
    } catch (err: any) {
      setError('Authentication failed. Please try again.');
    }
  }, [provider, account, signInWithProvider]);

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

      // Auto sign-in after wallet connection
      if (!authApi.isAuthenticated()) {
        await signInWithProvider(web3Provider, addr);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [disconnect, signInWithProvider]);

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
    <WalletContext.Provider value={{ account, provider, signer, chainId, connect, disconnect, signIn, signOut, isConnecting, isAuthenticated, error }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWalletContext must be used within WalletProvider');
  return context;
};
