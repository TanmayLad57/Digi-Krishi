import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const authorization = request.headers.get("Authorization");
  if (!authorization) {
    return jsonResponse({ error: "Authentication is required" }, 401);
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authorization } } },
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return jsonResponse({ error: "Invalid or expired authentication token" }, 401);
    }

    const { audioPath } = await request.json();
    if (typeof audioPath !== "string" || !audioPath.trim()) {
      return jsonResponse({ error: "audioPath is required" }, 400);
    }
    if (!audioPath.startsWith(`${user.id}/`)) {
      return jsonResponse({ error: "You are not allowed to transcribe this audio" }, 403);
    }

    // Downloads through the caller-authenticated client so private-bucket RLS is enforced.
    const { data: audioBlob, error: downloadError } = await supabase.storage
      .from("voice-recordings")
      .download(audioPath);
    if (downloadError || !audioBlob) {
      console.error("Unable to download voice recording", downloadError);
      return jsonResponse({ error: "Unable to access the uploaded voice recording" }, 404);
    }

    const apiKey = Deno.env.get("GROQ_API_KEY");
    if (!apiKey) {
      console.error("GROQ_API_KEY is not configured");
      return jsonResponse({ error: "AI service is not configured" }, 503);
    }

    const extension = audioPath.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "webm";
    const formData = new FormData();
    formData.set("model", "whisper-large-v3");
    formData.set("file", audioBlob, `voice-recording.${extension}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    let groqResponse: Response;
    try {
      groqResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}` },
        body: formData,
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return jsonResponse({ error: "Transcription request timed out" }, 504);
      }
      console.error("Groq transcription request failed", error);
      return jsonResponse({ error: "Unable to reach the transcription service" }, 502);
    } finally {
      clearTimeout(timeout);
    }

    if (!groqResponse.ok) {
      console.error("Groq transcription returned an error", groqResponse.status);
      return jsonResponse({ error: "Transcription service returned an error" }, 502);
    }

    const result = await groqResponse.json();
    const transcript = result?.text;
    if (typeof transcript !== "string" || !transcript.trim()) {
      return jsonResponse({ error: "Transcription service returned an invalid response" }, 502);
    }

    return jsonResponse({ transcript: transcript.trim() });
  } catch (error) {
    console.error("transcribe-voice function failed", error);
    return jsonResponse({ error: "Unable to process the voice recording" }, 500);
  }
});
