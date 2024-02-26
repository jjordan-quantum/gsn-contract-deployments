import { ethers } from "hardhat";
import {POLYGON_RELAY_HUB_CONFIG, ZERO_ADDRESS} from "./constants";

async function main() {
  const [deployer] = await ethers.getSigners();

  // ===========================================================================
  //
  //  DEPLOY STAKING TOKEN
  //
  // ===========================================================================

  const stakingToken = await ethers.deployContract('TestToken', []);
  await stakingToken.waitForDeployment();
  console.log(`Test Token (for staking) deployed to ${stakingToken.target}`);

  // ===========================================================================
  //
  //  DEPLOY FORWARDER
  //
  // ===========================================================================

  const forwarder = await ethers.deployContract("Forwarder", []);
  await forwarder.waitForDeployment();
  console.log(`Forwarder deployed to ${forwarder.target}`);

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
    '5', // _penalizeBlockDelay used in polygon
    '5', // _penalizeBlockExpiration used in polygon
  ]);

  await penalizer.waitForDeployment();
  console.log(`Penalizer deployed to ${penalizer.target}`);

  // ===========================================================================
  //
  //  DEPLOY STAKEMANAGER
  //
  // ===========================================================================

  const stakeManager = await ethers.deployContract("StakeManager", [
    '100000000', //  _maxUnstakeDelay
    '1000', // _abandonmentDelay used in polygon
    '500', // _escheatmentDelay used in polygon
    deployer.address,
    deployer.address,
  ]);

  await stakeManager.waitForDeployment();
  console.log(`StakeManager deployed to ${stakeManager.target}`);

  // ===========================================================================
  //
  //  DEPLOY RELAYREGISTRAR
  //
  // ===========================================================================

  const relayRegistrar = await ethers.deployContract("RelayRegistrar", [
    '15552000', // _relayRegistrationMaxAge used in polygon
  ]);

  await relayRegistrar.waitForDeployment();
  console.log(`RelayRegistrar deployed to ${relayRegistrar.target}`);

  // ===========================================================================
  //
  //  DEPLOY RELAYHUB
  //
  // ===========================================================================

  const relayHub = await ethers.deployContract("RelayHub", [
    stakeManager.target,
    penalizer.target,
    ZERO_ADDRESS,
    relayRegistrar.target,
    {
      ...POLYGON_RELAY_HUB_CONFIG,
      devAddress: deployer.address,
      devFee: 0,  // polygon  = 10
    }
  ]);

  await relayHub.waitForDeployment();
  console.log(`RelayHub deployed to ${relayHub.target}`);

  // ===========================================================================
  //
  //  DEPLOY PAYMASTER
  //
  // ===========================================================================

  const payMaster = await ethers.deployContract("TestPaymasterEverythingAccepted", []);
  await payMaster.waitForDeployment();
  console.log(`PayMaster deployed to ${payMaster.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
