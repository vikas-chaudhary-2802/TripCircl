import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getStyleInstructions, buildSystemPrompt, buildUserPrompt } from "./prompts.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { destination, country, startDate, endDate, travelStyle, budget, travelers, interests, prompt, tripPace, placeType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const days = startDate && endDate
      ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 7;

    const numTravelers = parseInt(travelers) || 2;

    const isIndia = /india/i.test(country || "") || /goa|jaipur|kerala|varanasi|manali|rishikesh|udaipur|ladakh|mumbai|delhi|bangalore|hyderabad|chennai|kolkata|agra|shimla|darjeeling|hampi|meghalaya|andaman|rajasthan|kashmir|ooty|coorg|mysore|pondicherry|amritsar|jodhpur|pushkar|alleppey|munnar|leh|nainital|mussoorie|gangtok|shillong|kodaikanal/i.test(destination || "");
    const currencySymbol = isIndia ? "₹" : "$";

    const totalBudget = budget ? parseInt(budget.replace(/[^0-9]/g, "")) : 0;
    const perPersonBudget = totalBudget > 0 ? Math.floor(totalBudget / numTravelers) : 0;
    const dailyBudgetPerPerson = perPersonBudget > 0 ? Math.floor(perPersonBudget / days) : 0;

    const styleInstructions = getStyleInstructions(travelStyle, totalBudget, numTravelers, currencySymbol, days);

    const systemPrompt = buildSystemPrompt({
      destination, isIndia, days, numTravelers, totalBudget, perPersonBudget, dailyBudgetPerPerson, currencySymbol, styleInstructions, tripPace, placeType
    });

    const userPrompt = buildUserPrompt({
      days, destination, country, numTravelers, travelStyle, totalBudget, perPersonBudget, dailyBudgetPerPerson, currencySymbol,
      interests: interests || "", prompt: prompt || "", startDate: startDate || "", endDate: endDate || "", tripPace, placeType
    });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
        temperature: 0.65,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
