
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "npm:@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DiagnosisDetails {
  crop: string;
  dateAnalyzed: string;
  disease?: {
    commonName: string;
    scientificName?: string;
    confidence: number;
  };
  severity?: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Unknown' | 'None';
  description?: string;
  recommendations?: string[];
  error?: string;
  isHealthy?: boolean;
}

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
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    const cropNameFromUser = formData.get('cropName') as string || null;
    
    if (!imageFile) {
      return new Response(
        JSON.stringify({ error: "No image file provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const generationConfig = {
      temperature: 0.2,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    // Convert image to base64
    const imageBytes = await imageFile.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBytes)));
    
    // Create image part for Gemini
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: imageFile.type
      }
    };

    // Create prompt - add user provided crop name if available
    let prompt = `Analyze the provided image of a plant.`;
    
    if (cropNameFromUser) {
      prompt += ` The user has identified this as a ${cropNameFromUser} plant. Take this into consideration for your analysis.`;
    } else {
      prompt += ` Identify the plant (crop) if possible.`;
    }
    
    prompt += ` Detect any visible diseases.
Provide the diagnosis details STRICTLY in the following JSON format. Do not include any explanatory text before or after the JSON block.

{
  "crop": "${cropNameFromUser || "Identify the plant species if possible, otherwise 'Unknown Plant'"}",
  "disease": {
    "commonName": "Common name of the disease, or 'None' if healthy",
    "scientificName": "Scientific name of the pathogen, if known and applicable, otherwise null",
    "confidence": "Estimated confidence level (0.0 to 1.0) for the disease identification, or 1.0 if healthy"
  },
  "severity": "Assess severity ('Low', 'Moderate', 'High', 'Severe', 'Unknown', or 'None' if healthy)",
  "description": "Brief description of the disease OR state 'Plant appears healthy'",
  "recommendations": ["List 3-5 actionable recommendations as strings in an array, or general care tips if healthy"]
}

Ensure all fields are present. If no disease is clearly visible, report it as healthy using 'None' for disease name and severity. Use 'Unknown' or null where appropriate if information cannot be determined.`;

    const parts = [{ text: prompt }, imagePart];

    // Call Gemini API
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    if (!result.response) {
      throw new Error("Gemini API did not return a response.");
    }
    
    const responseText = result.response.text();
    console.log("Raw Gemini Response Text:", responseText);

    // Process response
    let diagnosisData;
    try {
      // Extract JSON from response (handling both clean JSON and code-block enclosed JSON)
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : responseText;
      
      // Clean the jsonString to handle any markdown formatting that might remain
      const cleanedJsonString = jsonString.replace(/^```(json)?|```$/gm, '').trim();
      diagnosisData = JSON.parse(cleanedJsonString);

      if (!diagnosisData || typeof diagnosisData !== 'object') {
        console.warn("Parsed JSON may not fully match expected structure.");
        diagnosisData = {};
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response as JSON:", parseError);
      console.error("Raw response:", responseText);
      return new Response(
        JSON.stringify({
          crop: cropNameFromUser || "Unknown Plant",
          dateAnalyzed: new Date().toISOString(),
          error: "Failed to parse Gemini response.",
          isHealthy: false,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const analysisDate = new Date();
    const formattedDate = `${analysisDate.getFullYear()}-${String(analysisDate.getMonth() + 1).padStart(2, '0')}-${String(analysisDate.getDate()).padStart(2, '0')} at ${String(analysisDate.getHours()).padStart(2, '0')}:${String(analysisDate.getMinutes()).padStart(2, '0')}`;
    
    // If user provided a crop name, use that instead of what Gemini identified
    if (cropNameFromUser) {
      diagnosisData.crop = cropNameFromUser;
    }
    
    const isHealthy = !diagnosisData.disease || diagnosisData.disease.commonName?.toLowerCase() === 'none';

    const diagnosisResult: DiagnosisDetails = {
      crop: diagnosisData.crop || cropNameFromUser || "Unknown Plant",
      dateAnalyzed: formattedDate,
      disease: (isHealthy || !diagnosisData.disease?.commonName) ? undefined : {
        commonName: diagnosisData.disease.commonName,
        scientificName: diagnosisData.disease.scientificName || undefined,
        confidence: typeof diagnosisData.disease.confidence === 'number' ? 
          diagnosisData.disease.confidence : 
          (typeof diagnosisData.disease.confidence === 'string' ? parseFloat(diagnosisData.disease.confidence) : 0.8),
      },
      severity: diagnosisData.severity as 'Low' | 'Moderate' | 'High' | 'Severe' | 'Unknown' | 'None' || (isHealthy ? 'None' : 'Unknown'),
      description: diagnosisData.description || (isHealthy ? "Plant appears healthy." : "No description provided."),
      recommendations: diagnosisData.recommendations || [],
      isHealthy: isHealthy,
    };

    // Save the diagnosis result to the database
    try {
      const { error: saveError } = await supabaseClient.from('crop_diagnostics').insert({
        user_id: req.headers.get('authorization')?.split(' ')[1] ? JSON.parse(atob(req.headers.get('authorization')?.split(' ')[1].split('.')[1] || '')).sub : null,
        disease_name: diagnosisResult.disease?.commonName || null,
        severity: diagnosisResult.severity || null,
        description: diagnosisResult.description || null,
        recommendations: diagnosisResult.recommendations || null,
        confidence: diagnosisResult.disease?.confidence ? Math.round(diagnosisResult.disease.confidence * 100) : null,
        image_url: null // Would need storage bucket setup to store the image
      });
      
      if (saveError) {
        console.error("Error saving diagnosis:", saveError);
      }
    } catch (dbError) {
      console.error("Error saving to database:", dbError);
    }

    return new Response(
      JSON.stringify(diagnosisResult),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        error: `Failed to analyze image with Gemini: ${error instanceof Error ? error.message : String(error)}`,
        crop: "Unknown Plant",
        dateAnalyzed: new Date().toISOString(),
        isHealthy: false,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Initialize Supabase client for saving diagnostics results
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://mrbjnkednllemtrafofj.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseClient = createClient(supabaseUrl, supabaseKey);
