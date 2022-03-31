import brownie
import pytest


@pytest.fixture(autouse=True)
def isolation(fn_isolation):
    pass


def test_buying_gm_crystal_with_jewel(
    gm_crystal, crystal_token, central_bank, alice, dfk_bank_account
):
    crystal_token.transfer(alice, "100 ether", {"from": dfk_bank_account})
    crystal_token.approve(central_bank, "100 ether", {"from": alice})
    assert crystal_token.balanceOf(alice) == "100 ether"
    assert crystal_token.allowance(alice, central_bank) == "100 ether"

    prebalance = gm_crystal.balanceOf(alice)
    central_bank.buy("100 ether", {"from": alice})
    postbalance = gm_crystal.balanceOf(alice)

    assert postbalance == prebalance + "100 ether"
    assert crystal_token.balanceOf(alice) == 0
    assert crystal_token.allowance(alice, central_bank) == 0


def test_buying_gm_crystal_with_jewel_to_receiver(
    gm_crystal, crystal_token, central_bank, alice, bob, dfk_bank_account
):
    crystal_token.transfer(alice, "100 ether", {"from": dfk_bank_account})
    crystal_token.approve(central_bank, "100 ether", {"from": alice})
    assert crystal_token.balanceOf(alice) == "100 ether"
    assert crystal_token.allowance(alice, central_bank) == "100 ether"

    prebalanceA = gm_crystal.balanceOf(alice)
    prebalanceB = gm_crystal.balanceOf(bob)
    central_bank.buyWithReceiver("100 ether", bob, {"from": alice})
    postbalanceA = gm_crystal.balanceOf(alice)
    postbalanceB = gm_crystal.balanceOf(bob)

    assert postbalanceA == prebalanceA
    assert postbalanceB == prebalanceB + "100 ether"
    assert crystal_token.balanceOf(alice) == 0
    assert crystal_token.allowance(alice, central_bank) == 0


def test_cant_buy_when_paused(
    gm_crystal, crystal_token, central_bank, deployer, alice, dfk_bank_account
):
    crystal_token.transfer(alice, "100 ether", {"from": dfk_bank_account})
    crystal_token.approve(central_bank, "100 ether", {"from": alice})
    central_bank.pause({"from": deployer})

    with brownie.reverts():
        central_bank.buy("100 ether", {"from": alice})


def test_cant_buy_with_receiver_when_paused(
    gm_crystal, crystal_token, central_bank, deployer, alice, bob, dfk_bank_account
):
    crystal_token.transfer(alice, "100 ether", {"from": dfk_bank_account})
    crystal_token.approve(central_bank, "100 ether", {"from": alice})
    central_bank.pause({"from": deployer})

    with brownie.reverts():
        central_bank.buyWithReceiver("100 ether", bob, {"from": alice})


def test_owner_can_withdraw_protocol_jewel(
    deployer, alice, central_bank, crystal_token, dfk_bank_account
):
    crystal_token.transfer(alice, "100 ether", {"from": dfk_bank_account})
    crystal_token.approve(central_bank, "100 ether", {"from": alice})
    central_bank.buy("100 ether", {"from": alice})

    assert crystal_token.balanceOf(central_bank) == "100 ether"
    central_bank.withdrawCentralBankJewel("50 ether", {"from": deployer})

    assert crystal_token.balanceOf(deployer) == "50 ether"
    assert crystal_token.balanceOf(central_bank) == "50 ether"


def test_keeper_can_withdraw_protocol_jewel(
    deployer, alice, central_bank, crystal_token, dfk_bank_account, bob
):
    crystal_token.transfer(alice, "100 ether", {"from": dfk_bank_account})
    crystal_token.approve(central_bank, "100 ether", {"from": alice})
    central_bank.buy("100 ether", {"from": alice})

    assert crystal_token.balanceOf(central_bank) == "100 ether"
    central_bank.updateKeeper(bob, {"from": deployer})
    central_bank.withdrawCentralBankJewel("50 ether", {"from": bob})

    assert crystal_token.balanceOf(deployer) == "50 ether"
    assert crystal_token.balanceOf(central_bank) == "50 ether"


def test_non_owner_cannot_withdraw_protocol_jewel(
    deployer, alice, central_bank, crystal_token, dfk_bank_account
):
    crystal_token.transfer(alice, "100 ether", {"from": dfk_bank_account})
    crystal_token.approve(central_bank, "100 ether", {"from": alice})
    central_bank.buy("100 ether", {"from": alice})

    assert crystal_token.balanceOf(central_bank) == "100 ether"

    with brownie.reverts():
        central_bank.withdrawCentralBankJewel("50 ether", {"from": alice})
