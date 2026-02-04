'use client';

// Compressed NFT display with compression details
// Use Case 3: Compressed NFT
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function CompressedNftDisplay({ asset, className }: CompressedNftDisplayProps) {
  const metadata = asset.content?.metadata;
  const compression = asset.compression;
  const imageUrl = asset.content?.links?.image || asset.content?.files?.[0]?.cdn_uri;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        {imageUrl && (
          <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden bg-muted shrink-0">
            <Image
              src={imageUrl}
              alt={metadata?.name || 'Compressed NFT'}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Details */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-semibold">{metadata?.name || 'Unnamed cNFT'}</h3>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-500 text-xs font-medium rounded-full mt-1">
              <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a5 5 0 1110 0 5 5 0 01-10 0z" />
              </svg>
              Compressed NFT
            </div>
          </div>

          {metadata?.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">{metadata.description}</p>
          )}

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Owner</span>
              <p className="font-mono truncate">{asset.ownership?.owner?.slice(0, 8)}...</p>
            </div>
            <div>
              <span className="text-muted-foreground">Frozen</span>
              <p>{asset.ownership?.frozen ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compression Details */}
      {compression && (
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <h4 className="text-sm font-medium">Compression Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Merkle Tree</p>
              <p className="font-mono truncate">{compression.tree?.slice(0, 12)}...</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Leaf ID</p>
              <p className="font-mono">{compression.leaf_id?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Sequence</p>
              <p className="font-mono">{compression.seq?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Data Hash</p>
              <p className="font-mono truncate">{compression.data_hash?.slice(0, 12)}...</p>
            </div>
          </div>
        </div>
      )}

      {/* Attributes */}
      {metadata?.attributes && metadata.attributes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Attributes</h4>
          <div className="flex flex-wrap gap-2">
            {metadata.attributes.slice(0, 8).map((attr, i) => (
              <div key={i} className="px-3 py-1 bg-muted rounded-full text-sm">
                <span className="text-muted-foreground">{attr.trait_type}:</span>{' '}
                <span className="font-medium">{attr.value}</span>
              </div>
            ))}
            {metadata.attributes.length > 8 && (
              <div className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                +{metadata.attributes.length - 8} more
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Asset ID: <span className="font-mono">{asset.id}</span>
        <span className="ml-2 text-blue-500">
          (Not a mint address - this is a compressed asset ID)
        </span>
      </div>
    </div>
  );
}
