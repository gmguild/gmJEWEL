import pytest
from tests.helpers import bank_address


def test_buyback(central_bank, crystal_token, deployer, alice, gmg_token, staked_gmg):
    value = 1e18
    # SIMULATE FEE TO BANK
    crystal_token.transfer(alice, value, {"from": bank_address()})
    crystal_token.approve(central_bank.address, value, {"from": alice})
    central_bank.buy(value, {"from": alice})
    assert crystal_token.balanceOf(central_bank) == value

    # set fee wallet as GMG stkaing
    central_bank.updateFeeWallet(staked_gmg, {"from": deployer})

    # alice to deposit
    gmg_token.mint(alice, value, {"from": deployer})
    gmg_token.approve(staked_gmg, value, {"from": alice})
    staked_gmg.enter(value, {"from": alice})

    # NOW SIMULATE BUYBACK
    central_bank.withdrawCentralBankJewel(value)
    assert crystal_token.balanceOf(staked_gmg) == value
    # buyback with 5% slippage
    start_bal = gmg_token.balanceOf(staked_gmg)
    staked_gmg.swap(
        [crystal_token, gmg_token], value, value // 1.05, {"from": deployer}
    )
    assert gmg_token.balanceOf(staked_gmg) > start_bal

    # alice to withdraw
    shares = staked_gmg.balanceOf(alice)
    staked_gmg.leave(shares, {"from": alice})
    assert gmg_token.balanceOf(alice) > value
