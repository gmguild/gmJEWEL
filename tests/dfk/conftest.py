import pytest
from brownie import ZERO_ADDRESS

crystal_address = "0x04b9da42306b023f3572e106b11d82aad9d32ebb"


@pytest.fixture(scope="module")
def utxo_template(deployer, UTXO):
    contract = deployer.deploy(UTXO)
    yield contract


@pytest.fixture(scope="module")
def gm_crystal(deployer, gmCRYSTAL, alice):
    contract = deployer.deploy(gmCRYSTAL)
    contract.mint(alice, 100 * 1e18, {"from": deployer})
    yield contract


@pytest.fixture(scope="module")
def pawn_shop(deployer, utxo_template, gm_crystal, central_bank, PawnShop):
    contract = deployer.deploy(
        PawnShop,
        gm_crystal,
        utxo_template,
        central_bank,
        crystal_address,
    )
    gm_crystal.addMinter(contract.address, {"from": deployer})
    yield contract


@pytest.fixture(scope="module")
def pawn_shop_router(deployer, PawnShopRouter, pawn_shop, gm_crystal):
    contract = deployer.deploy(
        PawnShopRouter,
        pawn_shop,
        gm_crystal,
        crystal_address,
    )
    yield contract


@pytest.fixture(scope="module")
def central_bank(deployer, crystal_token, gm_crystal, CentralBank):
    contract = deployer.deploy(CentralBank, gm_crystal, crystal_token)
    gm_crystal.addMinter(contract.address, {"from": deployer})
    yield contract


# DefiKingdom contracts


@pytest.fixture(scope="module")
def crystal_token(interface):
    contract = interface.Jewel(crystal_address)
    yield contract
