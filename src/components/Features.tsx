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
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Trust & transparency",
    description: "Every transaction is shown clearly. You always know where your money is.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24">
      <div className="container">
        <div className="text-center max-w-lg mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-medium text-foreground">
            Designed for everyday savers
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            No complex DeFi jargon. Just a beautiful, simple savings account that grows your money.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="bg-card border border-border rounded-outer p-6 space-y-4 hover:border-primary/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
                {f.icon}
              </div>
              <h3 className="text-lg font-medium text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
