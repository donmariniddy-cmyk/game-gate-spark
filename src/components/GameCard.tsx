import { Link } from "react-router-dom";

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  slug: string;
  color: string;
  cover: string;
}

const GameCard = ({ title, description, slug, cover }: GameCardProps) => {
  return (
    <Link
      to={`/games/${slug}`}
      className="group relative bg-card border border-border rounded-lg overflow-hidden hover:neon-border transition-all duration-300"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs font-heading text-primary tracking-wider">PLAY NOW →</span>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
