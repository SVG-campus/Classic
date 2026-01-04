# products/social_packs/_generator.py
import sys
import os
import time

# Add root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from core.providers import groq_llama3
from core.utils import slugify, ensure_dir
import requests

THEMES = [
    "Motivational Quotes for Entrepreneurs",
    "Cyberpunk Cityscapes",
    "Minimalist Home Decor",
    "Healthy Meal Prep Ideas"
]

def generate_social_pack():
    print("Starting Social Pack Generation...")
    
    for theme in THEMES:
        print(f"--> Processing Theme: {theme}")
        slug = slugify(theme)
        out_dir = f"products/social_packs/output/{slug}"
        ensure_dir(out_dir)

        # 1. Generate 5 Captions (Groq)
        prompt = f"Write 5 engaging Instagram captions for a post about '{theme}'. Include hashtags."
        captions = groq_llama3(prompt)
        
        with open(f"{out_dir}/captions.md", "w") as f:
            f.write(captions)
        
        # 2. Generate 5 Images (Pollinations)
        # We parse the captions to get image ideas, or just use the theme
        for i in range(1, 6):
            image_prompt = f"{theme}, high quality, trending on artstation, 8k, image number {i}"
            # Pollinations URL
            seed = int(time.time()) + i
            url = f"https://pollinations.ai/p/{image_prompt}?width=1080&height=1080&seed={seed}&model=flux"
            
            print(f"    Downloading Image {i}...")
            resp = requests.get(url)
            if resp.status_code == 200:
                with open(f"{out_dir}/image_{i}.jpg", "wb") as f:
                    f.write(resp.content)
            time.sleep(1) # Be nice to the API

if __name__ == "__main__":
    generate_social_pack()
