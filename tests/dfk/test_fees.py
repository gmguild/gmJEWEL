import pytest
from brownie.test import given, strategy


@given(value=strategy("uint256"))
def test_fees(pawn_shop, value):
    fee = pawn_shop.getFeeTier(value)
    expected_fee = 500
    if value > 100_000 * 1e18:
        expected_fee = 25
    elif value > 10_000 * 1e18:
        expected_fee = 50
    elif value > 1_000 * 1e18:
        expected_fee = 100
    elif value > 0:
        expected_fee = 150
    assert fee == expected_fee
