import pytest

from tests.helpers import (
    get_random_name,
    users_with_locked_jewel,
)
from brownie import accounts
from brownie.test import given, strategy
import brownie


@pytest.fixture(autouse=True)
def shared_setup(fn_isolation):
    pass


# UTXO HAS NO ACCESS CONTROL


# PAWN SHOP


def test_pawn_shop_init_owner(pawn_shop, deployer):
    assert pawn_shop.owner() == deployer


def test_pawn_shop_change_owner(pawn_shop, deployer, alice):
    pawn_shop.transferOwnership(alice, {"from": deployer})
    assert pawn_shop.owner() == alice


def test_pawn_shop_cant_change_owner_if_not_admin(pawn_shop, alice):
    with brownie.reverts():
        pawn_shop.transferOwnership(alice, {"from": alice})


def test_pawn_shop_owner_can_pause(pawn_shop, deployer):
    pawn_shop.pause({"from": deployer})
    assert pawn_shop.isPaused() == True


def test_pawn_shop_owner_can_unpause(pawn_shop, deployer):
    pawn_shop.pause({"from": deployer})
    assert pawn_shop.isPaused() == True
    pawn_shop.unpause({"from": deployer})
    assert pawn_shop.isPaused() == False


def test_pawn_shop_cannot_pause_when_already_paused(pawn_shop, deployer):
    pawn_shop.pause({"from": deployer})
    assert pawn_shop.isPaused() == True
    with brownie.reverts():
        pawn_shop.pause({"from": deployer})


def test_pawn_shop_cannot_unpause_when_already_unpaused(pawn_shop, deployer):
    assert pawn_shop.isPaused() == False
    with brownie.reverts():
        pawn_shop.unpause({"from": deployer})


def test_pawn_shop_non_owner_cannot_pause(pawn_shop, alice):
    with brownie.reverts():
        pawn_shop.pause({"from": alice})


def test_pawn_shop_non_owner_cannot_unpause(pawn_shop, alice):
    with brownie.reverts():
        pawn_shop.unpause({"from": alice})


# LL JEWEL


def test_gm_jewel_init_owner(gm_jewel, deployer):
    assert gm_jewel.owner() == deployer


def test_gm_jewel_change_owner(gm_jewel, deployer, alice):
    gm_jewel.transferOwnership(alice, {"from": deployer})
    assert gm_jewel.owner() == alice


def test_gm_jewel_cant_change_owner_if_not_admin(gm_jewel, alice):
    with brownie.reverts():
        gm_jewel.transferOwnership(alice, {"from": alice})


def test_gm_jewel_add_minter(gm_jewel, alice, deployer):
    gm_jewel.addMinter(alice, {"from": deployer})
    assert gm_jewel.isMinter(alice) == True


def test_gm_jewel_remove_minter(gm_jewel, alice, deployer):
    gm_jewel.addMinter(alice, {"from": deployer})
    assert gm_jewel.isMinter(alice) == True
    gm_jewel.removeMinter(alice, {"from": deployer})
    assert gm_jewel.isMinter(alice) == False


def test_gm_jewel_cant_add_minter_if_not_admin(gm_jewel, alice):
    with brownie.reverts():
        gm_jewel.addMinter(alice, {"from": alice})


def test_gm_jewel_cant_remove_minter_if_not_admin(gm_jewel, alice):
    with brownie.reverts():
        gm_jewel.removeMinter(alice, {"from": alice})


# CENTRAL BANK


def test_central_bank_init_owner(central_bank, deployer):
    assert central_bank.owner() == deployer


def test_central_bank_change_owner(central_bank, deployer, alice):
    central_bank.transferOwnership(alice, {"from": deployer})
    assert central_bank.owner() == alice


def test_central_bank_cant_change_owner_if_not_admin(central_bank, alice):
    with brownie.reverts():
        central_bank.transferOwnership(alice, {"from": alice})


def test_central_bank_owner_can_pause(central_bank, deployer):
    central_bank.pause({"from": deployer})
    assert central_bank.isPaused() == True


def test_central_bank_owner_can_unpause(central_bank, deployer):
    central_bank.pause({"from": deployer})
    assert central_bank.isPaused() == True
    central_bank.unpause({"from": deployer})
    assert central_bank.isPaused() == False


def test_central_bank_cannot_pause_when_already_paused(central_bank, deployer):
    central_bank.pause({"from": deployer})
    assert central_bank.isPaused() == True
    with brownie.reverts():
        central_bank.pause({"from": deployer})


def test_central_bank_cannot_unpause_when_already_unpaused(central_bank, deployer):
    assert central_bank.isPaused() == False
    with brownie.reverts():
        central_bank.unpause({"from": deployer})


def test_central_bank_non_owner_cannot_pause(central_bank, alice):
    with brownie.reverts():
        central_bank.pause({"from": alice})


def test_central_bank_non_owner_cannot_unpause(central_bank, alice):
    with brownie.reverts():
        central_bank.unpause({"from": alice})


def test_central_bank_init_feeWallet(central_bank, deployer):
    assert central_bank.feeWallet() == deployer


def test_central_bank_change_feeWallet(central_bank, deployer, alice):
    central_bank.updateFeeWallet(alice, {"from": deployer})
    assert central_bank.feeWallet() == alice


def test_central_bank_cant_change_feeWallet_if_not_admin(central_bank, alice):
    with brownie.reverts():
        central_bank.updateFeeWallet(alice, {"from": alice})
