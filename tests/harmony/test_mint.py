import pytest

from tests.helpers import (
    anti_whale_transfer_value,
    get_random_name,
    users_with_locked_jewel,
)
from brownie.test import given, strategy
import brownie


@pytest.fixture(autouse=True)
def shared_setup(fn_isolation):
    pass


@given(id=strategy("uint", max_value=len(users_with_locked_jewel) - 1))
def test_mint_from_utxo(jewel_token, pawn_shop, gm_jewel, UTXO, id):
    users = users_with_locked_jewel
    user = users[id]

    name = get_random_name()
    tx = pawn_shop.createUTXOWithProfile(name.encode("utf-8"), {"from": user})
    created_utxo = UTXO.at(tx.return_value)

    UTXO_start_balance = created_utxo.nominalCombinedValue()

    whale_bal = jewel_token.balanceOf(user)
    if whale_bal > anti_whale_transfer_value():
        return

    jewel_token.transferAll(created_utxo.address, {"from": user})

    assert jewel_token.balanceOf(user) == 0
    assert jewel_token.lockOf(user) == 0
    user_start_bal = gm_jewel.balanceOf(user)

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
        gm_jewel.balanceOf(user) - user_start_bal
        == created_utxo.nominalCombinedValue() - UTXO_start_balance
    )


def test_cant_mint_from_utxo_when_paused(
    jewel_token, pawn_shop, gm_jewel, UTXO, deployer
):
    users = users_with_locked_jewel
    user = users[0]

    name = get_random_name()
    tx = pawn_shop.createUTXOWithProfile(name.encode("utf-8"), {"from": user})
    created_utxo = UTXO.at(tx.return_value)

    UTXO_start_balance = created_utxo.nominalCombinedValue()

    whale_bal = jewel_token.balanceOf(user)
    if whale_bal > anti_whale_transfer_value():
        return

    jewel_token.transferAll(created_utxo.address, {"from": user})

    assert jewel_token.balanceOf(user) == 0
    assert jewel_token.lockOf(user) == 0
    user_start_bal = gm_jewel.balanceOf(user)

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

    assert gm_jewel.balanceOf(user) - user_start_bal == 0
