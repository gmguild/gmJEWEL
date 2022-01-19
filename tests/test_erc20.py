import pytest

from brownie import accounts
from brownie.test import given, strategy
import brownie


@pytest.fixture(autouse=True)
def shared_setup(fn_isolation):
    pass


def test_initial_allowance(gm_jewel, alice, bob):
    assert gm_jewel.allowance(alice, bob) == 0


@given(value=strategy("uint256"))
def test_approve(gm_jewel, alice, bob, value):
    gm_jewel.approve(bob, value, {"from": alice})
    assert gm_jewel.allowance(alice, bob) == value


@given(
    value=strategy("uint256", max_value="100 ether"),
)
def test_transfer(gm_jewel, alice, bob, value):
    gm_jewel.transfer(bob, value, {"from": alice})
    assert gm_jewel.balanceOf(bob) == value


@given(
    value=strategy("uint256", max_value="100 ether", min_value=1),
)
def test_transfer_from(gm_jewel, alice, bob, value):
    gm_jewel.approve(bob, value, {"from": alice})
    gm_jewel.transferFrom(alice, bob, value, {"from": bob})
    assert gm_jewel.balanceOf(bob) == value


@given(
    value=strategy("uint256", max_value="100 ether", min_value=1),
)
def test_cant_transfer_without_approval(gm_jewel, alice, bob, value):
    with brownie.reverts():
        gm_jewel.transferFrom(alice, bob, value, {"from": bob})


@given(value=strategy("uint256", max_value="100 ether"))
def test_burn(gm_jewel, alice, value):
    # should never do this, but burning is boolish
    gm_jewel.burn(value, {"from": alice})


@given(
    value=strategy("uint256", max_value="100 ether", min_value=1),
)
def test_burnFrom(gm_jewel, alice, value, bob):
    gm_jewel.approve(bob, value, {"from": alice})
    gm_jewel.burnFrom(alice, value, {"from": bob})


@given(
    value=strategy("uint256", max_value="100 ether", min_value=1),
)
def test_cant_burn_without_approval(gm_jewel, alice, bob, value):
    with brownie.reverts():
        gm_jewel.burnFrom(alice, value, {"from": bob})
