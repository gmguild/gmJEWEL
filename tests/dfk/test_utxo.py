import pytest
import brownie
from brownie.test import given, strategy
from tests.helpers import anti_whale_transfer_value

from tests.dfk.conftest import TEST_USERS_WITH_LOCKED_CRYSTAL


@pytest.fixture(autouse=True)
def shared_setup(fn_isolation):
    pass


def test_cant_create_utxo_when_paused(pawn_shop, deployer, users_with_locked_crystal):
    pawn_shop.pause({"from": deployer})
    assert pawn_shop.isPaused() == True

    user = users_with_locked_crystal[0]

    with brownie.reverts():
        pawn_shop.createUTXO({"from": user})


def test_create_utxo_separately(pawn_shop, bob, UTXO):
    _utxo = pawn_shop.createUTXO({"from": bob}).return_value
    utxo = UTXO.at(_utxo)
    assert utxo


@given(id=strategy("uint", max_value=TEST_USERS_WITH_LOCKED_CRYSTAL))
def test_send_to_utxo(
    pawn_shop, bob, UTXO, crystal_token, id, users_with_locked_crystal
):
    _utxo = pawn_shop.createUTXO({"from": bob}).return_value
    utxo = UTXO.at(_utxo)

    whale = users_with_locked_crystal[id]
    locked_bal = crystal_token.lockOf(whale)
    unlocked_bal = crystal_token.balanceOf(whale)

    if unlocked_bal > anti_whale_transfer_value():
        return  # this will give an error due to antiwhale.

    crystal_token.transferAll(utxo.address, {"from": whale})

    assert utxo.nominalLockedValue() == locked_bal
    assert utxo.nominalUnlockedValue() == unlocked_bal
    assert utxo.nominalCombinedValue() == locked_bal + unlocked_bal


@given(id=strategy("uint", max_value=TEST_USERS_WITH_LOCKED_CRYSTAL))
def test_send_unlocked_jewel_from_utxo(
    pawn_shop, bob, UTXO, crystal_token, id, users_with_locked_crystal
):
    _utxo = pawn_shop.createUTXO({"from": bob}).return_value
    utxo = UTXO.at(_utxo)

    whale = users_with_locked_crystal[id]
    whale_bal = crystal_token.balanceOf(whale)
    if whale_bal > anti_whale_transfer_value():
        return

    crystal_token.transferAll(utxo.address, {"from": whale})

    start_bal = crystal_token.balanceOf(utxo)

    amount_to_transfer = start_bal // 2

    if amount_to_transfer == 0:
        return

    utxo.transferUnlocked(bob, amount_to_transfer, {"from": pawn_shop})

    assert crystal_token.balanceOf(utxo) == start_bal - amount_to_transfer
    assert crystal_token.balanceOf(bob) == amount_to_transfer


@given(id=strategy("uint", max_value=TEST_USERS_WITH_LOCKED_CRYSTAL))
def test_send_all_jewel_from_utxo(
    pawn_shop, bob, UTXO, crystal_token, id, chain, users_with_locked_crystal
):
    _utxo = pawn_shop.createUTXO({"from": bob}).return_value
    utxo = UTXO.at(_utxo)

    whale = users_with_locked_crystal[id]

    whale_bal = crystal_token.balanceOf(whale)
    if whale_bal > anti_whale_transfer_value():
        return  # this will give antiwhale

    crystal_token.transferAll(utxo.address, {"from": whale})

    start_bal = crystal_token.totalBalanceOf(utxo)

    chain.sleep(259201)
    utxo.transferAll(bob, {"from": pawn_shop})

    assert crystal_token.totalBalanceOf(utxo) == 0
    assert crystal_token.totalBalanceOf(bob) == start_bal
