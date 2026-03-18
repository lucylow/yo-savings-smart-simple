import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Connect wallet",
    desc: "Use MetaMask, WalletConnect, or any mobile wallet.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M16 10a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Deposit funds",
    desc: "Your assets are deposited into YO vaults and start earning yield.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 7l-5-5-5 5" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Watch it grow",
    desc: "Check daily earnings, withdraw anytime with clear redemption status.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Get Started</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Three steps to smarter savings
          </h2>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-[2.75rem] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
                className="relative text-center space-y-4"
              >
                {/* Step number ring */}
                <div className="relative mx-auto w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-primary shadow-heavy">
                  {s.icon}
                </div>

                <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                  Step {s.num}
                </span>
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px] mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
