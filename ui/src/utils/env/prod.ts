import PawnShop from "../../../../prod-deployment/contracts/PawnShop.json";
import CentralBank from "../../../../prod-deployment/contracts/CentralBank.json";
import UTXO from "../../../../prod-deployment/contracts/UTXO.json";
import gmJEWEL from "../../../../prod-deployment/contracts/gmJEWEL.json";
import Profiles from "../../../../prod-deployment/interfaces/Profiles.json";
import JewelToken from "../../../../prod-deployment/interfaces/Jewel.json";
import MasterJeweler from "../../../../prod-deployment/contracts/MasterJeweler.json";
import ERC20 from "../../abi/ERC20.json";
import xGMG from "../../../../prod-deployment/contracts/StakedGMG.json";
import Addresses from "../../../deployment-prod.json";

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
  PawnShop: Addresses["PawnShop"],
  JewelToken: "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F",
  gmJEWEL: Addresses["gmJEWEL"],
  GMGToken: Addresses["GMGToken"],
  MasterJeweler: Addresses["MasterJeweler"],
  JGMGLPToken: Addresses["JGMGLPToken"],
  JgmJLPToken: Addresses["JgmJLPToken"],
  xGMG: Addresses["staked_GMG"],
};
