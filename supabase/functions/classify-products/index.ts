import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OCCASION_CATEGORIES = ["wedding", "festival", "party", "casual"] as const;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch products from database
    const { data: products, error } = await supabase
      .from("products")
      .select("id, title, images, category, description")
      .eq("status", "published")
      .limit(50);

    if (error) throw error;
    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ classified: { wedding: [], festival: [], party: [], casual: [] } }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare product info for classification
    const productInfos = products.map(p => ({
      id: p.id,
      title: p.title,
      category: p.category || "",
      description: p.description || "",
      image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null
    }));

    // Use AI to classify products based on their info
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a fashion product classifier. Classify each product into ONE of these occasion categories:
- wedding: Formal ethnic wear like sherwanis, lehengas, heavy embroidered sarees, bridal wear
- festival: Traditional festive wear like kurtas, silk sarees, ethnic dresses for celebrations
- party: Semi-formal to formal western or fusion wear, bandhgalas, cocktail dresses, stylish outfits
- casual: Everyday comfortable wear like t-shirts, jeans, casual shirts, daily wear kurtas

Respond with a JSON object where keys are product IDs and values are the occasion category.
Example: {"id1": "wedding", "id2": "casual", "id3": "festival"}`
          },
          {
            role: "user",
            content: `Classify these products:\n${JSON.stringify(productInfos.map(p => ({
              id: p.id,
              title: p.title,
              category: p.category,
              description: p.description?.substring(0, 100)
            })), null, 2)}`
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "{}";
    
    // Parse AI response - extract JSON from response
    let classifications: Record<string, string> = {};
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        classifications = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("Failed to parse AI response:", e);
    }

    // Group products by occasion
    const classified: Record<string, typeof products> = {
      wedding: [],
      festival: [],
      party: [],
      casual: [],
    };

    for (const product of products) {
      const occasion = classifications[product.id] || "casual";
      if (OCCASION_CATEGORIES.includes(occasion as any)) {
        classified[occasion].push(product);
      } else {
        classified.casual.push(product);
      }
    }

    // Limit each category to 4 products
    for (const key of Object.keys(classified)) {
      classified[key] = classified[key].slice(0, 4);
    }

    return new Response(
      JSON.stringify({ classified }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("classify-products error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
