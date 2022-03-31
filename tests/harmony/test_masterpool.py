import pytest

from brownie.test import given, strategy


def pos(n):
    if n > 0:
        return n
    return 0


@given(
    _from=strategy("uint256", min_value=21_000_000, max_value=110_000_000),
    _to=strategy("uint256", min_value=21_000_000, max_value=110_000_000),
)
def test_multiplier(master_jeweler, _from, _to):
    multiplier = master_jeweler.getMultiplier(_from, _to)
    epoch0_reward = pos(min(25_000_000, _to) - max(20_000_000, _from)) * 100
    epoch1_reward = pos(min(30_000_000, _to) - max(25_000_000, _from)) * 50
    epoch2_reward = pos(min(35_000_000, _to) - max(30_000_000, _from)) * 30
    epoch3_reward = pos(min(45_000_000, _to) - max(35_000_000, _from)) * 10
    epoch4_reward = pos(_to - max(45_000_000, _from)) * 1
    assert (
        multiplier
        == epoch0_reward + epoch1_reward + epoch2_reward + epoch3_reward + epoch4_reward
    )
