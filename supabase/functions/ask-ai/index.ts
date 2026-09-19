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

    const { question, language } = await request.json();
    if (typeof question !== "string" || !question.trim() || typeof language !== "string" || !language.trim()) {
      return jsonResponse({ error: "question and language are required strings" }, 400);
    }

    const apiKey = Deno.env.get("GROQ_API_KEY");
    if (!apiKey) {
      console.error("GROQ_API_KEY is not configured");
      return jsonResponse({ error: "AI service is not configured" }, 503);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);

    let groqResponse: Response;
    try {
      groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `You are an agricultural advisory assistant for Indian farmers. Respond in ${language.trim()}. Always return a JSON object with these exact fields: identifiedCondition (string), confidenceScore (number 0-100), treatmentPlan (string).`,
            },
            { role: "user", content: question.trim() },
          ],
        }),
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return jsonResponse({ error: "AI request timed out" }, 504);
      }
      console.error("Groq request failed", error);
      return jsonResponse({ error: "Unable to reach the AI service" }, 502);
    } finally {
      clearTimeout(timeout);
    }

    if (!groqResponse.ok) {
      console.error("Groq returned an error", groqResponse.status);
      return jsonResponse({ error: "AI service returned an error" }, 502);
    }

    const completion = await groqResponse.json();
    const content = completion?.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      return jsonResponse({ error: "AI service returned an invalid response" }, 502);
    }

    let result: unknown;
    try {
      result = JSON.parse(content);
    } catch {
      return jsonResponse({ error: "AI service returned invalid JSON" }, 502);
    }

    const { identifiedCondition, confidenceScore, treatmentPlan } = result as Record<string, unknown>;
    if (
      typeof identifiedCondition !== "string" ||
      typeof confidenceScore !== "number" ||
      !Number.isFinite(confidenceScore) ||
      confidenceScore < 0 ||
      confidenceScore > 100 ||
      typeof treatmentPlan !== "string"
    ) {
      return jsonResponse({ error: "AI service returned an invalid advisory" }, 502);
    }

    return jsonResponse({ identifiedCondition, confidenceScore, treatmentPlan });
  } catch (error) {
    console.error("ask-ai function failed", error);
    return jsonResponse({ error: "Unable to process the AI request" }, 500);
  }
});
