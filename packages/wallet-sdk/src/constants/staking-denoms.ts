import { SupportedChain } from './chain-infos';
import { ChainNetwork } from './native-fee-denoms';

export type StakingDenom = Record<SupportedChain, string[]>;
export type StakingDenoms = Record<ChainNetwork, StakingDenom>;

export const stakingDenoms: StakingDenoms = {
  mainnet: {
    akash: ['uakt'],
    axelar: ['uaxl'],
    juno: ['ujuno'],
    cosmos: ['uatom'],
    osmosis: ['uosmo'],
    secret: ['uscrt'],
    persistenceNew: ['uxprt'],
    persistence: ['uxprt'],
    stargaze: ['ustars'],
    emoney: ['ungm'],
    sifchain: ['rowan'],
    irisnet: ['uiris'],
    sommelier: ['usomm'],
    umee: ['uumee'],
    starname: ['uiov'],
    cryptoorg: ['basecro'],
    comdex: ['ucmdx'],
    assetmantle: ['umntl'],
    crescent: ['ucre'],
    kujira: ['ukuji'],
    injective: ['inj'],
    mars: ['umars'],
    sei: ['usei'],
    stride: ['ustrd'],
    agoric: ['ubld'],
    cheqd: ['ncheq'],
    likecoin: ['nanolike'],
    chihuahua: ['uhuahua'],
    gravitybridge: ['ugraviton'],
    fetchhub: ['afet'],
    desmos: ['udsm'],
    teritori: ['utori'],
    jackal: ['ujkl'],
    evmos: ['aevmos'],
    bitsong: ['ubtsg'],
    bitcanna: ['ubcna'],
    canto: ['acanto'],
    decentr: ['udec'],
    carbon: ['swth'],
    cudos: ['acudos'],
    kava: ['ukava'],
    omniflix: ['uflix'],
    passage: ['upasg'],
    terra: ['uluna'],
    quasar: ['uqsr'],
    neutron: ['untrn'],
    coreum: ['utestcore'],
    mainCoreum: ['ucore'],
    quicksilver: ['uqck'],
    migaloo: ['uwhale'],
    kyve: ['ukyve'],
    seiTestnet2: ['usei'],
    seiDevnet: ['usei'],
    onomy: ['anom'],
    noble: ['ustake'],
    impacthub: ['uixo'],
    planq: ['aplanq'],
    nomic: ['unom'],
    nolus: ['unls'],
    archway: ['aarch'],
    chain4energy: ['uc4e'],
    gitopia: ['ulore'],
    nibiru: ['unibi'],
    mayachain: ['cacao'],
    empowerchain: ['umpwr'],
    dydx: ['adydx'],
    celestia: ['utia'],
    sge: ['usge'],
    bandchain: ['uband'],
    sentinel: ['udvpn'],
    kichain: ['uxki'],
    aura: ['uaura'],
    provenance: ['nhash'],
    xpla: ['axpla'],
    composable: ['ppica'],
    pryzmtestnet: ['upryzm'],
    thorchain: ['rune'],
    odin: ['loki'],
    dymension: ['udym'],
  },
  testnet: {
    akash: ['uakt'],
    axelar: ['uaxl'],
    juno: ['ujunox'],
    cosmos: ['uatom'],
    osmosis: ['uosmo'],
    secret: ['uscrt'],
    persistenceNew: ['uxprt'],
    persistence: ['uxprt'],
    stargaze: ['ustars'],
    emoney: ['ungm'],
    sifchain: ['rowan'],
    irisnet: ['uiris'],
    sommelier: ['usomm'],
    umee: ['uumee'],
    starname: ['uiov'],
    cryptoorg: ['basecro'],
    comdex: ['ucmdx'],
    assetmantle: ['umntl'],
    crescent: ['ucre'],
    injective: ['inj'],
    kujira: ['ukuji'],
    mars: ['umars'],
    sei: ['usei'],
    stride: ['ustrd'],
    agoric: ['ubld'],
    cheqd: ['ncheq'],
    likecoin: ['nanolike'],
    chihuahua: ['uhuahua'],
    gravitybridge: ['ugraviton'],
    fetchhub: ['afet'],
    desmos: ['udsm'],
    teritori: ['utori'],
    jackal: ['ujkl'],
    evmos: ['aevmos'],
    bitsong: ['ubtsg'],
    bitcanna: ['ubcna'],
    canto: ['acanto'],
    decentr: ['udec'],
    carbon: ['swth'],
    cudos: ['acudos'],
    kava: ['ukava'],
    omniflix: ['uflix'],
    passage: ['upasg'],
    terra: ['uluna'],
    quasar: ['uqsr'],
    neutron: ['untrn'],
    coreum: ['utestcore'],
    mainCoreum: ['ucore'],
    quicksilver: ['uqck'],
    migaloo: ['uwhale'],
    kyve: ['tkyve'],
    seiTestnet2: ['usei'],
    seiDevnet: ['usei'],
    onomy: ['anom'],
    noble: ['ustake'],
    impacthub: ['uixo'],
    planq: ['aplanq'],
    nomic: ['unom'],
    nolus: ['unls'],
    archway: ['aconst'],
    chain4energy: ['uc4e'],
    gitopia: ['ulore'],
    nibiru: ['unibi'],
    mayachain: ['cacao'],
    empowerchain: ['umpwr'],
    dydx: ['adydx'],
    celestia: ['utia'],
    sge: ['usge'],
    bandchain: ['uband'],
    sentinel: ['udvpn'],
    kichain: ['uxki'],
    aura: ['uaura'],
    provenance: ['nhash'],
    xpla: ['axpla'],
    composable: ['ppica'],
    pryzmtestnet: ['upryzm'],
    thorchain: ['rune'],
    odin: ['loki'],
    dymension: ['udym'],
  },
};
