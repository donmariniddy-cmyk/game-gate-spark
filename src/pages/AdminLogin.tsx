import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gamepad2, Lock, Mail, Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    void supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
      if (data) navigate("/admin/dashboard", { replace: true });
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Check if user has admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      setError("Access denied. You are not an admin.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    navigate("/admin/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Gamepad2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-heading text-3xl font-black text-foreground">
            <em>NAAMS <span className="neon-text">play</span></em>
          </h1>
          <p className="text-muted-foreground mt-2">Admin Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 bg-card border border-border rounded-xl p-6">
          <div>
            <label htmlFor="admin-email" className="text-sm text-muted-foreground mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="admin-email"
                autoComplete="username"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="admin@email.com"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="admin-password" className="text-sm text-muted-foreground mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="admin-password"
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                placeholder="••••••••"
                required
              />
              <Button variant="ghost" size="icon"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 text-muted-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" className="w-full font-heading tracking-wider" disabled={loading}>
            {loading ? "Signing in..." : "SIGN IN"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
