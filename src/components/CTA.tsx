import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-24">
      <div className="container">
        <div className="bg-card border border-border rounded-outer p-10 sm:p-16 text-center max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-medium text-foreground">
            Ready to start saving smarter?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Join the YO ecosystem and build the future of DeFi savings.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <motion.a
              href="#demo"
              className="inline-flex h-12 px-7 items-center rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-drop"
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              Launch App
            </motion.a>
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 px-7 items-center rounded-xl bg-secondary border border-border text-foreground text-sm font-bold"
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              GitHub Repo
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
