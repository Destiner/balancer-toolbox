interface Token {
  symbol: string;
  name: string;
  address: string;
}

const TOKENS: Token[] = [
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
  {
    symbol: 'BAL',
    name: 'Balancer',
    address: '0xba100000625a3754423978a60c9317c58a424e3d',
  },
];

export { TOKENS, Token };
