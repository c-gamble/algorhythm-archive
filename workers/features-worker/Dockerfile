FROM python:3.6

ENV PYTHONPATH="${PYTHONPATH}:/app"
WORKDIR /app

COPY requirements.txt .

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd -m myuser
RUN chown -R myuser:myuser /app
USER myuser

RUN ls -R /app
RUN echo $PYTHONPATH
RUN python3 -c "import sys; print(sys.path)"

RUN python3 scripts/download_models.py

CMD gunicorn --timeout 0 --bind 0.0.0.0:$PORT app:app