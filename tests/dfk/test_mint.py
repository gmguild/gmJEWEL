import pytest

from tests.helpers import (
    anti_whale_transfer_value,
    get_random_name,
    users_with_locked_crystal,
)
from brownie.test import given, strategy
import brownie


@pytest.fixture(autouse=True)
def shared_setup(fn_isolation):
    pass


@given(id=strategy("uint", max_value=len(users_with_locked_crystal) - 1))
def test_mint_from_utxo(crystal_token, pawn_shop, gm_crystal, UTXO, id):
    users = users_with_locked_crystal
    user = users[id]

    tx = pawn_shop.createUTXO({"from": user})
    created_utxo = UTXO.at(tx.return_value)

    UTXO_start_balance = created_utxo.nominalCombinedValue()

    whale_bal = crystal_token.balanceOf(user)
    if whale_bal > anti_whale_transfer_value():
        return

    crystal_token.transferAll(created_utxo.address, {"from": user})

    assert crystal_token.balanceOf(user) == 0
    assert crystal_token.lockOf(user) == 0
    user_start_bal = gm_crystal.balanceOf(user)

    utxo_val = created_utxo.nominalCombinedValue()
    minted_from = pawn_shop.mintedFromUTXO(created_utxo)
    amount_to_mint = utxo_val - minted_from

    if amount_to_mint == 0:
        # if there is nothing to mint, the following cohisntract call reverts
        with brownie.reverts():
            pawn_shop.mintFromUTXO(created_utxo, {"from": user})
        return

    pawn_shop.mintFromUTXO(created_utxo, {"from": user})
    assert (
        gm_crystal.balanceOf(user) - user_start_bal
        == created_utxo.nominalCombinedValue() - UTXO_start_balance
    )


def test_cant_mint_from_utxo_when_paused(
    crystal_token, pawn_shop, gm_crystal, UTXO, deployer
):
    users = users_with_locked_crystal
    user = users[0]

    tx = pawn_shop.createUTXO({"from": user})
    created_utxo = UTXO.at(tx.return_value)

    UTXO_start_balance = created_utxo.nominalCombinedValue()

    whale_bal = crystal_token.balanceOf(user)
    if whale_bal > anti_whale_transfer_value():
        return

    crystal_token.transferAll(created_utxo.address, {"from": user})

    assert crystal_token.balanceOf(user) == 0
    assert crystal_token.lockOf(user) == 0
    user_start_bal = gm_crystal.balanceOf(user)

    utxo_val = created_utxo.nominalCombinedValue()
    minted_from = pawn_shop.mintedFromUTXO(created_utxo)
    amount_to_mint = utxo_val - minted_from

    if amount_to_mint == 0:
        # if there is nothing to mint, the following contract call reverts
        with brownie.reverts():
            pawn_shop.mintFromUTXO(created_utxo, {"from": user})
        return

    pawn_shop.pause({"from": deployer})
    assert pawn_shop.isPaused() == True

    with brownie.reverts():
        pawn_shop.mintFromUTXO(created_utxo, {"from": user})

    assert gm_crystal.balanceOf(user) - user_start_bal == 0
