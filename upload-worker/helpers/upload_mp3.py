import os
import io
import boto3
import requests
import time
from playwright.sync_api import sync_playwright


def upload_spotify_track(
    spotify_url: str,
    bucket_name: str,
    s3_key: str,
    spotify_requester,
    chartmetric_requester,
) -> dict:

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
            ],
        )
        context = browser.new_context(
            viewport={"width": 1280, "height": 720},
            accept_downloads=True,
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            device_scale_factor=1,
            is_mobile=False,
            has_touch=False,
        )
        page = context.new_page()

        # Set up ad blocking
        def block_ads(route):
            if (
                any(
                    ad_domain in route.request.url
                    for ad_domain in [
                        "cdn.ads.com",
                        "googleads.g.doubleclick.net",
                    ]
                )
                or "ads" in route.request.url
            ):
                route.abort()
            else:
                route.continue_()

        page.route("**/*", block_ads)

        try:
            page.goto(
                "https://spotifydown.com/", wait_until="networkidle", timeout=60000
            )
            page.wait_for_load_state("domcontentloaded")

            # focus on page
            page.mouse.click(100, 100)

            input_field = page.get_by_placeholder("https://open.spotify.com/..../....")
            input_field.wait_for(state="visible")
            input_field.fill(spotify_url)
            page.wait_for_timeout(1000)

            first_button = page.locator("button.bg-button", has_text="Download")
            first_button.wait_for(state="visible")
            first_button.click()
            page.wait_for_timeout(1000)

            second_button = None
            scroll_step = 50
            max_scroll = 5000
            current_scroll = 0

            while current_scroll < max_scroll:
                download_buttons = page.locator(
                    "button.bg-button", has_text="Download"
                ).all()
                visible_buttons = [
                    button for button in download_buttons if button.is_visible()
                ]

                if len(visible_buttons) > 0:
                    second_button = visible_buttons[0]
                    break

                page.evaluate(f"window.scrollBy(0, {scroll_step})")
                page.wait_for_timeout(200)
                current_scroll += scroll_step

            if not second_button:
                raise Exception("Second button not found")

            with page.expect_download() as download_info:
                second_button.click()
                download_link = page.wait_for_selector(
                    'a[download^="spotifydown.com"][href^="blob:"]',
                    state="visible",
                    timeout=60000,
                )
                download_link.click()

            download = download_info.value
            page.wait_for_timeout(5000)  # Wait for download to complete

            # Read the file content into memory
            file_content = io.BytesIO(download.path().read_bytes())

            # Upload to S3
            s3_client = boto3.client(
                "s3",
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                region_name=os.getenv("AWS_REGION"),
            )
            s3_client.upload_fileobj(file_content, bucket_name, f"audio/{s3_key}.mp3")

            print(
                f"File uploaded successfully to S3 bucket: {bucket_name}, key: {s3_key}"
            )

        finally:
            context.close()
            browser.close()

    spotify_id = ""
    if "track" in spotify_url:
        spotify_id = spotify_url.split("track/")[1].split("?")[0].rstrip("/")
    else:
        raise Exception("Invalid Spotify URL")

    try:
        spotify_response = spotify_requester.make_request(
            f"tracks/{spotify_id}", method="GET"
        )

        ids_response = chartmetric_requester.make_request(
            f"track/spotify/{spotify_response['id']}/get-ids", method="GET"
        )
        chartmetric_id = ids_response["obj"][0]["chartmetric_ids"][0]
        time.sleep(1)

        metadata_response = chartmetric_requester.make_request(
            f"track/{chartmetric_id}", method="GET"
        )

        artist_id = metadata_response["obj"]["artists"][0]["id"]
        time.sleep(1)

        social_urls_response = chartmetric_requester.make_request(
            f"artist/{artist_id}/urls", method="GET"
        )

        instagram_url = None
        for url_obj in social_urls_response["obj"]:
            if url_obj["domain"] == "instagram":
                instagram_url = url_obj["url"][0]
                break

        image_url = metadata_response["obj"]["image_url"]
        image_response = requests.get(image_url)
        image_response.raise_for_status()
        s3_image_key = f"images/{s3_key}.png"
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_REGION"),
        )
        s3_client.upload_fileobj(
            io.BytesIO(image_response.content), bucket_name, s3_image_key
        )
        s3_image_url = f"https://{bucket_name}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{s3_image_key}"

        track_response = {
            "name": spotify_response["name"],
            "artist": {
                "name": spotify_response["artists"][0]["name"],
                "instagramURL": instagram_url,
                "spotifyURL": spotify_response["artists"][0]["external_urls"][
                    "spotify"
                ],
            },
            "imageURL": s3_image_url,
            "s3Key": f"audio/{s3_key}.mp3",
        }

    except Exception as e:
        print(e)
        track_response = None

    return track_response
