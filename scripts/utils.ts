export function printRelayInfo (
  hubAddress: string,
  deployerAddress: string,
  networkUrl: string,
  network: string,  // hre.hardhatArguments.network
  stakingTokenAddress: string,
  stakingTokenValue: string,
): void {
  console.log('\nExample for Relayer config JSON file:');

  console.log(JSON.stringify({
    relayHubAddress: hubAddress,
    ownerAddress: deployerAddress,
    managerStakeTokenAddress: stakingTokenAddress,
    gasPriceFactor: 1,
    maxFeePerGas: 1e12,
    ethereumNodeUrl: networkUrl
  }, null, 2));

  console.log('\nRegister your Relay Server:');
  console.log('Go to https://relays.opengsn.org/ and register your relay server with the web app, or use the following CLI command:');
  console.log(`gsn relayer-register -m $SECRET --network ${networkUrl} --relayUrl https://${network}.v3.opengsn.org/v3 --token ${stakingTokenAddress} --stake ${stakingTokenValue} --wrap`);
}