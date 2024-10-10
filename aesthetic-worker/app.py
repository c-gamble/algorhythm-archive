from quart import Quart, jsonify, request
from helpers import get_images_from_queries
import requests
from requests_ip_rotator import ApiGateway
import asyncio
import os
from dotenv import load_dotenv

load_dotenv(override=True)

app = Quart(__name__)

# Store the gateway and session in the app context
app.gateway = None
app.session = None


@app.before_serving
async def initialize_gateway():
    app.gateway = ApiGateway(
        "https://pinterest.com",
        access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        access_key_secret=os.getenv("AWS_ACCESS_KEY_SECRET"),
    )
    # Run the synchronous start method in a separate thread
    await asyncio.to_thread(app.gateway.start)
    app.session = requests.Session()
    app.session.mount("https://pinterest.com", app.gateway)


@app.after_serving
async def shutdown_gateway():
    if app.gateway:
        # Run the synchronous shutdown method in a separate thread
        await asyncio.to_thread(app.gateway.shutdown)


@app.route("/", methods=["GET"])
async def confirm():
    print("connection confirmed")
    return "Connection confirmed"


@app.route("/images", methods=["POST"])
async def get_images():
    try:
        data = await request.get_json()
        queries = data.get("queries")
        n_per = int(data.get("n_per", 2))
        if not queries:
            return jsonify({"error": "No queries provided"}), 400

        # Pass the session to get_images_from_queries
        image_urls = get_images_from_queries(queries, n_per, app.session)

        # Rest of your code...
        image_urls_agg = {}
        for image_url, query_labels in image_urls.items():
            if image_url not in image_urls_agg:
                image_urls_agg[image_url] = query_labels
            else:
                image_urls_agg[image_url] += query_labels

        image_urls_agg = {
            image_url: list(set(query_labels))
            for image_url, query_labels in image_urls_agg.items()
        }

        return jsonify(image_urls_agg)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
