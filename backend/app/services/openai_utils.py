import openai
from typing import List
from dotenv import load_dotenv
import os

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_embedding(text: str) -> List[float]:
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def summarize_and_tag(code: str) -> dict:
    prompt = f"""
You are a helpful assistant. Given a code snippet, return a JSON object with:
- "summary": A 1–2 sentence summary
- "tags": A list of 3–5 tags

Code:
{code}
"""
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    return eval(response.choices[0].message.content)