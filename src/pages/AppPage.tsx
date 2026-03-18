import { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '../config/wagmiConfig';
import { WalletProvider } from '../contexts/WalletContext';
import { VaultProvider } from '../contexts/VaultContext';
import { UserProvider } from '../contexts/UserContext';
import { TransactionProvider } from '../contexts/TransactionContext';
import { motion, AnimatePresence } from 'framer-motion';

const wagmiQueryClient = new QueryClient();
import AppHeader from '../components/app/AppHeader';
import AppCard from '../components/app/AppCard';
import BottomNav from '../components/app/BottomNav';
import VaultSelector from '../components/app/VaultSelector';
import BalanceDisplay from '../components/app/BalanceDisplay';
import DepositForm from '../components/app/DepositForm';
import WithdrawForm from '../components/app/WithdrawForm';
import CrossChainDeposit from '../components/app/CrossChainDeposit';
import PortfolioView from '../components/app/PortfolioView';
import RedemptionStatus from '../components/app/RedemptionStatus';
import TransactionHistory from '../components/app/TransactionHistory';
import RecurringSettings from '../components/app/RecurringSettings';
import SettingsView from '../components/app/SettingsView';
import { useWalletContext } from '../contexts/WalletContext';
import { formatAddress } from '../utils/formatters';

const tabVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const AppContent = () => {
  const { account, isAuthenticated, isMock, error: walletError } = useWalletContext();
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container max-w-md mx-auto px-4 py-5 pb-24 min-h-[calc(100dvh-4rem)]">
        {walletError && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 mb-4">
            <p className="text-xs text-destructive">{walletError}</p>
          </div>
        )}

        {!account ? (
          /* Welcome / Onboarding */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AppCard>
              <div className="text-center py-8 space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M16 10a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    Save Smarter with DeFi Yields
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-[260px] mx-auto leading-relaxed">
                    Earn up to 5% APY on your savings. Real transactions, real yield.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  {[
                    { label: '5.2%', sub: 'APY' },
                    { label: '6', sub: 'Chains' },
                    { label: '24/7', sub: 'Withdrawals' },
                  ].map((item) => (
                    <div key={item.label} className="py-3 rounded-xl bg-secondary border border-border">
                      <p className="text-base font-bold text-foreground">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AppCard>
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <motion.div
                  key="home"
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Greeting */}
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-xs text-muted-foreground">Welcome back</p>
                      <p className="text-sm font-bold text-foreground font-mono">{formatAddress(account)}</p>
                    </div>
                    {isMock && (
                      <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">DEMO MODE</span>
                    )}
                  </div>

                  {/* Balance card with gradient */}
                  <AppCard>
                    <BalanceDisplay />
                  </AppCard>

                  {/* Pending redemption */}
                  <RedemptionStatus />

                  {/* Vault selector as cards */}
                  <AppCard>
                    <VaultSelector />
                  </AppCard>

                  {/* Deposit / Withdraw */}
                  <AppCard>
                    <DepositForm />
                  </AppCard>
                  <AppCard>
                    <WithdrawForm />
                  </AppCard>

                  {/* Cross-chain */}
                  <AppCard>
                    <CrossChainDeposit />
                  </AppCard>

                  {/* Recurring (auth only) */}
                  {isAuthenticated && (
                    <AppCard>
                      <RecurringSettings />
                    </AppCard>
                  )}

                  {/* Quick recent transactions */}
                  {isAuthenticated && (
                    <AppCard>
                      <TransactionHistory />
                    </AppCard>
                  )}
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <AppCard>
                    <PortfolioView />
                  </AppCard>
                  <AppCard>
                    <TransactionHistory />
                  </AppCard>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  <SettingsView />
                </motion.div>
              )}
            </AnimatePresence>

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
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
