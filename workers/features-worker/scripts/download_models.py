import os
import requests
import argparse
from constants.models import MODELS


BASE_URL = "https://essentia.upf.edu/models/"


def download_models(omit: list = []) -> None:

    for model_name, model_files in MODELS.items():
        if model_name in omit:
            print(f"Skipping {model_name}...")
            continue

        print(f"Downloading {model_name}...")
        for file_type, model_file in model_files.items():

            if file_type == "definition" and os.path.exists(
                f"models/definitions/{model_name}.json"
            ):
                print(f"{file_type} file exists for {model_name}, skipped.")
                continue
            if file_type == "weights" and os.path.exists(
                f"models/weights/{model_name}.pb"
            ):
                print(f"{file_type} file exists for {model_name}, skipped.")
                continue

            url = f"{BASE_URL}{model_file}"
            response = requests.get(url)

            if response.status_code == 200:
                os.makedirs(f"models/definitions", exist_ok=True)
                os.makedirs(f"models/weights", exist_ok=True)
                if file_type == "definition":
                    with open(f"models/definitions/{model_name}.json", "wb") as f:
                        f.write(response.content)
                elif file_type == "weights":
                    with open(f"models/weights/{model_name}.pb", "wb") as f:
                        f.write(response.content)
            else:
                print(f"Failed to download {model_name} {file_type} file.")

    print("Download complete.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download models.")
    parser.add_argument(
        "--omit",
        type=str,
        help="Comma-separated list of model names to omit from downloading.",
    )

    args = parser.parse_args()

    omit_list = args.omit.split(",") if args.omit else []

    download_models(omit=omit_list)
