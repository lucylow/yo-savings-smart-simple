import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/60 glass">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="font-display text-xl font-bold text-foreground tracking-tight">
          YO<span className="text-primary">.</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">Features</a>
          <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">Demo</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">How it works</a>
        </div>

        <motion.a
          href="/app"
          className="hidden md:inline-flex h-10 px-5 items-center rounded-xl bg-primary text-primary-foreground text-sm font-bold"
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          Launch App
        </motion.a>

        <button
          className="md:hidden text-foreground p-2 -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-background/95 glass overflow-hidden"
          >
            <div className="p-4 space-y-1">
              <a href="#features" className="block py-2.5 px-3 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors" onClick={() => setMenuOpen(false)}>Features</a>
              <a href="#demo" className="block py-2.5 px-3 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors" onClick={() => setMenuOpen(false)}>Demo</a>
              <a href="#how-it-works" className="block py-2.5 px-3 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors" onClick={() => setMenuOpen(false)}>How it works</a>
              <div className="pt-2 border-t border-border mt-2">
                <a href="/app" className="block py-2.5 px-3 text-sm font-bold text-primary" onClick={() => setMenuOpen(false)}>
                  Launch App →
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
