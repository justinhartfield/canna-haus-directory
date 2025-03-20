
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecommendationRequest {
  effects?: string[];
  medical?: string[];
  avoid?: string[];
  experience?: "novice" | "intermediate" | "experienced";
  preferredType?: "indica" | "sativa" | "hybrid";
  count?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: RecommendationRequest = await req.json();
    const { effects = [], medical = [], avoid = [], experience = "intermediate", preferredType, count = 3 } = requestData;

    // Configure OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });
    const openai = new OpenAIApi(configuration);

    // Construct the prompt for OpenAI
    let prompt = "You are an expert budtender with deep knowledge of cannabis strains and their effects. ";
    prompt += "Provide personalized cannabis strain recommendations based on the following criteria:\n\n";
    
    if (effects.length > 0) {
      prompt += `Desired effects: ${effects.join(", ")}\n`;
    }
    
    if (medical.length > 0) {
      prompt += `Medical conditions: ${medical.join(", ")}\n`;
    }
    
    if (avoid.length > 0) {
      prompt += `Effects to avoid: ${avoid.join(", ")}\n`;
    }
    
    prompt += `Experience level: ${experience}\n`;
    
    if (preferredType) {
      prompt += `Preferred type: ${preferredType}\n`;
    }
    
    prompt += `\nProvide ${count} strain recommendations in JSON format with the following structure for each strain:
    {
      "name": "Strain Name",
      "type": "Indica/Sativa/Hybrid",
      "thcContent": "THC percentage range",
      "cbdContent": "CBD percentage range",
      "effects": ["Effect1", "Effect2", ...],
      "medicalBenefits": ["Benefit1", "Benefit2", ...],
      "terpenes": ["Terpene1", "Terpene2", ...],
      "flavorProfile": ["Flavor1", "Flavor2", ...],
      "recommendationReason": "Brief explanation of why this strain matches the criteria"
    }`;

    // Call OpenAI API
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a cannabis expert who provides strain recommendations in JSON format only." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const responseText = completion.data.choices[0]?.message?.content || "No recommendations available";
    
    // Extract JSON from the response
    let recommendations = [];
    try {
      // Try to parse the entire response as JSON first
      recommendations = JSON.parse(responseText);
    } catch (e) {
      // If that fails, try to extract JSON objects from the text
      const jsonPattern = /\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/g;
      const jsonMatches = responseText.match(jsonPattern);
      
      if (jsonMatches) {
        recommendations = jsonMatches.map(jsonStr => {
          try {
            return JSON.parse(jsonStr);
          } catch (err) {
            console.error("Error parsing JSON:", err);
            return null;
          }
        }).filter(Boolean);
      }
    }

    console.log("Successfully generated recommendations");
    
    return new Response(
      JSON.stringify({
        success: true,
        recommendations
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error("Error in strain recommendation function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
