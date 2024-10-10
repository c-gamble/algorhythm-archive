import numpy as np


def quantize_dict(input_dict, threshold=0.5, scale=10):
    def quantize_value(value):
        if isinstance(value, (float, int, np.number)):
            return round(float(value) * scale) if value >= threshold else 0
        else:
            return value

    return {key: quantize_value(value) for key, value in input_dict.items()}


def convert_to_serializable(obj):
    if isinstance(obj, np.generic):
        return obj.item()
    elif isinstance(obj, dict):
        return {key: convert_to_serializable(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_serializable(item) for item in obj]
    else:
        return obj
