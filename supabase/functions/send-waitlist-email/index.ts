import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email, feature } = await req.json();

    if (!email || !feature) {
      return new Response(JSON.stringify({ error: "Email and feature are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save to waitlist table
    const { error: dbError } = await supabase
      .from("waitlist_emails")
      .insert({ email, feature });

    if (dbError) {
      console.error("DB insert error:", dbError);
    }

    const featureNames: Record<string, string> = {
      "/explore": "Discover Trips",
      "/create-trip": "Create a Trip",
      "/dashboard": "My Trips",
      "/messages": "Messages",
      "/profile": "Profile",
    };

    const featureName = featureNames[feature] || "this feature";
    const senderEmail = "contact@tripcicl.in";

    console.log(`✅ Waitlist signup: ${email} for ${featureName} (sender: ${senderEmail})`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `You've been added to the waitlist for ${featureName}!`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
