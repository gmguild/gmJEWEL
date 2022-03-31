import brownie
import pytest


@pytest.fixture(autouse=True)
def isolation(fn_isolation):
    pass


def test_buying_gm_jewel_with_jewel(gm_jewel, jewel_token, central_bank, alice, dfk_bank_account):
    jewel_token.transfer(alice, "100 ether", {"from": dfk_bank_account})
    jewel_token.approve(central_bank, "100 ether", {"from": alice})
    assert jewel_token.balanceOf(alice) == "100 ether"
    assert jewel_token.allowance(alice, central_bank) == "100 ether"

    prebalance = gm_jewel.balanceOf(alice)
    central_bank.buy("100 ether", {"from": alice})
    postbalance = gm_jewel.balanceOf(alice)

    assert postbalance == prebalance + "100 ether"
    assert jewel_token.balanceOf(alice) == 0
    assert jewel_token.allowance(alice, central_bank) == 0


def test_buying_gm_jewel_with_jewel_to_receiver(gm_jewel, jewel_token, central_bank, alice, bob, dfk_bank_account):
    jewel_token.transfer(alice, "100 ether", {"from": dfk_bank_account})
    jewel_token.approve(central_bank, "100 ether", {"from": alice})
    assert jewel_token.balanceOf(alice) == "100 ether"
    assert jewel_token.allowance(alice, central_bank) == "100 ether"

    prebalanceA = gm_jewel.balanceOf(alice)
    prebalanceB = gm_jewel.balanceOf(bob)
    central_bank.buyWithReceiver("100 ether", bob, {"from": alice})
    postbalanceA = gm_jewel.balanceOf(alice)
    postbalanceB = gm_jewel.balanceOf(bob)

    assert postbalanceA == prebalanceA
    assert postbalanceB == prebalanceB + "100 ether"
    assert jewel_token.balanceOf(alice) == 0
    assert jewel_token.allowance(alice, central_bank) == 0


def test_cant_buy_when_paused(gm_jewel, jewel_token, central_bank, deployer, alice, dfk_bank_account):
    jewel_token.transfer(alice, "100 ether", {"from": dfk_bank_account})
    jewel_token.approve(central_bank, "100 ether", {"from": alice})
    central_bank.pause({"from": deployer})

    with brownie.reverts():
        central_bank.buy("100 ether", {"from": alice})


def test_cant_buy_with_receiver_when_paused(gm_jewel, jewel_token, central_bank, deployer, alice, bob, dfk_bank_account):
    jewel_token.transfer(alice, "100 ether", {"from": dfk_bank_account})
    jewel_token.approve(central_bank, "100 ether", {"from": alice})
    central_bank.pause({"from": deployer})

    with brownie.reverts():
        central_bank.buyWithReceiver("100 ether", bob, {"from": alice})


def test_owner_can_withdraw_protocol_jewel(deployer, alice, central_bank, jewel_token, dfk_bank_account):
    jewel_token.transfer(alice, "100 ether", {"from": dfk_bank_account})
    jewel_token.approve(central_bank, "100 ether", {"from": alice})
    central_bank.buy("100 ether", {"from": alice})

    assert jewel_token.balanceOf(central_bank) == "100 ether"
    central_bank.withdrawCentralBankJewel("50 ether", {"from": deployer})

    assert jewel_token.balanceOf(deployer) == "50 ether"
    assert jewel_token.balanceOf(central_bank) == "50 ether"


def test_non_owner_cannot_withdraw_protocol_jewel(deployer, alice, central_bank, jewel_token, dfk_bank_account):
    jewel_token.transfer(alice, "100 ether", {"from": dfk_bank_account})
    jewel_token.approve(central_bank, "100 ether", {"from": alice})
    central_bank.buy("100 ether", {"from": alice})

    assert jewel_token.balanceOf(central_bank) == "100 ether"

    with brownie.reverts():
        central_bank.withdrawCentralBankJewel("50 ether", {"from": alice})
