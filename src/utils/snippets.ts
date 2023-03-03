import { constants } from 'ethers';

function getQueryBatchSwapAllPoolsSnippet(
  swapTokenInValue: string,
  swapTokenOutValue: string,
  isExactIn: boolean,
  amount: string,
): string {
  return `const swapInfo = await sdk.sor.getSwaps(
  '${swapTokenInValue}',
  '${swapTokenOutValue}',
  ${isExactIn ? 'SwapTypes.SwapExactIn' : 'SwapTypes.SwapExactOut'},
  ${`BigNumber.from('${amount}')`},
);

const vaultAddress = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';
const vault = new ethers.Contract(vaultAddress, vaultAbi, provider);
const values = await vault.queryBatchSwap(
  ${isExactIn ? 'SwapTypes.SwapExactIn' : 'SwapTypes.SwapExactOut'},
  swapInfo.swaps,
  swapInfo.tokenAddresses,
  {
    sender: ${constants.AddressZero},
    fromInternalBalance: false,
    recipient: ${constants.AddressZero},
    toInternalBalance: false,
  }
)
  `;
}

function getQueryBatchSwapSelectedPoolsSnippet(
  swaps: unknown,
  tokens: string[],
): string {
  return `const vaultAddress = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';
const vault = new ethers.Contract(vaultAddress, vaultAbi, provider);
const values = await vault.queryBatchSwap(
  'SwapTypes.SwapExactIn',
  [${JSON.stringify(swaps)}],
  ['${tokens.join("', '")}'],
  {
    sender: ${constants.AddressZero},
    fromInternalBalance: false,
    recipient: ${constants.AddressZero},
    toInternalBalance: false,
  }
)`;
}

export {
  getQueryBatchSwapAllPoolsSnippet,
  getQueryBatchSwapSelectedPoolsSnippet,
};
