import { motion } from "framer-motion";
import SavingsWidget from "./SavingsWidget";

const DemoSection = () => {
  return (
    <section id="demo" className="py-16 sm:py-24">
      <div className="container px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg mx-auto mb-8 sm:mb-12 space-y-3"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Interactive Demo</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Try the widget
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Experience the simplicity. Click deposit/withdraw to see how it feels.
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground/60">
            This is a simulation — real transactions happen onchain in the live app.
          </p>
        </motion.div>

        <SavingsWidget />
      </div>
    </section>
  );
};

export default DemoSection;
