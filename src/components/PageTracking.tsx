import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
export default function PageTracking() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname === "/auth") return;
    let visitor = sessionStorage.getItem("naams-visitor");
    if (!visitor) { visitor = crypto.randomUUID(); sessionStorage.setItem("naams-visitor", visitor); }
    void supabase.from("site_visits").insert({ page: pathname.slice(0, 200), visitor_id: visitor }).then(({ error }) => {
      if (error) console.warn("Visit recording unavailable");
    });
  }, [pathname]);
  return null;
}