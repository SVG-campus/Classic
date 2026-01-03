// worker_api/src/index.js
import { Ai } from '@cloudflare/ai';

export default {
  async fetch(request, env) {
    // 1. Handle Preflight (CORS) so your Python script can call it
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      });
    }

    // 2. Initialize AI
    const ai = new Ai(env.AI);
    
    // 3. Parse Request
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response("Invalid JSON", { status: 400 });
    }

    const { prompt, system_prompt } = body;
    
    // 4. Run Llama 3 (Free Tier: ~100k reqs/day shared)
    try {
      const response = await ai.run('@cf/meta/llama-3-8b-instruct', {
        messages: [
            { role: "system", content: system_prompt || "You are a helpful assistant." },
            { role: "user", content: prompt }
        ]
      });

      return new Response(JSON.stringify(response), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.toString() }), { status: 500 });
    }
  }
};
