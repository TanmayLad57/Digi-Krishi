export interface WeatherData {
  temperature?: number;
  humidity?: number;
  rainProbability?: number;
}

/**
 * Fetches current weather and rain probability for a given location using Open-Meteo API.
 * Fails gracefully and returns null if geocoding or weather fetching encounters any error.
 */
export async function fetchWeather(location: string): Promise<WeatherData | null> {
  if (!location || !location.trim()) return null;

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location.trim())}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl, {
      signal: AbortSignal.timeout(4000),
    });

    if (!geoRes.ok) {
      console.warn(`[weather] Geocoding API returned status ${geoRes.status} for location: ${location}`);
      return null;
    }

    const geoData = await geoRes.json();
    const result = geoData?.results?.[0];
    if (!result || typeof result.latitude !== "number" || typeof result.longitude !== "number") {
      console.warn(`[weather] Geocoding returned no coordinates for location: ${location}`);
      return null;
    }

    const { latitude, longitude } = result;
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&daily=precipitation_probability_max&timezone=auto`;
    const forecastRes = await fetch(forecastUrl, {
      signal: AbortSignal.timeout(4000),
    });

    if (!forecastRes.ok) {
      console.warn(`[weather] Forecast API returned status ${forecastRes.status} for coords: ${latitude},${longitude}`);
      return null;
    }

    const weatherData = await forecastRes.json();
    const temperature = weatherData?.current?.temperature_2m;
    const humidity = weatherData?.current?.relative_humidity_2m;
    const rainProbability = weatherData?.daily?.precipitation_probability_max?.[0];

    return {
      temperature: typeof temperature === "number" ? Math.round(temperature) : undefined,
      humidity: typeof humidity === "number" ? Math.round(humidity) : undefined,
      rainProbability: typeof rainProbability === "number" ? Math.round(rainProbability) : undefined,
    };
  } catch (error) {
    console.warn("[weather] Weather fetch failed for location:", location, error);
    return null;
  }
}

/**
 * Loads the farmer's profile and details, fetches local weather data,
 * and formats a context string to prepend to the AI system prompt.
 * Fails gracefully if data cannot be retrieved.
 */
// deno-lint-ignore no-explicit-any
export async function getFarmerContext(supabase: any, userId: string): Promise<string> {
  try {
    const [profileRes, detailsRes] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
      supabase.from("farmer_details").select("state, district, primary_crop, additional_crops, land_area_acres").eq("id", userId).maybeSingle(),
    ]);

    if (profileRes?.error) {
      console.warn("[context] Error querying profiles for user", userId, profileRes.error);
    }
    if (detailsRes?.error) {
      console.warn("[context] Error querying farmer_details for user", userId, detailsRes.error);
    }

    const details = detailsRes?.data ?? {};

    const state = (details.state || "").trim();
    const district = (details.district || "").trim();

    const crops: string[] = [];
    if (details.primary_crop && typeof details.primary_crop === "string") {
      crops.push(details.primary_crop.trim());
    }
    if (Array.isArray(details.additional_crops)) {
      for (const c of details.additional_crops) {
        if (typeof c === "string" && c.trim() && !crops.includes(c.trim())) {
          crops.push(c.trim());
        }
      }
    }

    const landArea = details.land_area_acres;

    // Weather query: try district first, then district + state, then state
    let weather: WeatherData | null = null;
    const locationQuery = [district, state].filter(Boolean).join(", ");
    if (district) {
      weather = await fetchWeather(district);
    }
    if (!weather && locationQuery) {
      weather = await fetchWeather(locationQuery);
    }
    if (!weather && state) {
      weather = await fetchWeather(state);
    }

    // Build farmer description
    const farmerParts: string[] = [];
    if (crops.length > 0) {
      farmerParts.push(`grows ${crops.join(", ")}`);
    }
    if (landArea !== null && landArea !== undefined && String(landArea).trim() !== "") {
      farmerParts.push(`on ${landArea} acres`);
    }
    const locationParts = [district, state].filter(Boolean);
    if (locationParts.length > 0) {
      farmerParts.push(`in ${locationParts.join(", ")}`);
    }

    // Build weather description
    const weatherParts: string[] = [];
    if (weather) {
      if (weather.temperature !== undefined) {
        weatherParts.push(`${weather.temperature}°C`);
      }
      if (weather.humidity !== undefined) {
        weatherParts.push(`${weather.humidity}% humidity`);
      }
      if (weather.rainProbability !== undefined) {
        weatherParts.push(`${weather.rainProbability}% chance of rain`);
      }
    }

    const sentences: string[] = [];
    if (farmerParts.length > 0) {
      sentences.push(`Farmer context: ${farmerParts.join(" ")}.`);
    }
    if (weatherParts.length > 0) {
      sentences.push(`Current weather: ${weatherParts.join(", ")}.`);
    }

    if (sentences.length > 0) {
      return `${sentences.join(" ")} You MUST reference the farmer's specific crop and current weather conditions in your treatmentPlan where relevant, not just generic advice — but still answer the farmer's actual question as the priority.`;
    }

    return "";
  } catch (err) {
    console.warn("[context] Could not get farmer context:", err);
    return "";
  }
}
