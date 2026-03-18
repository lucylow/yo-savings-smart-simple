const Footer = () => {
  return (
    <footer className="border-t border-border py-10">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display text-sm font-bold text-foreground tracking-tight">
          YO<span className="text-primary">.</span> Savings
        </span>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#demo" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Demo</a>
          <a href="#how-it-works" className="text-xs text-muted-foreground hover:text-foreground transition-colors">How it works</a>
        </div>
        <span className="text-xs text-muted-foreground">
          Built for the YO SDK Hackathon · 2026
        </span>
      </div>
    </footer>
  );
};

export default Footer;
