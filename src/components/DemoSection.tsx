import SavingsWidget from "./SavingsWidget";

const DemoSection = () => {
  return (
    <section id="demo" className="py-24">
      <div className="container">
        <div className="text-center max-w-lg mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-medium text-foreground">
            Try the widget
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Experience the simplicity. Click deposit/withdraw to see how it feels.
          </p>
          <p className="text-xs text-muted-foreground/60">
            This is a simulation — real transactions happen onchain in the live app.
          </p>
        </div>

        <SavingsWidget />
      </div>
    </section>
  );
};

export default DemoSection;
