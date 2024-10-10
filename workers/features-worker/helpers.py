import os
import time
from essentia.standard import TensorflowPredict2D
from typing import Dict
from constants.themes import THEMES
from constants.genres import GENRES


def load_model(model_name, input_=None, output=None):
    print(f"Loading model: {model_name}")
    start_time = time.time()
    current_path = os.path.dirname(os.path.abspath(__file__))
    model_path = f"{current_path}/./models/weights/{model_name}.pb"
    if input_ and output:
        model = TensorflowPredict2D(
            graphFilename=model_path, input=input_, output=output
        )
    elif input_:
        model = TensorflowPredict2D(graphFilename=model_path, input=input_)
    elif output:
        model = TensorflowPredict2D(graphFilename=model_path, output=output)
    else:
        model = TensorflowPredict2D(graphFilename=model_path)
    end_time = time.time()
    print(
        f"Model {model_name} loaded. Loading time: {end_time - start_time:.4f} seconds"
    )
    return model


def predict_and_process(model, embeddings, process_func):
    # print(f"Making prediction with model: {model}")
    start_time = time.time()
    output = model(embeddings)
    processed_output = process_func(output)
    end_time = time.time()
    print(
        f"Prediction and processing completed. Time taken: {end_time - start_time:.4f} seconds"
    )
    print(f"Result: {processed_output}")
    return processed_output


def get_danceability(embeddings) -> float:
    model = load_model("danceability", output="model/Softmax")
    return predict_and_process(model, embeddings, lambda x: x.mean(axis=0)[0])


def get_acousticness(embeddings) -> float:
    model = load_model("acousticness", output="model/Softmax")
    return predict_and_process(model, embeddings, lambda x: x.mean(axis=0)[0])


def get_aggressiveness(embeddings) -> float:
    model = load_model("aggressiveness", output="model/Softmax")
    return predict_and_process(model, embeddings, lambda x: x.mean(axis=0)[0])


def get_electronicness(embeddings) -> float:
    model = load_model("electronicness", output="model/Softmax")
    return predict_and_process(model, embeddings, lambda x: x.mean(axis=0)[0])


def get_happiness(embeddings) -> float:
    model = load_model("happiness", output="model/Softmax")
    return predict_and_process(model, embeddings, lambda x: x.mean(axis=0)[0])


def get_partiness(embeddings) -> float:
    model = load_model("partiness", output="model/Softmax")
    return predict_and_process(model, embeddings, lambda x: x.mean(axis=0)[0])


def get_relaxation(embeddings) -> float:
    model = load_model("relaxation", output="model/Softmax")
    return predict_and_process(model, embeddings, lambda x: x.mean(axis=0)[0])


def get_nicheness(embeddings) -> float:
    model = load_model("nicheness", output="model/Identity")
    return predict_and_process(model, embeddings, lambda x: 1 - x.mean(axis=0)[0])


def get_immersiveness(embeddings) -> float:
    model = load_model("immersiveness", output="model/Identity")
    return predict_and_process(model, embeddings, lambda x: x.mean(axis=0)[0])


def get_sadness(embeddings) -> float:
    model = load_model("sadness", output="model/Softmax")
    return predict_and_process(model, embeddings, lambda x: x.mean(axis=0)[0])


def get_themes(embeddings) -> Dict[str, float]:
    print("Starting get_themes function")
    start_time = time.time()

    model = load_model("themes")
    output = model(embeddings)
    agg = output.mean(axis=0)

    print("Processing theme outputs")
    theme_mapping = {THEMES[i]: agg[i] for i in range(len(THEMES))}
    sorted_themes = sorted(
        theme_mapping.keys(), key=lambda x: theme_mapping[x], reverse=True
    )
    top_ten_themes = {theme: theme_mapping[theme] for theme in sorted_themes[:10]}
    top_ten_sum = sum(top_ten_themes.values())
    unused_sum = 1 - top_ten_sum
    for theme in top_ten_themes:
        top_ten_themes[theme] += unused_sum / 10

    result = [
        {"name": theme, "value": value} for theme, value in top_ten_themes.items()
    ]

    end_time = time.time()
    print(
        f"get_themes function completed. Execution time: {end_time - start_time:.4f} seconds"
    )
    print(f"Top 10 themes: {result}")
    return result


def get_timbre(embeddings) -> float:
    model = load_model("timbre", output="model/Softmax")
    return predict_and_process(model, embeddings, lambda x: x.mean(axis=0)[0])


def get_tonality(embeddings) -> float:
    model = load_model("tonality", output="model/Softmax")
    return predict_and_process(model, embeddings, lambda x: x.mean(axis=0)[0])


def get_vocal_gender(embeddings) -> str:
    print("Starting get_vocal_gender function")
    start_time = time.time()

    model = load_model("vocal_gender", output="model/Softmax")
    output = model(embeddings)
    agg = output.mean(axis=0)
    female, male = agg[0], agg[1]

    if female > male:
        result = f"{agg[0]*100:.2f}% female"
    else:
        result = f"{agg[1]*100:.2f}% male"

    end_time = time.time()
    print(
        f"get_vocal_gender function completed. Execution time: {end_time - start_time:.4f} seconds"
    )
    print(f"Result: {result}")
    return result


def get_voiceness(embeddings) -> float:
    model = load_model("voiceness", output="model/Softmax")
    return predict_and_process(model, embeddings, lambda x: x.mean(axis=0)[0])


def get_genres(embeddings) -> Dict[str, float]:
    print("Starting get_genres function")
    start_time = time.time()

    model = load_model(
        "genres", input_="serving_default_model_Placeholder", output="PartitionedCall:0"
    )
    output = model(embeddings)
    agg = output.mean(axis=0)

    print("Processing genre outputs")
    genre_mapping = {GENRES[i]: agg[i] for i in range(len(GENRES))}
    sorted_genres = sorted(
        genre_mapping.keys(), key=lambda x: genre_mapping[x], reverse=True
    )
    top_five_genres = {genre: genre_mapping[genre] for genre in sorted_genres[:5]}
    top_five_sum = sum(top_five_genres.values())
    unused_sum = 1 - top_five_sum
    for genre in top_five_genres:
        top_five_genres[genre] += unused_sum / 5

    result = [
        {"name": genre, "value": value} for genre, value in top_five_genres.items()
    ]

    end_time = time.time()
    print(
        f"get_genres function completed. Execution time: {end_time - start_time:.4f} seconds"
    )
    print(f"Top 5 genres: {result}")
    return result
