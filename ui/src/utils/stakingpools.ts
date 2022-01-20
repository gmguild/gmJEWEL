// Add pools to this file to save on RPC calls

interface IPool {
  lpToken: string;
  allocPoint: number;
  //   keep these tokens in same order as uniswap pool
  token0: string;
  token1: string;
}

export const MasterJewelerPool: Record<number, IPool> = {
  [0]: {
    //   gmJEWEL-JEWEL
    lpToken: "0x8e6C2ee1f55FF482cAEa84E7cFeDF34D259864d9",
    allocPoint: 30,
    token0: "0x3eC03857197159B68Ac60dfD765ede48F25a9F8B",
    token1: "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F",
  },
  [1]: {
    //   JEWEL-GMG
    lpToken: "0x33Af0e5bFa4552DB2390C01e1f5646689037e04E",
    allocPoint: 70,
    token0: "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F",
    token1: "0x8d175DC448b1d3D0277AB87388a5362921eE1fEF",
  },
};
