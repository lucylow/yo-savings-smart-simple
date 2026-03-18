import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

export const formatBalance = (balance: BigNumber): string => {
  const num = parseFloat(formatEther(balance));
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatUSD = (amount: BigNumber | number): string => {
  const num = typeof amount === 'number' ? amount : parseFloat(formatEther(amount));
  return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatAPY = (apy: number): string => {
  return `${apy.toFixed(2)}%`;
};
