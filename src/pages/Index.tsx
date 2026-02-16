import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GameCard from "@/components/GameCard";
import { games } from "@/data/games";
import { Zap, Shield, Wifi, WifiOff } from "lucide-react";
import heroVideo from "@/assets/hero-drift.mp4";
import heroBmw from "@/assets/hero-bmw-racing.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src={heroBmw}
          alt="Two modified BMW cars racing each other at night"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        <div className="relative z-10 container mx-auto px-6 text-center pt-20">
          <div className="inline-block mb-6 px-4 py-2 rounded-full border border-primary/30 bg-primary/5">
            <span className="font-heading text-xs tracking-widest text-primary">⚡ UNLIMITED OFFLINE GAMES</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 text-foreground leading-tight">
            PLAY WITHOUT <br />
            <span className="neon-text">LIMITS</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            One-time $20 access. No ads, no subscriptions, no internet required.
            Premium offline games, forever yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pricing"
              className="bg-primary text-primary-foreground font-heading font-bold px-10 py-4 rounded-md hover:shadow-[0_0_30px_hsl(120_100%_50%/0.5)] transition-all text-lg tracking-wider"
            >
              GET ACCESS — $20
            </Link>
            <Link
              to="/games"
              className="border border-border text-foreground font-heading font-bold px-10 py-4 rounded-md hover:bg-secondary transition-all text-lg tracking-wider"
            >
              VIEW GAMES
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: WifiOff, title: "100% Offline", desc: "No internet needed. Play anywhere, anytime." },
              { icon: Shield, title: "One-Time Payment", desc: "Pay $20 once. No subscriptions, no hidden fees." },
              { icon: Zap, title: "Instant Access", desc: "Start playing immediately after purchase." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass rounded-lg p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Preview */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              FEATURED <span className="neon-text">GAMES</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Classic games reimagined with a neon twist. More games added regularly.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard key={game.slug} {...game} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section id="pricing" className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-lg mx-auto text-center glass rounded-2xl p-12 neon-box">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">LIFETIME ACCESS</h2>
            <div className="mb-6">
              <span className="font-heading text-6xl font-black neon-text">$20</span>
              <p className="text-muted-foreground mt-2">One-time payment • Forever yours</p>
            </div>
            <ul className="text-left space-y-3 mb-8 text-sm">
              {["All current & future games", "No ads, ever", "Works 100% offline", "Instant access", "Lifetime updates"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-foreground">
                  <Zap className="w-4 h-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/pricing"
              className="block w-full bg-primary text-primary-foreground font-heading font-bold py-4 rounded-md hover:shadow-[0_0_30px_hsl(120_100%_50%/0.5)] transition-all tracking-wider"
            >
              GET ACCESS NOW
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
