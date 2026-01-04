'use client';
import { useState } from 'react';

export default function TitleGenerator() {
  const [topic, setTopic] = useState('');
  const [titles, setTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    // Call your Cloudflare Worker (or a Next.js API route that calls Gemini)
    const res = await fetch('https://classic-ai-worker.YOUR_SUBDOMAIN.workers.dev', {
      method: 'POST',
      body: JSON.stringify({ 
        prompt: `Generate 5 clickbait SEO titles for: ${topic}`,
        system_prompt: "You are an SEO expert."
      })
    });
    const data = await res.json();
    // Assuming worker returns { result: { response: "..." } }
    // You might need to parse the text output
    setTitles([data.result.response]); 
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Free AI Title Generator</h1>
      
      {/* AD PLACEMENT HERE */}
      <div className="bg-gray-100 p-8 text-center mb-6">
        [AdSense Banner Placeholder]
      </div>

      <input 
        value={topic} 
        onChange={(e) => setTopic(e.target.value)}
        className="border p-2 w-full mb-4" 
        placeholder="Enter your blog topic..."
      />
      <button 
        onClick={generate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Generating...' : 'Generate Titles'}
      </button>

      <div className="mt-6 space-y-2">
        {titles.map((t, i) => (
          <div key={i} className="p-4 border rounded bg-white shadow-sm">
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
