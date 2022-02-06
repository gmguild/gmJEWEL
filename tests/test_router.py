import pytest

from tests.helpers import (
    anti_whale_transfer_value,
    bank_address,
    get_random_name,
    max_uint256,
    users_with_locked_jewel,
)
from brownie.test import given, strategy
import brownie


@given(
    id=strategy("uint", max_value=len(users_with_locked_jewel) - 1),
    pct_unlocked=strategy("uint", max_value=100),
)
def test_full_redeem(
    jewel_token,
    pawn_shop_router,
    dfk_bank_account,
    pawn_shop,
    gm_jewel,
    UTXO,
    alice,
    bob,
    id,
    pct_unlocked,
    deployer,
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
    bal = gm_jewel.balanceOf(whale)
    assert bal > 0

    # Whale has made a UTXO

    gm_jewel.transfer(alice, bal, {"from": whale})

    # Alice now needs fees to redeem
    fee_bips = pawn_shop.getFeeTier(utxo_val)
    total_fee = utxo_val * fee_bips / 10_000

    fee_in_jewel = pct_unlocked * total_fee / 100
    fee_in_gmjewel = total_fee - fee_in_jewel
    jewel_token.transfer(alice, fee_in_jewel, {"from": dfk_bank_account})
    gm_jewel.mint(alice, fee_in_gmjewel, {"from": deployer})

    # Now we can redeem

    jewel_token.approve(pawn_shop_router, max_uint256, {"from": alice})
    gm_jewel.approve(pawn_shop_router, max_uint256, {"from": alice})

    alice_total_before = jewel_token.totalBalanceOf(alice)
    pawn_shop_router.fullRedeem(created_utxo, fee_in_jewel, {"from": alice})
    alice_total_after = jewel_token.totalBalanceOf(alice)

    assert alice_total_after + fee_in_jewel == alice_total_before + utxo_val


@given(
    id=strategy("uint", max_value=len(users_with_locked_jewel) - 1),
    pct_unlocked=strategy("uint", max_value=100),
)
def test_full_redeem_via_force_redeem(
    jewel_token,
    pawn_shop_router,
    dfk_bank_account,
    pawn_shop,
    gm_jewel,
    UTXO,
    alice,
    bob,
    id,
    pct_unlocked,
    deployer,
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

    # Now add additional jewel to contract after minting
    jewel_token.transfer(created_utxo, 10 * 1e18, {"from": dfk_bank_account})
    utxo_val = created_utxo.nominalCombinedValue()

    amount_to_mint = utxo_val - minted_from

    if amount_to_mint == 0:
        return

    pawn_shop.mintFromUTXO(created_utxo, {"from": whale})
    bal = gm_jewel.balanceOf(whale)
    assert bal > 0

    # Whale has made a UTXO

    gm_jewel.transfer(alice, bal, {"from": whale})

    # Alice now needs fees to redeem
    fee_bips = pawn_shop.getFeeTier(utxo_val)
    total_fee = utxo_val * fee_bips / 10_000

    fee_in_jewel = pct_unlocked * total_fee / 100
    fee_in_gmjewel = total_fee - fee_in_jewel
    jewel_token.transfer(alice, fee_in_jewel, {"from": dfk_bank_account})
    gm_jewel.mint(alice, fee_in_gmjewel, {"from": deployer})

    # Now we can redeem

    jewel_token.approve(pawn_shop_router, max_uint256, {"from": alice})
    gm_jewel.approve(pawn_shop_router, max_uint256, {"from": alice})

    alice_total_before = jewel_token.totalBalanceOf(alice)
    pawn_shop_router.fullRedeem(created_utxo, fee_in_jewel, {"from": alice})
    alice_total_after = jewel_token.totalBalanceOf(alice)

    assert alice_total_after + fee_in_jewel == alice_total_before + utxo_val
    assert 1 == 2
