import type { Tables } from "@/integrations/supabase/types";

export type CatalogGame = Tables<"games">;
export const playableSlugs = new Set(["snake", "tic-tac-toe", "memory", "2048", "temple-run"]);
export const publicGames = (rows: CatalogGame[], kind: string) => rows
  .filter(game => game.is_active && game.kind === kind)
  .sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title));
export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const libraryGrant = (email: string, userId: string) => ({
  user_email: normalizeEmail(email), game_slug: "all-games", granted_by: userId,
});