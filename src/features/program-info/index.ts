// Barrel export for program-info feature

// Components
export { ProgramInfoDemo } from './components/program-info-demo';
export { ProgramMetadata } from './components/program-metadata';
export { IdlViewer } from './components/idl-viewer';

// Hooks
export {
  useProgramInfo,
  useProgramMetadata,
  useProgramAuthority,
  useProgramIdl,
} from './hooks/use-program-info';

// Fetch functions
export { fetchProgramInfo } from './lib/fetch-program-info';
export { fetchUpgradeAuthority, fetchProgramWithAuthority } from './lib/fetch-upgrade-authority';
export { fetchProgramIdl, getRpcUrlForIdl } from './lib/fetch-idl';

// Constants
export { COMMON_PROGRAMS, findCommonProgram } from './constants/common-programs';
export { PROGRAM_INFO_CODE_EXAMPLES, getCodeExample } from './constants/code-examples';
