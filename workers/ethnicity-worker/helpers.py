from constants import (
    ETHNICITY_DISTRIBUTION_CALCULATION_PROMPT,
    ETHNICITY_EXPLAINABILITY_PROMPT,
)
import requests
import os
from dotenv import load_dotenv
import time

load_dotenv(override=True)


def calculate_ethnicity_distribution(
    lyrics, audio_features, additional_features
) -> dict:
    print(f"Starting calculate_ethnicity_distribution function")

    ethnicity_distribution = generate_text(
        ETHNICITY_DISTRIBUTION_CALCULATION_PROMPT,
        f"[A]: {lyrics}\n\n[B]: {audio_features}\n\n[C]: {additional_features}",
    )
    print(f"Generated ethnicity_distribution text: {ethnicity_distribution}")

    ethnicity_distribution = eval(ethnicity_distribution)
    print(f"Parsed ethnicity_distribution: {ethnicity_distribution}")

    return ethnicity_distribution


def explain_ethnicity(
    ethnicity: str, lyrics, audio_features, additional_features
) -> str:
    print(f"Starting explain_ethnicity function for ethnicity: {ethnicity}")

    # explanation = generate_text(
    #     ETHNICITY_EXPLAINABILITY_PROMPT,
    #     f"[A]: {ethnicity}\n\n[B]: {lyrics}\n\n[C]: {audio_features}\n\n[D]: {additional_features}",
    # )
    # print(f"Generated ethnicity explanation: {explanation[:100]}...")

    return ""


def get_ethnicity_distribution(lyrics, audio_features, additional_features) -> dict:
    print("Starting get_ethnicity_distribution function")
    ethnicity_distribution = calculate_ethnicity_distribution(
        lyrics, audio_features, additional_features
    )
    print(f"Calculated {len(ethnicity_distribution)} ethnicities")
    for i, ethnicity in enumerate(ethnicity_distribution):
        print(
            f"Processing ethnicity {i+1}/{len(ethnicity_distribution)}: {ethnicity['name']}"
        )
        ethnicity["value"] = int(ethnicity["value"])
        ethnicity["explanation"] = explain_ethnicity(
            f"{ethnicity['name']} {ethnicity['value']}",
            lyrics,
            audio_features,
            additional_features,
        )
    print("Finished get_ethnicity_distribution function")
    return ethnicity_distribution


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
