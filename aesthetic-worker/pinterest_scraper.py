import json
import os
from requests import get
from bs4 import BeautifulSoup as soup
from pydotmap import DotMap


class PinterestImageScraper:
    def __init__(self):
        self.json_data_list = []
        self.unique_img = []

    @staticmethod
    def clear():
        # Clear the console screen based on the OS
        if os.name == "nt":
            os.system("cls")
        else:
            os.system("clear")

    @staticmethod
    def get_pinterest_links(body, max_images: int):
        """
        Extract Pinterest links from the HTML body.

        Args:
            body (str): HTML content of the search result page.
            max_images (int): Maximum number of image links to retrieve.

        Returns:
            list: List of Pinterest URLs.
        """
        searched_urls = []
        html = soup(body, "html.parser")
        links = html.select("#b_results cite")
        for link in links:
            link = link.text
            if "pinterest" in link:
                searched_urls.append(link)
                # Stops adding links if the limit has been reached
                if max_images is not None and max_images == len(searched_urls):
                    break
        return searched_urls

    def get_source(self, url: str, proxies: dict) -> None:
        """
        Fetch the source code from the given Pinterest URL and extract JSON data.

        Args:
            url (str): Pinterest URL.
            proxies (dict): Dictionary of proxies to be used for the request.
        """
        try:
            res = get(url, proxies=proxies)
        except Exception:
            return
        html = soup(res.text, "html.parser")
        json_data = html.find_all("script", attrs={"id": "__PWS_INITIAL_PROPS__"})
        if not json_data:
            json_data = html.find_all("script", attrs={"id": "__PWS_DATA__"})
        self.json_data_list.append(json.loads(json_data[0].string) if json_data else {})

    def save_image_url(self, max_images: int) -> list:
        """
        Extract image URLs from the collected JSON data.

        Args:
            max_images (int): Maximum number of image URLs to extract.

        Returns:
            list: List of unique image URLs.
        """
        url_list = []
        for js in self.json_data_list:
            try:
                data = DotMap(js)
                if not data.initialReduxState and not data.props:
                    return []
                pins = (
                    data.initialReduxState.pins
                    if data.initialReduxState
                    else data.props.initialReduxState.pins
                )
                urls = [
                    (
                        i.get("url")
                        if isinstance(pins[pin].images.get("orig"), list)
                        else pins[pin].images.get("orig").get("url")
                    )
                    for pin in pins
                    for i in (
                        pins[pin].images.get("orig")
                        if isinstance(pins[pin].images.get("orig"), list)
                        else [pins[pin].images.get("orig")]
                    )
                ]
                url_list.extend(urls)
                if max_images is not None and len(url_list) >= max_images:
                    return list(set(url_list))
            except Exception:
                continue
        return list(set(url_list))

    @staticmethod
    def start_scraping(max_images, key=None, proxies={}):
        """
        Start the scraping process by performing a search and retrieving Pinterest links.

        Args:
            max_images (int): Maximum number of image links to retrieve.
            key (str): Keyword for searching images.
            proxies (dict): Dictionary of proxies to be used for the requests.

        Returns:
            tuple: Tuple containing the list of Pinterest URLs and the formatted keyword.
        """
        assert key is not None, "Please provide keyword for searching images"
        keyword = f"{key} pinterest".replace("+", "%20")
        url = f"https://www.bing.com/search?q={keyword}&first=1&FORM=PERE"
        res = get(
            url,
            proxies=proxies,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0"
            },
        )
        searched_urls = PinterestImageScraper.get_pinterest_links(
            res.content, max_images
        )
        return searched_urls, key.replace(" ", "_")

    def scrape(self, key=None, max_images=None):
        """
        Prepare for downloading images by scraping Pinterest URLs and extracting image URLs.

        Args:
            key (str): Keyword for searching images.

        Returns:
            bool: True if images were downloaded successfully, False otherwise.
        """
        extracted_urls, keyword = PinterestImageScraper.start_scraping(
            max_images=max_images, key=key
        )
        self.json_data_list = []
        self.unique_img = []

        print("[+] Saving JSON data ...")
        for url in extracted_urls:
            self.get_source(url, {})

        url_list = self.save_image_url(max_images=None)
        print(f"[+] Total {len(url_list)} files available to download.\n")

        return url_list
