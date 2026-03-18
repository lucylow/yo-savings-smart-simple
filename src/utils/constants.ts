export const SUPPORTED_NETWORKS = ['ethereum', 'arbitrum', 'base'] as const;
export type SupportedNetwork = typeof SUPPORTED_NETWORKS[number];

export const NETWORK_NAMES: Record<SupportedNetwork, string> = {
  ethereum: 'Ethereum',
  arbitrum: 'Arbitrum',
  base: 'Base'
};

export const DEFAULT_NETWORK: SupportedNetwork = 'base';
