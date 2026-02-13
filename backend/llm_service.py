import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def generate_tasks(data):
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise Exception("GROQ_API_KEY not found in environment variables")

    client = OpenAI(
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1"
    )

    prompt = f"""
You are a senior product manager.

Goal: {data['goal']}
Users: {data['users']}
Constraints: {data['constraints']}
Template: {data['template']}

Return strictly valid JSON:
{{
  "user_stories": [],
  "tasks": {{
    "frontend": [],
    "backend": [],
    "database": [],
    "devops": []
  }}
}}
"""

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    return json.loads(response.choices[0].message.content)
