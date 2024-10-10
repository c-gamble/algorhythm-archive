import requests
import base64
import datetime


class SpotifyRequester:
    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.auth_state = {"access_token": None, "expires_at": None}
        self.base_url = "https://api.spotify.com/v1"

    def _refresh_auth(self) -> None:
        auth_url = "https://accounts.spotify.com/api/token"
        auth_header = base64.b64encode(
            f"{self.client_id}:{self.client_secret}".encode()
        ).decode()
        headers = {"Authorization": f"Basic {auth_header}"}
        data = {"grant_type": "client_credentials"}

        response = requests.post(auth_url, headers=headers, data=data)
        response.raise_for_status()

        token_data = response.json()
        self.auth_state["access_token"] = token_data["access_token"]
        self.auth_state["expires_at"] = datetime.datetime.now() + datetime.timedelta(
            seconds=token_data["expires_in"]
        )

    def _ensure_valid_token(self) -> None:
        if (
            self.auth_state["expires_at"] is None
            or datetime.datetime.now() >= self.auth_state["expires_at"]
        ):
            self._refresh_auth()

    def make_request(
        self, endpoint: str, method: str = "GET", params: dict = None, data: dict = None
    ) -> dict:
        self._ensure_valid_token()

        url = f"{self.base_url}/{endpoint}"
        headers = {
            "Authorization": f"Bearer {self.auth_state['access_token']}",
            "Content-Type": "application/json",
        }

        response = requests.request(
            method, url, headers=headers, params=params, json=data
        )
        response.raise_for_status()

        return response.json()
