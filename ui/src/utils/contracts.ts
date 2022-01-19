import PawnShop from "../../../build/contracts/PawnShop.json";
import CentralBank from "../../../build/contracts/CentralBank.json";
import UTXO from "../../../build/contracts/UTXO.json";
import gmJEWEL from "../../../build/contracts/gmJEWEL.json";
import Profiles from "../../../build/interfaces/Profiles.json";
import JewelToken from "../../../build/interfaces/Jewel.json";
import Addresses from "../../deployment.json";
import MasterJeweler from "../../../build/contracts/MasterJeweler.json";
import ERC20 from "../abi/ERC20.json";
import xGMG from "../../../build/contracts/StakedGMG.json";

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
};

export const addresses = {
  PawnShop: Addresses["pawn_shop"],
  JewelToken: "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F",
  gmJEWEL: Addresses["gm_jewel"],
  GMGToken: Addresses["GMG_token"],
  MasterJeweler: Addresses["master_jeweler"],
  GMGLPToken: Addresses["GMG_jewel_LP_token"],
  JgmJLPToken: Addresses["gmJEWEL_jewel_LP_token"],
  xGMG: Addresses["staked_GMG"],
};
