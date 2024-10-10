from constants import (
    CITIES_CALCULATION_PROMPT,
    CITY_EXPLAINABILITY_PROMPT,
)
import requests
import os
from dotenv import load_dotenv
import time
from geopy.geocoders import Nominatim
from typing import List


load_dotenv(override=True)


def get_coordinates(city_name: str) -> List[float]:  # [lat, long]
    print(f"Starting get_coordinates function for city: {city_name}")

    print("Initializing Nominatim geolocator...")
    geolocator = Nominatim(user_agent="myapplication")
    print("Geolocator initialized successfully")

    print(f"Attempting to geocode '{city_name}'...")
    location = geolocator.geocode(city_name)

    if location:
        print(f"Geocoding successful for '{city_name}'")
        print(f"Latitude: {location.latitude}, Longitude: {location.longitude}")
        return [location.longitude, location.latitude]
    else:
        print(f"Geocoding failed for '{city_name}'. No location found.")
        return None


def calculate_cities(lyrics, audio_features, additional_features) -> dict:
    print(f"Starting calculate_cities function")

    cities = generate_text(
        CITIES_CALCULATION_PROMPT,
        f"[A]: {lyrics}\n\n[B]: {audio_features}\n\n[C]: {additional_features}",
    )
    print(f"Generated cities text: {cities}")

    cities = eval(cities)
    print(f"Parsed cities: {cities}")

    return cities


def explain_city(city: str, lyrics, audio_features, additional_features) -> str:
    print(f"Starting explain_city function for city: {city}")

    # explanation = generate_text(
    #     CITY_EXPLAINABILITY_PROMPT,
    #     f"[A]: {city}\n\n[B]: {lyrics}\n\n[C]: {audio_features}\n\n[D]: {additional_features}",
    # )
    # print(f"Generated city explanation: {explanation[:100]}...")

    return ""


def get_cities(lyrics, audio_features, additional_features) -> dict:
    print("Starting get_cities function")
    cities = calculate_cities(lyrics, audio_features, additional_features)
    print(f"Calculated {len(cities)} cities")
    for i, city in enumerate(cities):
        print(f"Processing city {i+1}/{len(cities)}: {city['name']}")
        city["weight"] = int(city["weight"])
        city["coordinates"] = get_coordinates(city["name"])
        city["explanation"] = explain_city(
            f"{city['name']} {city['weight']}",
            lyrics,
            audio_features,
            additional_features,
        )
    print("Finished get_cities function")
    return cities


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
