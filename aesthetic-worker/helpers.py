import urllib.parse
from typing import List, Dict


def get_images_from_queries(
    queries: List[str], n_per: int, session
) -> Dict[str, List[str]]:
    def generate_query_link(query: str) -> str:
        query = urllib.parse.quote(query)
        return f"https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D{query}%26rs%3Dtyped&data=%7B%22options%22%3A%7B%22article%22%3A%22%22%2C%22appliedProductFilters%22%3A%22---%22%2C%22price_max%22%3Anull%2C%22price_min%22%3Anull%2C%22query%22%3A%22{query}%22%2C%22scope%22%3A%22pins%22%2C%22auto_correction_disabled%22%3A%22%22%2C%22top_pin_id%22%3A%22%22%2C%22filters%22%3A%22%22%7D%2C%22context%22%3A%7B%7D%7D"

    image_urls = {}

    for query in queries:
        url = generate_query_link(query["query"])
        print(f"Fetching images from {url}")
        response = session.get(url)
        response_data = response.json()

        images = []

        if (
            "results" not in response_data["resource_response"]["data"]
            or len(response_data["resource_response"]["data"]["results"]) == 0
        ):
            print(
                f'Found no images for query "{query["query"]} with labels {query["labels"]}"'
            )
            continue

        if "objects" in response_data["resource_response"]["data"]["results"][0]:
            for result_obj in response_data["resource_response"]["data"]["results"]:
                if "objects" in result_obj:
                    for obj in result_obj["objects"]:
                        if "images" in obj and "orig" in obj["images"]:
                            images.append(obj["images"]["orig"]["url"])
        else:
            for result_obj in response_data["resource_response"]["data"]["results"]:
                if "images" in result_obj and "orig" in result_obj["images"]:
                    images.append(result_obj["images"]["orig"]["url"])

        print(len(images), images)

        if len(images) < n_per:
            n_per = len(images)
        images = images[:n_per]

        print(
            f'Found {len(images)} images for query "{query["query"]} with labels {query["labels"]}"'
        )

        for image_url in images:
            if image_url in image_urls:
                image_urls[image_url] += query["labels"]
            else:
                image_urls[image_url] = query["labels"]

    return image_urls
