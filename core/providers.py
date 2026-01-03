# core/providers.py

import os
import time
import requests

from google import genai
from google.genai import types
from groq import Groq


# ---------- GEMINI 2.5 FLASH-LITE ----------

def _gemini_client():
    api_key = os.environ.get("GOOGLE_CLOUD_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_CLOUD_API_KEY is not set")
    return genai.Client(vertexai=True, api_key=api_key)


def gemini_flash_lite(prompt: str) -> str:
    client = _gemini_client()
    model = "gemini-2.5-flash-lite"

    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=prompt)]
        )
    ]

    tools = [types.Tool(google_search=types.GoogleSearch())]

    config = types.GenerateContentConfig(
        temperature=1,
        top_p=0.95,
        max_output_tokens=2048,
        safety_settings=[
            types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="OFF"),
            types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="OFF"),
            types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="OFF"),
            types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="OFF"),
        ],
        tools=tools,
        thinking_config=types.ThinkingConfig(thinking_budget=0),
    )

    # Simple free-tier guard
    time.sleep(4)

    chunks = client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=config,
    )

    parts = []
    for chunk in chunks:
        if not chunk.candidates:
            continue
        cand = chunk.candidates[0]
        if not cand.content or not cand.content.parts:
            continue
        parts.append(chunk.text)
    return "".join(parts)


# ---------- GROQ LLAMA 3 ----------

def _groq_client():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set")
    return Groq(api_key=api_key)


def groq_llama3(prompt: str, model: str = "llama3-70b-8192") -> str:
    client = _groq_client()

    # Conservative rate-limit guard for free/dev tier
    time.sleep(2)

    completion = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )
    return completion.choices[0].message.content
