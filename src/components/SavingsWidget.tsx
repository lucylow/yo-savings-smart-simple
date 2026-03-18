import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const springTransition = { type: "spring" as const, stiffness: 400, damping: 25 };

const SavingsWidget = () => {
  const [balance, setBalance] = useState(1234.56);
  const [available, setAvailable] = useState(800.0);
  const [dailyEarned, setDailyEarned] = useState(0.42);
  const [toast, setToast] = useState<string | null>(null);
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [flash, setFlash] = useState(false);

  // Animate balance display
  useEffect(() => {
    const start = displayBalance;
    const end = balance;
    const duration = 600;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayBalance(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };

    setFlash(true);
    setTimeout(() => setFlash(false), 400);
    requestAnimationFrame(animate);
  }, [balance]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleDeposit = () => {
    const amount = 100 + Math.random() * 200;
    setBalance((b) => +(b + amount).toFixed(2));
    setAvailable((a) => +(a + amount * 0.65).toFixed(2));
    setDailyEarned((d) => +(d + amount * 0.00014).toFixed(2));
    showToast(`+$${amount.toFixed(2)} deposited`);
  };

  const handleWithdraw = () => {
    if (available < 50) {
      showToast("Insufficient available balance");
      return;
    }
    const amount = Math.min(50 + Math.random() * 100, available);
    setBalance((b) => +(b - amount).toFixed(2));
    setAvailable((a) => +(a - amount).toFixed(2));
    setDailyEarned((d) => +Math.max(0, d - amount * 0.00014).toFixed(2));
    showToast(`-$${amount.toFixed(2)} withdrawn`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="w-full max-w-[340px] mx-auto"
    >
      {/* Outer shell */}
      <div className="bg-card border border-border rounded-2xl sm:rounded-outer p-1.5 sm:p-2 shadow-heavy">
        {/* Inner surface */}
        <div className="bg-card-elevated rounded-xl sm:rounded-lg p-5 sm:p-6 shadow-inset border border-border space-y-5 sm:space-y-6">
          {/* Connection status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs text-muted-foreground font-medium">Connected</span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">0x742...d3E2</span>
          </div>

          {/* Balance */}
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
              Total Savings
            </p>
            <h2
              className={`text-3xl sm:text-4xl font-medium tracking-tighter tabular-nums transition-colors duration-300 ${
                flash ? "text-primary" : "text-foreground"
              }`}
            >
              ${displayBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-xs text-muted-foreground">+${dailyEarned.toFixed(2)} earned today</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-lime-dim text-primary text-xs font-medium">
                5.2% APY
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <motion.button
              onClick={handleDeposit}
              className="h-11 sm:h-12 bg-primary text-primary-foreground font-bold rounded-xl text-sm active:scale-95 transition-transform"
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              transition={springTransition}
            >
              Deposit
            </motion.button>
            <motion.button
              onClick={handleWithdraw}
              className="h-11 sm:h-12 bg-secondary border border-border text-foreground font-bold rounded-xl text-sm hover:bg-muted active:scale-95 transition-all"
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              transition={springTransition}
            >
              Withdraw
            </motion.button>
          </div>

          {/* Vault info */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Vault</span>
              <span className="text-xs text-foreground font-medium">Base Yield Optimizer</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Available to withdraw</span>
              <span className="text-xs text-foreground font-medium tabular-nums">
                ${available.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="text-center text-xs font-medium text-primary bg-lime-dim rounded-lg py-2"
              >
                {toast}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SavingsWidget;
