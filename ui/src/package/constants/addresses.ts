import { ChainId } from "../enums";
import { AddressMap } from "../types/AddressMap";

export const SUSHI_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
  [ChainId.ROPSTEN]: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
  [ChainId.RINKEBY]: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
  [ChainId.GÖRLI]: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
  [ChainId.KOVAN]: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
  [ChainId.FANTOM]: "0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC",
  [ChainId.MATIC]: "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a",
  [ChainId.XDAI]: "0x2995D1317DcD4f0aB89f4AE60F3f020A4F17C7CE",
  [ChainId.BSC]: "0x947950BcC74888a40Ffa2593C5798F11Fc9124C4",
  [ChainId.ARBITRUM]: "0xd4d42F0b6DEF4CE0383636770eF773390d85c61A",
  [ChainId.AVALANCHE]: "0x37B608519F91f70F2EeB0e5Ed9AF4061722e4F76",
  [ChainId.HECO]: "0x52E00B2dA5Bd7940fFe26B609A42F957f31118D5",
  [ChainId.HARMONY]: "0xBEC775Cb42AbFa4288dE81F387a9b1A3c4Bc552A",
  [ChainId.OKEX]: "0x2218E0D5E0173769F5b4939a3aE423f7e5E4EAB7",
  [ChainId.OKEX_TESTNET]: "",
  [ChainId.PALM]: "",
  [ChainId.PALM_TESTNET]: "",
  [ChainId.MOONRIVER]: "0xf390830DF829cf22c53c8840554B98eafC5dCBc2",
  [ChainId.CELO]: "0x29dFce9c22003A4999930382Fd00f9Fd6133Acd1",
  [ChainId.TELOS]: "0x922D641a426DcFFaeF11680e5358F34d97d112E1",
  [ChainId.FUSE]: "0x90708b20ccC1eb95a4FA7C8b18Fd2C22a0Ff9E78",
};

export const GMG_ADDRESS: AddressMap = {
  [ChainId.HARMONY]: "0x8d175DC448b1d3D0277AB87388a5362921eE1fEF",
};

export const USDC_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [ChainId.ROPSTEN]: "0x0D9C8723B343A8368BebE0B5E89273fF8D712e3C",
  [ChainId.KOVAN]: "0xb7a4F3E9097C08dA09517b5aB877F7a917224ede",
  [ChainId.MATIC]: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  [ChainId.FANTOM]: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
  [ChainId.BSC]: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  [ChainId.HARMONY]: "0x985458E523dB3d53125813eD68c274899e9DfAb4",
  [ChainId.HECO]: "0x9362Bbef4B8313A8Aa9f0c9808B80577Aa26B73B",
  [ChainId.OKEX]: "0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85",
  [ChainId.XDAI]: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
  [ChainId.ARBITRUM]: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
  [ChainId.AVALANCHE]: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
  [ChainId.MOONRIVER]: "0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D",
  [ChainId.CELO]: "0xef4229c8c3250C675F21BCefa42f58EfbfF6002a",
  [ChainId.TELOS]: "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
  [ChainId.FUSE]: "0x620fd5fa44BE6af63715Ef4E65DDFA0387aD13F5",
};

export const USD_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: USDC_ADDRESS[ChainId.MAINNET],
  [ChainId.ROPSTEN]: USDC_ADDRESS[ChainId.ROPSTEN],
  [ChainId.KOVAN]: USDC_ADDRESS[ChainId.KOVAN],
  [ChainId.MATIC]: USDC_ADDRESS[ChainId.MATIC],
  [ChainId.FANTOM]: USDC_ADDRESS[ChainId.FANTOM],
  [ChainId.BSC]: USDC_ADDRESS[ChainId.BSC],
  [ChainId.HARMONY]: USDC_ADDRESS[ChainId.HARMONY],
  [ChainId.HECO]: USDC_ADDRESS[ChainId.HECO],
  [ChainId.OKEX]: USDC_ADDRESS[ChainId.OKEX],
  [ChainId.XDAI]: USDC_ADDRESS[ChainId.XDAI],
  [ChainId.ARBITRUM]: USDC_ADDRESS[ChainId.ARBITRUM],
  [ChainId.AVALANCHE]: USDC_ADDRESS[ChainId.AVALANCHE],
  [ChainId.MOONRIVER]: USDC_ADDRESS[ChainId.MOONRIVER],
  [ChainId.CELO]: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  [ChainId.TELOS]: USDC_ADDRESS[ChainId.TELOS],
  [ChainId.FUSE]: USDC_ADDRESS[ChainId.FUSE],
};

