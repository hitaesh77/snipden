import openai
from typing import List
from dotenv import load_dotenv
import os

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def build_embedding_input(code: str, summary: str, tags: list[str]) -> str:
    return f"""
    Code:
    {code}

    Summary:
    {summary}

    Tags:
    {", ".join(tags)}
    """

def generate_embedding(code: str, summary: str, tags: list[str]) -> list[float]:
    text = build_embedding_input(code, summary, tags)
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def summarize_and_tag(code: str) -> dict:
    prompt = f"""
Given the following code snippet, generate:
1. A concise summary (1–2 sentences) describing what the code does.
2. A list of 3 to 5 relevant tags (keywords) that describe the code, such as the algorithm used, language, purpose, or domain.

Given a code snippet, return:
- "summary": a 1–2 sentence summary
- "tags": 3–5 relevant tags

Code:
{code}
"""
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    return eval(response.choices[0].message.content)