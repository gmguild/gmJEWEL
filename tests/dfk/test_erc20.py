import pytest

from brownie import accounts
from brownie.test import given, strategy
import brownie


@pytest.fixture(autouse=True)
def shared_setup(fn_isolation):
    pass


def test_initial_allowance(gm_crystal, alice, bob):
    assert gm_crystal.allowance(alice, bob) == 0


@given(value=strategy("uint256"))
def test_approve(gm_crystal, alice, bob, value):
    gm_crystal.approve(bob, value, {"from": alice})
    assert gm_crystal.allowance(alice, bob) == value


@given(
    value=strategy("uint256", max_value="100 ether"),
)
def test_transfer(gm_crystal, alice, bob, value):
    gm_crystal.transfer(bob, value, {"from": alice})
    assert gm_crystal.balanceOf(bob) == value


@given(
    value=strategy("uint256", max_value="100 ether", min_value=1),
)
def test_transfer_from(gm_crystal, alice, bob, value):
    gm_crystal.approve(bob, value, {"from": alice})
    gm_crystal.transferFrom(alice, bob, value, {"from": bob})
    assert gm_crystal.balanceOf(bob) == value


@given(
    value=strategy("uint256", max_value="100 ether", min_value=1),
)
def test_cant_transfer_without_approval(gm_crystal, alice, bob, value):
    with brownie.reverts():
        gm_crystal.transferFrom(alice, bob, value, {"from": bob})


@given(value=strategy("uint256", max_value="100 ether"))
def test_burn(gm_crystal, alice, value):
    # should never do this, but burning is boolish
    gm_crystal.burn(value, {"from": alice})


@given(
    value=strategy("uint256", max_value="100 ether", min_value=1),
)
def test_burnFrom(gm_crystal, alice, value, bob):
    gm_crystal.approve(bob, value, {"from": alice})
    gm_crystal.burnFrom(alice, value, {"from": bob})


@given(
    value=strategy("uint256", max_value="100 ether", min_value=1),
)
def test_cant_burn_without_approval(gm_crystal, alice, bob, value):
    with brownie.reverts():
        gm_crystal.burnFrom(alice, value, {"from": bob})
