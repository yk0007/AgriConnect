
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    // Get the Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get current user ID from JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData) {
      throw new Error('Unauthorized');
    }
    
    // Check if the user is an admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
      .single();
    
    const isAdmin = userRoles?.role === 'admin';
    
    if (!isAdmin) {
      throw new Error('Only administrators can update API keys');
    }

    // Get the API key from the request
    const { apiKey } = await req.json();
    
    if (!apiKey) {
      throw new Error('API key is required');
    }

    // Update the GROQ_API_KEY secret in the edge function
    // This requires service role key permissions
    const { error } = await supabase.functions.updateSecret("GROQ_API_KEY", apiKey);
    
    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error updating GROQ API key:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
