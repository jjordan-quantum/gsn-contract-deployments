import { ethers } from "hardhat";
import {
  defaultGsnConfigPartial,
  GsnDomainSeparatorType,
  GsnRequestType,
  POLYGON_RELAY_HUB_CONFIG,
  ZERO_ADDRESS
} from "./constants";

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
  //  FORWARDER - REGISTER REQUEST TYPE
  //
  // ===========================================================================

  console.log(`Registering request type for Forwarder...`);
  await forwarder.registerRequestType(GsnRequestType.typeName, GsnRequestType.typeSuffix);

  // ===========================================================================
  //
  //  FORWARDER - REGISTER DOMAIN SEPARATOR
  //
  // ===========================================================================

  console.log(`Registering domain separator for Forwarder...`);

  await forwarder.registerDomainSeparator(
    defaultGsnConfigPartial.domainSeparatorName,
    GsnDomainSeparatorType.version
  );

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
  //  RELAYHUB - SET STAKING TOKEN CONFIG
  //
  // ===========================================================================

  console.log(`Setting staking token config for RelayHub - min stake for Test Token is 100 TEST...`);
  await relayHub.setMinimumStakes([stakingToken.target], ['100000000000000000000']);

  // ===========================================================================
  //
  //  STAKEMANAGER - SETTING DEV ADDRESS
  //
  // ===========================================================================

  console.log(`Setting devAddress for StakeManager to ${deployer.address}...`);
  await stakeManager.setDevAddress(deployer.address);

  // ===========================================================================
  //
  //  DEPLOY PAYMASTER
  //
  // ===========================================================================

  const payMaster = await ethers.deployContract("TestPaymasterEverythingAccepted", []);
  await payMaster.waitForDeployment();
  console.log(`PayMaster deployed to ${payMaster.target}`);

  // ===========================================================================
  //
  //  PAYMASTER - SETTING RELAYHUB
  //
  // ===========================================================================

  console.log(`Setting relayHub for PayMaster to ${relayHub.target}...`);
  await payMaster.setRelayHub(relayHub.target);

  // ===========================================================================
  //
  //  PAYMASTER - SETTING TRUSTED FORWARDER
  //
  // ===========================================================================

  console.log(`Setting _trustedForwarder for PayMaster to ${forwarder.target}...`);
  await payMaster.setTrustedForwarder(forwarder.target);

  // ===========================================================================
  //
  //  RELAYHUB - DEPOSITING FUNDS FOR PAYMASTER
  //
  // ===========================================================================

  console.log(`Depositing funds for Paymaster in RelayHub...`);

  await relayHub.depositFor(payMaster.target, {
    value: ethers.parseEther("1.0"),
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
