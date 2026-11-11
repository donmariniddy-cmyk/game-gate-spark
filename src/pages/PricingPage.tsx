import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Zap, Check } from "lucide-react";
import pricingBgVideo from "@/assets/pricing-bg.mp4";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
        src={pricingBgVideo}
      />
      <div className="relative z-10">
      <Navbar />
      <div className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              ONE PRICE. <span className="neon-text">FOREVER.</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">No tricks. Pay once, play forever. All games included.</p>
          </div>

          <div className="max-w-md mx-auto glass rounded-2xl p-6 sm:p-10 neon-box">
            <div className="text-center mb-8">
              <span className="font-heading text-sm tracking-widest text-primary">LIFETIME ACCESS</span>
              <div className="mt-4">
                <span className="font-heading text-5xl sm:text-6xl font-black neon-text">50,000</span>
                <span className="font-heading text-2xl font-bold text-primary ml-2">TZS</span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">One-time payment</p>
            </div>

            <ul className="space-y-4 mb-10">
              {[
                "Access after owner approval",
                "New games added for free",
                "Browser games require internet",
                "External games may show provider ads",
                "Lifetime updates & support",
                "Works on all devices",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-foreground text-sm">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={`https://wa.me/255693711597?text=${encodeURIComponent("Hi! I want to pay 50,000 TZS for full NAAMS play access.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center w-full bg-primary text-primary-foreground font-heading font-bold py-4 rounded-md hover:shadow-[0_0_30px_hsl(120_100%_50%/0.5)] transition-all tracking-wider text-lg"
            >
              <Zap className="w-5 h-5 inline mr-2" />
              PAY 50,000 TZS — GET ACCESS
            </a>

            <p className="text-center text-muted-foreground text-xs mt-4">
              Opens WhatsApp (+255 693 711 597) for payment details. Send your proof of payment there or to donmariniddy@gmail.com and your access is activated.
            </p>
          </div>
        </div>
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default PricingPage;
