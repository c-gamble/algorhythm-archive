import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import sys
import pandas as pd
from helpers import get_third_party_playlists
import traceback

load_dotenv(override=True)

app = Flask(__name__)
df = pd.read_csv("third-party.csv")
print("Flask app initialized and dataframe loaded")


@app.route("/", methods=["GET", "POST"])
def test_route():
    print("Test route accessed")
    return "aws worker is live"


@app.route("/third-party-playlists", methods=["POST"])
def third_party_playlists_endpoint():

    lyrics = request.json.get("lyrics")
    audio_features = request.json.get("audioFeatures")
    additional_features = request.json.get("additionalFeatures")
    track_title = request.json.get("trackTitle")

    try:

        third_party_playlists = get_third_party_playlists(
            lyrics, audio_features, additional_features, df, track_title
        )

        return jsonify(third_party_playlists), 200
    except Exception as e:
        exc_type, exc_value, exc_traceback = sys.exc_info()

        # Get the full traceback as a string
        tb_str = "".join(traceback.format_exception(exc_type, exc_value, exc_traceback))

        # Extract filename and line number from the last frame of the traceback
        last_frame = traceback.extract_tb(exc_traceback)[-1]
        filename = last_frame.filename
        line_number = last_frame.lineno

        error_message = f"Error in {filename} at line {line_number}: {str(e)}"

        print(error_message)
        print(tb_str)  # Print the full traceback to the server logs

        # Return both the error message and the full traceback to the client
        return jsonify({"error": error_message, "traceback": tb_str}), 500


if __name__ == "__main__":
    print("Starting Flask app")
    app.run(debug=False)
