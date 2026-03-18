// Mock implementations for @yo-protocol/react hooks
// Replace with real package when available

import { useState } from 'react';

const MOCK_VAULTS = [
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'YO Base Vault',
    symbol: 'yoETH',
    apy: 5.2,
    tvl: '1250000',
    totalAssets: '1250000',
    network: 'base',
    assetSymbol: 'ETH',
    decimals: 18,
    userBalance: { formatted: '0.00' },
    userAssets: { formatted: '0.00' },
  },
  {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    name: 'YO USDC Vault',
    symbol: 'yoUSDC',
    apy: 8.1,
    tvl: '3400000',
    totalAssets: '3400000',
    network: 'base',
    assetSymbol: 'USDC',
    decimals: 6,
    userBalance: { formatted: '0.00' },
    userAssets: { formatted: '0.00' },
  },
];

export function useVaults() {
  const [vaults] = useState(MOCK_VAULTS);
  const [isLoading] = useState(false);
  const [error] = useState(null);
  return { vaults, isLoading, error };
}

export function useDeposit(_opts?: any) {
  const [step, setStep] = useState('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);

  const deposit = async (_args?: any) => {
    setIsLoading(true);
    setStep('depositing');
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const mockHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setHash(mockHash);
      setStep('success');
      setIsSuccess(true);
    } catch (e) {
      setStep('error');
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep('idle');
    setIsLoading(false);
    setIsSuccess(false);
    setHash(null);
    setError(null);
  };

  return { deposit, step, isLoading, isSuccess, hash, approveHash: null, error, reset };
}

export function useRedeem(_opts?: any) {
  const [step, setStep] = useState('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);

  const redeem = async (_args?: any) => {
    setIsLoading(true);
    setStep('redeeming');
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const mockHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setHash(mockHash);
      setStep('success');
      setIsSuccess(true);
    } catch (e) {
      setStep('error');
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep('idle');
    setIsLoading(false);
    setIsSuccess(false);
    setHash(null);
    setError(null);
  };

  return { redeem, step, isLoading, isSuccess, hash, instant: true, assetsOrRequestId: null, error, reset };
}

export function useVaultState(_vaultId?: any, _opts?: any) {
  return {
    vaultState: { apy: 5.2, tvl: '1250000' },
    isLoading: false,
    error: null,
    refetch: () => {},
  };
}

export function useUserPosition(_vaultId?: any, _account?: any, _opts?: any) {
  return {
    position: { assets: 0, balance: 0, shares: 0 },
    isLoading: false,
    error: null,
    refetch: () => {},
  };
}
