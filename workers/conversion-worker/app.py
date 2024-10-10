from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
import boto3
import io
import librosa
import soundfile as sf

load_dotenv(override=True)

app = Flask(__name__)

s3_client = boto3.client('s3', 
                         aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'), 
                         aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'), 
                         region_name=os.getenv('AWS_REGION'))

@app.route('/', methods=['GET', 'POST'])
def test_route():
    return 'Conversion worker is live'

@app.route('/convert', methods=['POST'])
def convert_wav_to_mp3():
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

        # Download WAV file content
        wav_response = requests.get(signed_url)
        if wav_response.status_code != 200:
            raise Exception(f"Failed to download WAV file: {wav_response.status_code}")

        # Load audio data
        audio_data, sample_rate = librosa.load(io.BytesIO(wav_response.content), sr=None)

        # Prepare buffer for MP3
        mp3_buffer = io.BytesIO()
        
        # Write MP3 to buffer
        sf.write(mp3_buffer, audio_data, sample_rate, format='mp3')
        mp3_buffer.seek(0)

        # Upload MP3 to S3
        mp3_key = s3_key.rsplit('.', 1)[0] + '.mp3'
        s3_client.upload_fileobj(mp3_buffer, os.getenv('AWS_BUCKET_NAME'), mp3_key)

        return jsonify({"s3Key": mp3_key}), 200

    except Exception as e:
        return f'Error during conversion: {str(e)}', 500

if __name__ == '__main__':
    app.run(debug=True)