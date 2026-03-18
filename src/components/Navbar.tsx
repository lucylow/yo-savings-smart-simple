import { useState } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <a href="#" className="font-display text-xl font-bold text-foreground tracking-tight">
          YO<span className="text-primary">.</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Demo</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
        </div>

        <motion.a
          href="#demo"
          className="hidden md:inline-flex h-10 px-5 items-center rounded-lg bg-primary text-primary-foreground text-sm font-bold"
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          Launch App
        </motion.a>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-border bg-background p-4 space-y-3"
        >
          <a href="#features" className="block text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#demo" className="block text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>Demo</a>
          <a href="#how-it-works" className="block text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>How it works</a>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