export const WETH9_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  [ChainId.ROPSTEN]: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  [ChainId.RINKEBY]: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  [ChainId.GÖRLI]: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  [ChainId.KOVAN]: "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
  [ChainId.ARBITRUM]: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  [ChainId.ARBITRUM_TESTNET]: "0xf8456e5e6A225C2C1D74D8C9a4cB2B1d5dc1153b",
  [ChainId.BSC]: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
  [ChainId.FANTOM]: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
  [ChainId.MATIC]: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
  [ChainId.OKEX]: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
  [ChainId.HECO]: "0x64FF637fB478863B7468bc97D30a5bF3A428a1fD",
  [ChainId.HARMONY]: "0x6983D1E6DEf3690C4d616b13597A09e6193EA013",
  [ChainId.XDAI]: "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1",
  [ChainId.AVALANCHE]: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
  [ChainId.PALM]: "0x726138359C17F1E56bA8c4F737a7CAf724F6010b",
  [ChainId.CELO]: "0x122013fd7dF1C6F636a5bb8f03108E876548b455",
  [ChainId.MOONRIVER]: "0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C",
  [ChainId.TELOS]: "0xfA9343C3897324496A05fC75abeD6bAC29f8A40f",
  [ChainId.FUSE]: "0xa722c13135930332Eb3d749B2F0906559D2C5b99",
};

export const WNATIVE_ADDRESS: AddressMap = {
  [ChainId.DFK]: "0xccb93dabd71c8dad03fc4ce5559dc3d89f67a260",
  [ChainId.MAINNET]: WETH9_ADDRESS[ChainId.MAINNET],
  [ChainId.ROPSTEN]: WETH9_ADDRESS[ChainId.ROPSTEN],
  [ChainId.RINKEBY]: WETH9_ADDRESS[ChainId.RINKEBY],
  [ChainId.GÖRLI]: WETH9_ADDRESS[ChainId.GÖRLI],
  [ChainId.KOVAN]: WETH9_ADDRESS[ChainId.KOVAN],
  [ChainId.ARBITRUM]: WETH9_ADDRESS[ChainId.ARBITRUM],
  [ChainId.ARBITRUM_TESTNET]: WETH9_ADDRESS[ChainId.ARBITRUM_TESTNET],
  [ChainId.FANTOM]: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
  [ChainId.FANTOM_TESTNET]: "0xf1277d1Ed8AD466beddF92ef448A132661956621",
  [ChainId.MATIC]: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  [ChainId.MATIC_TESTNET]: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  [ChainId.XDAI]: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
  [ChainId.BSC]: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  [ChainId.BSC_TESTNET]: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
  [ChainId.MOONBEAM_TESTNET]: "0x372d0695E75563D9180F8CE31c9924D7e8aaac47",
  [ChainId.AVALANCHE]: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  [ChainId.AVALANCHE_TESTNET]: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
  [ChainId.HECO]: "0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F",
  [ChainId.HECO_TESTNET]: "0x5B2DA6F42CA09C77D577a12BeaD0446148830687",
  [ChainId.HARMONY]: "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a",
  [ChainId.HARMONY_TESTNET]: "0x7a2afac38517d512E55C0bCe3b6805c10a04D60F",
  [ChainId.OKEX]: "0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15",
  [ChainId.OKEX_TESTNET]: "0x2219845942d28716c0F7C605765fABDcA1a7d9E0",
  [ChainId.PALM]: "0xF98cABF0a963452C5536330408B2590567611a71",
  [ChainId.CELO]: "0x471EcE3750Da237f93B8E339c536989b8978a438",
  [ChainId.MOONRIVER]: "0xf50225a84382c74CbdeA10b0c176f71fc3DE0C4d",
  [ChainId.FUSE]: "0x0BE9e53fd7EDaC9F859882AfdDa116645287C629",
  [ChainId.TELOS]: "0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E",
};

