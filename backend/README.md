## Rental Bedroom Applications API

Simple FastAPI backend for storing rental bedroom applications in SQLite.

## Development

### Setup

From the `backend` directory:

```bash
python -m venv .venv
# Windows PowerShell
. .venv/Scripts/Activate.ps1
# Linux/Mac
source .venv/bin/activate

pip install -r requirements.txt
```

### Run the API

```bash
uvicorn main:app --reload --port 8000
```

Then open `http://127.0.0.1:8000/docs` in your browser to try:

- `POST /applications` – create a new application
- `GET /applications` – list all applications (oldest → newest)

## Production

### Build Docker Image

From the `backend` directory:

```bash
docker build -t roomates-backend .
```

### Run with Docker

```bash
docker run -p 8000:8000 -v backend-db:/app/data roomates-backend
```

### Run with Docker Compose

From the project root directory:

```bash
docker-compose up backend
```

Or to run the entire application stack:

```bash
docker-compose up
```

