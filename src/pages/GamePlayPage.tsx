import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { games } from "@/data/games";
import SnakeGame from "@/components/games/SnakeGame";
import TicTacToeGame from "@/components/games/TicTacToeGame";
import MemoryGame from "@/components/games/MemoryGame";
import Game2048 from "@/components/games/Game2048";
import TempleRunGame from "@/components/games/TempleRunGame";
import { ArrowLeft } from "lucide-react";

const gameComponents: Record<string, React.FC> = {
  snake: SnakeGame,
  "tic-tac-toe": TicTacToeGame,
  memory: MemoryGame,
  "2048": Game2048,
  "temple-run": TempleRunGame,
};

const GamePlayPage = () => {
  const { slug } = useParams();
  const game = games.find((g) => g.slug === slug);
  const GameComponent = slug ? gameComponents[slug] : null;

  if (!game || !GameComponent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-foreground mb-4">Game not found</h1>
          <Link to="/games" className="text-primary hover:underline">Back to Games</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <Link to="/games" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Games
          </Link>
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">{game.icon}</span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">{game.title}</h1>
            <p className="text-muted-foreground text-sm">{game.instructions}</p>
          </div>
          <div className="flex justify-center">
            <GameComponent />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GamePlayPage;
