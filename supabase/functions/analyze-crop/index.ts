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
    const { cropName, image, language } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: "Image data is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY environment variable not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `You are an expert Indian Agronomist AI. Analyze this crop leaf image for "${cropName || 'crop'}".
Respond ONLY in valid JSON with this exact structure:
{
  "cropName": "${cropName || 'Identified Crop'}",
  "diseaseName": "Disease Name",
  "scientificName": "Pathogen scientific name",
  "confidence": 94,
  "severity": "High" (or "Medium", "Low", "Healthy"),
  "symptoms": ["Symptom 1", "Symptom 2", "Symptom 3"],
  "possibleCauses": ["Cause 1", "Cause 2"],
  "recommendedCare": {
    "organic": ["Organic remedy 1", "Organic remedy 2"],
    "chemical": ["Chemical spray with exact dosage per liter", "Chemical option 2"],
    "immediateAction": "Urgent immediate action"
  },
  "prevention": ["Prevention tip 1", "Prevention tip 2"]
}
Ensure all descriptions are simple and clear for Indian farmers in ${language || 'en'} language where appropriate.`;

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
            temperature: 0.2,
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

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process crop analysis" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
