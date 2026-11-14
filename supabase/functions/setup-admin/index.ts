import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Initial owner provisioning is complete. Never expose a public password reset.
serve((req) => new Response(req.method === "OPTIONS" ? null : JSON.stringify({ error: "Account setup is disabled. Use normal account recovery." }), {
  status: req.method === "OPTIONS" ? 204 : 410,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Content-Type": "application/json",
  },
}));
