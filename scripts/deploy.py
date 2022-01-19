from brownie import interface, accounts, chain, network, web3
from brownie import UTXO, gmJEWEL, PawnShop, CentralBank
from brownie import GMGToken, MasterJeweler, StakedGMG
import json
import os
from brownie import web3

from scripts.helpers import toDict
from tests.conftest import alice

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


def mine_new_blocks():

    web3.manager.request_blocking("evm_setAutomine", [False])
    web3.manager.request_blocking("evm_setIntervalMining", [2000])

    for block in chain.new_blocks():
        txs = block.transactions
        print(f"Mining block {block.number}")
        for txr in txs:
            tx = web3.eth.get_transaction_receipt(txr)
            print(f"Transaction: {json.dumps(toDict(tx),indent=2)}")


def deploy_utxo(deployer):
    return deployer.deploy(UTXO)


def deploy_gm_jewel(deployer):
    return deployer.deploy(gmJEWEL)


def deploy_pawnshop(deployer, gm_jewel, central_bank, utxo_template):
    contract = deployer.deploy(
        PawnShop,
        gm_jewel,
        utxo_template,
        central_bank,
        jewel_address,
        profiles_address,
    )
    gm_jewel.addMinter(contract.address, {"from": deployer})
    return contract


def deploy_central_bank(deployer, gm_jewel):
    contract = deployer.deploy(CentralBank, gm_jewel, jewel_address)
    gm_jewel.addMinter(contract.address, {"from": deployer})
    return contract


def deploy_GMGtoken(deployer):
    return deployer.deploy(GMGToken)


def deploy_masterjeweler(deployer, GMG_token):
    blocknumber = web3.eth.block_number
    contract = deployer.deploy(
        MasterJeweler,
        GMG_token,
        deployer,
        1 * 1e17,
        blocknumber,
        [20_000_000, 25_000_000, 30_000_000, 35_000_000, 45_000_000],
        [100, 50, 30, 10, 1],
    )
    return contract


def deploy_stakedGMG(deployer, GMG_token):
    return deployer.deploy(
        StakedGMG, GMG_token, deployer, uniswap_router, jewel_address
    )


def give_user_jewel(user):
    jewel_token = interface.Jewel(jewel_address)
    jewel_token.transfer(
        user, 100 *
        1e18, {"from": "0xa9ce83507d872c5e1273e745abcfda849daa654f"}
    )


def give_user_gm_jewel(user, gm_jewel, deployer):
    gm_jewel.mint(user, 10 * 1e18, {"from": deployer})


def seed_gmg_pool(deployer, gmg_token, accounts, is_dev):
    jewel_token = interface.Jewel(jewel_address)
    contract = interface.IUniswapV2Factory(uniswap_factory)
    contract.createPair(gmg_token, jewel_token, {"from": deployer})
    pool_addr = contract.getPair(gmg_token, jewel_token)
    if is_dev:
        pool = interface.IUniswapV2Pair(pool_addr)
        jewel_token.transfer(
            pool, 1000 *
            1e18, {"from": "0xa9ce83507d872c5e1273e745abcfda849daa654f"}
        )
        gmg_token.mint(pool, 10_000 * 1e18, {"from": deployer})
        pool.mint(accounts[1], {"from": deployer})
    return pool_addr


def seed_llj_pool(deployer, llj_pool, accounts, is_dev):
    jewel_token = interface.Jewel(jewel_address)
    contract = interface.IUniswapV2Factory(uniswap_factory)
    contract.createPair(llj_pool, jewel_token, {"from": deployer})
    pool_addr = contract.getPair(llj_pool, jewel_token)
    if is_dev:
        pool = interface.IUniswapV2Pair(pool_addr)
        jewel_token.transfer(
            pool, 2500 *
            1e18, {"from": "0xa9ce83507d872c5e1273e745abcfda849daa654f"}
        )
        llj_pool.mint(pool, 1_000 * 1e18, {"from": deployer})
        pool.mint(accounts[1], {"from": deployer})
    return pool_addr


def main():
    deployer = get_deployer()
    net = network.show_active()
    is_dev = "fork" in net or "development" in net

    print(chain._chainid)
    print(f"Attempting to deploy with {deployer}")

    blocknumber = chain.height

    # Core Contracts
    utxo_template = deploy_utxo(deployer)
    gm_jewel = deploy_gm_jewel(deployer)
    central_bank = deploy_central_bank(deployer, gm_jewel)
    pawn_shop = deploy_pawnshop(
        deployer, gm_jewel, central_bank, utxo_template)

    # Staking Contracts
    GMG_token = deploy_GMGtoken(deployer)
    master_jeweler = deploy_masterjeweler(deployer, GMG_token)
    staked_GMG = deploy_stakedGMG(deployer, GMG_token)

    gmg_lp_token = seed_gmg_pool(deployer, GMG_token, accounts, is_dev)
    master_jeweler.add(1, gmg_lp_token, True, {"from": deployer})

    llg_lp_token = seed_llj_pool(deployer, gm_jewel, accounts, is_dev)
    master_jeweler.add(1, llg_lp_token, True, {"from": deployer})

    GMG_token.transferOwnership(master_jeweler, {"from": deployer})

    with open(
        "ui/deployment.json" if is_dev else "ui/deployment-prod.json", "w"
    ) as outfile:
        json.dump(
            {
                "utxo_template": utxo_template.address,
                "gm_jewel": gm_jewel.address,
                "central_bank": central_bank.address,
                "pawn_shop": pawn_shop.address,
                "GMG_token": GMG_token.address,
                "master_jeweler": master_jeweler.address,
                "staked_GMG": staked_GMG.address,
                "deployment_block": blocknumber,
                "GMG_LP_token": gmg_lp_token,
                "JLLJ_LP_token": llg_lp_token,
            },
            outfile,
        )

    if is_dev:
        give_user_jewel(accounts[1])
        give_user_jewel(accounts[2])
        give_user_gm_jewel(accounts[1], gm_jewel, deployer)
        give_user_gm_jewel(accounts[2], gm_jewel, deployer)

        mine_new_blocks()
