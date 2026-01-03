import { Ai } from '@cloudflare/ai';

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      });
    }

    const ai = new Ai(env.AI);

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response("Invalid JSON", { status: 400 });
    }

    const { prompt, system_prompt } = body;

    try {
      const result = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: "system", content: system_prompt || "You are a helpful assistant." },
          { role: "user", content: prompt }
        ]
      });

      return new Response(JSON.stringify(result), {
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
