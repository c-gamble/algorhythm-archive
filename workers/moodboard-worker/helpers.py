from constants import (
    GENRE_DESCRIPTION_PROMPT,
    AESTHETIC_SELECTION_FROM_GENRE_PROMPT,
    AESTHETIC_SELECTION_FROM_LYRICS_PROMPT,
    QUERY_SUFFIX_MAPPING,
)
import random
import requests
from requests.exceptions import RequestException
import os
from dotenv import load_dotenv
import time

load_dotenv(override=True)


def get_moodboard(lyrics, genres) -> dict:
    print("Starting get_moodboard function")

    # sort genres by value
    genres = sorted(genres, key=lambda x: x["value"], reverse=True)
    genre = genres[0]["name"]
    genre_description_prompt = f"[A]: {genre}"
    genre_description = generate_text(
        GENRE_DESCRIPTION_PROMPT, genre_description_prompt
    )

    aesthetic_selection_from_genre_prompt = f"[A]: {genre}, {genre_description}"
    aesthetic_selection_from_genre = eval(
        generate_text(
            AESTHETIC_SELECTION_FROM_GENRE_PROMPT, aesthetic_selection_from_genre_prompt
        )
    )
    print(f"Aesthetic selection from genre: {aesthetic_selection_from_genre}")

    aesthetic_selection_from_lyrics_prompt = f"[A]: {lyrics}"
    aesthetic_selection_from_lyrics = eval(
        generate_text(
            AESTHETIC_SELECTION_FROM_LYRICS_PROMPT,
            aesthetic_selection_from_lyrics_prompt,
        )
    )
    print(f"Aesthetic selection from lyrics: {aesthetic_selection_from_lyrics}")

    all_aesthetics = aesthetic_selection_from_genre + aesthetic_selection_from_lyrics
    all_aesthetics = [aesthetic.lower() for aesthetic in all_aesthetics]
    all_aesthetics = list(set(all_aesthetics))
    selected_aesthetics = random.sample(all_aesthetics, 3)

    all_queries = []
    for query in selected_aesthetics:
        if query in QUERY_SUFFIX_MAPPING:
            query += " " + QUERY_SUFFIX_MAPPING[query]
        else:
            query += " aesthetic"
        all_queries.append(query)
    print("All queries:", all_queries)
    labeled_queries = [
        {"query": query, "labels": selected_aesthetics} for query in all_queries
    ]
    print("Queries:", labeled_queries)

    max_retries = 3
    retry_delay = 1  # seconds

    for attempt in range(max_retries):
        try:
            image_results_response = requests.post(
                f'{os.getenv("AESTHETIC_WORKER_URL")}/images',
                json={"queries": labeled_queries, "n_per": 10},
                timeout=10,  # Add a timeout to prevent hanging
            )
            image_results_response.raise_for_status()  # Raise an exception for non-200 status codes
            break  # If successful, break out of the retry loop
        except RequestException as e:
            print(f"Attempt {attempt + 1} failed: {str(e)}")
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2  # Exponential backoff
            else:
                print("Max retries reached. Unable to get image results.")
                raise  # Re-raise the last exception if all retries fail

    print(
        f"Received response from aesthetic worker: {image_results_response.status_code}, {image_results_response.text}"
    )
    image_results = image_results_response.json()
    print(f"Image results: {image_results}")

    moodboard = {
        "keywords": list(
            set(
                [keyword for keywords in image_results.values() for keyword in keywords]
            )
        ),
        "images": [
            {"imageURL": url, "keywords": keywords}
            for url, keywords in image_results.items()
        ],
    }

    print(f"Found a total of {len(image_results)} images for the moodboard")
    return moodboard


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

    return response.json()["choices"][0]["message"]["content"]
