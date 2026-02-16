## Rental Bedroom Frontend

React + Vite + Tailwind CSS frontend for the student rental bedroom application system.

## Development

### Setup

From the `frontend` directory:

```bash
npm install
```

Optionally, create a `.env` file to configure the backend URL (defaults to `http://localhost:8000`):

```bash
VITE_API_BASE_URL=http://localhost:8000
```

### Run the dev server

```bash
npm run dev
```

Or specify a custom port:

```bash
npm run dev -- --port 5173
```

Open `http://localhost:5173` in your browser to use the app.

## Production

### Build for Production

From the `frontend` directory:

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Build Docker Image

From the `frontend` directory:

```bash
docker build -t roomates-frontend .
```

### Run with Docker

```bash
docker run -p 80:80 roomates-frontend
```

### Run with Docker Compose

From the project root directory:

```bash
docker-compose up frontend
```

Or to run the entire application stack:

```bash
docker-compose up
```