export const DAI_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  [ChainId.ROPSTEN]: "0xc2118d4d90b274016cB7a54c03EF52E6c537D957",
  [ChainId.KOVAN]: "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa",
  [ChainId.MATIC]: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  [ChainId.FANTOM]: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
  [ChainId.BSC]: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
  [ChainId.HARMONY]: "0xEf977d2f931C1978Db5F6747666fa1eACB0d0339",
  [ChainId.HECO]: "0x3D760a45D0887DFD89A2F5385a236B29Cb46ED2a",
  [ChainId.OKEX]: "0x21cDE7E32a6CAF4742d00d44B07279e7596d26B9",
  [ChainId.XDAI]: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
  [ChainId.ARBITRUM]: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  [ChainId.AVALANCHE]: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
  [ChainId.CELO]: "0x90Ca507a5D4458a4C6C6249d186b6dCb02a5BCCd",
  [ChainId.MOONRIVER]: "0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844",
  // [ChainId.TELOS]: '',
  [ChainId.FUSE]: "0x94Ba7A27c7A95863d1bdC7645AC2951E0cca06bA",
};

export const USDT_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  [ChainId.ROPSTEN]: "0x110a13FC3efE6A245B50102D2d79B3E76125Ae83",
  [ChainId.KOVAN]: "0x07de306FF27a2B630B1141956844eB1552B956B5",
  [ChainId.MATIC]: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  [ChainId.FANTOM]: "0x049d68029688eAbF473097a2fC38ef61633A3C7A",
  [ChainId.BSC]: "0x55d398326f99059fF775485246999027B3197955",
  [ChainId.HARMONY]: "0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f",
  [ChainId.HECO]: "0xa71EdC38d189767582C38A3145b5873052c3e47a",
  [ChainId.OKEX]: "0x382bB369d343125BfB2117af9c149795C6C65C50",
  [ChainId.XDAI]: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
  [ChainId.ARBITRUM]: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  [ChainId.AVALANCHE]: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
  [ChainId.CELO]: "0x88eeC49252c8cbc039DCdB394c0c2BA2f1637EA0",
  [ChainId.MOONRIVER]: "0xB44a9B6905aF7c801311e8F4E76932ee959c663C",
  [ChainId.TELOS]: "0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73",
  [ChainId.FUSE]: "0xFaDbBF8Ce7D5b7041bE672561bbA99f79c532e10",
};

export const FACTORY_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
  [ChainId.ROPSTEN]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.RINKEBY]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.GÖRLI]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.KOVAN]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.FANTOM]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.FANTOM_TESTNET]: "",
  [ChainId.MATIC]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.MATIC_TESTNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.XDAI]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.BSC]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.BSC_TESTNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.ARBITRUM]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.ARBITRUM_TESTNET]: "",
  [ChainId.MOONBEAM_TESTNET]: "0x2Ce3F07dD4c62b56a502E223A7cBE38b1d77A1b5",
  [ChainId.AVALANCHE]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.AVALANCHE_TESTNET]: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
  [ChainId.HECO]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.HECO_TESTNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  // Updated to DFK
  [ChainId.HARMONY]: "0x9014B937069918bd319f80e8B3BB4A2cf6FAA5F7",
  [ChainId.HARMONY_TESTNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.OKEX]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.OKEX_TESTNET]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.CELO]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.PALM]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.PALM_TESTNET]: "",
  [ChainId.MOONRIVER]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.FUSE]: "0x43eA90e2b786728520e4f930d2A71a477BF2737C",
  [ChainId.TELOS]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
};

export const ROUTER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
  [ChainId.RINKEBY]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.ROPSTEN]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.GÖRLI]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.KOVAN]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.FANTOM]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.FANTOM_TESTNET]: "",
  [ChainId.MATIC]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.MATIC_TESTNET]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.XDAI]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.BSC]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.BSC_TESTNET]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.ARBITRUM]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.ARBITRUM_TESTNET]: "",
  [ChainId.MOONBEAM_TESTNET]: "0xeB5c2BB5E83B51d83F3534Ae21E84336B8B376ef",
  [ChainId.AVALANCHE]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.AVALANCHE_TESTNET]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.HECO]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.HECO_TESTNET]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  // Updated to DFK
  [ChainId.HARMONY]: "0x24ad62502d1C652Cc7684081169D04896aC20f30",
  [ChainId.HARMONY_TESTNET]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.OKEX]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.OKEX_TESTNET]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.CELO]: "0x1421bDe4B10e8dd459b3BCb598810B1337D56842",
  [ChainId.PALM]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.PALM_TESTNET]: "",
  [ChainId.MOONRIVER]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.FUSE]: "0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3",
  [ChainId.TELOS]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
};

