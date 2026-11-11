import { useParams, Link } from "react-router-dom";
import { useBrowserGames } from "@/hooks/useCatalog";
import CatalogStatus from "@/components/CatalogStatus";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Star, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";

const BrowserGamePlayPage = () => {
  const { id } = useParams<{ id: string }>();
  const { games: html5Games, isLoading, isError, refetch } = useBrowserGames();
  const game = html5Games.find((g) => g.id === id || (id === "snake" && g.id === "snake-html5") || (id === "tetris" && g.id === "block-puzzle"));
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setLoaded(false); const timer = setTimeout(() => setLoaded(true), 15000); return () => clearTimeout(timer); }, [id]);
  if (isLoading || isError) return <CatalogStatus loading={isLoading} error={isError} retry={() => void refetch()} />;
  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-foreground mb-4">Game Not Found</h1>
          <Link to="/browser-games" className="text-primary hover:underline">
            ← Back to Browser Games
          </Link>
        </div>
      </div>
    );
  }

  const handleFullscreen = () => {
    void iframeRef.current?.requestFullscreen?.().catch(() => {});
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link to="/browser-games">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                {game.title}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="outline" className="capitalize text-xs font-heading border-border">
                  {game.category}
                </Badge>
                <div className="flex items-center gap-1 text-primary">
                  <Star className="w-3.5 h-3.5 fill-primary" />
                  <span className="text-xs font-heading">{game.rating}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleFullscreen} className="hidden sm:flex gap-2">
              <Maximize2 className="w-4 h-4" />
              Fullscreen
            </Button>
          </div>

          {/* Game iframe */}
          <div className="relative w-full rounded-lg overflow-hidden border border-border bg-card" style={{ minHeight: "70vh" }}>
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
                <div className="text-center">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground font-heading text-sm">Loading game...</p>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={game.embedUrl}
              title={game.title}
              className="w-full border-0"
              style={{ height: "70vh" }}
              allowFullScreen
              onLoad={() => setLoaded(true)}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3"><Button variant="outline" onClick={() => { setLoaded(false); if (iframeRef.current) iframeRef.current.src = game.embedUrl; }}>Reload game</Button><span className="text-muted-foreground text-sm">External games need internet and may include provider advertisements.</span></div>
          <p className="text-muted-foreground text-sm mt-4">{game.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BrowserGamePlayPage;
