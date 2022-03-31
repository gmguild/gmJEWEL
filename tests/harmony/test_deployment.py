import brownie
import pytest

from tests.helpers import get_random_name


@pytest.fixture(autouse=True)
def shared_setup(fn_isolation):
    pass


def test_deployment(jewel_token, gm_jewel, pawn_shop):
    pass


def test_create_profile(profiles, bob):
    name = get_random_name()
    profiles.createProfile(name, 0, {"from": bob})


def test_create_utxo(pawn_shop, bob):
    pawn_shop.createUTXO({"from": bob})
