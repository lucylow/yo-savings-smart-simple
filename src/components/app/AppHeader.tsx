import React from 'react';
import ConnectWalletButton from './ConnectWalletButton';

const AppHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/60 glass">
      <div className="container flex h-16 items-center justify-between gap-4">
        <a href="/" className="font-display text-xl font-bold text-foreground tracking-tight shrink-0">
          YO<span className="text-primary">.</span>
        </a>
        <div className="flex items-center min-w-0">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
