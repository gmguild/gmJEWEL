import brownie
from brownie.test import given, strategy

from tests.helpers import (
    anti_whale_transfer_value,
    users_with_locked_crystal,
)


def test_send_all_jewel_from_utxo(pawn_shop, bob, UTXO, crystal_token, chain):
    _utxo = pawn_shop.createUTXO({"from": bob}).return_value
    utxo = UTXO.at(_utxo)

    whale = users_with_locked_crystal[0]

    whale_bal = crystal_token.balanceOf(whale)
    if whale_bal > anti_whale_transfer_value():
        return  # this will give antiwhale

    crystal_token.transferAll(utxo.address, {"from": whale})

    start_bal = crystal_token.totalBalanceOf(utxo)

    chain.sleep(259200)
    with brownie.reverts():
        utxo.transferAll(bob, {"from": pawn_shop})
    chain.sleep(1)
    utxo.transferAll(bob, {"from": pawn_shop})

    assert crystal_token.totalBalanceOf(utxo) == 0
    assert crystal_token.totalBalanceOf(bob) == start_bal
