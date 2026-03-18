import { motion } from "framer-motion";

const steps = [
  { num: "1", title: "Connect wallet", desc: "Use MetaMask, WalletConnect, or any mobile wallet." },
  { num: "2", title: "Deposit funds", desc: "Your assets are deposited into YO vaults and start earning yield." },
  { num: "3", title: "Watch it grow", desc: "Check daily earnings, withdraw anytime with clear redemption status." },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container">
        <h2 className="text-3xl sm:text-4xl font-medium text-foreground text-center mb-16">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.23, 1, 0.32, 1] }}
              className="text-center space-y-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center mx-auto">
                {s.num}
              </div>
              <h3 className="text-lg font-medium text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
