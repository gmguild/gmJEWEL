# Greedy Merchant Guild

Hello! Welcome to the monorepo for the Greedy Merchant Guild. Here you will find many treasures.

The repository contains the source code for the following tools used by the Greedy Merchant Guild:

- [Contracts](contracts) : All the contracts used by the Greedy Merchant Guild. Contracts are written in both solidity and vyper.

- [Backend](backend) : Simple backend written in python, used to serve an API that is used by the frontend

- [UI](ui) : The front-end for the website hosted at gmg.money

## Development

### Contracts

To add Harmony to brownie:

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

### Web

```
npm i

brownie compile

# npm run generate-contract-types

brownie run deploy --network harmony

npm run dev-web
```
