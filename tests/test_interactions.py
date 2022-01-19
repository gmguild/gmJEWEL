import pytest
from tests.helpers import bank_address


def test_buyback(central_bank, jewel_token, deployer, alice, gmg_token, staked_gmg):
    value = 1e18
    # SIMULATE FEE TO BANK
    jewel_token.transfer(alice, value, {"from": bank_address()})
    jewel_token.approve(central_bank.address, value, {"from": alice})
    central_bank.buy(value, {"from": alice})
    assert jewel_token.balanceOf(central_bank) == value

    # set fee wallet as GMG stkaing
    central_bank.updateFeeWallet(staked_gmg, {"from": deployer})

    # NOW SIMULATE BUYBACK
    central_bank.withdrawCentralBankJewel(value)
    assert jewel_token.balanceOf(staked_gmg) == value
    # buyback with 5% slippage
    start_bal = gmg_token.balanceOf(staked_gmg)
    staked_gmg.swap([jewel_token, gmg_token], value, value // 1.05, {"from": deployer})
    assert gmg_token.balanceOf(staked_gmg) > start_bal
