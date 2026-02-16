# Roommates - Rental Bedroom Application System

A full-stack web application for managing rental bedroom applications for students. The system allows students to submit rental applications and provides an interface to view and manage all submissions.

## Architecture

- **Backend**: FastAPI (Python) with SQLite database
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Deployment**: Docker + Docker Compose with Nginx

## Project Structure

```
roomates/
├── backend/          # FastAPI application
├── frontend/         # React frontend
└── docker-compose.yaml
```

## Quick Start

### Using Docker Compose (Recommended)

Run the entire application stack:

```bash
docker-compose up
```

The application will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost/api (proxied through Nginx)
- **API Documentation**: http://localhost/api/docs

### Development Mode

#### Backend

See [backend/README.md](backend/README.md) for detailed instructions.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# or
. .venv/Scripts/Activate.ps1  # Windows PowerShell

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Frontend

See [frontend/README.md](frontend/README.md) for detailed instructions.

```bash
cd frontend
npm install
npm run dev
```

## Features

- Submit rental bedroom applications with personal information
- View all submitted applications
- RESTful API with automatic documentation
- Responsive UI built with Tailwind CSS
- Containerized deployment with health checks
- Persistent data storage with SQLite

## API Endpoints

- `POST /applications` – Create a new rental application
- `GET /applications` – List all applications (oldest → newest)
- `GET /health` – Health check endpoint

## Technology Stack

### Backend
- FastAPI 0.115.0
- SQLAlchemy 2.0.36
- Pydantic 2.9.2
- Uvicorn (ASGI server)
- SQLite database

### Frontend
- React 18.3.1
- TypeScript 5.6.3
- Vite 5.4.10
- Tailwind CSS 3.4.15
- Nginx (production)

## Documentation

For detailed setup, build, and deployment instructions:
- Backend: [backend/README.md](backend/README.md)
- Frontend: [frontend/README.md](frontend/README.md)

## License

Private project
