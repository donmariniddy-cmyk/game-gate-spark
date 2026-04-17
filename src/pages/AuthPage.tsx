import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gamepad2, Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/games");
    });
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/games`,
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Account created!",
      description: "Now request access via the pricing page. Admin will unlock your games.",
    });
    navigate("/pricing");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Welcome back!" });
    navigate("/games");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex flex-col items-center mb-8">
          <Gamepad2 className="w-12 h-12 text-primary mb-3" />
          <h1 className="font-heading text-3xl font-black text-foreground">
            <em>NAAMS <span className="neon-text">play</span></em>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to play</p>
        </Link>

        <div className="bg-card border border-border rounded-xl p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <EmailField email={email} setEmail={setEmail} />
                <PasswordField
                  password={password}
                  setPassword={setPassword}
                  show={showPassword}
                  setShow={setShowPassword}
                />
                <Button type="submit" className="w-full font-heading tracking-wider" disabled={loading}>
                  {loading ? "Signing in..." : "LOG IN"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Full name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>
                <EmailField email={email} setEmail={setEmail} />
                <PasswordField
                  password={password}
                  setPassword={setPassword}
                  show={showPassword}
                  setShow={setShowPassword}
                />
                <Button type="submit" className="w-full font-heading tracking-wider" disabled={loading}>
                  {loading ? "Creating..." : "CREATE ACCOUNT"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-muted-foreground text-xs text-center mt-6">
          All games are locked until an admin grants access.
        </p>
      </div>
    </div>
  );
};

const EmailField = ({ email, setEmail }: { email: string; setEmail: (v: string) => void }) => (
  <div>
    <label className="text-sm text-muted-foreground mb-1 block">Email</label>
    <div className="relative">
      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="pl-10"
        placeholder="you@email.com"
        required
      />
    </div>
  </div>
);

const PasswordField = ({
  password,
  setPassword,
  show,
  setShow,
}: {
  password: string;
  setPassword: (v: string) => void;
  show: boolean;
  setShow: (v: boolean) => void;
}) => (
  <div>
    <label className="text-sm text-muted-foreground mb-1 block">Password</label>
    <div className="relative">
      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
      <Input
        type={show ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="pl-10 pr-10"
        placeholder="••••••••"
        minLength={6}
        required
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
);

export default AuthPage;
