import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container relative z-10 text-center max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-dim border border-primary/20 text-primary text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Live on Base · 5.2% APY
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-foreground leading-[1.1]">
            Your money,<br />working overtime.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            A high-yield savings vault that lives on your home screen. No jargon, just growth.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <motion.a
              href="#demo"
              className="inline-flex h-12 px-7 items-center rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-drop"
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              Try the Demo
            </motion.a>
            <motion.a
              href="#how-it-works"
              className="inline-flex h-12 px-7 items-center rounded-xl bg-secondary border border-border text-foreground text-sm font-bold"
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              Learn More
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
