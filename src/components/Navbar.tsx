import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <span className="font-heading text-xl font-bold tracking-wider text-foreground">
            <em>NAAMS <span className="neon-text">play</span></em>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Home
          </Link>
          <Link to="/games" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Games
          </Link>
          <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Pricing
          </Link>
          <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Contact
          </Link>
          <Link
            to="/pricing"
            className="bg-primary text-primary-foreground font-heading font-bold px-6 py-2 rounded-md hover:shadow-[0_0_20px_hsl(120_100%_50%/0.5)] transition-all text-sm tracking-wider"
          >
            GET ACCESS
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
