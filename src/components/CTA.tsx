import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-card border border-border rounded-outer p-10 sm:p-16 text-center max-w-2xl mx-auto overflow-hidden noise"
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />
          </div>

          <div className="relative space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Ready to start saving
              <br />
              <span className="text-gradient-primary">smarter?</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Join the YO ecosystem and let your money work harder, every single day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <motion.a
                href="/app"
                className="inline-flex h-13 px-8 items-center rounded-2xl bg-primary text-primary-foreground text-sm font-bold shadow-glow"
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                Launch App →
              </motion.a>
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 px-8 items-center rounded-2xl bg-secondary/50 border border-border text-foreground text-sm font-bold"
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                View on GitHub
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
