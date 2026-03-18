import { WalletProvider } from '../contexts/WalletContext';
import { VaultProvider } from '../contexts/VaultContext';
import AppHeader from '../components/app/AppHeader';
import AppCard from '../components/app/AppCard';
import VaultSelector from '../components/app/VaultSelector';
import BalanceDisplay from '../components/app/BalanceDisplay';
import DepositForm from '../components/app/DepositForm';
import WithdrawForm from '../components/app/WithdrawForm';
import { useWalletContext } from '../contexts/WalletContext';

const AppContent = () => {
  const { account } = useWalletContext();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-md mx-auto py-8 space-y-6">
        {!account ? (
          <AppCard>
            <div className="text-center py-8 space-y-3">
              <h2 className="text-2xl font-medium text-foreground tracking-tight">Welcome to YO Savings</h2>
              <p className="text-sm text-muted-foreground">Connect your wallet to start saving with DeFi yields.</p>
            </div>
          </AppCard>
        ) : (
          <>
            <AppCard>
              <BalanceDisplay />
            </AppCard>

            <AppCard>
              <VaultSelector />
            </AppCard>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AppCard>
                <DepositForm />
              </AppCard>
              <AppCard>
                <WithdrawForm />
              </AppCard>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

const AppPage = () => {
  return (
    <WalletProvider>
      <VaultProvider>
        <AppContent />
      </VaultProvider>
    </WalletProvider>
  );
};

export default AppPage;
