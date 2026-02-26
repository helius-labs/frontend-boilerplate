// Types for RPC API proxy

type AllowedMethod =
  | 'getBalance'
  | 'getAsset'
  | 'getAssetsByOwner'
  | 'getSignaturesForAddress'
  | 'getTransaction'
  | 'getTransactionsForAddress'
  | 'getTokenAccounts'
  | 'getAccountInfo'
  | 'getVoteAccounts'
  | 'getEpochInfo'
  | 'simulateTransaction'
  | 'sendTransaction'
  | 'getLatestBlockhash'
  | 'getMinimumBalanceForRentExemption'
  | 'getSignatureStatuses'
  | 'getBlock';
