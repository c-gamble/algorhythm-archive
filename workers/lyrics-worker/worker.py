import os
from dotenv import load_dotenv
import requests
from flask import Flask, request, jsonify
from io import BytesIO
import sys
from lyrics_extraction import process_audio_url
import traceback

load_dotenv(override=True)

app = Flask(__name__)
print("Pre-production Flask app initialized")


@app.route("/", methods=["GET", "POST"])
def test_route():
    print("Test route accessed")
    return "lyrics worker is live"


@app.route("/lyrics", methods=["POST"])
def lyrics_endpoint():

    s3_key = request.json.get("s3Key")
    print(f"Received track s3 key: {s3_key}")

    try:
        print("Getting signed URL")
        signed_url_response = requests.post(
            os.getenv("AWS_WORKER_URL") + "/signed-url",
            json={"s3Key": s3_key, "expirationMinutes": 2},
        )

        if signed_url_response.status_code != 200:
            raise Exception(f"Failed to get signed URL: {signed_url_response.text}")

        signed_url = signed_url_response.json().get("url")
        print(f"Signed URL obtained: {signed_url}")

        transcription = process_audio_url(signed_url)

        return (
            jsonify(
                {"lyrics": transcription.text, "word_timestamps": transcription.words}
            ),
            200,
        )

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
