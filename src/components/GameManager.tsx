import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCatalog } from "@/hooks/useCatalog";
import { supabase } from "@/integrations/supabase/client";
import type { CatalogGame } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import CatalogStatus from "./CatalogStatus";

const blank = { slug: "", title: "", description: "", kind: "browser", category: "arcade", image_url: "", embed_url: "", instructions: "", sort_order: 0, is_active: true, is_popular: false, is_new: false };
export default function GameManager() {
  const query = useCatalog(true);
  const cache = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(blank);
  const refresh = () => cache.invalidateQueries({ queryKey: ["catalog"] });
  function edit(game?: CatalogGame) {
    setEditing(game?.id ?? null);
    setForm(game ? { ...blank, ...game, image_url: game.image_url ?? "", embed_url: game.embed_url ?? "" } : blank);
    setOpen(true);
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) { toast({ title: "Use a short game address with lowercase letters, numbers and hyphens", variant: "destructive" }); return; }
    if (form.kind === "browser" && !form.embed_url.startsWith("https://")) { toast({ title: "A secure HTTPS game embed address is required", variant: "destructive" }); return; }
    setSaving(true);
    const payload = { ...form, title: form.title.trim(), image_url: form.image_url || null, embed_url: form.embed_url || null };
    const { error } = editing ? await supabase.from("games").update(payload).eq("id", editing) : await supabase.from("games").insert(payload);
    setSaving(false);
    if (error) { toast({ title: "Game could not be saved", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Game saved" }); setOpen(false); void refresh();
  }
  async function toggle(game: CatalogGame) {
    const { error } = await supabase.from("games").update({ is_active: !game.is_active }).eq("id", game.id);
    if (error) toast({ title: "Change failed", description: error.message, variant: "destructive" });
    else { toast({ title: game.is_active ? "Game hidden" : "Game shown" }); void refresh(); }
  }
  async function remove(game: CatalogGame) {
    if (!window.confirm(`Delete ${game.title}? This cannot be undone.`)) return;
    const { error } = await supabase.from("games").delete().eq("id", game.id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Game deleted" }); void refresh(); }
  }
  return <section>
    <div className="flex items-center justify-between mb-4"><h2 className="font-heading text-xl">Games</h2><Button onClick={() => edit()}>Add game</Button></div>
    <CatalogStatus loading={query.isLoading} error={query.isError} retry={() => void query.refetch()} />
    <Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
      <TableBody>{query.data?.map(game => <TableRow key={game.id}><TableCell>{game.title}</TableCell><TableCell>{game.kind}</TableCell><TableCell>{game.is_active ? "Shown" : "Hidden"}</TableCell><TableCell><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => edit(game)}>Edit</Button><Button size="sm" variant="outline" onClick={() => void toggle(game)}>{game.is_active ? "Hide" : "Show"}</Button><Button size="sm" variant="destructive" onClick={() => void remove(game)}>Delete</Button></div></TableCell></TableRow>)}</TableBody>
    </Table>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editing ? "Edit game" : "Add game"}</DialogTitle></DialogHeader>
      <form onSubmit={save} className="space-y-3">
        {([['title','Title'],['slug','Game address'],['description','Description'],['image_url','Cover image URL'],['embed_url','Game embed URL'],['instructions','Instructions'],['category','Category']] as const).map(([key,label]) => <div key={key}><Label htmlFor={`game-${key}`}>{label}</Label><Input id={`game-${key}`} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={key === "title" || key === "slug"} /></div>)}
        <div><Label htmlFor="game-kind">Type</Label><select id="game-kind" className="w-full h-10 border border-input rounded-md bg-background px-3" value={form.kind} onChange={e => setForm({ ...form, kind: e.target.value })}><option value="browser">Browser</option><option value="offline">Offline</option></select></div>
        <div><Label htmlFor="game-order">Display order</Label><Input id="game-order" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
        {([['is_active','Shown'],['is_popular','Popular'],['is_new','New']] as const).map(([key,label]) => <Label key={key} className="flex items-center gap-2"><input type="checkbox" checked={form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })} />{label}</Label>)}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save game"}</Button>
      </form>
    </DialogContent></Dialog>
  </section>;
}