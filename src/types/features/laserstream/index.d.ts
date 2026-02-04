// Types for laserstream feature

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface BlockUpdate {
  slot: number;
  timestamp: number;
  parentSlot?: number;
}

interface UseLaserstreamReturn {
  status: ConnectionStatus;
  blocks: BlockUpdate[];
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  isConfigured: boolean;
}

interface LaserstreamDemoProps {
  className?: string;
}

interface ConnectionStatusProps {
  status: ConnectionStatus;
}

interface BlockStreamProps {
  blocks: BlockUpdate[];
}
