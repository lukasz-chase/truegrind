import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRAVA_CLIENT_ID = Deno.env.get("STRAVA_CLIENT_ID")!;
const STRAVA_CLIENT_SECRET = Deno.env.get("STRAVA_CLIENT_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const STRAVA_OAUTH_TOKEN_URL = "https://www.strava.com/oauth/token";
const STRAVA_API_BASE = "https://www.strava.com/api/v3";

type Workout = {
  id: string;
  name: string;
  workout_time: string;
  workout_exercises?: WorkoutExercisePopulated[];
  created_at?: string;
  order: number | null;
  folder_id: string | null;
};

type WorkoutExercisePopulated = {
  exercises: { name: string };
  exercise_sets: ExerciseSet[];
};

type ExerciseSet = {
  reps: number | null;
  weight: number | null;
  unit?: string; // Assuming unit might be part of the set
};

interface StravaUploadPayload {
  userId: string;
  workout: Workout;
  startTime: string; // ISO Date string
}

const parseElapsedSeconds = (mmss: string): number => {
  const [m, s] = mmss.split(":").map((n) => Number(n) || 0);
  return m * 60 + s;
};

const getValidAccessToken = async (
  supabaseAdmin: any,
  userId: string
): Promise<string> => {
  const { data: integration, error } = await supabaseAdmin
    .from("strava_integrations")
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !integration) {
    throw new Error("Strava integration not found for this user.");
  }

  const expiresAt = Number(integration.expires_at) || 0;
  const now = Math.floor(Date.now() / 1000);
  const isExpired = expiresAt <= now + 300; // 5 min buffer

  if (!isExpired) return integration.access_token as string;

  const form = new URLSearchParams({
    client_id: STRAVA_CLIENT_ID,
    client_secret: STRAVA_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: integration.refresh_token,
  });

  const resp = await fetch(STRAVA_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    console.error("Strava refresh error:", resp.status, txt);
    throw new Error(`Could not refresh Strava token (status ${resp.status}).`);
  }

  const tokens = await resp.json();

  const { error: updErr } = await supabaseAdmin
    .from("strava_integrations")
    .update({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at,
    })
    .eq("user_id", userId);

  if (updErr) {
    console.warn("Warning: failed to persist refreshed tokens:", updErr);
  }

  return tokens.access_token as string;
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { userId, workout, startTime } =
      (await req.json()) as StravaUploadPayload;
    if (!userId || !workout || !startTime) {
      return new Response(
        JSON.stringify({ error: "Missing userId or workout" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const accessToken = await getValidAccessToken(supabaseAdmin, userId);

    const elapsedSeconds = parseElapsedSeconds(workout.workout_time);

    const description = workout.workout_exercises
      ?.map((ex) => {
        const sets = ex.exercise_sets
          .map((set) => `- ${set.reps || 0} reps @ ${set.weight || 0} kg`)
          .join("\n");
        return `${ex.exercises.name}:\n${sets}`;
      })
      .join("\n\n");

    const payload = new URLSearchParams({
      name: "Weight training",
      type: "WeightTraining",
      start_date_local: startTime,
      elapsed_time: String(elapsedSeconds),
      description:
        workout.name + "\n\n" + description ||
        "Completed a workout on trueGrind.",
      trainer: "1",
    });

    const stravaResp = await fetch(`${STRAVA_API_BASE}/activities`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
    });

    if (!stravaResp.ok) {
      const text = await stravaResp.text();
      return new Response(
        JSON.stringify({
          error: "Failed to upload to Strava",
          status: stravaResp.status,
          details: text,
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const activity = await stravaResp.json();

    return new Response(JSON.stringify({ success: true, activity }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e?.message ?? "Internal error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
