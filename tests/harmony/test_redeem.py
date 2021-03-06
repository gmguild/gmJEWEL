import pytest

from tests.helpers import (
    anti_whale_transfer_value,
    get_random_name,
    users_with_locked_jewel,
)
from brownie.test import given, strategy
import brownie


@given(id=strategy("uint", max_value=len(users_with_locked_jewel) - 1))
def test_redeem_from_minted_utxo_combined(
    jewel_token, pawn_shop, gm_jewel, UTXO, bob, id, deployer
):
    users = users_with_locked_jewel
    whale = users[id]

    # create UTXO
    name = get_random_name()
    tx = pawn_shop.createUTXOWithProfile(name.encode("utf-8"), {"from": whale})
    created_utxo = UTXO.at(tx.return_value)

    whale_bal = jewel_token.balanceOf(whale)
    while whale_bal > anti_whale_transfer_value():
        # if they get hit by antiwhale rule, instead send some tokens to bob
        jewel_token.transfer(bob, anti_whale_transfer_value(), {"from": whale})
        whale_bal = jewel_token.balanceOf(whale)
        return

    jewel_token.transferAll(created_utxo.address, {"from": whale})

    utxo_val = created_utxo.nominalCombinedValue()
    minted_from = pawn_shop.mintedFromUTXO(created_utxo)
    amount_to_mint = utxo_val - minted_from

    if amount_to_mint == 0:
        return

    pawn_shop.mintFromUTXO(created_utxo, {"from": whale})
    assert gm_jewel.balanceOf(whale) > 0

    bal = gm_jewel.balanceOf(whale)
    # as user has to pay fee, need to get some more to claim
    gm_jewel.mint(whale, bal // 100, {"from": deployer})

    # USER NOW HAS A UTXO. BUT CAN SHE REDEEM???

    initial_locked = jewel_token.lockOf(whale)
    initial_unlocked = jewel_token.balanceOf(whale)
    utxo_locked = jewel_token.lockOf(created_utxo)
    utxo_unlocked = jewel_token.balanceOf(created_utxo)

    gm_jewel.approve(pawn_shop, bal, {"from": whale})

    pawn_shop.redeemUTXOForFullCombinedValue(created_utxo, 0, {"from": whale})
    post_locked = jewel_token.lockOf(whale)
    post_unlocked = jewel_token.balanceOf(whale)
    assert post_locked == initial_locked + utxo_locked
    assert post_unlocked == initial_unlocked + utxo_unlocked


@given(id=strategy("uint", max_value=len(users_with_locked_jewel) - 1))
def test_redeem_from_minted_utxo_combined_with_partial_jewel_payment(
    jewel_token, pawn_shop, gm_jewel, UTXO, bob, id, deployer, dfk_bank_account
):
    users = users_with_locked_jewel
    whale = users[id]

    # create UTXO
    name = get_random_name()
    tx = pawn_shop.createUTXOWithProfile(name.encode("utf-8"), {"from": whale})
    created_utxo = UTXO.at(tx.return_value)

    whale_bal = jewel_token.balanceOf(whale)
    while whale_bal > anti_whale_transfer_value():
        # if they get hit by antiwhale rule, instead send some tokens to bob
        jewel_token.transfer(bob, anti_whale_transfer_value(), {"from": whale})
        whale_bal = jewel_token.balanceOf(whale)
        return

    jewel_token.transferAll(created_utxo.address, {"from": whale})

    utxo_val = created_utxo.nominalCombinedValue()
    minted_from = pawn_shop.mintedFromUTXO(created_utxo)
    amount_to_mint = utxo_val - minted_from

    if amount_to_mint == 0:
        return

    pawn_shop.mintFromUTXO(created_utxo, {"from": whale})
    assert gm_jewel.balanceOf(whale) > 0

    bal = gm_jewel.balanceOf(whale)

    # USER NOW HAS A UTXO. BUT CAN SHE REDEEM???

    initial_locked = jewel_token.lockOf(whale)
    initial_unlocked = jewel_token.balanceOf(whale)
    utxo_locked = jewel_token.lockOf(created_utxo)
    utxo_unlocked = jewel_token.balanceOf(created_utxo)

    jewel_token.transfer(whale, bal // 100, {"from": dfk_bank_account})
    jewel_token.approve(pawn_shop, bal, {"from": whale})
    gm_jewel.approve(pawn_shop, bal, {"from": whale})

    pawn_shop.redeemUTXOForFullCombinedValue(created_utxo, bal // 100, {"from": whale})
    post_locked = jewel_token.lockOf(whale)
    post_unlocked = jewel_token.balanceOf(whale)
    assert post_locked == initial_locked + utxo_locked
    assert post_unlocked == initial_unlocked + utxo_unlocked


@given(id=strategy("uint", max_value=len(users_with_locked_jewel) - 1))
def test_redeem_from_minted_utxo_unlocked(
    jewel_token, pawn_shop, gm_jewel, UTXO, bob, id, deployer
):
    users = users_with_locked_jewel
    whale = users[id]

    # create UTXO
    name = get_random_name()
    tx = pawn_shop.createUTXOWithProfile(name.encode("utf-8"), {"from": whale})
    created_utxo = UTXO.at(tx.return_value)

    whale_bal = jewel_token.balanceOf(whale)
    while whale_bal > anti_whale_transfer_value():
        # if they get hit by antiwhale rule, instead send some tokens to bob
        jewel_token.transfer(bob, anti_whale_transfer_value(), {"from": whale})
        whale_bal = jewel_token.balanceOf(whale)
        return

    jewel_token.transferAll(created_utxo.address, {"from": whale})

    utxo_val = created_utxo.nominalCombinedValue()
    minted_from = pawn_shop.mintedFromUTXO(created_utxo)
    amount_to_mint = utxo_val - minted_from

    if amount_to_mint == 0:
        return

    pawn_shop.mintFromUTXO(created_utxo, {"from": whale})
    assert gm_jewel.balanceOf(whale) > 0

    bal = gm_jewel.balanceOf(whale)
    # as user has to pay fee, need to get some more to claim
    gm_jewel.mint(whale, bal // 100, {"from": deployer})

    # USER NOW HAS A UTXO. BUT CAN SHE REDEEM???

    initial_locked = jewel_token.lockOf(whale)
    initial_unlocked = jewel_token.balanceOf(whale)
    utxo_unlocked = jewel_token.balanceOf(created_utxo)

    gm_jewel.approve(pawn_shop, bal, {"from": whale})

    pawn_shop.redeemUTXOForUnlockedValue(created_utxo, 0, {"from": whale})
    post_locked = jewel_token.lockOf(whale)
    post_unlocked = jewel_token.balanceOf(whale)
    assert post_locked == initial_locked
    assert post_unlocked == initial_unlocked + utxo_unlocked


@given(id=strategy("uint", max_value=len(users_with_locked_jewel) - 1))
def test_redeem_from_minted_utxo_unlocked_with_partial_jewel_payment(
    jewel_token, pawn_shop, gm_jewel, UTXO, bob, id, deployer, dfk_bank_account
):
    users = users_with_locked_jewel
    whale = users[id]

    # create UTXO
    name = get_random_name()
    tx = pawn_shop.createUTXOWithProfile(name.encode("utf-8"), {"from": whale})
    created_utxo = UTXO.at(tx.return_value)

    whale_bal = jewel_token.balanceOf(whale)
    while whale_bal > anti_whale_transfer_value():
        # if they get hit by antiwhale rule, instead send some tokens to bob
        jewel_token.transfer(bob, anti_whale_transfer_value(), {"from": whale})
        whale_bal = jewel_token.balanceOf(whale)
        return

    jewel_token.transferAll(created_utxo.address, {"from": whale})

    utxo_val = created_utxo.nominalCombinedValue()
    minted_from = pawn_shop.mintedFromUTXO(created_utxo)
    amount_to_mint = utxo_val - minted_from

    if amount_to_mint == 0:
        return

    pawn_shop.mintFromUTXO(created_utxo, {"from": whale})
    assert gm_jewel.balanceOf(whale) > 0

    bal = gm_jewel.balanceOf(whale)

    # USER NOW HAS A UTXO. BUT CAN SHE REDEEM???

    initial_locked = jewel_token.lockOf(whale)
    initial_unlocked = jewel_token.balanceOf(whale)
    utxo_unlocked = jewel_token.balanceOf(created_utxo)

    jewel_token.transfer(whale, utxo_unlocked // 100, {"from": dfk_bank_account})
    jewel_token.approve(pawn_shop, utxo_unlocked, {"from": whale})
    gm_jewel.approve(pawn_shop, utxo_unlocked, {"from": whale})

    pawn_shop.redeemUTXOForUnlockedValue(
        created_utxo, utxo_unlocked // 100, {"from": whale}
    )
    post_locked = jewel_token.lockOf(whale)
    post_unlocked = jewel_token.balanceOf(whale)

    assert post_locked == initial_locked
    assert post_unlocked == initial_unlocked + utxo_unlocked
