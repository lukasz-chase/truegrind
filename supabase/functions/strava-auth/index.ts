import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRAVA_CLIENT_ID = Deno.env.get("STRAVA_CLIENT_ID");
const STRAVA_CLIENT_SECRET = Deno.env.get("STRAVA_CLIENT_SECRET");
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { code, userId } = await req.json();

    if (!code || !userId) {
      return new Response(JSON.stringify({ error: "Missing code or userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Exchange auth code for tokens
    const tokenResponse = await fetch(STRAVA_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Strava token exchange failed:", errorText);
      return new Response(
        JSON.stringify({
          error: "Failed to exchange Strava code",
          details: errorText,
        }),
        {
          status: tokenResponse.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const stravaData = await tokenResponse.json();

    // Create a Supabase client with service_role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Store the tokens in your database
    const { error: dbError } = await supabaseAdmin
      .from("strava_integrations")
      .upsert(
        {
          user_id: userId,
          strava_user_id: stravaData.athlete.id,
          access_token: stravaData.access_token,
          refresh_token: stravaData.refresh_token,
          expires_at: stravaData.expires_at,
        },
        { onConflict: "user_id" }
      );

    if (dbError) {
      console.error("Error saving Strava integration:", dbError);
      throw dbError;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Internal server error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
