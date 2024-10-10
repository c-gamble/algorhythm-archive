import os
from dotenv import load_dotenv
import requests
from flask import Flask, request, jsonify
import essentia
import tempfile
from analysis import get_analysis
from utils import convert_to_serializable
import sys
import traceback

load_dotenv(override=True)

app = Flask(__name__)
print("Flask app initialized")


class MonoLoader(essentia.standard.MonoLoader):
    def configure(self, **kwargs):
        print(f"MonoLoader.configure called with kwargs: {kwargs}")
        if "filename" in kwargs and self.is_url(kwargs["filename"]):
            temp_file = self.download_file(kwargs["filename"])
            kwargs["filename"] = temp_file
        super().configure(**kwargs)

    @staticmethod
    def is_url(filename):
        return filename.startswith(("http://", "https://", "ftp://"))

    @staticmethod
    def download_file(url):
        print(f"Downloading file from URL: {url}")
        response = requests.get(url)
        if response.status_code == 200:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
                temp_file.write(response.content)
                print(f"File downloaded and saved temporarily as: {temp_file.name}")
                return temp_file.name
        else:
            print(f"Failed to download file from {url}")
            raise RuntimeError(f"Failed to download file from {url}")

    def __del__(self):
        if hasattr(self, "_temp_file") and os.path.exists(self._temp_file):
            os.unlink(self._temp_file)
            print(f"Temporary file {self._temp_file} deleted")


@app.route("/", methods=["GET", "POST"])
def test_route():
    print("Test route accessed")
    return "features worker is live"


@app.route("/features", methods=["POST"])
def get_features():
    print("Features endpoint called")

    s3_key = request.json.get("s3Key")
    print(f"Received track: {s3_key}")

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

        loader = MonoLoader(filename=signed_url)
        audio = loader()

        print("Audio loaded")

        analysis = get_analysis(audio)
        results = convert_to_serializable(analysis)

        return jsonify(results), 200
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
