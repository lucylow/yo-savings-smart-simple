import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { useVaultContext } from '../../contexts/VaultContext';
import { formatAddress } from '../../utils/formatters';
import AppCard from './AppCard';

const SettingsView: React.FC = () => {
  const { account, disconnect, signOut, isAuthenticated, isMock, chainId } = useWallet();
  const { network, setNetwork } = useVaultContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSignOut = () => {
    if (isAuthenticated) signOut();
    disconnect();
  };

  return (
    <div className="space-y-4">
      {/* Profile */}
      <AppCard>
        <div className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Profile</h3>

          <div className="flex items-center justify-between p-3 bg-secondary rounded-xl border border-border">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M16 10a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{account ? formatAddress(account) : 'Not connected'}</p>
                <p className="text-[10px] text-muted-foreground">
                  {isMock ? 'Demo Wallet' : isAuthenticated ? 'Authenticated' : 'Connected'}
                  {chainId && ` · Chain ${chainId}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 p-2"
              title="Copy address"
            >
              {copied ? '✓' : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </button>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full h-11 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
          >
            {isAuthenticated ? 'Sign Out & Disconnect' : 'Disconnect Wallet'}
          </button>
        </div>
      </AppCard>

      {/* Network */}
      <AppCard>
        <div className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Preferences</h3>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Default Network</label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value as any)}
              className="w-full h-11 px-3 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="base">Base</option>
              <option value="ethereum">Ethereum</option>
              <option value="arbitrum">Arbitrum</option>
              <option value="optimism">Optimism</option>
            </select>
          </div>
        </div>
      </AppCard>

      {/* About */}
      <AppCard>
        <div className="space-y-3">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">About</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs text-muted-foreground">Version</span>
              <span className="text-xs text-foreground font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs text-muted-foreground">Network</span>
              <span className="text-xs text-foreground font-medium">Base (Chain 8453)</span>
            </div>
            <a
              href="https://github.com/lucylow/yo-savings-smart-simple"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-1.5 group"
            >
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">GitHub</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          </div>
        </div>
      </AppCard>
    </div>
  );
};

export default SettingsView;
