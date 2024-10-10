from constants import NOTABLE_MOMENTS_PROMPT
import json
import os
import requests
import time
from dotenv import load_dotenv

load_dotenv(override=True)


def get_notable_moments(transcription) -> list:
    print("Identifying notable moments...")
    notable_moments_response = generate_text(
        NOTABLE_MOMENTS_PROMPT,
        f'[A]: {transcription["lyrics"]}\n\n[B]: {json.dumps(transcription["word_timestamps"])}',
    )
    print(f"Notable moments response: {notable_moments_response}")
    notable_moments = eval(notable_moments_response)
    return notable_moments


def generate_text(system_prompt: str, instance_prompt: str) -> str:
    time.sleep(2)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}",
    }

    data = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": instance_prompt,
            },
        ],
    }

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers=headers,
        json=data,
    )

    print(f"Received response from OpenAI: {response.status_code}")
    print(f"Raw response from OpenAI: {response.json()}")

    if response.status_code != 200:
        return "A system error occurred."

    print(
        f'JSON Response from OpenAI: {response.json()["choices"][0]["message"]["content"]}'
    )

    return response.json()["choices"][0]["message"]["content"]
