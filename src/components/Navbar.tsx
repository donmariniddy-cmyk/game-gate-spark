import { Link, useNavigate } from "react-router-dom";
import { Gamepad2, LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out" });
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <span className="font-heading text-xl font-bold tracking-wider text-foreground">
            <em>NAAMS <span className="neon-text">play</span></em>
          </span>
        </Link>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors font-medium">Home</Link>
          <Link to="/games" className="text-muted-foreground hover:text-primary transition-colors font-medium">Games</Link>
          <Link to="/browser-games" className="text-muted-foreground hover:text-primary transition-colors font-medium">Browser Games</Link>
          <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors font-medium">Pricing</Link>
          <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors font-medium">Contact</Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-muted-foreground max-w-40 truncate" title={user.email}>
                <UserIcon className="w-3.5 h-3.5" />
                {user.email}
              </span>
              <Button size="sm" variant="ghost" onClick={handleLogout} aria-label="Log out">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-primary text-primary-foreground font-heading font-bold px-6 py-2 rounded-md hover:shadow-[0_0_20px_hsl(120_100%_50%/0.5)] transition-all text-sm tracking-wider"
            >
              LOGIN / SIGN UP
            </Link>
          )}
        </div>
      </div>
      {menuOpen && <div className="lg:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4">
        {[["/", "Home"], ["/games", "Games"], ["/browser-games", "Browser Games"], ["/pricing", "Pricing"], ["/contact", "Contact"]].map(([path, label]) => <Link key={path} to={path} onClick={() => setMenuOpen(false)} className="text-foreground">{label}</Link>)}
        {user ? <Button variant="outline" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" />Log out</Button> : <Button asChild><Link to="/auth" onClick={() => setMenuOpen(false)}>Login / Sign Up</Link></Button>}
      </div>}
    </nav>
  );
};

export default Navbar;
