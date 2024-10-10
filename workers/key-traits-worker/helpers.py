from constants import WORD_BANK, KEY_TRAITS_PROMPT
import random
import requests
import os
from dotenv import load_dotenv
import time

load_dotenv(override=True)


def get_key_traits(
    lyrics: str,
    audio_features: dict,
    quantized_audio_features: dict,
    additional_features: dict,
) -> list:

    features_strings = [
        f"{feature}: {value}" for feature, value in audio_features.items()
    ]
    features_strings += [
        f"{feature}: {value}" for feature, value in additional_features.items()
    ]
    features_string = "\n".join(features_strings)
    print("Features strings:", ", ".join(features_strings))

    key_trait_prompts = {}
    for feature in ["energy", "danceability", "acousticness"]:
        value = quantized_audio_features[
            feature if feature != "acousticness" else "acousticLevel"
        ]
        words = WORD_BANK[feature][value]
        for word in words:
            print(f"Generating key trait using {word}...")
            instance_prompt = f"[A]: {word}\n\n[B]: {features_string}\n\n[C]: {lyrics}"
            key_trait_prompts[word] = instance_prompt

    key_traits = []
    selected_traits = random.sample(list(key_trait_prompts.keys()), 4)
    for trait in selected_traits:
        key_trait = {
            "name": trait,
            "description": generate_text(KEY_TRAITS_PROMPT, key_trait_prompts[trait]),
        }
        key_traits.append(key_trait)

    return key_traits


def generate_text(system_prompt: str, instance_prompt: str) -> str:
    time.sleep(1)

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

    if response.status_code != 200:
        return "A system error occurred."

    print(
        f'JSON Response from OpenAI: {response.json()["choices"][0]["message"]["content"]}'
    )

    return response.json()["choices"][0]["message"]["content"]
