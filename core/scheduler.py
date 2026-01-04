# core/scheduler.py

import os
import sys
import time
import importlib

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT not in sys.path:
    sys.path.append(ROOT)

JOBS = [
    "products.seo_pages._generator:generate_seo_cluster",
    "products.social_packs._generator:generate_social_pack",
    # Add more as you create them, e.g.:
    # "products.youtube_shorts._generator:generate_shorts",
    # "products.email_sequences._generator:generate_sequences",
]

def run_once():
    for spec in JOBS:
        module_name, func_name = spec.split(":")
        print(f"\n=== Running job: {spec} ===")
        module = importlib.import_module(module_name)
        func = getattr(module, func_name)
        func()

def run_forever(interval_seconds: int = 3600):
    while True:
        run_once()
        print(f"\nSleeping {interval_seconds} seconds before next cycle...\n")
        time.sleep(interval_seconds)

if __name__ == "__main__":
    # For now, just run once so you can test.
    run_once()
