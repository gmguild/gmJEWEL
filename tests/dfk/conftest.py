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


@pytest.fixture(scope="module")
def gmg_token(deployer, GMGToken):
    yield deployer.deploy(GMGToken)


@pytest.fixture(scope="module")
def staked_gmg(deployer, StakedGMG, gmg_token, crystal_token):
    yield deployer.deploy(StakedGMG, gmg_token, deployer, uniswap_router, crystal_token)


@pytest.fixture(scope="module")
def uniswap_pool1(deployer, gm_crystal, crystal_token, interface):
    contract = interface.IUniswapV2Factory(uniswap_factory)
    contract.createPair(gm_crystal, crystal_token, {"from": deployer})
    pool_addr = contract.getPair(gm_crystal, crystal_token)
    pool = interface.IUniswapV2Pair(pool_addr)
    crystal_token.transfer(
        pool, 5_000_000 * 1e18, {"from": "0xa9ce83507d872c5e1273e745abcfda849daa654f"}
    )
    gm_crystal.mint(pool, 10_000_000 * 1e18, {"from": deployer})
    pool.mint(deployer, {"from": deployer})
    yield contract


@pytest.fixture(scope="module")
def uniswap_pool2(deployer, gmg_token, crystal_token):
    contract = interface.IUniswapV2Factory(uniswap_factory)
    contract.createPair(gmg_token, crystal_token, {"from": deployer})
    pool_addr = contract.getPair(gmg_token, crystal_token)
    pool = interface.IUniswapV2Pair(pool_addr)
    crystal_token.transfer(
        pool, 5_000_000 * 1e18, {"from": "0xa9ce83507d872c5e1273e745abcfda849daa654f"}
    )
    gmg_token.mint(pool, 10_000_000 * 1e18, {"from": deployer})
    pool.mint(deployer, {"from": deployer})
    yield contract


@pytest.fixture(scope="module")
def master_jeweler(deployer, MasterJeweler, gmg_token):
    yield deployer.deploy(
        MasterJeweler,
        gmg_token,
        deployer,
        1 * 1e17,
        20_000_000,
        [20_000_000, 25_000_000, 30_000_000, 35_000_000, 45_000_000],
        [100, 50, 30, 10, 1],
    )


# DefiKingdom contracts


@pytest.fixture(scope="module")
def crystal_token(interface):
    contract = interface.Jewel(crystal_address)
    yield contract
