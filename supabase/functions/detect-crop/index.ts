import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { image, language } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({
          error: "Image data is required",
          crop_name: "",
          cropName: "",
          confidence: 0,
          identified: false,
          is_certain: false,
          isCertain: false,
          is_plant: false,
          isRecognized: false,
          reason: "unidentified"
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY environment variable not configured",
          crop_name: "",
          cropName: "",
          confidence: 0,
          identified: false,
          is_certain: false,
          isCertain: false,
          is_plant: false,
          isRecognized: false,
          reason: "api_error"
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `You are a real-time Agricultural Plant and Crop Vision AI.
Carefully examine the uploaded image to identify what agricultural crop/plant is depicted.

CRITICAL RULES:
1. Is this a plant or agricultural crop?
   - If the image is a person, animal, vehicle, electronic gadget, furniture, building, screenshot, or non-plant object:
     Set "is_plant": false, "identified": false, "crop_name": "", "confidence": 0.0, "reason": "non_plant".
2. If it is a plant or crop:
   - Identify the specific crop name (e.g. Rice, Chilli, Tomato, Cotton, Maize, Groundnut, Potato, Brinjal, Sugarcane, Wheat, Soybean, Mustard, Banana, Chickpea, Mango, Apple, Onion, Turmeric, Coffee, Tea, Garlic, Ginger, etc.).
   - Set "is_plant": true.
   - Set "confidence" as a float between 0.0 and 1.0 (e.g. 0.94 for high certainty, 0.55 for low/medium certainty).
   - If confidence >= 0.70: set "identified": true, "is_certain": true.
   - If confidence is between 0.35 and 0.69: set "identified": true, "is_certain": false.
   - If the image is completely blurry, unclear, or unrecognizable: set "identified": false, "crop_name": "", "confidence": 0.0, "reason": "unclear".

Respond ONLY in valid JSON format with this exact structure:
{
  "crop_name": "Identified Crop Name (in ${language || 'English'})",
  "confidence": 0.92,
  "identified": true,
  "is_certain": true,
  "is_plant": true,
  "reason": "identified"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            response_mime_type: "application/json",
            temperature: 0.1,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text);

    const confScore = typeof parsed.confidence === "number"
      ? (parsed.confidence <= 1.0 ? Math.round(parsed.confidence * 100) : Math.round(parsed.confidence))
      : 0;

    return new Response(JSON.stringify({
      crop_name: parsed.crop_name || "",
      cropName: parsed.crop_name || "",
      confidence: confScore,
      identified: Boolean(parsed.identified && parsed.crop_name),
      is_certain: Boolean(parsed.is_certain),
      isCertain: Boolean(parsed.is_certain),
      is_plant: parsed.is_plant !== undefined ? Boolean(parsed.is_plant) : true,
      isRecognized: Boolean(parsed.identified && parsed.crop_name),
      reason: parsed.reason || (parsed.identified ? "identified" : "unidentified")
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to detect crop",
        crop_name: "",
        cropName: "",
        confidence: 0,
        identified: false,
        is_certain: false,
        isCertain: false,
        is_plant: false,
        isRecognized: false,
        reason: "api_error"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
