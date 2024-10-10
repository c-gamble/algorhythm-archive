import requests
import datetime


class ChartmetricRequester:
    def __init__(self, refresh_token: str):
        self.refresh_token = refresh_token
        self.auth_state = {"access_token": None, "expires_at": None}
        self.base_url = "https://api.chartmetric.com/api"

    def _refresh_auth(self) -> None:
        auth_url = f"{self.base_url}/token"
        headers = {"Content-Type": "application/json"}
        data = {"refreshtoken": self.refresh_token}

        response = requests.post(auth_url, headers=headers, json=data)
        response.raise_for_status()

        token_data = response.json()
        self.auth_state["access_token"] = token_data["token"]
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
