import { Ref, ref } from 'vue';

const ETHEREUM = 'ethereum';
const OPTIMISM = 'optimism';
const POLYGON = 'polygon';
const ARBITRUM = 'arbitrum';
type Chain =
  | typeof ETHEREUM
  | typeof OPTIMISM
  | typeof POLYGON
  | typeof ARBITRUM;

const CHAINS: Chain[] = [ETHEREUM, POLYGON, ARBITRUM, OPTIMISM];

interface UseChain {
  id: Ref<Chain>;
  setChain: (chainId: Chain) => void;
}

function useChain(): UseChain {
  const id = ref<Chain>(ETHEREUM);

  function setChain(chainId: Chain): void {
    id.value = chainId;
  }

  return { id, setChain };
}

export default useChain;

export { ARBITRUM, CHAINS, ETHEREUM, OPTIMISM, POLYGON, Chain };
