import time
from collections import deque
import requests
import datetime


class RateLimiter:
    def __init__(self, max_requests_per_second):
        self.max_requests_per_second = max_requests_per_second
        self.request_times = deque()
        self.remaining_requests = max_requests_per_second
        self.reset_time = 0

    def wait_if_needed(self):
        current_time = time.time()

        # Remove old requests from the sliding window
        while self.request_times and current_time - self.request_times[0] >= 1:
            self.request_times.popleft()

        # If we've reached the limit, wait until reset time
        if len(self.request_times) >= self.max_requests_per_second:
            sleep_time = max(0, self.reset_time - current_time)
            time.sleep(sleep_time)

            # Clear the request times after waiting
            self.request_times.clear()

        # Add the current request time
        self.request_times.append(current_time)

    def update_limit_info(self, headers):
        # Handle the case where 'X-RateLimit-Remaining' is 'false'
        remaining = headers.get(
            "X-RateLimit-Remaining", str(self.max_requests_per_second)
        )
        self.remaining_requests = int(remaining) if remaining.isdigit() else 0

        # Handle the case where 'X-RateLimit-Reset' might also be 'false'
        reset_time = headers.get("X-RateLimit-Reset", str(time.time() + 1))
        self.reset_time = (
            float(reset_time)
            if reset_time.replace(".", "").isdigit()
            else time.time() + 1
        )


class ChartmetricRequester:
    def __init__(self, refresh_token: str, max_requests_per_second: int):
        self.refresh_token = refresh_token
        self.auth_state = {"access_token": None, "expires_at": None}
        self.base_url = "https://api.chartmetric.com/api"
        self.rate_limiter = RateLimiter(max_requests_per_second)

    def _refresh_auth(self) -> None:
        auth_url = f"{self.base_url}/token"
        headers = {"Content-Type": "application/json"}
        data = {"refreshtoken": self.refresh_token}

        self.rate_limiter.wait_if_needed()
        response = requests.post(auth_url, headers=headers, json=data)
        self.rate_limiter.update_limit_info(response.headers)
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

        self.rate_limiter.wait_if_needed()
        response = requests.request(
            method, url, headers=headers, params=params, json=data
        )
        self.rate_limiter.update_limit_info(response.headers)
        response.raise_for_status()

        time.sleep(1.5)

        return response.json()
