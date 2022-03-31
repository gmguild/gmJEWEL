import pytest

from brownie.test import given, strategy


@given(value=strategy("uint256"))
def test_enter(staked_gmg, alice, gmg_token, value, deployer):
    gmg_token.mint(alice, value, {"from": deployer})
    gmg_token.approve(staked_gmg.address, value, {"from": alice})
    staked_gmg.enter(value, {"from": alice})
    assert staked_gmg.balanceOf(alice) == value
    assert gmg_token.balanceOf(alice) == 0


@given(value=strategy("uint256", min_value="1", max_value="100_000_000 ether"))
def test_leave(staked_gmg, alice, gmg_token, value, deployer):
    gmg_token.mint(alice, value, {"from": deployer})
    gmg_token.approve(staked_gmg.address, value, {"from": alice})
    staked_gmg.enter(value, {"from": alice})
    staked_gmg.leave(value, {"from": alice})
    assert staked_gmg.balanceOf(alice) == 0
    assert gmg_token.balanceOf(alice) == value


@given(value=strategy("uint256", min_value="1 ether", max_value="1_000_000 ether"))
def test_swap1(staked_gmg, deployer, gm_crystal, crystal_token, uniswap_pool1, value):
    gm_crystal.mint(staked_gmg, value, {"from": deployer})
    staked_gmg.swap([gm_crystal, crystal_token], value, 0, {"from": deployer})
    assert gm_crystal.balanceOf(staked_gmg) == 0
    assert crystal_token.balanceOf(staked_gmg) > 0


@given(value=strategy("uint256", min_value="1 ether", max_value="1_000_000 ether"))
def test_swap2(staked_gmg, deployer, gmg_token, crystal_token, uniswap_pool2, value):
    crystal_token.transfer(
        staked_gmg, value, {"from": "0xa9ce83507d872c5e1273e745abcfda849daa654f"}
    )
    staked_gmg.swap([crystal_token, gmg_token], value, 0, {"from": deployer})
    assert crystal_token.balanceOf(staked_gmg) == 0
    assert gmg_token.balanceOf(staked_gmg) > 0
