# Contracts

To add Harmony to brownie, you should use the following commands:
Note: We provide functionality for users to use either ganache or hardhat as their forking engine of choice.

```
brownie networks add Harmony harmony-main host=https://api.harmony.one chainid=1666600000

brownie networks add Development "harmony-fork" host=http://127.0.0.1 cmd=ganache-cli fork=https://a.api.s0.t.hmny.io port=8545 chain_id=1666600000

brownie networks add Development "hardhat-harmony-fork" cmd="npx hardhat node" host="http://127.0.0.1:8545" chain_id=1666600000 fork="https://a.api.s0.t.hmny.io" port=8545
```

This allows you to run scripts/tests:

`brownie run test_fork --network harmony-fork`

Will run the script located at `scripts/test_fork.py` on a fork of Harmony mainnet.

If you get an error regarding ganache, please ensure you have Node installed, and then run:

```
npm install -g ganache-cli
```