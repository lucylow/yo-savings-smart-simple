import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    title: "Mobile‑first",
    description: "Install on your home screen like a native app. Check your savings in seconds.",
    accent: "from-primary/20 to-transparent",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    title: "Competitive yields",
    description: "Your deposits work in YO vaults, earning risk‑adjusted yield across top chains.",
    accent: "from-emerald-500/20 to-transparent",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Trust & transparency",
    description: "Every transaction is shown clearly. You always know where your money is.",
    accent: "from-blue-500/20 to-transparent",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg mx-auto mb-16 space-y-4"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Why YO</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Designed for everyday savers
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            No complex DeFi jargon. Just a beautiful, simple savings account that grows your money.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.23, 1, 0.32, 1] }}
              className="group relative bg-card border border-border rounded-outer p-6 space-y-4 hover:border-primary/30 transition-all duration-300 overflow-hidden"
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 bg-gradient-to-b ${f.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors duration-300">
                  {f.icon}
                </div>
              </div>
              <h3 className="relative text-lg font-bold text-foreground">{f.title}</h3>
              <p className="relative text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
