# GSN Contract Deployments

This project contains an extremely simple streamlined deployment of the Gas Station Network (v3.0.0-beta.10) smart contracts using hardhat.

Using [this](https://github.com/opengsn/gsn/blob/da4222b76e3ae1968608dc5c5d80074dcac7c4be/packages/deployer/deploy/deploy.ts) as a guide for deployment logic and sequence, and [this](https://github.com/opengsn/gsn/tree/da4222b76e3ae1968608dc5c5d80074dcac7c4be/packages/contracts) as a source for contract files.

First clone this repo:

```shell
git clone https://github.com/jjordan-quantum/gsn-contract-deployments.git
```

Install deps:

```shell
npm i
```

Compile contracts:

```shell
npm run compile
```

Try deployment using built-in hardhat network:

```shell
npm run deploy
```

Try deploying to target network:

TODO

Run tests:

TODO

