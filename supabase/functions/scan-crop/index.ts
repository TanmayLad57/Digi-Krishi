import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getFarmerContext } from "../_shared/weather.ts";

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

    const { imagePath, language } = await request.json();
    if (typeof imagePath !== "string" || !imagePath.trim() || typeof language !== "string" || !language.trim()) {
      return jsonResponse({ error: "imagePath and language are required strings" }, 400);
    }
    if (!imagePath.startsWith(`${user.id}/`)) {
      return jsonResponse({ error: "You are not allowed to scan this image" }, 403);
    }

    const { data: blob, error: dlError } = await supabase.storage
      .from("crop-images").download(imagePath);
    if (dlError || !blob) {
      console.error("Unable to download crop image", dlError);
      return jsonResponse({ error: "Unable to access the uploaded crop image" }, 404);
    }
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) {
      bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    const imageDataUrl = `data:${blob.type || "image/jpeg"};base64,${btoa(bin)}`;

    const apiKey = Deno.env.get("GROQ_API_KEY");
    if (!apiKey) {
      console.error("GROQ_API_KEY is not configured");
      return jsonResponse({ error: "AI service is not configured" }, 503);
    }

    const farmerContext = await getFarmerContext(supabase, user.id);
    console.log(`[scan-crop] Farmer context for user ${user.id}: "${farmerContext}"`);

    const languageMap: Record<string, string> = {
      mr: "Marathi",
      hi: "Hindi",
      ml: "Malayalam",
      en: "English",
    };
    const targetLanguage = languageMap[language.trim().toLowerCase().split("-")[0]] ?? language.trim();

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
          model: "qwen/qwen3.8-27b",
          reasoning_effort: "none",
          max_completion_tokens: 700,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `${farmerContext ? `${farmerContext} ` : ""}You are an agricultural advisory assistant for Indian farmers. Identify the crop and any visible disease or pest from the photo. Respond in ${targetLanguage}. Always return a JSON object with these exact fields: identifiedCondition (string), confidenceScore (number 0-100), treatmentPlan (string). If the image is not a plant, does not show a crop condition clearly, or is too unclear to assess, state that in identifiedCondition, set confidenceScore to 30 or lower, and ask for a clearer crop photo in treatmentPlan. Keep treatmentPlan concise: under 80 words, plain text, no markdown.`,
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Analyze this crop photo." },
                { type: "image_url", image_url: { url: imageDataUrl } },
              ],
            },
          ],
        }),
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return jsonResponse({ error: "AI request timed out" }, 504);
      }
      console.error("Groq crop scan failed", error);
      return jsonResponse({ error: "Unable to reach the AI service" }, 502);
    } finally {
      clearTimeout(timeout);
    }

    if (!groqResponse.ok) {
      const errBody = (await groqResponse.text()).slice(0, 300);
      console.error("Groq crop scan returned an error", groqResponse.status, errBody);
      return jsonResponse({ error: "AI service returned an error" }, 502);
    }

    const completion = await groqResponse.json();
    const content = completion?.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      return jsonResponse({ error: "AI service returned an invalid response" }, 502);
    }

    const cleanedContent = content.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    const rawJson = jsonMatch ? jsonMatch[0] : cleanedContent;

    let result: unknown;
    try {
      result = JSON.parse(rawJson);
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
    console.error("scan-crop function failed", error);
    return jsonResponse({ error: "Unable to process the crop scan" }, 500);
  }
});
