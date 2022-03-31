import pytest

from tests.helpers import (
    anti_whale_transfer_value,
    bank_address,
    get_random_name,
    max_uint256,
    users_with_locked_crystal,
)
from brownie.test import given, strategy
import brownie


@given(
    id=strategy("uint", max_value=len(users_with_locked_crystal) - 1),
)
def test_view(pawn_shop_router, pawn_shop, id, UTXO, crystal_token, bob, gm_crystal):
    users = users_with_locked_crystal
    whale = users[id]

    # create UTXO
    name = get_random_name()
    tx = pawn_shop.createUTXOWithProfile(name.encode("utf-8"), {"from": whale})
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
    bal = gm_crystal.balanceOf(whale)
    assert bal > 0

    vals = pawn_shop_router.utxoValues(created_utxo)
    assert vals[0] == pawn_shop.getFeeTier(utxo_val) * utxo_val // 10_000
    assert vals[1] == utxo_val
    assert vals[2] == amount_to_mint


@given(
    id=strategy("uint", max_value=len(users_with_locked_crystal) - 1),
    pct_unlocked=strategy("uint", max_value=100),
)
def test_full_redeem(
    crystal_token,
    pawn_shop_router,
    dfk_bank_account,
    pawn_shop,
    gm_crystal,
    UTXO,
    alice,
    bob,
    id,
    pct_unlocked,
    deployer,
):
    users = users_with_locked_crystal
    whale = users[id]

    # create UTXO
    name = get_random_name()
    tx = pawn_shop.createUTXOWithProfile(name.encode("utf-8"), {"from": whale})
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
    bal = gm_crystal.balanceOf(whale)
    assert bal > 0

    # Whale has made a UTXO

    gm_crystal.transfer(alice, bal, {"from": whale})

    # Alice now needs fees to redeem
    fee_bips = pawn_shop.getFeeTier(utxo_val)
    total_fee = utxo_val * fee_bips / 10_000

    fee_in_jewel = pct_unlocked * total_fee / 100
    fee_in_gmCRYSTAL = total_fee - fee_in_jewel
    crystal_token.transfer(alice, fee_in_jewel, {"from": dfk_bank_account})
    gm_crystal.mint(alice, fee_in_gmCRYSTAL, {"from": deployer})

    # Now we can redeem

    crystal_token.approve(pawn_shop_router, max_uint256, {"from": alice})
    gm_crystal.approve(pawn_shop_router, max_uint256, {"from": alice})

    alice_total_before = crystal_token.totalBalanceOf(alice)
    pawn_shop_router.fullRedeem(created_utxo, fee_in_jewel, {"from": alice})
    alice_total_after = crystal_token.totalBalanceOf(alice)

    assert alice_total_after + fee_in_jewel == alice_total_before + utxo_val


@given(
    id=strategy("uint", max_value=len(users_with_locked_crystal) - 1),
    pct_unlocked=strategy("uint", max_value=100),
)
def test_full_redeem_via_force_redeem(
    crystal_token,
    pawn_shop_router,
    dfk_bank_account,
    pawn_shop,
    gm_crystal,
    UTXO,
    alice,
    bob,
    id,
    pct_unlocked,
    deployer,
):
    users = users_with_locked_crystal
    whale = users[id]

    # create UTXO
    name = get_random_name()
    tx = pawn_shop.createUTXOWithProfile(name.encode("utf-8"), {"from": whale})
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
    bal = gm_crystal.balanceOf(whale)
    assert bal > 0

    # Now add additional jewel to contract after minting
    crystal_token.transfer(created_utxo.address, 100 * 1e18, {"from": dfk_bank_account})
    utxo_val2 = created_utxo.nominalCombinedValue()

    assert utxo_val2 > utxo_val

    # Whale has made a UTXO

    gm_crystal.transfer(alice, bal, {"from": whale})

    # Alice now needs fees to redeem
    fee_bips = pawn_shop.getFeeTier(utxo_val2)
    total_fee = utxo_val2 * fee_bips / 10_000

    fee_in_jewel = pct_unlocked * total_fee / 100
    fee_in_gmCRYSTAL = total_fee - fee_in_jewel
    crystal_token.transfer(alice, fee_in_jewel, {"from": dfk_bank_account})
    gm_crystal.mint(alice, 2 * fee_in_gmCRYSTAL, {"from": deployer})

    # Now we can redeem

    crystal_token.approve(pawn_shop_router, max_uint256, {"from": alice})
    gm_crystal.approve(pawn_shop_router, max_uint256, {"from": alice})

    alice_total_before = crystal_token.totalBalanceOf(alice)
    pawn_shop_router.fullRedeem(created_utxo, fee_in_jewel, {"from": alice})
    alice_total_after = crystal_token.totalBalanceOf(alice)

    assert alice_total_after + fee_in_jewel == alice_total_before + utxo_val2
