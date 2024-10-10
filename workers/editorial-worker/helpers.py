import os
import random
import time
import requests
import pandas as pd
from dotenv import load_dotenv
from constants import (
    EDITORIAL_PLAYLIST_PROMPT,
    PLAYLIST_DESCRIPTION_PROMPT,
    PLAYLIST_PITCH_PROMPT,
)

load_dotenv(override=True)


def find_playlists(lyrics, audio_features, additional_features, df):
    print(f"Starting find_playlists function with type: {type}")

    system_prompt = EDITORIAL_PLAYLIST_PROMPT

    print(f"Loaded dataframe with {len(df)} rows")

    def calculate_tag_similarity(row_tags, search_tags):
        if pd.isna(row_tags):
            return 0

        row_tag_set = set(tag.strip().lower() for tag in row_tags.split(","))
        search_tag_set = set(tag.strip().lower() for tag in search_tags)
        shared_tags = row_tag_set.intersection(search_tag_set)
        total_unique_tags = row_tag_set.union(search_tag_set)

        if not total_unique_tags:
            return 0

        similarity = len(shared_tags) / len(total_unique_tags)
        return similarity

    def is_playlist_valid(playlist_id):
        url = f"https://open.spotify.com/playlist/{playlist_id}"
        response = requests.get(url)
        return response.status_code == 200

    audio_features_string = "\n".join(
        [f"{feature}: {value}" for feature, value in audio_features.items()]
    )
    additional_features_string = "\n".join(
        [f"{feature}: {value}" for feature, value in additional_features.items()]
    )

    input_text = f"[A]: {lyrics}\n\n[B]: {audio_features_string}\n\n[C]: {additional_features_string}"
    print("Generating tags using OpenAI...")
    output = generate_text(system_prompt, input_text)
    print(f"Generated tags: {output}")

    tags = [tag.strip().lower() for tag in output.split(",")]

    print("Calculating tag similarity...")
    df["tag_similarity"] = df["Tags"].apply(lambda x: calculate_tag_similarity(x, tags))

    df = df.dropna(subset=["Tags"])
    print(f"Dataframe after removing NaN Tags: {len(df)} rows")

    df_sorted = df.sort_values(
        ["tag_similarity", "28-Day Change(%)"], ascending=[False, False]
    )

    valid_playlists = []
    index = 0

    while len(valid_playlists) < 3 and index < len(df_sorted):
        playlist = df_sorted.iloc[index]

        playlist_id = playlist["Spotify Playlist URL"].split("/")[-1]

        if is_playlist_valid(playlist_id):
            valid_playlists.append(
                {
                    "name": playlist["Name"],
                    "tags": playlist["Tags"],
                    "playlist_id": playlist_id,
                }
            )

        index += 1

    if len(valid_playlists) < 3:
        print(f"Warning: Only found {len(valid_playlists)} valid playlists")

    print(f"Returning {len(valid_playlists)} valid playlist infos")
    return valid_playlists


def describe_playlist(playlist_title, playlist_tags) -> str:
    print(f"Describing playlist: {playlist_title}")
    description = generate_text(
        PLAYLIST_DESCRIPTION_PROMPT, f"[A]: {playlist_title}\n\n[B]: {playlist_tags}"
    )
    print(f"Generated description: {description[:100]}...")
    return description


def write_pitch(
    playlist_title,
    playlist_tags,
    lyrics,
    audio_features,
    additional_features,
    track_title,
) -> str:
    print(f"Writing pitch for playlist: {playlist_title}")
    audio_features_string = "\n".join(
        [f"{feature}: {value}" for feature, value in audio_features.items()]
    )
    additional_features_string = "\n".join(
        [f"{feature}: {value}" for feature, value in additional_features.items()]
    )

    pitch = generate_text(
        PLAYLIST_PITCH_PROMPT,
        f"[A]: {playlist_title}\n\n[B]: {playlist_tags}\n\n[C]: {lyrics}\n\n[D]: {audio_features_string}\n\n[E]: {additional_features_string}\n\n[F]: {track_title}",
    )
    print(f"Generated pitch: {pitch[:100]}...")
    return pitch


def get_playlist_object(playlist_obj_with_pitch) -> dict:
    print(f"Getting playlist object for: {playlist_obj_with_pitch['playlist_id']}")
    playlist_response = requests.post(
        os.getenv("SPOTIFY_WORKER_URL"),
        json={
            "endpoint": f"playlists/{playlist_obj_with_pitch['playlist_id']}",
            "method": "GET",
            "params": None,
        },
    )
    playlist_response = playlist_response.json()["response"]
    playlist = {
        "name": playlist_response["name"],
        "imageURL": playlist_response["images"][0]["url"],
        "description": playlist_obj_with_pitch["description"],
        "spotifyURL": playlist_response["external_urls"]["spotify"],
        "suggestedPitch": playlist_obj_with_pitch["suggested_pitch"],
    }

    print(f"Retrieved playlist object: {playlist['name']}")
    return playlist


def get_editorial_playlists(
    lyrics, audio_features, additional_features, df, track_title
) -> dict:
    print("Starting get_editorial_playlists")

    print("Finding editorial playlists")
    playlist_infos = find_playlists(lyrics, audio_features, additional_features, df)
    print(f"Found {len(playlist_infos)} editorial playlists")

    print("Generating descriptions for playlists")
    playlist_infos_with_descriptions = []
    for i, playlist_info in enumerate(playlist_infos):
        print(
            f"Generating description for playlist {i+1}/{len(playlist_infos)}: {playlist_info['name']}"
        )
        description = describe_playlist(playlist_info["name"], playlist_info["tags"])
        playlist_info["description"] = description
        playlist_infos_with_descriptions.append(playlist_info)

    print("Generating pitches for playlists")
    playlist_infos_with_pitches = []
    for i, playlist_info in enumerate(playlist_infos_with_descriptions):
        print(
            f"Generating pitch for playlist {i+1}/{len(playlist_infos_with_descriptions)}: {playlist_info['name']}"
        )
        pitch = write_pitch(
            playlist_info["name"],
            playlist_info["tags"],
            lyrics,
            audio_features,
            additional_features,
            track_title,
        )

        playlist_info["suggested_pitch"] = pitch
        playlist_infos_with_pitches.append(playlist_info)

    print("Getting playlist objects")
    result = [
        get_playlist_object(playlist_info)
        for playlist_info in playlist_infos_with_pitches
    ]
    print(f"Retrieved {len(result)} editorial playlist objects")
    return result


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
