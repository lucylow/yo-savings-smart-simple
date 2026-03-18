import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '../config/wagmiConfig';
import { WalletProvider } from '../contexts/WalletContext';
import { VaultProvider } from '../contexts/VaultContext';
import { UserProvider } from '../contexts/UserContext';
import { TransactionProvider } from '../contexts/TransactionContext';
import { motion } from 'framer-motion';

const wagmiQueryClient = new QueryClient();
import AppHeader from '../components/app/AppHeader';
import AppCard from '../components/app/AppCard';
import VaultSelector from '../components/app/VaultSelector';
import BalanceDisplay from '../components/app/BalanceDisplay';
import DepositForm from '../components/app/DepositForm';
import WithdrawForm from '../components/app/WithdrawForm';
import CrossChainDeposit from '../components/app/CrossChainDeposit';
import PortfolioView from '../components/app/PortfolioView';
import RedemptionStatus from '../components/app/RedemptionStatus';
import TransactionHistory from '../components/app/TransactionHistory';
import RecurringSettings from '../components/app/RecurringSettings';
import { useWalletContext } from '../contexts/WalletContext';

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
};

const AppContent = () => {
  const { account, isAuthenticated, error: walletError } = useWalletContext();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-md mx-auto py-6 sm:py-8 space-y-4 pb-24">
        {walletError && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-xs text-destructive">{walletError}</p>
          </div>
        )}

        {!account ? (
          <motion.div {...fadeUp}>
            <AppCard>
              <div className="text-center py-10 space-y-5">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M16 10a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    Welcome to YO
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
                    Connect your wallet to start earning DeFi yields effortlessly.
                  </p>
                </div>

                {/* Feature highlights */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { label: '5.2% APY', sub: 'Current yield' },
                    { label: '6 chains', sub: 'Supported' },
                    { label: 'Instant', sub: 'Withdrawals' },
                  ].map((item) => (
                    <div key={item.label} className="text-center py-2">
                      <p className="text-sm font-bold text-foreground">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AppCard>
          </motion.div>
        ) : (
          <>
            {/* Portfolio overview */}
            <motion.div {...fadeUp}>
              <AppCard>
                <PortfolioView />
              </AppCard>
            </motion.div>

            {/* Balance */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }}>
              <AppCard>
                <BalanceDisplay />
              </AppCard>
            </motion.div>

            {/* Pending redemption tracker */}
            <RedemptionStatus />

            {/* Vault selector */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              <AppCard>
                <VaultSelector />
              </AppCard>
            </motion.div>

            {/* Cross-chain deposit */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
              <AppCard>
                <CrossChainDeposit />
              </AppCard>
            </motion.div>

            {/* Standard Deposit / Withdraw */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
                <AppCard className="h-full">
                  <DepositForm />
                </AppCard>
              </motion.div>
              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.25 }}>
                <AppCard className="h-full">
                  <WithdrawForm />
                </AppCard>
              </motion.div>
            </div>

            {/* Authenticated features */}
            {isAuthenticated && (
              <>
                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }}>
                  <AppCard>
                    <RecurringSettings />
                  </AppCard>
                </motion.div>
                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.35 }}>
                  <AppCard>
                    <TransactionHistory />
                  </AppCard>
                </motion.div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

const AppPage = () => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={wagmiQueryClient}>
        <WalletProvider>
          <UserProvider>
            <TransactionProvider>
              <VaultProvider>
                <AppContent />
              </VaultProvider>
            </TransactionProvider>
          </UserProvider>
        </WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default AppPage;
