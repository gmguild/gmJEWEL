import brownie
import pytest

from tests.helpers import get_random_name


@pytest.fixture(autouse=True)
def shared_setup(fn_isolation):
    pass


def test_deployment(crystal_token, gm_crystal, pawn_shop):
    pass


def test_create_utxo(pawn_shop, bob):
    pawn_shop.createUTXO({"from": bob})
