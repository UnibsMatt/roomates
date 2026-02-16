## Rental Bedroom Applications API

Simple FastAPI backend for storing rental bedroom applications in SQLite.

### Setup

From the `backend` directory:

```bash
python -m venv .venv
# Windows PowerShell
. .venv/Scripts/Activate.ps1
pip install -r requirements.txt
```

### Run the API

```bash
uvicorn main:app --reload --port 8000
```

Then open `http://127.0.0.1:8000/docs` in your browser to try:

- `POST /applications` – create a new application
- `GET /applications` – list all applications (oldest → newest)

