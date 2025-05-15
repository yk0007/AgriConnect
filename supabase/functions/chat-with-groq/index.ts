
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Get the API key from environment variables
const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

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
    // Check if GROQ_API_KEY is available
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured. Please set it in Supabase secrets.");
    }

    const { messages, conversationId, userId } = await req.json();

    // Basic validation
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format");
    }

    // Format conversation history for Groq
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // If system message is not already provided, include default system prompt
    if (!formattedMessages.some(msg => msg.role === "system")) {
      formattedMessages.unshift({
        role: "system",
        content: "You are FarmAI, an agricultural assistant trained to help farmers with crop information, farming techniques, disease identification, and best practices in agriculture. Provide helpful, accurate, and practical farming advice. **Format responses with bold headings** and use line breaks to organize information clearly."
      });
    }

    console.log("Sending request to Groq API with messages:", JSON.stringify(formattedMessages));

    // Call Groq API using their recommended format
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      throw new Error(`Groq API responded with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("Groq API response:", JSON.stringify(result));

    // Save to Supabase if userId and conversationId are provided
    if (userId && conversationId) {
      const { supabaseClient } = await import("../shared/supabase-client.ts");
      
      try {
        // Save user message
        await supabaseClient.from("chat_messages").insert({
          user_id: userId,
          conversation_id: conversationId,
          content: messages[messages.length - 1].content,
          role: "user",
          created_at: new Date().toISOString()
        });
        
        // Save assistant response
        await supabaseClient.from("chat_messages").insert({
          user_id: userId,
          conversation_id: conversationId,
          content: result.choices[0].message.content,
          role: "assistant",
          created_at: new Date().toISOString()
        });
        
        console.log("Successfully saved messages to database");
      } catch (dbError) {
        console.error("Database error:", dbError);
        // Continue execution even if database save fails
      }
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in chat-with-groq function:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        choices: [{
          message: {
            content: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment."
          }
        }]
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
