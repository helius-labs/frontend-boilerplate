// Barrel export for validator-staking feature

// Hooks
export { useValidators, useValidatorDetails } from './hooks/use-validators';
export { useStakeTransaction } from './hooks/use-stake-transaction';

// Fetch functions
export { fetchValidators } from './lib/fetch-validators';
export { fetchValidatorDetails, calculateValidatorDetails } from './lib/fetch-validator-details';

// Transaction building
export {
  buildStakeTransaction,
  validateStakeAmount,
  STAKE_ACCOUNT_RENT_EXEMPTION,
  SUGGESTED_MIN_STAKE,
  bs58,
  Keypair,
} from './lib/build-stake-transaction';

// Simulation
export {
  simulateStakeTransaction,
  calculateTotalCost,
  formatTransactionPreview,
} from './lib/simulate-stake';

// Components
export { ValidatorStakingDemo } from './components/validator-staking-demo';
export { ValidatorList } from './components/validator-list';
export { ValidatorDetails } from './components/validator-details';
export { StakeForm } from './components/stake-form';
export { TransactionPreview } from './components/transaction-preview';

// Code examples
export { VALIDATOR_STAKING_CODE_EXAMPLES } from './constants/code-examples';
