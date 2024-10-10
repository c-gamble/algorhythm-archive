import demucs.separate
import os
import traceback
import assemblyai as aai
import requests
from openai import OpenAI
import time
from dotenv import load_dotenv
import shutil

load_dotenv(override=True)

aai.settings.api_key = os.getenv("ASSEMBLY_AI_API_KEY")
transcriber = aai.Transcriber()

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
print("OpenAI client initialized")

def process_audio_url(url):
    def getVocals(audio_bytes):
        try:
            start_time = time.time()
            
            temp_dir = "temp"
            os.makedirs(temp_dir, exist_ok=True)
            audio_path = os.path.join(temp_dir, "audio.mp3")
            
            with open(audio_path, "wb") as f:
                f.write(audio_bytes)

            output_dir = temp_dir
            demucs.separate.main(["--mp3", "--two-stems", "vocals", "-n", "e51eebcc", "-o", output_dir, audio_path])

            vocals_path = os.path.join(output_dir, "e51eebcc", "audio", "vocals.mp3")
            if not os.path.exists(vocals_path):
                raise FileNotFoundError(f"Vocals file not found at expected path: {vocals_path}")

            with open(vocals_path, "rb") as f:
                vocals_bytes = f.read()

            end_time = time.time()
            vocal_extraction_time = end_time - start_time
            print(f"Vocal extraction time: {vocal_extraction_time:.2f} seconds")

            return vocals_bytes
        except Exception as e:
            print(f"An error occurred during separation: {e}")
            traceback.print_exc()
            return None

    def getLyrics(vocals_bytes):
        start_time = time.time()
        
        vocals_path = os.path.join("temp", "vocals.mp3")
        with open(vocals_path, "wb") as f:
            f.write(vocals_bytes)
        
        with open(vocals_path, "rb") as f:
            transcription = openai_client.audio.transcriptions.create(
                model="whisper-1",
                file=f,
                response_format="verbose_json",
                timestamp_granularities=["word"],
                language="en",
            )        
        
        end_time = time.time()
        lyrics_transcription_time = end_time - start_time
        print(f"Lyrics transcription time: {lyrics_transcription_time:.2f} seconds")
        
        return transcription

    try:
        response = requests.get(url)
        response.raise_for_status()
        audio_bytes = response.content

        vocals_bytes = getVocals(audio_bytes)
        if vocals_bytes is None:
            return "Failed to extract vocals."

        lyrics = getLyrics(vocals_bytes)
        
        # Clean up temporary files
        shutil.rmtree("temp")
        
        return lyrics

    except requests.exceptions.RequestException as e:
        print(f"Error downloading the audio file: {e}")
        return "Failed to download the audio file."
    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()
        return "An error occurred while processing the audio."
    finally:
        # Ensure cleanup in case of any errors
        if os.path.exists("temp"):
            shutil.rmtree("temp")