import React from 'react';
import ConnectWalletButton from './ConnectWalletButton';

const AppHeader: React.FC = () => {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="font-display text-xl font-bold text-foreground tracking-tight">
          YO<span className="text-primary">.</span>
        </a>
        <ConnectWalletButton />
      </div>
    </header>
  );
};

export default AppHeader;
