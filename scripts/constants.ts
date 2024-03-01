export type Address = string;
export type IntString = string;
export type PrefixedHexString = string

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const SENDER = '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97';

export const POLYGON_RELAY_HUB_CONFIG: any = {
  maxWorkerCount: 10,
  gasReserve: 100000,
  postOverhead: 17516,
  gasOverhead: 55909,
  minimumUnstakeDelay: 15000,
  devAddress: '0xd21934eD8eAf27a67f0A70042Af50A1D6d195E81',
  devFee: 10,
  baseRelayFee: '0',
  pctRelayFee: 30,
}

export const GsnRequestType = {
  typeName: 'RelayRequest',
  typeSuffix: 'RelayData relayData)RelayData(uint256 maxFeePerGas,uint256 maxPriorityFeePerGas,uint256 transactionCalldataGasUsed,address relayWorker,address paymaster,address forwarder,bytes paymasterData,uint256 clientId)'
}

export const GsnDomainSeparatorType = {
  prefix: 'string name,string version',
  version: '3'
}

type addresses = 'from' | 'to'
type data = 'data'
type intStrings = 'value' | 'nonce' | 'gas' | 'validUntilTime'

export type ForwardRequest = Record<addresses, Address> & Record<data, PrefixedHexString> & Record<intStrings, IntString>

export const defaultGsnConfigPartial: any = {
  domainSeparatorName: 'GSN Relayed Transaction'
}

// export const defaultGsnConfig: GSNConfig = {
//   calldataEstimationSlackFactor: 1,
//   preferredRelays: [],
//   blacklistedRelays: [],
//   pastEventsQueryMaxPageSize: Number.MAX_SAFE_INTEGER,
//   pastEventsQueryMaxPageCount: 20,
//   gasPriceFactorPercent: GAS_PRICE_PERCENT,
//   gasPriceSlackPercent: GAS_PRICE_SLACK_PERCENT,
//   getGasFeesBlocks: 5,
//   getGasFeesPercentile: 50,
//   gasPriceOracleUrl: '',
//   gasPriceOraclePath: '',
//   minMaxPriorityFeePerGas: 1e9,
//   maxRelayNonceGap: MAX_RELAY_NONCE_GAP,
//   relayTimeoutGrace: DEFAULT_RELAY_TIMEOUT_GRACE_SEC,
//   methodSuffix: '_v4',
//   requiredVersionRange: gsnRequiredVersion,
//   jsonStringifyRequest: true,
//   auditorsCount: 0,
//   skipErc165Check: false,
//   clientId: '1',
//   requestValidSeconds: 172800, // 2 days
//   maxViewableGasLimit: '20000000',
//   minViewableGasLimit: '300000',
//   environment: defaultEnvironment,
//   maxApprovalDataLength: 0,
//   maxPaymasterDataLength: 0,
//   clientDefaultConfigUrl: `https://client-config.opengsn.org/${gsnRuntimeVersion}/client-config.json`,
//   useClientDefaultConfigUrl: true,
//   performDryRunViewRelayCall: true,
//   performEstimateGasFromRealSender: false,
//   paymasterAddress: '',
//   tokenPaymasterDomainSeparators: {},
//   waitForSuccessSliceSize: 3,
//   waitForSuccessPingGrace: 3000,
//   domainSeparatorName: 'GSN Relayed Transaction'
// }
