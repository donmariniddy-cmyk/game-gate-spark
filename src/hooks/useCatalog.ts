import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { publicGames } from "@/lib/catalog";

export function useCatalog(admin = false) {
  return useQuery({
    queryKey: ["catalog", admin],
    queryFn: async () => {
      let query = supabase.from("games").select("*").order("sort_order");
      if (!admin) query = query.eq("is_active", true);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
export function useOfflineGames() {
  const query = useCatalog();
  return { ...query, games: publicGames(query.data ?? [], "offline").map(g => ({ ...g, cover: g.image_url ?? "" })) };
}
export function useBrowserGames() {
  const query = useCatalog();
  return { ...query, games: publicGames(query.data ?? [], "browser").map(g => ({
    ...g, id: g.slug, thumbnail: g.image_url ?? "", embedUrl: g.embed_url ?? "",
    isPopular: g.is_popular, isNew: g.is_new,
  })) };
}