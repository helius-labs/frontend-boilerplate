'use client';

// NFT metadata display for standard NFTs and pNFTs
// Use Case 1: NFT Metadata
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function NftMetadataDisplay({ asset, className }: NftMetadataDisplayProps) {
  const metadata = asset.content?.metadata;
  const imageUrl = asset.content?.links?.image || asset.content?.files?.[0]?.cdn_uri;
  const collection = asset.grouping?.find((g) => g.group_key === 'collection');
  const royaltyPercent =
    (asset.royalty?.percent ?? asset.royalty?.basis_points)
      ? (asset.royalty.basis_points / 100).toFixed(2)
      : null;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        {imageUrl && (
          <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden bg-muted shrink-0">
            <Image
              src={imageUrl}
              alt={metadata?.name || 'NFT'}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Details */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-semibold">{metadata?.name || 'Unnamed NFT'}</h3>
            {collection && (
              <p className="text-sm text-muted-foreground">
                {collection.collection_metadata?.name || 'Unknown Collection'}
                {collection.verified && (
                  <span className="ml-1 text-green-500" title="Verified Collection">
                    ✓
                  </span>
                )}
              </p>
            )}
          </div>

          {metadata?.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">{metadata.description}</p>
          )}

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Owner</span>
              <p className="font-mono truncate">{asset.ownership?.owner?.slice(0, 8)}...</p>
            </div>
            {royaltyPercent && (
              <div>
                <span className="text-muted-foreground">Royalty</span>
                <p>{royaltyPercent}%</p>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Type</span>
              <p>{asset.interface}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Frozen</span>
              <p>{asset.ownership?.frozen ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attributes */}
      {metadata?.attributes && metadata.attributes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Attributes</h4>
          <div className="flex flex-wrap gap-2">
            {metadata.attributes.slice(0, 12).map((attr, i) => (
              <div key={i} className="px-3 py-1 bg-muted rounded-full text-sm">
                <span className="text-muted-foreground">{attr.trait_type}:</span>{' '}
                <span className="font-medium">{attr.value}</span>
              </div>
            ))}
            {metadata.attributes.length > 12 && (
              <div className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                +{metadata.attributes.length - 12} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Creators */}
      {asset.creators && asset.creators.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Creators</h4>
          <div className="space-y-1">
            {asset.creators.map((creator, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="font-mono truncate flex-1">{creator.address}</span>
                <span className="text-muted-foreground">{creator.share}%</span>
                {creator.verified && <span className="text-green-500">✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
