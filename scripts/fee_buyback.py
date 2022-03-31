from brownie import interface, accounts, chain, network, web3, Wei
from brownie import hUTXO, gmJEWEL, hPawnShop, hCentralBank, GMGToken, MasterJeweler, StakedGMG
import json
import os

SCRIPT_DIR = os.path.dirname(__file__)  # <-- absolute dir the script is in
ADDRESSES = json.load(open(
    os.path.join(SCRIPT_DIR, "../ui/deployment-prod.json"), "r"))


def main():
    jewel = interface.Jewel(ADDRESSES["JewelToken"])
    gmg = GMGToken.at(ADDRESSES["GMGToken"])
    xgmg = StakedGMG.at(ADDRESSES["StakedGMG"])
    central_bank = hCentralBank.at(ADDRESSES["CentralBank"])
    pawn_shop = hPawnShop.at(ADDRESSES["PawnShop"])

    factory = interface.IUniswapV2Factory(ADDRESSES["UniswapFactory"])
    router = interface.IUniswapV2Router(ADDRESSES["UniswapRouter"])
    pair = interface.IUniswapV2Pair(factory.getPair(jewel, gmg))
    assert pair.token0() == jewel
    assert pair.token1() == gmg

    def calculate_ratio(plus: int = 0):
        return (gmg.balanceOf(xgmg) + plus) / xgmg.totalSupply()

    central_bank_balance = jewel.balanceOf(central_bank)
    xgmg_balance = jewel.balanceOf(xgmg)
    pre_buyback_ratio = calculate_ratio()

    print("JEWEL balance of CentralBank: " +
          str(central_bank_balance.to("ether")))
    print("JEWEL balance of StakedGMG: " +
          str(xgmg_balance.to("ether")))
    print("Current xGMG ratio: " + str(pre_buyback_ratio))

    if xgmg_balance == 0:
        print("No JEWEL in xGMG contract")
        if central_bank_balance > 0:
            print("Please withdraw JEWEL from CentralBank, with calldata: " +
                  str(central_bank.withdrawCentralBankJewel.encode_input(central_bank_balance)))
        return

    amount_to_buyback = Wei("10 ether") if xgmg_balance > Wei(
        "10 ether") else xgmg_balance

    print(
        f"Ready to commence buyback of {str(amount_to_buyback.to('ether'))} JEWEL to GMG")

    min_amount_out = Wei(router.getAmountOut(amount_to_buyback, pair.getReserves()[
        0], pair.getReserves()[1]) // 1.015)

    print("Estimated min amount out is " + str(min_amount_out.to("ether")))
    print("Estimated new ratio is " + str(calculate_ratio(min_amount_out)))

    if input("Go ahead? (y/n) ") != "y":
        return

    print("Loading account...")
    keeper_account = accounts.load(input("Enter account name: "))

    xgmg.swap([jewel, gmg], amount_to_buyback,
              min_amount_out, {'from': keeper_account})

    post_buyback_ratio = calculate_ratio()

    print("New xGMG ratio: " + str(post_buyback_ratio))
