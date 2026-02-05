'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { type WalletConnector, useWallet } from '@/shared/hooks/use-wallet';
import { Button } from '@/shared/ui/button';

interface WalletStyle {
  buttonClass: string;
  installUrl: string;
  icon: string;
}

// Known wallets with their styling and install URLs
const KNOWN_WALLETS: Record<string, WalletStyle> = {
  phantom: {
    buttonClass: 'bg-[#ab9ff2] hover:bg-[#9b8fe2] text-white',
    installUrl: 'https://phantom.com/download',
    icon: '/phantom.svg',
  },
  solflare: {
    buttonClass: 'bg-[#ffef46] hover:bg-[#f0e040] text-black',
    installUrl: 'https://solflare.com/download',
    icon: '/solflare.svg',
  },
  backpack: {
    buttonClass: 'bg-[#000000] hover:bg-[#222222] text-white',
    installUrl: 'https://backpack.app/',
    icon: '/backpack.svg',
  },
  exodus: {
    buttonClass: 'bg-[#1d1d2c] hover:bg-[#2d2d3c] text-white',
    installUrl: 'https://exodus.com/download',
    icon: '/exodus.svg',
  },
};

function getWalletStyle(name: string): WalletStyle {
  const key = name.toLowerCase();
  return (
    KNOWN_WALLETS[key] || {
      buttonClass: 'bg-primary hover:bg-primary/90 text-primary-foreground',
      installUrl: '',
    }
  );
}

// Get wallets that aren't installed
function getNotInstalledWallets(
  installedNames: string[]
): Array<{ name: string; style: WalletStyle }> {
  const installedLower = installedNames.map((n) => n.toLowerCase());
  return Object.entries(KNOWN_WALLETS)
    .filter(([key]) => !installedLower.includes(key))
    .map(([key, style]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      style,
    }));
}

/**
 * Direct wallet connection demo with branded buttons for each wallet.
 * Uses discovered wallets from the Phantom SDK.
 */
export function DirectWalletConnect() {
  const { isConnected, isConnecting, address, connectors, connect, disconnect } = useWallet();
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = useCallback(
    async (wallet: WalletConnector) => {
      setConnectingWallet(wallet.id);
      setError(null);
      try {
        await connect(wallet.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect');
      } finally {
        setConnectingWallet(null);
      }
    },
    [connect]
  );

  const handleInstall = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  // Get wallets that aren't installed
  const notInstalledWallets = getNotInstalledWallets(connectors.map((c) => c.name));

  if (isConnected && address) {
    return (
      <div className={cn('p-6 rounded-lg border', 'bg-green-500/10 border-green-500/30')}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Connected Wallet</p>
            <p className="font-mono text-sm">
              {address.slice(0, 8)}...{address.slice(-8)}
            </p>
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={disconnect}
            className="text-destructive hover:text-destructive hover:no-underline"
          >
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-6 rounded-lg border', 'bg-muted/50')}>
      <p className="text-muted-foreground mb-4">
        Connect directly to a specific wallet. Detected wallets are shown below.
      </p>

      {/* Installed wallets */}
      {connectors.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            Detected Wallets
          </p>
          <div className="flex flex-wrap gap-3">
            {connectors.map((wallet) => {
              const style = getWalletStyle(wallet.name);
              const isThisConnecting = connectingWallet === wallet.id;
              return (
                <Button
                  key={wallet.id}
                  onClick={() => handleConnect(wallet)}
                  disabled={isConnecting || connectingWallet !== null}
                  className={cn('font-medium', style.buttonClass)}
                >
                  <Image
                    src={wallet.icon || style.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="size-5"
                    unoptimized
                  />
                  <span className="ml-2">
                    {isThisConnecting ? 'Connecting...' : `Connect ${wallet.name}`}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Not installed wallets */}
      {notInstalledWallets.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            {connectors.length > 0 ? 'Not Installed' : 'Available Wallets'}
          </p>
          <div className="flex flex-wrap gap-3">
            {notInstalledWallets.map(({ name, style }) => (
              <Button
                key={name}
                variant="outline"
                onClick={() => handleInstall(style.installUrl)}
                className="opacity-60 hover:opacity-100"
              >
                <Image src={style.icon} alt="" width={20} height={20} className="size-5" />
                <span className="ml-2">Install {name}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {connectors.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          No wallets detected. Click a wallet above to install it.
        </p>
      )}
    </div>
  );
}
