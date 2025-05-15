
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://mrbjnkednllemtrafofj.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY environment variable not set" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const data = await req.json();
    const { 
      fieldName, 
      phLevel, 
      nitrogen, 
      phosphorus, 
      potassium, 
      organicMatter, 
      moisture, 
      ecLevel, 
      notes 
    } = data;
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the prompt for Gemini
    const prompt = `Analyze the following soil test results and provide detailed insights and recommendations:

Field Name: ${fieldName}
pH Level: ${phLevel}
Nitrogen: ${nitrogen} ppm
Phosphorus: ${phosphorus} ppm
Potassium: ${potassium} ppm
Organic Matter: ${organicMatter}%
Moisture Content: ${moisture}%
EC Level: ${ecLevel}
Additional Notes: ${notes || 'None'}

Based on these values, please provide:
1. An overall assessment of soil health
2. Analysis of each parameter (is it low, optimal, or high?)
3. How these values might affect plant growth
4. Recommendations for improving soil health
5. Suitable crops for this soil composition
6. Any amendments or fertilizers needed

Please structure your response in clear sections and be specific with actionable recommendations.`;

    // Call Gemini API
    const result = await model.generateText(prompt);
    const analysis = result.text();

    // Get user ID from JWT token if available
    const userId = req.headers.get('authorization')?.split(' ')[1] ? 
      JSON.parse(atob(req.headers.get('authorization')?.split(' ')[1].split('.')[1] || '')).sub : null;

    // Save the soil analysis data to Supabase
    if (userId) {
      const { error } = await supabaseClient.from('soil_analysis').insert({
        user_id: userId,
        field_name: fieldName,
        ph_level: phLevel,
        nitrogen: nitrogen,
        phosphorus: phosphorus,
        potassium: potassium,
        organic_matter: organicMatter,
        moisture: moisture,
        ec_level: ecLevel,
        notes: notes,
        analysis_date: new Date()
      });

      if (error) {
        console.error("Error saving soil analysis:", error);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysis,
        data: {
          fieldName,
          phLevel,
          nitrogen,
          phosphorus,
          potassium,
          organicMatter,
          moisture,
          ecLevel,
          notes,
          analysisDate: new Date().toISOString()
        }
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: `Failed to analyze soil data: ${error instanceof Error ? error.message : String(error)}`
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
