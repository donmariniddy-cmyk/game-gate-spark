import { useBrowserGames } from "@/hooks/useCatalog";
import CatalogStatus from "@/components/CatalogStatus";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories, type Html5Game } from "@/data/html5Games";
import { Search, Star, Flame, Sparkles, Gamepad2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BrowserGamesPage = () => {
  const { games: html5Games, isLoading, isError, refetch } = useBrowserGames();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return html5Games.filter((g) => {
      const matchesSearch =
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "all" || g.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, html5Games]);

  const popular = html5Games.filter((g) => g.isPopular);
  const newGames = html5Games.filter((g) => g.isNew);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 className="w-8 h-8 text-primary" />
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
              BROWSER <span className="neon-text">GAMES</span>
            </h1>
          </div>
          <p className="text-muted-foreground mb-8 max-w-lg">
            HTML5 games • Account and owner approval required • Internet required.
          </p>

          <CatalogStatus loading={isLoading} error={isError} retry={() => void refetch()} />
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search games..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={activeCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.value)}
                  className="font-heading text-xs tracking-wider"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Popular Games */}
          {activeCategory === "all" && !search && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Flame className="w-5 h-5 text-primary" />
                <h2 className="font-heading text-2xl font-bold text-foreground">POPULAR GAMES</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {popular.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </section>
          )}

          {/* New Games */}
          {activeCategory === "all" && !search && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="font-heading text-2xl font-bold text-foreground">NEW GAMES</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </section>
          )}

          {/* All / Filtered */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
              {search || activeCategory !== "all" ? "RESULTS" : "ALL GAMES"}
            </h2>
            {filtered.length === 0 ? (
              <p className="text-muted-foreground">No games found. Try a different search or category.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

function GameCard({ game }: { game: Omit<Html5Game, "category"> & { category: string } }) {
  return (
    <Link
      to={`/browser-games/${game.id}`}
      className="group relative bg-card border border-border rounded-lg overflow-hidden hover:neon-border transition-all duration-300"
    >
      <div className="h-44 overflow-hidden relative">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          {game.isPopular && (
            <Badge className="bg-primary/90 text-primary-foreground text-[10px] font-heading">
              <Flame className="w-3 h-3 mr-1" /> HOT
            </Badge>
          )}
          {game.isNew && (
            <Badge className="bg-accent/90 text-accent-foreground text-[10px] font-heading">
              NEW
            </Badge>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-heading text-lg font-bold text-foreground">{game.title}</h3>
          <div className="flex items-center gap-1 text-primary">
            <Star className="w-3.5 h-3.5 fill-primary" />
            <span className="text-xs font-heading">{game.rating}</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">
          {game.description}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] font-heading capitalize border-border">
            {game.category}
          </Badge>
          <span className="text-xs font-heading text-primary tracking-wider">PLAY NOW →</span>
        </div>
      </div>
    </Link>
  );
}

export default BrowserGamesPage;
