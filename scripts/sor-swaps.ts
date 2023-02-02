import { BalancerSDK, Network } from '@balancer-labs/sdk';
import { BigNumber } from 'ethers';

const balancer = new BalancerSDK({
  network: Network.MAINNET,
  rpcUrl:
    'https://eth-mainnet.g.alchemy.com/v2/XBMDB1hM72SfDFbB0A7xEUMIwwRC34Qs',
  customSubgraphUrl:
    'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
});

await balancer.sor.fetchPools();

const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f';
const amount = BigNumber.from(10).pow(18);
const swaps = await balancer.sor.getSwaps(WETH, DAI, 0, amount);

console.log(swaps);
