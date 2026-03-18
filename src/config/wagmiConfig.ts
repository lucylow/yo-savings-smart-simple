import { http, createConfig } from 'wagmi';
import { base, mainnet, arbitrum, optimism, avalanche, gnosis } from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [base, mainnet, arbitrum, optimism, avalanche, gnosis],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [optimism.id]: http('https://mainnet.optimism.io'),
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
    [gnosis.id]: http('https://rpc.gnosischain.com'),
  },
});
