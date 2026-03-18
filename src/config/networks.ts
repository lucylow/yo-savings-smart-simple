export const NETWORKS = {
  base: {
    chainId: 8453,
    chainIdHex: '0x2105',
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    currency: 'ETH',
    isPrimary: true, // YO vaults deployed here
  },
  ethereum: {
    chainId: 1,
    chainIdHex: '0x1',
    name: 'Ethereum',
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    currency: 'ETH',
    isPrimary: false,
  },
  arbitrum: {
    chainId: 42161,
    chainIdHex: '0xa4b1',
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    currency: 'ETH',
    isPrimary: false,
  },
  optimism: {
    chainId: 10,
    chainIdHex: '0xa',
    name: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    explorer: 'https://optimistic.etherscan.io',
    currency: 'ETH',
    isPrimary: false,
  },
  avalanche: {
    chainId: 43114,
    chainIdHex: '0xa86a',
    name: 'Avalanche',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://snowtrace.io',
    currency: 'AVAX',
    isPrimary: false,
  },
  gnosis: {
    chainId: 100,
    chainIdHex: '0x64',
    name: 'Gnosis',
    rpcUrl: 'https://rpc.gnosischain.com',
    explorer: 'https://gnosisscan.io',
    currency: 'xDAI',
    isPrimary: false,
  },
} as const;

export type NetworkId = keyof typeof NETWORKS;

// Cross-chain deposit source networks (all 6 supported by Enso)
export const DEPOSIT_SOURCE_NETWORKS: NetworkId[] = [
  'base', 'ethereum', 'arbitrum', 'optimism', 'avalanche', 'gnosis',
];

// Known YO vault configurations on Base
export const YO_VAULTS = {
  yoETH: {
    name: 'yoETH',
    description: 'ETH Yield Optimizer',
    supportedAssets: ['ETH', 'WETH', 'stETH', 'wstETH', 'rETH', 'weETH', 'cbETH'],
  },
  yoBTC: {
    name: 'yoBTC',
    description: 'BTC Yield Optimizer',
    supportedAssets: ['WBTC', 'cbBTC'],
  },
  yoUSD: {
    name: 'yoUSD',
    description: 'USD Stablecoin Yield Optimizer',
    supportedAssets: ['USDC', 'USDT', 'DAI', 'USDS'],
  },
  yoEUR: {
    name: 'yoEUR',
    description: 'EUR Stablecoin Yield Optimizer',
    supportedAssets: ['EURe'],
  },
  yoGOLD: {
    name: 'yoGOLD',
    description: 'Gold Yield Optimizer',
    supportedAssets: ['PAXG', 'XAUt'],
  },
} as const;

export type VaultId = keyof typeof YO_VAULTS;

// All supported deposit assets across chains
export const SUPPORTED_ASSETS = [
  { symbol: 'ETH', name: 'Ether', decimals: 18 },
  { symbol: 'WETH', name: 'Wrapped Ether', decimals: 18 },
  { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  { symbol: 'USDT', name: 'Tether', decimals: 6 },
  { symbol: 'DAI', name: 'Dai', decimals: 18 },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', decimals: 8 },
  { symbol: 'stETH', name: 'Lido Staked ETH', decimals: 18 },
  { symbol: 'wstETH', name: 'Wrapped stETH', decimals: 18 },
  { symbol: 'cbETH', name: 'Coinbase ETH', decimals: 18 },
] as const;

export function getExplorerTxUrl(network: NetworkId, txHash: string): string {
  return `${NETWORKS[network].explorer}/tx/${txHash}`;
}

export function getExplorerAddressUrl(network: NetworkId, address: string): string {
  return `${NETWORKS[network].explorer}/address/${address}`;
}

export function getNetworkByChainId(chainId: number): NetworkId | null {
  for (const [id, config] of Object.entries(NETWORKS)) {
    if (config.chainId === chainId) return id as NetworkId;
  }
  return null;
}
