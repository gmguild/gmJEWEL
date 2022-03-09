import PawnShop from "../../../../build/contracts/PawnShop.json";
import CentralBank from "../../../../build/contracts/CentralBank.json";
import UTXO from "../../../../build/contracts/UTXO.json";
import gmJEWEL from "../../../../build/contracts/gmJEWEL.json";
import Profiles from "../../../../build/interfaces/Profiles.json";
import JewelToken from "../../../../build/interfaces/Jewel.json";
import MasterJeweler from "../../../../build/contracts/MasterJeweler.json";
import ERC20 from "../../abi/ERC20.json";
import UniswapV2Pair from "../../abi/UniswapV2Pair.json";
import xGMG from "../../../../build/contracts/StakedGMG.json";
import Addresses from "../../../deployment.json";
import PawnShopRouter from "../../../../build/contracts/PawnShopRouter.json";

export const abis = {
  PawnShop: PawnShop.abi,
  CentralBank: CentralBank.abi,
  UTXO: UTXO.abi,
  gmJEWEL: gmJEWEL.abi,
  Profiles: Profiles.abi,
  JewelToken: JewelToken.abi,
  MasterJeweler: MasterJeweler.abi,
  ERC20: ERC20,
  xGMG: xGMG.abi,
  UniswapV2Pair: UniswapV2Pair,
  PawnShopRouter: PawnShopRouter.abi,
};

export const addresses = {
  PawnShop: Addresses["PawnShop"],
  JewelToken: "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F",
  gmJEWEL: Addresses["gmJEWEL"],
  GMGToken: Addresses["GMGToken"],
  MasterJeweler: Addresses["MasterJeweler"],
  JGMGLPToken: Addresses["JGMGLPToken"],
  JgmJLPToken: Addresses["JgmJLPToken"],
  xGMG: Addresses["StakedGMG"],
  PawnShopRouter: Addresses["PawnShopRouter"],
};
