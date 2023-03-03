function getQueryBatchSwapAllPoolsSnippet(
  swapTokenInValue: string,
  swapTokenOutValue: string,
  isExactIn: boolean,
  swapAmountInValue: string,
  swapAmountOutValue: string,
): string {
  return `const swapInfo = await sdk.sor.getSwaps(
  '${swapTokenInValue}',
  '${swapTokenOutValue}',
  ${isExactIn ? 'SwapTypes.SwapExactIn' : 'SwapTypes.SwapExactOut'},
  ${
    isExactIn
      ? `BigNumber.from('${swapAmountInValue}')`
      : `BigNumber.from('${swapAmountOutValue}')`
  },
);

const vaultAddress = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';
const vault = new ethers.Contract(vaultAddress, vaultAbi, provider);
const values = await vault.queryBatchSwap(
  ${isExactIn ? 'SwapTypes.SwapExactIn' : 'SwapTypes.SwapExactOut'},
  swapInfo.swaps,
  swapInfo.tokenAddresses,
  {
    sender: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    fromInternalBalance: false,
    recipient: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
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
    sender: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    fromInternalBalance: false,
    recipient: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    toInternalBalance: false,
  }
)`;
}

export {
  getQueryBatchSwapAllPoolsSnippet,
  getQueryBatchSwapSelectedPoolsSnippet,
};
