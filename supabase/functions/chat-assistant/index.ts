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
    const { messages, cropContext, language } = await req.json();

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sysPrompt = `You are AI Crop Assistant Agronomy Assistant, an agricultural expert helping Indian farmers.
Current Crop Context: ${cropContext || 'General Agriculture'}.
Preferred Language: ${language || 'en'}.
Always provide farmer-friendly, accurate advice with practical organic alternatives and exact pesticide/fertilizer dosages per liter of water.`;

    const userMessage = messages[messages.length - 1]?.text || "";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${sysPrompt}\n\nFarmer question: ${userMessage}` }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 600,
          },
        }),
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am here to help you with your crop.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Chat request failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
