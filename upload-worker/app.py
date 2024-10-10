import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from helpers.spotify_requester import SpotifyRequester
from helpers.chartmetric_requester import ChartmetricRequester
from helpers.upload_mp3 import upload_spotify_track

load_dotenv(override=True)

app = Flask(__name__)
spotify_requester = SpotifyRequester(
    os.getenv("SPOTIFY_CLIENT_ID"), os.getenv("SPOTIFY_CLIENT_SECRET")
)
chartmetric_requester = ChartmetricRequester(os.getenv("CHARTMETRIC_REFRESH_TOKEN"))


@app.route("/upload", methods=["POST"])
def upload():

    spotify_url = request.json.get("spotifyURL")
    bucket_name = request.json.get("bucketName")
    s3_key = request.json.get("s3Key")

    if not spotify_url:
        return jsonify({"error": "No Spotify URL provided"}), 400

    try:
        downloaded_file_path = upload_spotify_track(
            spotify_url, bucket_name, s3_key, spotify_requester, chartmetric_requester
        )

        if downloaded_file_path is None:
            print("Failed to download track")
            return jsonify({"error": "Failed to download track"}), 500

        return (
            jsonify(
                {
                    "message": "Track downloaded successfully",
                    "track": downloaded_file_path,
                }
            ),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
