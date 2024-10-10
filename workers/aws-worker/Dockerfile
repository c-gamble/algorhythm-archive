FROM python:3.11

WORKDIR /app

COPY requirements.txt .

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd -m myuser
RUN chown -R myuser:myuser /app
USER myuser

CMD gunicorn --bind 0.0.0.0:$PORT app:app