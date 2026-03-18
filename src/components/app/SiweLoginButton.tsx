import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';
import AppButton from './AppButton';

const SiweLoginButton: React.FC = () => {
  const { account, signer } = useWallet();
  const { isAuthenticated, isLoading, error, signIn, signOut } = useAuth();

  if (!account || !signer) return null;

  if (isAuthenticated) {
    return (
      <AppButton variant="ghost" onClick={signOut} className="h-8 px-3 text-xs">
        Sign Out (API)
      </AppButton>
    );
  }

  return (
    <div className="space-y-2">
      <AppButton
        variant="secondary"
        onClick={() => signIn(account, signer as any)}
        isLoading={isLoading}
        className="w-full"
      >
        Sign In with Ethereum
      </AppButton>
      {error && <p className="text-xs text-destructive text-center">{error}</p>}
      <p className="text-[10px] text-muted-foreground text-center">
        Sign a message to unlock profile, history & recurring deposits
      </p>
    </div>
  );
};

export default SiweLoginButton;
