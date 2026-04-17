import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { games } from "@/data/games";
import { Gamepad2, Users, CreditCard, BarChart3, Shield, LogOut, Plus, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [gameAccess, setGameAccess] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New payment form
  const [newPaymentEmail, setNewPaymentEmail] = useState("");
  const [newPaymentName, setNewPaymentName] = useState("");

  // Grant access form
  const [accessEmail, setAccessEmail] = useState("");
  const [accessGame, setAccessGame] = useState("");

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin");
      return;
    }
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      await supabase.auth.signOut();
      navigate("/admin");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const [profilesRes, paymentsRes, accessRes, visitsRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("payment_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("game_access").select("*").order("granted_at", { ascending: false }),
      supabase.from("site_visits").select("*").order("visited_at", { ascending: false }).limit(100),
    ]);
    setProfiles(profilesRes.data || []);
    setPayments(paymentsRes.data || []);
    setGameAccess(accessRes.data || []);
    setVisits(visitsRes.data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const confirmPayment = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase
      .from("payment_requests")
      .update({ status: "confirmed", confirmed_at: new Date().toISOString(), confirmed_by: session?.user.id })
      .eq("id", id);
    if (!error) {
      toast({ title: "Payment confirmed!" });
      fetchData();
    }
  };

  const rejectPayment = async (id: string) => {
    const { error } = await supabase
      .from("payment_requests")
      .update({ status: "rejected" })
      .eq("id", id);
    if (!error) {
      toast({ title: "Payment rejected" });
      fetchData();
    }
  };

  const addPaymentRequest = async () => {
    if (!newPaymentEmail) return;
    const { error } = await supabase
      .from("payment_requests")
      .insert({ user_email: newPaymentEmail, user_name: newPaymentName || null });
    if (!error) {
      toast({ title: "Payment request added" });
      setNewPaymentEmail("");
      setNewPaymentName("");
      fetchData();
    }
  };

  const grantAccess = async () => {
    if (!accessEmail || !accessGame) return;
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase
      .from("game_access")
      .insert({ user_email: accessEmail, game_slug: accessGame, granted_by: session?.user.id });
    if (!error) {
      toast({ title: `Access granted for ${accessGame}` });
      setAccessEmail("");
      setAccessGame("");
      fetchData();
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const grantAllAccess = async () => {
    if (!accessEmail) return;
    const { data: { session } } = await supabase.auth.getSession();
    const inserts = games.map(g => ({
      user_email: accessEmail,
      game_slug: g.slug,
      granted_by: session?.user.id,
    }));
    const { error } = await supabase.from("game_access").upsert(inserts, { onConflict: "user_email,game_slug" });
    if (!error) {
      toast({ title: `All games access granted for ${accessEmail}` });
      setAccessEmail("");
      fetchData();
    }
  };

  const revokeAccess = async (id: string) => {
    const { error } = await supabase.from("game_access").delete().eq("id", id);
    if (!error) {
      toast({ title: "Access revoked" });
      fetchData();
    }
  };

  // Analytics
  const totalVisits = visits.length;
  const todayVisits = visits.filter(v => new Date(v.visited_at).toDateString() === new Date().toDateString()).length;
  const pendingPayments = payments.filter(p => p.status === "pending").length;
  const confirmedPayments = payments.filter(p => p.status === "confirmed").length;

  const pageVisitCounts = visits.reduce((acc: Record<string, number>, v) => {
    acc[v.page] = (acc[v.page] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-heading text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-heading text-lg font-bold">
              <em>NAAMS <span className="neon-text">play</span></em> — Admin
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-primary mx-auto mb-1" />
              <div className="text-2xl font-heading font-bold text-foreground">{profiles.length}</div>
              <div className="text-xs text-muted-foreground">Users</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <CreditCard className="w-6 h-6 text-primary mx-auto mb-1" />
              <div className="text-2xl font-heading font-bold text-foreground">{pendingPayments}</div>
              <div className="text-xs text-muted-foreground">Pending Payments</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Gamepad2 className="w-6 h-6 text-primary mx-auto mb-1" />
              <div className="text-2xl font-heading font-bold text-foreground">{gameAccess.length}</div>
              <div className="text-xs text-muted-foreground">Game Grants</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 text-primary mx-auto mb-1" />
              <div className="text-2xl font-heading font-bold text-foreground">{totalVisits}</div>
              <div className="text-xs text-muted-foreground">Total Visits</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="payments" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="access">Game Access</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card className="bg-card border-border mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Add Payment Request</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-2">
                <Input placeholder="User email" value={newPaymentEmail} onChange={e => setNewPaymentEmail(e.target.value)} />
                <Input placeholder="User name (optional)" value={newPaymentName} onChange={e => setNewPaymentName(e.target.value)} />
                <Button onClick={addPaymentRequest} className="shrink-0">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="text-xs">{p.user_email}</TableCell>
                        <TableCell>{p.user_name || "-"}</TableCell>
                        <TableCell>TZS {p.amount?.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            p.status === "confirmed" ? "bg-primary/20 text-primary" :
                            p.status === "rejected" ? "bg-destructive/20 text-destructive" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {p.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {p.status === "pending" && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => confirmPayment(p.id)}>
                                <Check className="w-4 h-4 text-primary" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => rejectPayment(p.id)}>
                                <X className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {payments.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No payment requests yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Game Access Tab */}
          <TabsContent value="access">
            <Card className="bg-card border-border mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Grant Game Access</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-2">
                <Input placeholder="User email" value={accessEmail} onChange={e => setAccessEmail(e.target.value)} />
                <select
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={accessGame}
                  onChange={e => setAccessGame(e.target.value)}
                >
                  <option value="">Select game</option>
                  {games.map(g => (
                    <option key={g.slug} value={g.slug}>{g.title}</option>
                  ))}
                </select>
                <Button onClick={grantAccess} className="shrink-0">
                  <Plus className="w-4 h-4 mr-1" /> Grant
                </Button>
                <Button onClick={grantAllAccess} variant="secondary" className="shrink-0">
                  Grant All Games
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Game</TableHead>
                      <TableHead>Granted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gameAccess.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="text-xs">{a.user_email}</TableCell>
                        <TableCell>{games.find(g => g.slug === a.game_slug)?.title || a.game_slug}</TableCell>
                        <TableCell className="text-xs">{new Date(a.granted_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => revokeAccess(a.id)}>
                            <X className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {gameAccess.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No access granted yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map(p => {
                      const userGrants = gameAccess.filter(a => a.user_email === p.email);
                      const granted = userGrants.length > 0;
                      return (
                        <TableRow key={p.id}>
                          <TableCell className="text-xs">{p.email}</TableCell>
                          <TableCell>{p.full_name || "-"}</TableCell>
                          <TableCell className="text-xs">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className={`text-xs px-2 py-1 rounded-full ${granted ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                              {granted ? `Unlocked (${userGrants.length})` : "Locked"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {granted ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={async () => {
                                  const { error } = await supabase.from("game_access").delete().eq("user_email", p.email);
                                  if (!error) {
                                    toast({ title: `Access revoked for ${p.email}` });
                                    fetchData();
                                  }
                                }}
                              >
                                <X className="w-4 h-4 text-destructive mr-1" /> Revoke
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={async () => {
                                  const { data: { session } } = await supabase.auth.getSession();
                                  const inserts = games.map(g => ({
                                    user_email: p.email,
                                    game_slug: g.slug,
                                    granted_by: session?.user.id,
                                  }));
                                  const { error } = await supabase
                                    .from("game_access")
                                    .upsert(inserts, { onConflict: "user_email,game_slug" });
                                  if (!error) {
                                    toast({ title: `Access granted for ${p.email}` });
                                    fetchData();
                                  } else {
                                    toast({ title: "Error", description: error.message, variant: "destructive" });
                                  }
                                }}
                              >
                                <Check className="w-4 h-4 mr-1" /> Grant Access
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {profiles.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No users yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card border-border">
                <CardHeader><CardTitle className="text-lg">Overview</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Visits</span><span className="font-bold text-foreground">{totalVisits}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Today's Visits</span><span className="font-bold text-foreground">{todayVisits}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Users</span><span className="font-bold text-foreground">{profiles.length}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Confirmed Payments</span><span className="font-bold text-primary">{confirmedPayments}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Pending Payments</span><span className="font-bold text-foreground">{pendingPayments}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Revenue (TZS)</span><span className="font-bold text-primary">{(confirmedPayments * 50000).toLocaleString()}</span></div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader><CardTitle className="text-lg">Page Visits</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(pageVisitCounts).sort(([,a],[,b]) => (b as number) - (a as number)).map(([page, count]) => (
                    <div key={page} className="flex justify-between">
                      <span className="text-muted-foreground text-sm">{page}</span>
                      <span className="font-bold text-foreground">{count as number}</span>
                    </div>
                  ))}
                  {Object.keys(pageVisitCounts).length === 0 && (
                    <p className="text-muted-foreground text-sm">No visit data yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
