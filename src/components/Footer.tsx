const Footer = () => {
  return (
    <footer className="border-t border-border py-8">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display text-sm font-bold text-foreground tracking-tight">
          YO<span className="text-primary">.</span> Savings
        </span>
        <span className="text-xs text-muted-foreground">
          Built for the YO SDK Hackathon · 2026
        </span>
      </div>
    </footer>
  );
};

export default Footer;
