import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GameCard from "@/components/GameCard";
import { games } from "@/data/games";
import codBg from "@/assets/cod-bg.mp4";

const GamesPage = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={codBg} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="pt-28 pb-24">
          <div className="container mx-auto px-6">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              GAME <span className="neon-text">LIBRARY</span>
            </h1>
            <p className="text-muted-foreground mb-12 max-w-lg">All games work offline. No internet, no ads, no nonsense.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {games.map((game) => (
                <GameCard key={game.slug} {...game} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default GamesPage;
