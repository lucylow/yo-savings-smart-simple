const Footer = () => {
  return (
    <footer className="border-t border-border py-8 sm:py-10">
      <div className="container px-4 sm:px-6 flex flex-col items-center gap-4 sm:gap-0 sm:flex-row sm:justify-between">
        <span className="font-display text-sm font-bold text-foreground tracking-tight">
          YO<span className="text-primary">.</span> Savings
        </span>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#demo" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Demo</a>
          <a href="#how-it-works" className="text-xs text-muted-foreground hover:text-foreground transition-colors">How it works</a>
        </div>
        <span className="text-[10px] sm:text-xs text-muted-foreground text-center">
          Built for the YO SDK Hackathon · 2026
        </span>
      </div>
    </footer>
  );
};

export default Footer;
