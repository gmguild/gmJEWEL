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
def test_swap1(staked_gmg, deployer, gm_jewel, jewel_token, uniswap_pool1, value):
    gm_jewel.mint(staked_gmg, value, {"from": deployer})
    staked_gmg.swap([gm_jewel, jewel_token], value, 0, {"from": deployer})
    assert gm_jewel.balanceOf(staked_gmg) == 0
    assert jewel_token.balanceOf(staked_gmg) > 0


@given(value=strategy("uint256", min_value="1 ether", max_value="1_000_000 ether"))
def test_swap2(staked_gmg, deployer, gmg_token, jewel_token, uniswap_pool2, value):
    jewel_token.transfer(
        staked_gmg, value, {
            "from": "0xa9ce83507d872c5e1273e745abcfda849daa654f"}
    )
    staked_gmg.swap([jewel_token, gmg_token], value, 0, {"from": deployer})
    assert jewel_token.balanceOf(staked_gmg) == 0
    assert gmg_token.balanceOf(staked_gmg) > 0
