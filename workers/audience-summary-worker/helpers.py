from constants import AUDIENCE_SUMMARY_PROMPT
import requests
import os
import time
from dotenv import load_dotenv

load_dotenv(override=True)


def get_summary(
    cities,
    age_distribution,
    sex_distribution,
    ethnicity_distribution,
    lyrics,
    audio_features,
    additional_features,
) -> str:
    print("Starting get_summary function")
    summary = generate_text(
        AUDIENCE_SUMMARY_PROMPT,
        f"[A]: {cities}\n\n[B]: {age_distribution}\n\n[C]: {sex_distribution}\n\n[D]: {ethnicity_distribution}\n\n[E]: {lyrics}\n\n[F]: {audio_features}\n\n[G]: {additional_features}",
    )
    print(f"Generated summary with {len(summary)} characters")
    return summary


def generate_text(system_prompt: str, instance_prompt: str) -> str:
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
