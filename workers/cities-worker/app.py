from dotenv import load_dotenv
from flask import Flask, request, jsonify
from helpers import get_cities
import sys
import traceback

load_dotenv(override=True)

app = Flask(__name__)

print("Flask app initialized")


@app.route("/", methods=["GET", "POST"])
def test_route():
    print("Test route accessed")
    return "sex worker is live"


@app.route("/cities", methods=["POST"])
def cities_endpoint():

    lyrics = request.json.get("lyrics")
    audio_features = request.json.get("audioFeatures")
    additional_features = request.json.get("additionalFeatures")

    try:

        cities = get_cities(
            lyrics,
            audio_features,
            additional_features,
        )

        return jsonify(cities), 200
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
