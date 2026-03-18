import React from 'react';
import { useWallet } from '../../hooks/useWallet';
import { formatAddress } from '../../utils/formatters';
import AppButton from './AppButton';

const ConnectWalletButton: React.FC = () => {
  const { account, connect, connectMock, disconnect, signIn, signOut, isConnecting, isAuthenticated, isMock, error } = useWallet();

  if (account) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary border border-border">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isMock ? 'bg-amber-400' : 'bg-primary'}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isMock ? 'bg-amber-400' : 'bg-primary'}`} />
          </span>
          <span className="text-xs text-foreground font-mono truncate max-w-[80px]">{formatAddress(account)}</span>
          {isMock && <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1 py-0.5 rounded shrink-0">MOCK</span>}
        </div>
        {!isMock && !isAuthenticated && (
          <AppButton variant="ghost" onClick={signIn} className="h-8 px-2.5 text-xs">
            Sign In
          </AppButton>
        )}
        <button
          onClick={isMock ? disconnect : (isAuthenticated ? signOut : disconnect)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
          title={isAuthenticated ? "Sign Out" : "Disconnect"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <AppButton variant="primary" onClick={connect} isLoading={isConnecting} className="h-10 px-5 text-xs">
        Connect Wallet
      </AppButton>
      <button
        onClick={connectMock}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
      >
        Demo
      </button>
      {error && <p className="text-[10px] text-destructive max-w-[120px] truncate">{error}</p>}
    </div>
  );
};

export default ConnectWalletButton;
