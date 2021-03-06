import pytest
import brownie
from tests.helpers import (
    anti_whale_transfer_value,
    get_random_name,
    users_with_locked_jewel,
)
from brownie.test import given, strategy


@pytest.fixture(autouse=True)
def shared_setup(fn_isolation):
    pass


def test_cant_create_utxo_when_paused(pawn_shop, deployer):
    pawn_shop.pause({"from": deployer})
    assert pawn_shop.isPaused() == True

    users = users_with_locked_jewel
    user = users[0]
    name = get_random_name()

    with brownie.reverts():
        pawn_shop.createUTXO({"from": user})

    with brownie.reverts():
        pawn_shop.createUTXOWithProfile(name.encode("utf-8"), {"from": user})


def test_create_utxo_with_profile_with_unique_name(pawn_shop, profiles, bob):
    name = get_random_name()
    pawn_shop.createUTXOWithProfile(name.encode("utf-8"), {"from": bob})
    assert profiles.nameTaken(name)


def test_create_utxo_separately(pawn_shop, profiles, bob, UTXO):
    name = get_random_name()
    _utxo = pawn_shop.createUTXO({"from": bob}).return_value
    utxo = UTXO.at(_utxo)
    utxo.createProfile(name.encode("utf-8"), {"from": bob})
    assert profiles.nameTaken(name)


@given(id=strategy("uint", max_value=len(users_with_locked_jewel) - 1))
def test_send_to_utxo(pawn_shop, bob, UTXO, jewel_token, id):
    name = get_random_name()
    _utxo = pawn_shop.createUTXOWithProfile(
        name.encode("utf-8"), {"from": bob}
    ).return_value
    utxo = UTXO.at(_utxo)

    whale = users_with_locked_jewel[id]
    locked_bal = jewel_token.lockOf(whale)
    unlocked_bal = jewel_token.balanceOf(whale)

    if unlocked_bal > anti_whale_transfer_value():
        return  # this will give an error due to antiwhale.

    jewel_token.transferAll(utxo.address, {"from": whale})

    assert utxo.nominalLockedValue() == locked_bal
    assert utxo.nominalUnlockedValue() == unlocked_bal
    assert utxo.nominalCombinedValue() == locked_bal + unlocked_bal


@given(id=strategy("uint", max_value=len(users_with_locked_jewel) - 1))
def test_send_unlocked_jewel_from_utxo(pawn_shop, bob, UTXO, jewel_token, id):
    name = get_random_name()
    _utxo = pawn_shop.createUTXOWithProfile(
        name.encode("utf-8"), {"from": bob}
    ).return_value
    utxo = UTXO.at(_utxo)

    whale = users_with_locked_jewel[id]
    whale_bal = jewel_token.balanceOf(whale)
    if whale_bal > anti_whale_transfer_value():
        return

    jewel_token.transferAll(utxo.address, {"from": whale})

    start_bal = jewel_token.balanceOf(utxo)

    amount_to_transfer = start_bal // 2

    if amount_to_transfer == 0:
        return

    utxo.transferUnlocked(bob, amount_to_transfer, {"from": pawn_shop})

    assert jewel_token.balanceOf(utxo) == start_bal - amount_to_transfer
    assert jewel_token.balanceOf(bob) == amount_to_transfer


@given(id=strategy("uint", max_value=len(users_with_locked_jewel) - 1))
def test_send_all_jewel_from_utxo(pawn_shop, bob, UTXO, jewel_token, id):
    name = get_random_name()
    _utxo = pawn_shop.createUTXOWithProfile(
        name.encode("utf-8"), {"from": bob}
    ).return_value
    utxo = UTXO.at(_utxo)

    whale = users_with_locked_jewel[id]

    whale_bal = jewel_token.balanceOf(whale)
    if whale_bal > anti_whale_transfer_value():
        return  # this will give antiwhale

    jewel_token.transferAll(utxo.address, {"from": whale})

    start_bal = jewel_token.totalBalanceOf(utxo)

    utxo.transferAll(bob, {"from": pawn_shop})

    assert jewel_token.totalBalanceOf(utxo) == 0
    assert jewel_token.totalBalanceOf(bob) == start_bal
