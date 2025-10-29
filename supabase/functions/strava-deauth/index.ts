// supabase/functions/strava-deauth/index.ts (Deno)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRAVA_DEAUTH_URL = "https://www.strava.com/oauth/deauthorize";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
    });
  }

  try {
    const { userId } = await req.json();
    if (!userId)
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
      });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1) Load current tokens
    const { data: row, error: qErr } = await supabase
      .from("strava_integrations")
      .select("access_token")
      .eq("user_id", userId)
      .maybeSingle();

    if (qErr || !row?.access_token) {
      return new Response(JSON.stringify({ error: "No Strava link found" }), {
        status: 404,
      });
    }

    // 2) Deauthorize at Strava
    const resp = await fetch(STRAVA_DEAUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Strava accepts access_token in body for deauth
      body: JSON.stringify({ access_token: row.access_token }),
    });

    if (!resp.ok) {
      const msg = await resp.text();
      return new Response(
        JSON.stringify({ error: "Strava deauth failed", details: msg }),
        { status: 502 }
      );
    }

    // 3) Remove local link
    const { error: delErr } = await supabase
      .from("strava_integrations")
      .delete()
      .eq("user_id", userId);

    if (delErr) throw delErr;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e?.message ?? "Internal error" }),
      { status: 500 }
    );
  }
});
