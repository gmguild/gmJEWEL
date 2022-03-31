import pytest


@pytest.fixture(autouse=True)
def isolation(fn_isolation):
    pass


# User accounts


@pytest.fixture(scope="module")
def deployer(accounts):
    yield accounts[0]


@pytest.fixture(scope="module")
def alice(accounts):
    yield accounts[1]


@pytest.fixture(scope="module")
def bob(accounts):
    yield accounts[2]
