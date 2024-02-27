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

note: only tested on windows using node v16.20.0 and npm 8.19.4

Compile contracts:

```shell
npm run compile
```

Try deployment using built-in hardhat network:

```shell
npm run deploy
```

Try deploying to target network:

 - first run the hardhat network in a separate terminal:

```shell
npx hardhat node
```

 - run the deploy script using hardhat's localhost network option

```shell
npm run deploy:local
```

Run tests:

note: tests adapted from [here](https://github.com/opengsn/gsn/tree/da4222b76e3ae1968608dc5c5d80074dcac7c4be/packages/dev/test)

```shell
npm run test
```

