from brownie import interface, accounts, chain, network, web3
from brownie import UTXO, gmJEWEL, PawnShop, CentralBank, GMGToken, MasterJeweler, StakedGMG
import json
import os

SCRIPT_DIR = os.path.dirname(__file__)  # <-- absolute dir the script is in
ADDRESSES = json.load(open(
    os.path.join(SCRIPT_DIR, "../ui/deployment-prod.json"), "r"))


def main():
    jewel = interface.Jewel(ADDRESSES["JewelToken"])
    gmg = GMGToken.at(ADDRESSES["GMGToken"])
    xgmg = StakedGMG.at(ADDRESSES["StakedGMG"])
    central_bank = CentralBank.at(ADDRESSES["CentralBank"])
    pawn_shop = PawnShop.at(ADDRESSES["PawnShop"])

    print("JEWEL balance of CentralBank: " +
          str(jewel.balanceOf(central_bank).to("ether")))
    print("JEWEL balance of StakedGMG: " +
          str(jewel.balanceOf(xgmg).to("ether")))
