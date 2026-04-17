import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

/**
 * Returns whether the currently logged-in user has been granted access
 * to the game library by an admin. Any row in `game_access` for the
 * user's email counts as access (admin can grant "All Games" in one click).
 */
export const useGameAccess = () => {
  const { user, loading: authLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.email) {
      setHasAccess(false);
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("game_access")
        .select("id")
        .eq("user_email", user.email!)
        .limit(1);
      if (active) {
        setHasAccess((data?.length ?? 0) > 0);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user, authLoading]);

  return { hasAccess, loading: authLoading || loading, user };
};
