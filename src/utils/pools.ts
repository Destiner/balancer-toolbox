interface Pool {
  id: string;
  address: string;
  name: string;
}

const POOLS: Pool[] = [
  {
    id: '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014',
    address: '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56',
    name: '80/20 BAL/WETH',
  },
  {
    id: '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8000200000000000000000019',
    address: '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    name: '50/50 USDC/WETH',
  },
  {
    id: '0x0b09dea16768f0799065c475be02919503cb2a3500020000000000000000001a',
    address: '0x0b09dea16768f0799065c475be02919503cb2a35',
    name: '60/40 WETH/DAI',
  },
];

export { POOLS, Pool };
