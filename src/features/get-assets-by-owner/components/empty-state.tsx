import { Coins, ImageIcon, Layers } from 'lucide-react';

const config = {
  nfts: {
    icon: ImageIcon,
    title: 'No NFTs Found',
    description: 'This wallet does not contain any NFTs.',
  },
  tokens: {
    icon: Coins,
    title: 'No Tokens Found',
    description: 'This wallet does not contain any fungible tokens.',
  },
  compressed: {
    icon: Layers,
    title: 'No Compressed NFTs Found',
    description: 'This wallet does not contain any compressed NFTs.',
  },
};

/**
 * Empty state component for when no assets are found.
 */
export function EmptyState({ type }: EmptyStateProps) {
  const { icon: Icon, title, description } = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="size-8 text-muted-foreground" />
      </div>
      <p className="text-lg font-medium">{title}</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
    </div>
  );
}
