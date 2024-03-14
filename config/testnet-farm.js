const NATIVE_ADDRESS = '0x4b9f8077856d81c5e97948dbec8960024d4908c1'
const WBTC_ADDRESS = '0x5289638b40725fb3c33f801d1a339878674ff555'
const DAI_ADDRESS = '0x73fe4db0779022ff9c0b32ef2644272b32bef5b7'
const USDC_ADDRESS = '0x9a0359e8432c856e1eefc6f2e242b5dfed41b3ec'
const USDT_ADDRESS = '0xf13d179f157a6202cede6a78a197eacee656440a'
const SUSHI_ADDRESS = '0xd0c8ec558e16361064f3d1240d0e5472943ea340'
const WETH_ADDRESS = '0x4a656f094b3140f067196c8986d22619d37df58d'
const WXRP_ADDRESS = '0xfd38a31834ccb29fa16c98b6c7a22283c3ceaba0'
const BUSD_ADDRESS = '0xc845fc63a5a69637ebe0d960fbfa33671a1e21e0'
const XSUSHI_ADDRESS = '0xb7739ebf389dd3b647e15105c6465be975088d0d'

const BENTOBOX_ADDRESS = '0x4cb93827e11d3f6cd2bcd99cff05871d47755330'
const BLOCK_ADDRESS = '0xe4b8f63c111ef118587d30401e1db99f4cfbd900'

module.exports = {
  network: 'testnet',
  sushi: { address: SUSHI_ADDRESS },
  weth: { address: NATIVE_ADDRESS },
  wbtc: { address: WBTC_ADDRESS },
  v3: {
    factory: {
      address: '0x0215b80e78e51f874819ab998b468c32922ae765',
      startBlock: 19094148
    },
    positionManager: {
      address: '0x4bc3396980f03c9ae001526578bf9ea7de28f1f0',
      startBlock: 19094158
    },
    native: { address: NATIVE_ADDRESS },
    whitelistedTokenAddresses: [
      NATIVE_ADDRESS,
      WBTC_ADDRESS,
      DAI_ADDRESS,
      USDC_ADDRESS,
      USDT_ADDRESS,
      XSUSHI_ADDRESS,
      SUSHI_ADDRESS,
      BUSD_ADDRESS
    ],
    stableTokenAddresses: [
      USDC_ADDRESS,
      USDT_ADDRESS,
      DAI_ADDRESS,
      BUSD_ADDRESS
    ],
    nativePricePool: '0x28ad4a77c63068425a34c1e375382a96084d2cbc',
    minimumEthLocked: 1.5
  },
  blacklistedTokenAddresses: [
  ],
  sushi: {
    address: SUSHI_ADDRESS,
    startBlock: 16364300
  },
  xSushi: {
    address: XSUSHI_ADDRESS,
    startBlock: 16364341
  },
  furo: {
    stream: { address: '0x4ab2fc6e258a0ca7175d05ff10c5cf798a672cae', startBlock: 14857212 },
    vesting: { address: '0x0689640d190b10765f09310fcfe9c670ede4e25b', startBlock: 14857245 }
  },
  auctionMaker: { address: '0x0000000000000000000000000000000000000000', startBlock: 0 },
  staking: { address: '0x0000000000000000000000000000000000000000', startBlock: 0 },
  blocks: {
    address: '0x0000000000000000000000000000000000000000',
    startBlock: 0
  },
  xswap: {
    address: '0x011e52e4e40cf9498c79273329e8827b21e2e581',
    startBlock: 15187118
  },
  stargate: {
    usdcPool: { address: '0xdf0770df86a8034b3efef0a1bb3c889b8332ff56', startBlock: 14403393 },
    usdtPool: { address: '0x38ea452219524bb87e18de1c24d3bb59510bd783', startBlock: 14403402 }
  },
  router: {
    address: '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f',
    startBlock: 13600375 // 2021-11-12
  }
}
