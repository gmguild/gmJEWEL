import pytest

from tests.helpers import (
    anti_whale_transfer_value,
    get_random_name,
    users_with_locked_crystal,
)
from brownie.test import given, strategy
import brownie


@given(id=strategy("uint", max_value=len(users_with_locked_crystal) - 1))
def test_redeem_from_minted_utxo_combined(
    crystal_token, pawn_shop, gm_crystal, UTXO, bob, id, deployer
):
    users = users_with_locked_crystal
    whale = users[id]

    # create UTXO
    tx = pawn_shop.createUTXO({"from": whale})
    created_utxo = UTXO.at(tx.return_value)

    whale_bal = crystal_token.balanceOf(whale)
    while whale_bal > anti_whale_transfer_value():
        # if they get hit by antiwhale rule, instead send some tokens to bob
        crystal_token.transfer(bob, anti_whale_transfer_value(), {"from": whale})
        whale_bal = crystal_token.balanceOf(whale)
        return

    crystal_token.transferAll(created_utxo.address, {"from": whale})

    utxo_val = created_utxo.nominalCombinedValue()
    minted_from = pawn_shop.mintedFromUTXO(created_utxo)
    amount_to_mint = utxo_val - minted_from

    if amount_to_mint == 0:
        return

    pawn_shop.mintFromUTXO(created_utxo, {"from": whale})
    assert gm_crystal.balanceOf(whale) > 0

    bal = gm_crystal.balanceOf(whale)
    # as user has to pay fee, need to get some more to claim
    gm_crystal.mint(whale, bal // 100, {"from": deployer})

    # USER NOW HAS A UTXO. BUT CAN SHE REDEEM???

    initial_locked = crystal_token.lockOf(whale)
    initial_unlocked = crystal_token.balanceOf(whale)
    utxo_locked = crystal_token.lockOf(created_utxo)
    utxo_unlocked = crystal_token.balanceOf(created_utxo)

    gm_crystal.approve(pawn_shop, bal, {"from": whale})

    pawn_shop.redeemUTXOForFullCombinedValue(created_utxo, 0, {"from": whale})
    post_locked = crystal_token.lockOf(whale)
    post_unlocked = crystal_token.balanceOf(whale)
    assert post_locked == initial_locked + utxo_locked
    assert post_unlocked == initial_unlocked + utxo_unlocked


@given(id=strategy("uint", max_value=len(users_with_locked_crystal) - 1))
def test_redeem_from_minted_utxo_combined_with_partial_jewel_payment(
    crystal_token, pawn_shop, gm_crystal, UTXO, bob, id, deployer, dfk_bank_account
):
    users = users_with_locked_crystal
    whale = users[id]

    tx = pawn_shop.createUTXO({"from": whale})
    created_utxo = UTXO.at(tx.return_value)

    whale_bal = crystal_token.balanceOf(whale)
    while whale_bal > anti_whale_transfer_value():
        # if they get hit by antiwhale rule, instead send some tokens to bob
        crystal_token.transfer(bob, anti_whale_transfer_value(), {"from": whale})
        whale_bal = crystal_token.balanceOf(whale)
        return

    crystal_token.transferAll(created_utxo.address, {"from": whale})

    utxo_val = created_utxo.nominalCombinedValue()
    minted_from = pawn_shop.mintedFromUTXO(created_utxo)
    amount_to_mint = utxo_val - minted_from

    if amount_to_mint == 0:
        return

    pawn_shop.mintFromUTXO(created_utxo, {"from": whale})
    assert gm_crystal.balanceOf(whale) > 0

    bal = gm_crystal.balanceOf(whale)

    # USER NOW HAS A UTXO. BUT CAN SHE REDEEM???

    initial_locked = crystal_token.lockOf(whale)
    initial_unlocked = crystal_token.balanceOf(whale)
    utxo_locked = crystal_token.lockOf(created_utxo)
    utxo_unlocked = crystal_token.balanceOf(created_utxo)

    crystal_token.transfer(whale, bal // 100, {"from": dfk_bank_account})
    crystal_token.approve(pawn_shop, bal, {"from": whale})
    gm_crystal.approve(pawn_shop, bal, {"from": whale})

    pawn_shop.redeemUTXOForFullCombinedValue(created_utxo, bal // 100, {"from": whale})
    post_locked = crystal_token.lockOf(whale)
    post_unlocked = crystal_token.balanceOf(whale)
    assert post_locked == initial_locked + utxo_locked
    assert post_unlocked == initial_unlocked + utxo_unlocked


@given(id=strategy("uint", max_value=len(users_with_locked_crystal) - 1))
def test_redeem_from_minted_utxo_unlocked(
    crystal_token, pawn_shop, gm_crystal, UTXO, bob, id, deployer
):
    users = users_with_locked_crystal
    whale = users[id]

    # create UTXO
    tx = pawn_shop.createUTXO({"from": whale})
    created_utxo = UTXO.at(tx.return_value)

    whale_bal = crystal_token.balanceOf(whale)
    while whale_bal > anti_whale_transfer_value():
        # if they get hit by antiwhale rule, instead send some tokens to bob
        crystal_token.transfer(bob, anti_whale_transfer_value(), {"from": whale})
        whale_bal = crystal_token.balanceOf(whale)
        return

    crystal_token.transferAll(created_utxo.address, {"from": whale})

    utxo_val = created_utxo.nominalCombinedValue()
    minted_from = pawn_shop.mintedFromUTXO(created_utxo)
    amount_to_mint = utxo_val - minted_from

    if amount_to_mint == 0:
        return

    pawn_shop.mintFromUTXO(created_utxo, {"from": whale})
    assert gm_crystal.balanceOf(whale) > 0

    bal = gm_crystal.balanceOf(whale)
    # as user has to pay fee, need to get some more to claim
    gm_crystal.mint(whale, bal // 100, {"from": deployer})

    # USER NOW HAS A UTXO. BUT CAN SHE REDEEM???

    initial_locked = crystal_token.lockOf(whale)
    initial_unlocked = crystal_token.balanceOf(whale)
    utxo_unlocked = crystal_token.balanceOf(created_utxo)

    gm_crystal.approve(pawn_shop, bal, {"from": whale})

    pawn_shop.redeemUTXOForUnlockedValue(created_utxo, 0, {"from": whale})
    post_locked = crystal_token.lockOf(whale)
    post_unlocked = crystal_token.balanceOf(whale)
    assert post_locked == initial_locked
    assert post_unlocked == initial_unlocked + utxo_unlocked


@given(id=strategy("uint", max_value=len(users_with_locked_crystal) - 1))
def test_redeem_from_minted_utxo_unlocked_with_partial_jewel_payment(
    crystal_token, pawn_shop, gm_crystal, UTXO, bob, id, deployer, dfk_bank_account
):
    users = users_with_locked_crystal
    whale = users[id]

    # create UTXO
    tx = pawn_shop.createUTXO({"from": whale})
    created_utxo = UTXO.at(tx.return_value)

    whale_bal = crystal_token.balanceOf(whale)
    while whale_bal > anti_whale_transfer_value():
        # if they get hit by antiwhale rule, instead send some tokens to bob
        crystal_token.transfer(bob, anti_whale_transfer_value(), {"from": whale})
        whale_bal = crystal_token.balanceOf(whale)
        return

    crystal_token.transferAll(created_utxo.address, {"from": whale})

    utxo_val = created_utxo.nominalCombinedValue()
    minted_from = pawn_shop.mintedFromUTXO(created_utxo)
    amount_to_mint = utxo_val - minted_from

    if amount_to_mint == 0:
        return

    pawn_shop.mintFromUTXO(created_utxo, {"from": whale})
    assert gm_crystal.balanceOf(whale) > 0

    bal = gm_crystal.balanceOf(whale)

    # USER NOW HAS A UTXO. BUT CAN SHE REDEEM???

    initial_locked = crystal_token.lockOf(whale)
    initial_unlocked = crystal_token.balanceOf(whale)
    utxo_unlocked = crystal_token.balanceOf(created_utxo)

    crystal_token.transfer(whale, utxo_unlocked // 100, {"from": dfk_bank_account})
    crystal_token.approve(pawn_shop, utxo_unlocked, {"from": whale})
    gm_crystal.approve(pawn_shop, utxo_unlocked, {"from": whale})

    pawn_shop.redeemUTXOForUnlockedValue(
        created_utxo, utxo_unlocked // 100, {"from": whale}
    )
    post_locked = crystal_token.lockOf(whale)
    post_unlocked = crystal_token.balanceOf(whale)

    assert post_locked == initial_locked
    assert post_unlocked == initial_unlocked + utxo_unlocked
