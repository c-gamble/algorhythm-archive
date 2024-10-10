import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import sys
import boto3
import traceback

load_dotenv(override=True)

app = Flask(__name__)

print("Flask app initialized")


@app.route("/", methods=["GET", "POST"])
def test_route():
    print("Test route accessed")
    return "aws worker is live"


@app.route("/signed-url", methods=["POST"])
def signed_url_endpoint():

    s3_key = request.json.get("s3Key")
    expiration_minutes = int(request.json.get("expirationMinutes"))
    print(f"Received track s3 key: {s3_key}")

    try:
        s3 = boto3.resource(
            "s3",
            region_name=os.getenv("AWS_REGION"),
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            config=boto3.session.Config(signature_version="s3v4"),
        )

        bucket_name = os.getenv("AWS_BUCKET_NAME")

        signed_url = s3.meta.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": s3_key},
            ExpiresIn=60 * expiration_minutes,
        )

        print(
            f"Generated signed url: {signed_url}, valid for {expiration_minutes} minutes."
        )

        return jsonify({"url": signed_url}), 200
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
