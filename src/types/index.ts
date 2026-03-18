import { BigNumber } from 'ethers';

export interface VaultInfo {
  address: string;
  name: string;
  apy: number;
  tvl: BigNumber;
  network: 'ethereum' | 'arbitrum' | 'base';
  assetSymbol: string;
}

export interface UserVaultData {
  balance: BigNumber;
  assets: BigNumber;
  apy: number;
  availableBalance: BigNumber;
  pendingRedemption?: {
    shares: BigNumber;
    assets: BigNumber;
    requestTime: Date;
  };
}

export type SupportedNetwork = 'ethereum' | 'arbitrum' | 'base';
