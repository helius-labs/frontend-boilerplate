// Type definitions for program-info feature

interface ProgramInfo {
  executable: boolean;
  owner: string;
  lamports: bigint;
  rentEpoch: number;
  programDataAddress?: string;
  upgradeAuthority?: string | null;
  lastDeploySlot?: number;
  space: number;
}

interface UpgradeAuthorityResult {
  programDataAddress: string;
  upgradeAuthority: string | null;
  lastDeploySlot: number;
  programDataSpace: number;
}

interface IdlResult {
  found: boolean;
  idl?: object;
  error?: string;
}

interface CommonProgram {
  id: string;
  name: string;
  description: string;
  hasIdl: boolean;
}

type ProgramInfoUseCase = 'metadata' | 'upgrade-authority' | 'idl';

interface ProgramInfoError {
  code: 'NOT_FOUND' | 'NOT_EXECUTABLE' | 'INVALID_ADDRESS' | 'NETWORK_ERROR' | 'IDL_NOT_FOUND';
  message: string;
  suggestion?: string;
}

// Component Props

interface IdlViewerProps {
  data: IdlResult | undefined;
  isLoading: boolean;
  error: ProgramInfoError | null;
}

interface ProgramInfoDemoProps {
  defaultProgramId?: string;
}

interface ProgramMetadataProps {
  data: ProgramInfo | undefined;
  isLoading: boolean;
  error: ProgramInfoError | null;
}
