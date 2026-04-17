import { Link, useNavigate } from "react-router-dom";
import { Gamepad2, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
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
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors font-medium">Home</Link>
          <Link to="/games" className="text-muted-foreground hover:text-primary transition-colors font-medium">Games</Link>
          <Link to="/browser-games" className="text-muted-foreground hover:text-primary transition-colors font-medium">Browser Games</Link>
          <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors font-medium">Pricing</Link>
          <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors font-medium">Contact</Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <UserIcon className="w-3.5 h-3.5" />
                {user.email}
              </span>
              <Button size="sm" variant="ghost" onClick={handleLogout}>
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
    </nav>
  );
};

export default Navbar;