export const MASTERCHEF_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd",
  [ChainId.ROPSTEN]: "0x80C7DD17B01855a6D2347444a0FCC36136a314de",
  [ChainId.RINKEBY]: "0x80C7DD17B01855a6D2347444a0FCC36136a314de",
  [ChainId.GÖRLI]: "0x80C7DD17B01855a6D2347444a0FCC36136a314de",
  [ChainId.KOVAN]: "0x80C7DD17B01855a6D2347444a0FCC36136a314de",
};

export const BAR_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272",
  [ChainId.ROPSTEN]: "0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c",
  [ChainId.RINKEBY]: "0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c",
  [ChainId.GÖRLI]: "0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c",
  [ChainId.KOVAN]: "0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c",
};

export const MAKER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0xE11fc0B43ab98Eb91e9836129d1ee7c3Bc95df50",
  [ChainId.ROPSTEN]: "0x1b9d177CcdeA3c79B6c8F40761fc8Dc9d0500EAa",
  [ChainId.RINKEBY]: "0x1b9d177CcdeA3c79B6c8F40761fc8Dc9d0500EAa",
  [ChainId.GÖRLI]: "0x1b9d177CcdeA3c79B6c8F40761fc8Dc9d0500EAa",
  [ChainId.KOVAN]: "0x1b9d177CcdeA3c79B6c8F40761fc8Dc9d0500EAa",
};

export const TIMELOCK_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0x9a8541Ddf3a932a9A922B607e9CF7301f1d47bD1",
};

export const BENTOBOX_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966",
  [ChainId.ROPSTEN]: "0x6BdD85290001C8Aef74f35A7606065FA15aD5ACF",
  [ChainId.RINKEBY]: "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966",
  [ChainId.GÖRLI]: "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966",
  [ChainId.KOVAN]: "0xc381a85ed7C7448Da073b7d6C9d4cBf1Cbf576f0",
  [ChainId.FANTOM]: "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966",
  [ChainId.MATIC]: "0x0319000133d3AdA02600f0875d2cf03D442C3367",
  [ChainId.MATIC_TESTNET]: "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966",
  [ChainId.XDAI]: "0xE2d7F5dd869Fc7c126D21b13a9080e75a4bDb324",
  [ChainId.BSC]: "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966",
  [ChainId.BSC_TESTNET]: "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966",
  [ChainId.ARBITRUM]: "0x74c764D41B77DBbb4fe771daB1939B00b146894A",
  [ChainId.AVALANCHE]: "0x0711B6026068f736bae6B213031fCE978D48E026",
  [ChainId.HECO]: "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966",
  [ChainId.CELO]: "0x0711B6026068f736bae6B213031fCE978D48E026",
  [ChainId.HARMONY]: "0xA28cfF72b04f83A7E3f912e6ad34d5537708a2C2",
};

export const KASHI_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42",
  [ChainId.KOVAN]: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42",
  [ChainId.MATIC]: "0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7",
  [ChainId.XDAI]: "0x7a6DA9903d0a481F40b8336c1463487BC8C0407e",
  [ChainId.BSC]: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42",
  [ChainId.ARBITRUM]: "0xa010eE0226cd071BeBd8919A1F675cAE1f1f5D3e",
  [ChainId.AVALANCHE]: "0x513037395FA0C9c35E41f89189ceDfE3bD42fAdb",
  [ChainId.AVALANCHE_TESTNET]: "",
  [ChainId.HECO]: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42",
};

export const SUSHISWAP_SWAPPER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0x1766733112408b95239aD1951925567CB1203084",
  [ChainId.MATIC]: "0xe9589382130Ded5DF2397E2fD7A3E9b41DD2701D",
  [ChainId.XDAI]: "0xE02BDb31C353CE95A1D74F81C93eEa70Bf7371B9",
  [ChainId.BSC]: "0x1766733112408b95239aD1951925567CB1203084",
  [ChainId.ARBITRUM]: "0x0bFcD5dD76218bF9e3BE8A1055f9e6D27E5745eb",
  [ChainId.AVALANCHE]: "0x062eee8B38ab5E8ee3bc58CE505939db53E63785",
  [ChainId.HECO]: "0x1766733112408b95239aD1951925567CB1203084",
};

