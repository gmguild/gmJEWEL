import pytest


# Our contracts


@pytest.fixture(scope="module", autouse=True)
def utxo_template(deployer, UTXO):
    contract = deployer.deploy(UTXO)
    yield contract


@pytest.fixture(scope="module", autouse=True)
def gm_jewel(deployer, gmJEWEL, alice):
    contract = deployer.deploy(gmJEWEL)
    contract.mint(alice, 100 * 1e18, {"from": deployer})
    yield contract


@pytest.fixture(scope="module", autouse=True)
def pawn_shop(deployer, utxo_template, gm_jewel, central_bank, PawnShop):
    contract = deployer.deploy(
        PawnShop,
        gm_jewel,
        utxo_template,
        central_bank,
        jewel_address,
        profiles_address,
    )
    gm_jewel.addMinter(contract.address, {"from": deployer})
    yield contract


@pytest.fixture(scope="module", autouse=True)
def pawn_shop_router(deployer, PawnShopRouter, pawn_shop, gm_jewel):
    contract = deployer.deploy(
        PawnShopRouter,
        pawn_shop,
        gm_jewel,
        jewel_address,
    )
    yield contract


@pytest.fixture(scope="module", autouse=True)
def central_bank(deployer, jewel_token, gm_jewel, CentralBank):
    contract = deployer.deploy(CentralBank, gm_jewel, jewel_token)
    gm_jewel.addMinter(contract.address, {"from": deployer})
    yield contract


@pytest.fixture(scope="module", autouse=True)
def gmg_token(deployer, GMGToken):
    yield deployer.deploy(GMGToken)


@pytest.fixture(scope="module", autouse=True)
def staked_gmg(deployer, StakedGMG, gmg_token, jewel_token):
    yield deployer.deploy(StakedGMG, gmg_token, deployer, uniswap_router, jewel_token)


@pytest.fixture(scope="module", autouse=True)
def uniswap_pool1(deployer, gm_jewel, jewel_token):
    contract = interface.IUniswapV2Factory(uniswap_factory)
    contract.createPair(gm_jewel, jewel_token, {"from": deployer})
    pool_addr = contract.getPair(gm_jewel, jewel_token)
    pool = interface.IUniswapV2Pair(pool_addr)
    jewel_token.transfer(
        pool, 5_000_000 * 1e18, {"from": "0xa9ce83507d872c5e1273e745abcfda849daa654f"}
    )
    gm_jewel.mint(pool, 10_000_000 * 1e18, {"from": deployer})
    pool.mint(deployer, {"from": deployer})
    yield contract


@pytest.fixture(scope="module", autouse=True)
def uniswap_pool2(deployer, gmg_token, jewel_token):
    contract = interface.IUniswapV2Factory(uniswap_factory)
    contract.createPair(gmg_token, jewel_token, {"from": deployer})
    pool_addr = contract.getPair(gmg_token, jewel_token)
    pool = interface.IUniswapV2Pair(pool_addr)
    jewel_token.transfer(
        pool, 5_000_000 * 1e18, {"from": "0xa9ce83507d872c5e1273e745abcfda849daa654f"}
    )
    gmg_token.mint(pool, 10_000_000 * 1e18, {"from": deployer})
    pool.mint(deployer, {"from": deployer})
    yield contract


@pytest.fixture(scope="module", autouse=True)
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
def jewel_token():
    contract = interface.Jewel(jewel_address)
    yield contract


@pytest.fixture(scope="module")
def profiles():
    contract = interface.Profiles(profiles_address)
    yield contract
