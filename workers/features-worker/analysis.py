import os
import json
import random
from essentia.standard import TensorflowPredictEffnetDiscogs
from helpers import (
    get_danceability,
    get_acousticness,
    get_aggressiveness,
    get_electronicness,
    get_happiness,
    get_partiness,
    get_relaxation,
    get_nicheness,
    get_immersiveness,
    get_sadness,
    get_themes,
    get_timbre,
    get_tonality,
    get_vocal_gender,
    get_voiceness,
    get_genres,
)
from utils import quantize_dict


def get_audio_features(embeddings) -> dict:
    print("Calculating audio features...")
    return {
        "danceability": get_danceability(embeddings),
        "acousticLevel": get_acousticness(embeddings),
        "energy": 1 - get_relaxation(embeddings),
        "vocalMode": get_voiceness(embeddings),
        "timbre": get_timbre(embeddings),
        "immersiveness": get_immersiveness(embeddings),
    }


def get_additional_features(embeddings) -> dict:
    print("Calculating additional features...")
    return {
        "aggressiveness": get_aggressiveness(embeddings),
        "electronicness": get_electronicness(embeddings),
        "happiness": get_happiness(embeddings),
        "partiness": get_partiness(embeddings),
        "nicheness": get_nicheness(embeddings),
        "sadness": get_sadness(embeddings),
        "themes": get_themes(embeddings),
        "tonality": get_tonality(embeddings),
        "vocalGender": get_vocal_gender(embeddings),
    }


def get_analysis(audio) -> dict:
    print("Generating track Analysis...")
    current_path = os.path.dirname(os.path.abspath(__file__))
    embedding_model = TensorflowPredictEffnetDiscogs(
        graphFilename=f"{current_path}/./models/weights/embeddings.pb",
        output="PartitionedCall:1",
    )
    embeddings = embedding_model(audio)
    print("Calculated embeddings with shape:", embeddings.shape)

    audio_features = get_audio_features(embeddings)
    quantized_audio_features = quantize_dict(audio_features)

    additional_features = get_additional_features(embeddings)
    quantized_additional_features = quantize_dict(additional_features)

    return {
        "audioFeatures": audio_features,
        "quantizedAudioFeatures": quantized_audio_features,
        "additionalFeatures": additional_features,
        "quantizedAdditionalFeatures": quantized_additional_features,
        "genres": get_genres(embeddings),
    }
