MODELS = {
    "danceability": {
        "definition": "classification-heads/danceability/danceability-discogs-effnet-1.json",
        "weights": "classification-heads/danceability/danceability-discogs-effnet-1.pb",
    },
    "acousticness": {
        "definition": "classification-heads/mood_acoustic/mood_acoustic-discogs-effnet-1.json",
        "weights": "classification-heads/mood_acoustic/mood_acoustic-discogs-effnet-1.pb",
    },
    "aggressiveness": {
        "definition": "classification-heads/mood_aggressive/mood_aggressive-discogs-effnet-1.json",
        "weights": "classification-heads/mood_aggressive/mood_aggressive-discogs-effnet-1.pb",
    },
    "electronicness": {
        "definition": "classification-heads/mood_electronic/mood_electronic-discogs-effnet-1.json",
        "weights": "classification-heads/mood_electronic/mood_electronic-discogs-effnet-1.pb",
    },
    "happiness": {
        "definition": "classification-heads/mood_happy/mood_happy-discogs-effnet-1.json",
        "weights": "classification-heads/mood_happy/mood_happy-discogs-effnet-1.pb",
    },
    "partiness": {
        "definition": "classification-heads/mood_party/mood_party-discogs-effnet-1.json",
        "weights": "classification-heads/mood_party/mood_party-discogs-effnet-1.pb",
    },
    "relaxation": {
        "definition": "classification-heads/mood_relaxed/mood_relaxed-discogs-effnet-1.json",
        "weights": "classification-heads/mood_relaxed/mood_relaxed-discogs-effnet-1.pb",
    },
    "nicheness": {
        "definition": "classification-heads/approachability/approachability_regression-discogs-effnet-1.json",
        "weights": "classification-heads/approachability/approachability_regression-discogs-effnet-1.pb",
    },
    "immersiveness": {
        "definition": "classification-heads/engagement/engagement_regression-discogs-effnet-1.json",
        "weights": "classification-heads/engagement/engagement_regression-discogs-effnet-1.pb",
    },
    "sadness": {
        "definition": "classification-heads/mood_sad/mood_sad-discogs-effnet-1.json",
        "weights": "classification-heads/mood_sad/mood_sad-discogs-effnet-1.pb",
    },
    "themes": {
        "definition": "classification-heads/mtg_jamendo_moodtheme/mtg_jamendo_moodtheme-discogs-effnet-1.json",
        "weights": "classification-heads/mtg_jamendo_moodtheme/mtg_jamendo_moodtheme-discogs-effnet-1.pb",
    },
    "timbre": {
        "definition": "classification-heads/timbre/timbre-discogs-effnet-1.json",
        "weights": "classification-heads/timbre/timbre-discogs-effnet-1.pb",
    },
    "tonality": {
        "definition": "classification-heads/tonal_atonal/tonal_atonal-discogs-effnet-1.json",
        "weights": "classification-heads/tonal_atonal/tonal_atonal-discogs-effnet-1.pb",
    },
    "vocal_gender": {
        "definition": "classification-heads/gender/gender-discogs-effnet-1.json",
        "weights": "classification-heads/gender/gender-discogs-effnet-1.pb",
    },
    "voiceness": {
        "definition": "classification-heads/voice_instrumental/voice_instrumental-discogs-effnet-1.json",
        "weights": "classification-heads/voice_instrumental/voice_instrumental-discogs-effnet-1.pb",
    },
    "genres": {
        "definition": "classification-heads/genre_discogs400/genre_discogs400-discogs-effnet-1.json",
        "weights": "classification-heads/genre_discogs400/genre_discogs400-discogs-effnet-1.pb",
    },
    "embeddings": {
        "definition": "feature-extractors/discogs-effnet/discogs-effnet-bs64-1.json",
        "weights": "feature-extractors/discogs-effnet/discogs-effnet-bs64-1.pb",
    },
}