export const SUSHISWAP_MULTISWAPPER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0x545820d5Cc05248da112419fEfb18522c63C8e12",
  [ChainId.KOVAN]: "0xc0c1649b2c67f1a9f5ff1dd618188165e2555bcf",
  [ChainId.MATIC]: "0x73BE093B84c773fe8eE0f76DDc0829E45c215415",
  [ChainId.XDAI]: "0x735f0FbEb3b6389986BcaAf073Af07D2F8be2b93",
  [ChainId.BSC]: "0x86c655cAc122e9A2fd9Ae1f79Df27b30E357968c",
  [ChainId.ARBITRUM]: "0xbe7D5968296843756109D42946D01195320922EF",
  [ChainId.AVALANCHE]: "0xB7C8b5BFcd7212f034Be42a2aAb08b8773B76920",
};

export const SUSHISWAP_MULTI_EXACT_SWAPPER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7",
  [ChainId.KOVAN]: "0x75AE0Aa596D39b20addC921DeB5EE3c96279dABE",
  [ChainId.MATIC]: "0xDB6C4EDd9545d3b815dA85E6429B699c418886f9",
  [ChainId.XDAI]: "0x07b6e34EeCF38B02e83b6B4702699717e298967E",
  [ChainId.BSC]: "0x1B16149Edaf1EFa6ADE6aEEF33e63C6e08c9bB1B",
  [ChainId.ARBITRUM]: "0x860D841bfD1cfEf72A14B2b734005799F07dC7ED",
  [ChainId.AVALANCHE]: "0x2c46217Fae90D302d1Fb5467ADA504bC2A84f448",
};

export const PEGGED_ORACLE_ADDRESS =
  "0x6cbfbB38498Df0E1e7A4506593cDB02db9001564";

export const SUSHISWAP_TWAP_0_ORACLE_ADDRESS =
  "0x66F03B0d30838A3fee971928627ea6F59B236065";

export const SUSHISWAP_TWAP_1_ORACLE_ADDRESS =
  "0x0D51b575591F8f74a2763Ade75D3CDCf6789266f";

export const CHAINLINK_ORACLE_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB",
  [ChainId.MATIC]: "0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB",
  [ChainId.XDAI]: "0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB",
  [ChainId.BSC]: "0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB",
  [ChainId.ARBITRUM]: "0xB2B5C26B6868be10fF77e4E233fD231ceB90162a",
  [ChainId.AVALANCHE]: "0x43198B6fA5d89B88D2E072fA4841724571De5A59",
};

export const BORING_HELPER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0x11Ca5375AdAfd6205E41131A4409f182677996E6",
  [ChainId.KOVAN]: "0x5bd6e4eFA335192FDA5D6B42a344ccA3d45894B8",
  [ChainId.MATIC]: "0xA77a7fD5a16237B85E0FAd02C51f459D18AE93Cd",
  [ChainId.XDAI]: "0x97e4a0fb71243A83A6FbaEF7Cf73617594e4cF2F",
  [ChainId.BSC]: "0x11Ca5375AdAfd6205E41131A4409f182677996E6",
  [ChainId.ARBITRUM]: "0x9AF28d4f7Fa007686958c306BD4c8c52c2b615b8",
  [ChainId.AVALANCHE]: "0xD18cA07a599bf5eBb9B7327871ad682F0b660748",
  [ChainId.HECO]: "0x11Ca5375AdAfd6205E41131A4409f182677996E6",
};

export const MINICHEF_ADDRESS: AddressMap = {
  [ChainId.MATIC]: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
  [ChainId.XDAI]: "0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3",
  [ChainId.HARMONY]: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
  [ChainId.ARBITRUM]: "0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3",
  [ChainId.CELO]: "0x8084936982D089130e001b470eDf58faCA445008",
  [ChainId.MOONRIVER]: "0x3dB01570D97631f69bbb0ba39796865456Cf89A5",
  [ChainId.FUSE]: "0x182CD0C6F1FaEc0aED2eA83cd0e160c8Bd4cb063",
  [ChainId.FANTOM]: "0xf731202A3cf7EfA9368C2d7bD613926f7A144dB5",
};

export const MASTERCHEF_V2_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d",
};

export const ENS_REGISTRAR_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
  [ChainId.GÖRLI]: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
  [ChainId.ROPSTEN]: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
  [ChainId.RINKEBY]: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
};

export const ZAPPER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2",
  [ChainId.ROPSTEN]: "0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2",
};

