import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsStrip from "@/components/StatsStrip";
import Features from "@/components/Features";
import DemoSection from "@/components/DemoSection";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <StatsStrip />
      <Features />
      <DemoSection />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
