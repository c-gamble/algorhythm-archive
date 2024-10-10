FROM python:3.11

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update -q && \
    apt-get install -y -qq --no-install-recommends \
        xvfb \
        libxcomposite1 \
        libxdamage1 \
        libatk1.0-0 \
        libasound2 \
        libdbus-1-3 \
        libnspr4 \
        libgbm1 \
        libatk-bridge2.0-0 \
        libcups2 \
        libxkbcommon0 \
        libatspi2.0-0 \
        libnss3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

ENV DISPLAY=:99

RUN useradd -m myuser
RUN chown -R myuser:myuser /app
USER myuser

# Install Playwright browsers as myuser
RUN playwright install chromium

CMD Xvfb :99 -screen 0 1024x768x16 & gunicorn --bind 0.0.0.0:$PORT app:app