export const MERKLE_DISTRIBUTOR_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0xcBE6B83e77cdc011Cc18F6f0Df8444E5783ed982",
  [ChainId.ROPSTEN]: "0x84d1f7202e0e7dac211617017ca72a2cb5e2b955",
};

export const MULTICALL2_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  [ChainId.ROPSTEN]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  [ChainId.RINKEBY]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  [ChainId.GÖRLI]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  [ChainId.KOVAN]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  [ChainId.ARBITRUM]: "0x80C7DD17B01855a6D2347444a0FCC36136a314de",
  [ChainId.ARBITRUM_TESTNET]: "0xa501c031958F579dB7676fF1CE78AD305794d579",
  [ChainId.CELO]: "0x9aac9048fC8139667D6a2597B902865bfdc225d3",
  [ChainId.FANTOM]: "0x22D4cF72C45F8198CfbF4B568dBdB5A85e8DC0B5",
  [ChainId.MATIC]: "0x02817C1e3543c2d908a590F5dB6bc97f933dB4BD",
  [ChainId.XDAI]: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
  [ChainId.BSC]: "0xa9193376D09C7f31283C54e56D013fCF370Cd9D9",
  [ChainId.AVALANCHE]: "0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3",
  [ChainId.HECO]: "0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3",
  [ChainId.HARMONY]: "0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3",
  [ChainId.OKEX]: "0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3",
  [ChainId.PALM]: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
  [ChainId.MOONRIVER]: "0x270f2F35bED92B7A59eA5F08F6B3fd34c8D9D9b5",
  [ChainId.FUSE]: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
  [ChainId.TELOS]: "0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3",
};

export const BALANCE_FETCHER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0x386a4B75578C7843A6082EFe181D5d629236C047",
  [ChainId.MATIC]: "0x06a846BA430Ed005bE60f8598B4C563dbaa6feF0",
  [ChainId.AVALANCHE]: "0x4d4A0D45a98AE8EC25b359D93A088A87BC9eF70b",
  [ChainId.XDAI]: "0x26DC4e2f63bad22BCdF99087E40bd5B6c456e69d",
  [ChainId.BSC]: "0x9d6c13Bc5269E553C4697767b4c267FB33Dd8d1A",
  [ChainId.ARBITRUM]: "0x0e9b6C08Fe70Aac8fd08a74a076c2B1C9f7c7d14",
  [ChainId.HECO]: "0x4d4A0D45a98AE8EC25b359D93A088A87BC9eF70b",
  [ChainId.KOVAN]: "0x980bE39AC44E5500f0f16bA692084A6E44e6549A",
};

export const MULTISIG_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: "0x19B3Eb3Af5D93b77a5619b047De0EED7115A19e7",
  // [ChainId.ROPSTEN]: '',
  // [ChainId.RINKEBY]: '',
  // [ChainId.GÖRLI]: '',
  // [ChainId.KOVAN]: '',
  [ChainId.FANTOM]: "0xF9E7d4c6d36ca311566f46c81E572102A2DC9F52",
  [ChainId.MATIC]: "0x850a57630A2012B2494779fBc86bBc24F2a7baeF",
  [ChainId.XDAI]: "0xc375411C6597F692Add6a7a3AD5b3C38626B0F26",
  [ChainId.BSC]: "0xc6fD91aD4919Fd91e2c84077ba648092cB499638",
  [ChainId.ARBITRUM]: "0x978982772b8e4055B921bf9295c0d74eB36Bc54e",
  [ChainId.AVALANCHE]: "0x09842Ce338647906B686aBB3B648A6457fbB25DA",
  // [ChainId.HECO]: '',
  [ChainId.HARMONY]: "0x30af69A3f4a6f266961313Ce0943719dF4A8AA10",
  // [ChainId.OKEX]: '',
  // [ChainId.OKEX_TESTNET]: '',
  // [ChainId.PALM]: '',
  // [ChainId.PALM_TESTNET]: '',
  [ChainId.MOONRIVER]: "0x939f7E76cc515cc296dD3ce362D9a52e148A7D5f",
  [ChainId.CELO]: "0x751b01Fa14fD9640a1DF9014e2D0f3a03A198b81",
  // [ChainId.TELOS]: '',
  [ChainId.FUSE]: "0x33b6beb37837459Ee84a1Ffed2C6a4ca22e5F316",
};
