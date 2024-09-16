/* eslint-disable no-unused-vars */
export enum EventName {
  PageView = 'Page View',
  BannerView = 'Banner View',
  BannerClick = 'Banner Click',
  BannerClose = 'Banner Close',
  ButtonClick = 'Button Click',
  DappTxnInit = 'dApp Transaction Initiated',
  DappTxnApproved = 'dApp Transaction Approved',
  DappTxnRejected = 'dApp Transaction Rejected',
  OnboardingStarted = 'Onboarding Started',
  OnboardingMethod = 'Onboarding Method Chosen',
  OnboardingCompleted = 'Onboarding Completed',
  OnboardingClicked = 'Onboarding CTA Clicked',
  SwapTransactionStatus = 'Transaction Status',
  TransactionSigned = 'Transaction Signed',
  ChainFavorited = 'Chain Favorited',
  ChainUnfavorited = 'Chain Unfavorited',
}

export enum ButtonType {
  HOME = 'home',
  ADD_FUNDS = 'zero balance wallet - add funds',
  CHAIN_MANAGEMENT = 'chain management',
  AIRDROPS = 'airdrops',
  SIDE_PANEL = 'side panel',
}

export enum ButtonName {
  IBC_SWAP = 'ibc swaps',
  RECEIVE_ASSETS = 'receive assets',
  RECEIVE = 'receive',
  BRIDGE = 'bridge',
  BUY = 'fiat on-ramp',
  MOBILE_APP = 'mobile app',
  LEAPBOARD = 'leapboard',
  EXPLORE_DEFI = 'dive into defi',
  EXPLORE_NFTS = 'explore nfts',
  EXPLORE_TOKENS = 'explore tokens',
  LAUNCH_EXTENSION = 'launch extension',
  FOLLOW_LEAP = 'follow Leap on X',
  ADD_CHAIN_FROM_STORE = 'add chain from store',
  ADD_NEW_CHAIN = 'add new chain',
  MANAGE_CHAIN = 'manage chain',
  RETRY_AIRDROP = 'retry airdrop',
  CLAIM_AIRDROP = 'claim airdrop',
  GO_TO_LEAPBOARD = 'go to leapboard',
  SIDE_PANEL_OPENED = 'side panel opened',
  SIDE_PANEL_CLOSED = 'side panel closed',
}

export enum PageName {
  Home = 'Home',
  Send = 'Send',
  SwapsStart = 'Swaps - Start',
  SwapsReview = 'Swaps - Review',
  SwapsTracking = 'Swaps - Tracking',
  SwapsCompletion = 'Swaps - Completion',
  Governance = 'Governance',
  Stake = 'Stake',
  Activity = 'Activity',
  Earn = 'Earn',
  NFT = 'NFT Collections',
  SyncWithMobileApp = 'Sync with Mobile App',
  Airdrops = 'Airdrops',
  StakeTxnPage = 'Transaction Completion CTA',
  QuickSearch = 'QuickSearch',
  Buy = 'Buy',
  OnRampQuotePreview = 'On-ramp quote preview',
  AssetDetails = 'Asset Details',
}
