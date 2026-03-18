import { WalletProvider } from '../contexts/WalletContext';
import { VaultProvider } from '../contexts/VaultContext';
import AppHeader from '../components/app/AppHeader';
import AppCard from '../components/app/AppCard';
import VaultSelector from '../components/app/VaultSelector';
import BalanceDisplay from '../components/app/BalanceDisplay';
import DepositForm from '../components/app/DepositForm';
import WithdrawForm from '../components/app/WithdrawForm';
import CrossChainDeposit from '../components/app/CrossChainDeposit';
import PortfolioView from '../components/app/PortfolioView';
import RedemptionStatus from '../components/app/RedemptionStatus';
import SiweLoginButton from '../components/app/SiweLoginButton';
import TransactionHistory from '../components/app/TransactionHistory';
import RecurringSettings from '../components/app/RecurringSettings';
import { useWalletContext } from '../contexts/WalletContext';

const AppContent = () => {
  const { account, error: walletError } = useWalletContext();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-md mx-auto py-8 space-y-6 pb-24">
        {walletError && (
          <AppCard>
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-xs text-destructive">{walletError}</p>
            </div>
          </AppCard>
        )}

        {!account ? (
          <AppCard>
            <div className="text-center py-8 space-y-3">
              <h2 className="text-2xl font-medium text-foreground tracking-tight">Welcome to YO Savings</h2>
              <p className="text-sm text-muted-foreground">Connect your wallet to start saving with DeFi yields.</p>
            </div>
          </AppCard>
        ) : (
          <>
            {/* Portfolio overview */}
            <AppCard>
              <PortfolioView />
            </AppCard>

            {/* Balance */}
            <AppCard>
              <BalanceDisplay />
            </AppCard>

            {/* Pending redemption tracker */}
            <RedemptionStatus />

            {/* SIWE Auth */}
            <AppCard>
              <SiweLoginButton />
            </AppCard>

            {/* Vault selector */}
            <AppCard>
              <VaultSelector />
            </AppCard>

            {/* Cross-chain deposit */}
            <AppCard>
              <CrossChainDeposit />
            </AppCard>

            {/* Standard Deposit / Withdraw */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AppCard>
                <DepositForm />
              </AppCard>
              <AppCard>
                <WithdrawForm />
              </AppCard>
            </div>

            {/* Recurring deposits */}
            <AppCard>
              <RecurringSettings />
            </AppCard>

            {/* Transaction history */}
            <AppCard>
              <TransactionHistory />
            </AppCard>
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
