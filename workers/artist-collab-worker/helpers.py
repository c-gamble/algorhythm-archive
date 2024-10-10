import os
import requests
from dotenv import load_dotenv

load_dotenv(override=True)


def get_artist_collaborations(artist_spotify_id) -> dict:
    print(f"Starting get_artist_collaborations for artist ID: {artist_spotify_id}")

    print("Fetching artist info")
    artist_info = requests.post(
        os.getenv("SPOTIFY_WORKER_URL"),
        json={
            "endpoint": f"artists/{artist_spotify_id}",
            "method": "GET",
            "params": None,
        },
    )
    artist_info = artist_info.json()["response"]
    artist_followers = artist_info["followers"]["total"]
    print(f"Artist has {artist_followers} followers")

    print("Fetching related artists")
    related_artists = requests.post(
        os.getenv("SPOTIFY_WORKER_URL"),
        json={
            "endpoint": f"artists/{artist_spotify_id}/related-artists",
            "method": "GET",
            "params": None,
        },
    )
    related_artists = related_artists.json()["response"]["artists"]
    print(f"Found {len(related_artists)} related artists")

    all_follower_counts = [artist["followers"]["total"] for artist in related_artists]
    min_followers = min(all_follower_counts)
    max_followers = max(all_follower_counts)
    print(f"Related artists follower range: {min_followers} - {max_followers}")

    smaller_artists = []
    perfect_artists = []
    larger_artists = []

    print("Categorizing related artists")
    for artist in related_artists:
        follower_count = artist["followers"]["total"]
        lower_bound = artist_followers * 0.5
        upper_bound = artist_followers * 1.5

        if follower_count < lower_bound:
            smaller_artists.append(artist)
        elif lower_bound <= follower_count <= upper_bound:
            perfect_artists.append(artist)
        else:
            larger_artists.append(artist)

    print(
        f"Categorized: {len(smaller_artists)} smaller, {len(perfect_artists)} perfect, {len(larger_artists)} larger"
    )

    smaller_artists.sort(
        key=lambda x: calculate_similarity(x["followers"]["total"], artist_followers),
        reverse=True,
    )
    perfect_artists.sort(
        key=lambda x: calculate_similarity(x["followers"]["total"], artist_followers),
        reverse=True,
    )
    larger_artists.sort(
        key=lambda x: calculate_similarity(x["followers"]["total"], artist_followers),
        reverse=True,
    )

    result = {
        "smaller": [
            create_custom_artist_object(artist, artist_followers)
            for artist in smaller_artists[:3]
        ],
        "perfect": [
            create_custom_artist_object(artist, artist_followers)
            for artist in perfect_artists[:3]
        ],
        "larger": [
            create_custom_artist_object(artist, artist_followers)
            for artist in larger_artists[:3]
        ],
    }

    print("Artist collaboration categorization complete")
    return result


def calculate_similarity(follower_count, artist_followers):
    if follower_count >= artist_followers:
        return (artist_followers / follower_count) * 100
    else:
        return (follower_count / artist_followers) * 100


def create_custom_artist_object(artist, artist_followers):
    similarity = calculate_similarity(artist["followers"]["total"], artist_followers)

    return {
        "name": artist["name"],
        "similarity": round(similarity, 2),
        "spotifyURL": artist["external_urls"]["spotify"],
        "spotifyID": artist["id"],
        "chartmetricID": get_artist_chartmetric_id(artist["name"]),
        "imageURL": artist["images"][0]["url"] if artist["images"] else None,
    }


def get_artist_chartmetric_id(artist_name: str):
    print(f"Attempting to get artist chartmetric id for artist: {artist_name}")

    try:
        response = requests.post(
            os.getenv("ARTISTS_WORKER_URL") + "/chartmetric-id",
            json={"artistName": artist_name},
        )
        response = response.json()
        chartmetric_id = response["chartmetric_id"]
    except:
        chartmetric_id = None

    return chartmetric_id
