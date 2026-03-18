import { motion } from "framer-motion";

const stats = [
  { label: "Total Value Locked", value: "$4.6M" },
  { label: "Current APY", value: "5.2%" },
  { label: "Supported Chains", value: "6" },
  { label: "Active Vaults", value: "2" },
];

const StatsStrip = () => {
  return (
    <section className="py-12 border-y border-border bg-card/30">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center space-y-1"
            >
              <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-display">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
