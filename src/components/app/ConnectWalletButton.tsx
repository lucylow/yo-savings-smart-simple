import React from 'react';
import { useWallet } from '../../hooks/useWallet';
import { formatAddress } from '../../utils/formatters';
import AppButton from './AppButton';

const ConnectWalletButton: React.FC = () => {
  const { account, connect, connectMock, disconnect, signIn, signOut, isConnecting, isAuthenticated, isMock, error } = useWallet();

  if (account) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isMock ? 'bg-amber-400' : 'bg-primary'}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isMock ? 'bg-amber-400' : 'bg-primary'}`} />
          </span>
          <span className="text-xs text-muted-foreground font-mono">{formatAddress(account)}</span>
          {isMock && <span className="text-[10px] font-medium text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">MOCK</span>}
        </div>
        {!isMock && (
          isAuthenticated ? (
            <AppButton variant="ghost" onClick={signOut} className="h-8 px-3 text-xs">
              Sign Out
            </AppButton>
          ) : (
            <AppButton variant="secondary" onClick={signIn} className="h-8 px-3 text-xs">
              Sign In
            </AppButton>
          )
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
      <AppButton variant="ghost" onClick={connectMock} className="w-full text-xs">
        Use Mock Wallet
      </AppButton>
      {error && <p className="text-xs text-destructive text-center">{error}</p>}
    </div>
  );
};

export default ConnectWalletButton;
