import React from 'react';
import { useWallet } from '../../hooks/useWallet';
import { formatAddress } from '../../utils/formatters';
import AppButton from './AppButton';

const ConnectWalletButton: React.FC = () => {
  const { account, connect, disconnect, signIn, signOut, isConnecting, isAuthenticated, error } = useWallet();

  if (account) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-xs text-muted-foreground font-mono">{formatAddress(account)}</span>
        </div>
        {isAuthenticated ? (
          <AppButton variant="ghost" onClick={signOut} className="h-8 px-3 text-xs">
            Sign Out
          </AppButton>
        ) : (
          <AppButton variant="secondary" onClick={signIn} className="h-8 px-3 text-xs">
            Sign In
          </AppButton>
        )}
        <AppButton variant="ghost" onClick={disconnect} className="h-8 px-3 text-xs">
          Disconnect
        </AppButton>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AppButton variant="primary" onClick={connect} isLoading={isConnecting}>
        Connect Wallet
      </AppButton>
      {error && <p className="text-xs text-destructive text-center">{error}</p>}
    </div>
  );
};

export default ConnectWalletButton;
