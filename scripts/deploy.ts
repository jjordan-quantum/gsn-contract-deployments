import { ethers } from "hardhat";
import {ZERO_ADDRESS} from "./constants";

async function main() {
  const [deployer] = await ethers.getSigners();

  // ===========================================================================
  //
  //  DEPLOY STAKING TOKEN
  //
  // ===========================================================================

  // TODO

  // ===========================================================================
  //
  //  DEPLOY FORWARDER
  //
  // ===========================================================================

  const forwarder = await ethers.deployContract("Forwarder", [], {
    value: '0',
  });

  await forwarder.waitForDeployment();

  console.log(
    `Forwarder deployed to ${forwarder.target}`
  );

  // ===========================================================================
  //
  //  FORWARDER EXECUTIONS
  //
  // ===========================================================================

  // TODO

  // ===========================================================================
  //
  //  DEPLOY PENALIZER
  //
  // ===========================================================================

  const penalizer = await ethers.deployContract("Penalizer", [
    '100', // todo - find out a reasonable _penalizeBlockDelay
    '100', // todo - find out a reasonable _penalizeBlockExpiration
  ], {
    value: '0',
  });

  await penalizer.waitForDeployment();

  console.log(
    `Penalizer deployed to ${penalizer.target}`
  );

  // ===========================================================================
  //
  //  DEPLOY STAKEMANAGER
  //
  // ===========================================================================

  const stakeManager = await ethers.deployContract("StakeManager", [
    '100', // todo - find out a reasonable _maxUnstakeDelay
    '100', // todo - find out a reasonable _abandonmentDelay
    '100', // todo - find out a reasonable _escheatmentDelay
    deployer.address,
    deployer.address,
  ], {
    value: '0',
  });

  await stakeManager.waitForDeployment();

  console.log(
    `StakeManager deployed to ${stakeManager.target}`
  );

  // ===========================================================================
  //
  //  DEPLOY RELAYREGISTRAR
  //
  // ===========================================================================

  const relayRegistrar = await ethers.deployContract("RelayRegistrar", [
    '100', // todo - find out a reasonable _relayRegistrationMaxAge
  ], {
    value: '0',
  });

  await relayRegistrar.waitForDeployment();

  console.log(
    `RelayRegistrar deployed to ${relayRegistrar.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
