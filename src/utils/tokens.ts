export const TOKENS = {
  ETH: {
    decimals: 18,
  },
  USDC: {
    // USDC Rinkeby Token has 18 decimals, mainnet has 6
    // ! don't have access to the node proccess
    decimals: process.env.NETWORK_CHAIN_ID === "4" ? 6 : 18,
  },
  DAI: {
    decimals: 18,
  },
  XYZ: {
    decimals: 18,
  },
  WETH: {
    decimals: 18,
  },
};
