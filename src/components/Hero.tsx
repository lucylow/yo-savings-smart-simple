import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center pt-16 overflow-hidden">
      {/* Multi-layer glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[350px] sm:h-[500px] rounded-full bg-primary/8 blur-[120px] sm:blur-[150px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[200px] sm:h-[300px] rounded-full bg-primary/5 blur-[80px] sm:blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container relative z-10 text-center max-w-3xl mx-auto px-5 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] sm:text-xs font-medium"
          >
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-full w-full bg-primary" />
            </span>
            Live on Base · 5.2% APY
          </motion.div>

          {/* Heading */}
          <h1 className="text-[2.5rem] leading-[1.08] sm:text-6xl md:text-7xl font-bold text-foreground sm:leading-[1.05]">
            Your money,
            <br />
            <span className="text-gradient-primary">working overtime.</span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-[300px] sm:max-w-md mx-auto">
            A high-yield savings vault that lives on your home screen.
            No jargon, just growth.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 sm:pt-2">
            <motion.a
              href="/app"
              className="w-full sm:w-auto inline-flex h-12 sm:h-13 px-8 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-sm font-bold shadow-glow hover:shadow-[0_0_80px_-12px_hsl(72_100%_60%_/_0.3)] transition-shadow duration-300"
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              Launch App →
            </motion.a>
            <motion.a
              href="#demo"
              className="w-full sm:w-auto inline-flex h-12 sm:h-13 px-8 items-center justify-center rounded-2xl bg-secondary/50 border border-border text-foreground text-sm font-bold"
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              Try the Demo
            </motion.a>
          </div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="pt-4 sm:pt-8"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-muted-foreground">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
