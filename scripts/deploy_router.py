from brownie import interface, accounts, chain, network, web3
from brownie import UTXO, gmJEWEL, PawnShop, CentralBank, PawnShopRouter
from brownie import GMGToken, MasterJeweler, StakedGMG
import json

from brownie import web3

profiles_address = "0xabD4741948374b1f5DD5Dd7599AC1f85A34cAcDD"
jewel_address = "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F"
uniswap_factory = "0x9014b937069918bd319f80e8b3bb4a2cf6faa5f7"
uniswap_router = "0x24ad62502d1C652Cc7684081169D04896aC20f30"


def get_deployer():
    net = network.show_active()
    if "fork" in net or "development" in net:
        return accounts[0]
    else:
        return accounts.load(input("Which account to deploy from: "))


def deploy_pawn_shop_router(deployer, pawn_shop, gm_jewel, jewel):
    return deployer.deploy(PawnShopRouter, pawn_shop, gm_jewel, jewel)


def main():
    deployer = get_deployer()
    net = network.show_active()
    is_dev = "fork" in net or "development" in net

    print(f"Attempting to deploy with {deployer}")

    with open(
        "ui/deployment.json" if is_dev else "ui/deployment-prod.json", "r"
    ) as infile:
        obj = json.load(infile)

    pawn_shop = obj["PawnShop"]
    gm_jewel = obj["gmJEWEL"]

    assert "PawnShopRouter" not in obj, "Router already deployed"

    pawn_shop_router = deploy_pawn_shop_router(
        deployer, pawn_shop, gm_jewel, jewel_address
    )
    print(f"Deployed PawnShopRouter at {pawn_shop_router.address}")

    with open(
        "ui/deployment.json" if is_dev else "ui/deployment-prod.json", "w"
    ) as outfile:
        obj["PawnShopRouter"] = pawn_shop_router.address
        json.dump(obj, outfile)
