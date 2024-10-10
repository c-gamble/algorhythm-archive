import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import requests

load_dotenv(override=True)

app = Flask(__name__)

print("Flask app initialized")


@app.route("/", methods=["GET", "POST"])
def test_route():
    print("Test route accessed")
    return "chartmetric worker is live"


@app.route("/chartmetric-id", methods=["POST"])
def chartmetric_id_endpoint():

    artist_name = request.json.get("artistName")
    print(f"Received request for artist: {artist_name}")

    try:
        response = requests.post(os.getenv("CHARTMETRIC_WORKER_URL"), json={
            "endpoint": "search",
            "method": "GET",
            "params": {
                "q": artist_name,
                "limit": 10,
                "type": "artists"
            }
        })

        response = response.json()["response"]
        chartmetric_id = response['obj']['artists'][0]['id']

    except:
        chartmetric_id = None
    
    return jsonify({"chartmetric_id": chartmetric_id}), 200

@app.route("/spotify-url", methods=["POST"])
def spotify_url_endpoint():

    artist_name = request.json.get("artistName")
    print(f"Received request for artist: {artist_name}")

    try:
        response = requests.post(os.getenv("SPOTIFY_WORKER_URL"), json={
            "endpoint": "search",
            "method": "GET",
            "params": {
                "q": artist_name,
                "type": "artist"
            }
        })

        response = response.json()["response"]
        spotify_url = response["artists"]["items"][0]["external_urls"]["spotify"]

    except:
        spotify_url = None
    
    return jsonify({"spotify_url": spotify_url}), 200

@app.route("/spotify-id", methods=["POST"])
def spotify_id_endpoint():

    artist_name = request.json.get("artistName")
    print(f"Received request for artist: {artist_name}")

    try:
        response = requests.post(os.getenv("SPOTIFY_WORKER_URL"), json={
            "endpoint": "search",
            "method": "GET",
            "params": {
                "q": artist_name,
                "type": "artist"
            }
        })

        response = response.json()["response"]
        spotify_id = response["artists"]["items"][0]["id"]

    except:
        spotify_id = None
    
    return jsonify({"spotify_id": spotify_id}), 200

@app.route("/instagram-url", methods=["POST"])
def instagram_url_endpoint():

    artist_chartmetric_id = request.json.get("artistChartmetricID")
    print(f"Received request for artist: {artist_chartmetric_id}")

    try:
        response = requests.post(os.getenv("CHARTMETRIC_WORKER_URL"), json={
            "endpoint": f"artist/{artist_chartmetric_id}/urls",
            "method": "GET",
            "params": None
        })

        response = response.json()["response"]
        instagram_url = [
            url["url"]
            for url in response["obj"]
            if url["domain"] == "instagram"
        ][0][0]

    except:
        instagram_url = None
    
    return jsonify({"instagram_url": instagram_url}), 200

@app.route("/overview", methods=["POST"])
def overview_endpoint():

    artist_chartmetric_id = request.json.get("artistChartmetricID")
    print(f"Received request for artist: {artist_chartmetric_id}")

    try:
        metadata_response = requests.post(os.getenv("CHARTMETRIC_WORKER_URL"), json={
            "endpoint": f"artist/{artist_chartmetric_id}",
            "method": "GET",
            "params": None
        })
        metadata_response = metadata_response.json()["response"]
        description = metadata_response["obj"]["description"]

        genres = []
        for key in metadata_response["obj"]["genres"]:
            if key == "primary":
                genres.append(metadata_response["obj"]["genres"][key]['name'])
                continue

            for genre in metadata_response["obj"]["genres"][key]:
                genres.append(genre["name"])

        overview = ", ".join(genres) + ". " + description if description else ", ".join(genres) + "."

    except:
        overview = None
    
    return jsonify({"overview": overview}), 200

if __name__ == "__main__":
    print("Starting Flask app")
    app.run(debug=False)
