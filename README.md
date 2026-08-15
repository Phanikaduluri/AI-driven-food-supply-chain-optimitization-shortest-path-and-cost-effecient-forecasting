# AI-driven-food-supply-chain-optimitization-shortest-path-and-cost-effecient-forecasting
# AutoMind AI

[![Python](https://img.shields.io/badge/python-3.11%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

AI automotive expert platform for vehicle discovery, local dealer recommendations, and finance estimation in a lightweight full-stack application.

## Project Overview

AutoMind AI is a full-stack prototype that combines a FastAPI backend with a Next.js frontend. The application exposes endpoints for health checks, chat-style vehicle guidance, vehicle listings, local dealer data, EMI estimation, and admin stats. The current implementation is driven by sample data and lightweight business logic rather than a production-grade database or real AI model service.

The project is organized as a simple monorepo:

- `backend/` contains the FastAPI application, routes, services, schemas, and tests.
- `frontend/` contains the Next.js UI that connects to the backend API.
- `docs/` includes API documentation notes.
- `docker-compose.yml` defines the local multi-container setup.

## Problem Statement

Buying or comparing vehicles often requires users to gather information from multiple sources: model options, nearby dealers, financing details, and general guidance. AutoMind AI aims to provide a single conversational interface that helps users explore vehicle recommendations, estimate financing costs, and understand nearby dealer options in one place.

This repository demonstrates a lightweight version of that workflow with mock or sample data, making it useful as a learning project and a foundation for a more complete automotive assistant.

## Key Features

- AI-style chat endpoint that returns a single response with model selection logic and suggested vehicle recommendations.
- Vehicle catalog endpoints with sample model and pricing data.
- Dealer listing endpoint with city-based dealer information and ratings.
- EMI calculation endpoint for simple loan estimation.
- Admin stats endpoint returning aggregate-style demo data.
- Lightweight Next.js frontend that calls the backend and displays status/replies.
- Docker Compose setup for running backend and frontend together.
- Automated backend test coverage for health and chat endpoints.

## Screenshots

No screenshots are included in the current repository snapshot. This project does not contain a dedicated `screenshots/`, `assets/`, or image folder in the root or frontend application.

If screenshots are added later, they can be referenced here in the format below:

```md
![AutoMind AI dashboard](docs/screenshots/dashboard.png)
```

## Tech Stack

| Layer | Technology | Notes |
| --- | --- | --- |
| Backend | Python 3.11+ | FastAPI application and API logic |
| API | FastAPI | Route definitions, request validation, tests |
| Frontend | Next.js 14 | React-based UI served from `frontend/` |
| UI Language | TypeScript | Used by the Next.js frontend |
| Data layer | PostgreSQL, MongoDB, Qdrant, Redis | Configured in environment variables and settings |
| Messaging / orchestration | LangChain, LangGraph | Referenced in project configuration and dependencies |
| Containerization | Docker / Docker Compose | Local orchestration for backend and frontend |
| Testing | Pytest | Current backend validation is focused on health and chat APIs |

## System Architecture

```text
Browser / User
    |
    v
Next.js frontend (frontend/)
    |
    v
FastAPI backend (backend/app/)
    |
    +--> /api/health/
    +--> /api/chat/
    +--> /api/vehicles/
    +--> /api/dealers/
    +--> /api/finance/emi
    +--> /api/admin/stats
    |
    +--> Pydantic models and recommendation logic
    |
    +--> Environment-based configuration for database and service URLs
```

The project configuration includes environment variables for:

- PostgreSQL (`DATABASE_URL`)
- MongoDB (`MONGO_URL`)
- Qdrant (`QDRANT_URL`)
- Redis (`REDIS_URL`)
- JWT settings (`JWT_SECRET`, `JWT_ALGORITHM`)

However, the API endpoints in the current codebase primarily use static sample data rather than live database connections.

## Project Structure

```text
.
├── .env
├── .env.example
├── .github/
│   └── workflows/
│       └── ci.yml
├── README.md
├── docker-compose.yml
├── docs/
│   └── openapi.md
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── pytest.ini
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── sample_data.json
│   │   ├── schemas.sql
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── admin.py
│   │   │       ├── chat.py
│   │   │       ├── dealers.py
│   │   │       ├── finance.py
│   │   │       ├── health.py
│   │   │       └── vehicles.py
│   │   ├── core/
│   │   │   └── config.py
│   │   └── services/
│   │       ├── model_router.py
│   │       └── vehicle_recommendation.py
│   └── tests/
│       └── test_health.py
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.js
│   ├── next-env.d.ts
│   ├── tsconfig.json
│   └── src/
│       └── app/
│           ├── globals.css
│           ├── layout.tsx
│           └── page.tsx
└── hospital-staff-scheduling/
    └── README.md
```

> `hospital-staff-scheduling/` is present in the repository but is a separate project and is not the primary application described in this README.

## Prerequisites

Before running the project, make sure the following are available:

- Python 3.11+ for the backend
- `pip` for installing Python dependencies
- Node.js 20+ and `npm` for the frontend
- Docker and Docker Compose (optional, for containerized setup)
- A modern web browser to access the frontend
- Local or remote services for PostgreSQL, MongoDB, Qdrant, and Redis if you plan to wire them in beyond the current mock-data implementation

## Installation

### 1) Clone the repository

```bash
git clone <repository-url>
cd autodrive
```

### 2) Set up the backend virtual environment

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3) Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4) Copy environment variables

From the repository root:

```bash
cp .env.example .env
```

Then update the values in `.env` as needed for your local environment.

## Environment Variables

The project defines the following environment variables in `.env.example` and `.env`:

| Variable | Example value | Description |
| --- | --- | --- |
| `APP_NAME` | `AutoMind AI` | Application name |
| `APP_VERSION` | `0.1.0` | Application version |
| `DATABASE_URL` | `******localhost:5432/automind` | PostgreSQL connection string placeholder |
| `MONGO_URL` | `mongodb://localhost:27017` | MongoDB connection string placeholder |
| `QDRANT_URL` | `http://localhost:6333` | Qdrant endpoint placeholder |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis connection string placeholder |
| `JWT_SECRET` | `change-me` | JWT signing secret placeholder |
| `JWT_ALGORITHM` | `HS256` | JWT algorithm |

These values are configuration placeholders and are not used by the current routes beyond the settings object.

## How to Run the Project

### Run the backend

From the repository root:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:

- `http://localhost:8000/`
- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

### Run the frontend

From the repository root:

```bash
cd frontend
npm run dev
```

Then open `http://localhost:3000` in a browser.

### Run with Docker Compose

From the repository root:

```bash
docker compose up --build
```

This starts:

- Backend on `http://localhost:8000`
- Frontend on `http://localhost:3000`

## API Documentation

The repository includes a lightweight API reference in `docs/openapi.md`.

### Core endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Returns a simple service status message and version |
| `GET` | `/api/health/` | Health check for the backend service |
| `POST` | `/api/chat/` | Sends a chat message and receives a generated reply with recommendations |
| `GET` | `/api/vehicles/` | Returns a list of sample vehicles |
| `GET` | `/api/dealers/` | Returns a list of sample dealers |
| `POST` | `/api/finance/emi` | Calculates EMI using loan amount, tenure, and interest rate |
| `GET` | `/api/admin/stats` | Returns demo admin metrics |

### Example chat request

```bash
curl -X POST http://localhost:8000/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message":"Need an EV under 15 lakh","location":"Bengaluru"}'
```

### Example EMI request

```bash
curl -X POST "http://localhost:8000/api/finance/emi?loan_amount=1200000&tenure_months=60&interest_rate=8.5"
```

### FastAPI docs

If the backend is running, FastAPI also serves interactive OpenAPI documentation automatically at:

- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

## Database Setup

The repository includes configuration placeholders for a PostgreSQL database and a starter schema file:

- `backend/app/schemas.sql`
- `.env.example`

The schema currently contains tables for:

- `vehicles`
- `dealers`
- `users`

Example schema:

```sql
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  segment VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  fuel_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

The current application endpoints do not connect to a live database in the code shown here; they return in-memory or static sample data from route functions and `sample_data.json`.

## Docker Setup

Docker support is defined in:

- `docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`

### Build and run

```bash
docker compose up --build
```

The compose configuration exposes:

- `8000` for the backend API
- `3000` for the frontend UI

## Testing Instructions

The repository includes backend tests under `backend/tests/`.

### Run backend tests

```bash
cd backend
source .venv/bin/activate
pytest -q
```

This was validated in the current workspace with:

```bash
backend/.venv/bin/pytest backend/tests -q
```

Result: `2 passed`.

## Example Usage

### Health check

```bash
curl http://localhost:8000/api/health/
```

Example response:

```json
{"status":"ok","service":"autodrive-backend"}
```

### Vehicle lookup

```bash
curl http://localhost:8000/api/vehicles/
```

### Finance estimate

```bash
curl -X POST "http://localhost:8000/api/finance/emi?loan_amount=1500000&tenure_months=60&interest_rate=8.25"
```

### Chat assistant sample

```bash
curl -X POST http://localhost:8000/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message":"Tell me about EV options in Bengaluru","location":"Bengaluru"}'
```

## Known Limitations

- The backend is primarily a mock-data API; it does not yet connect to real persistence layers.
- The `chat` endpoint uses simple keyword-based model routing rather than a configured LLM or a managed AI service.
- The recommendation logic is static and limited to a few vehicle examples.
- The app uses placeholder environment values for database and service integrations.
- Frontend and backend are not yet connected to a secure authentication or user-management system.
- There is no production deployment configuration or CI check beyond the current Python test workflow.

## Future Improvements

- Integrate real PostgreSQL, MongoDB, Qdrant, or Redis services.
- Replace the mock recommendation engine with a production-quality vehicle matching system.
- Connect the chat endpoint to a real AI model provider and persist conversation context.
- Add authentication and user profiles.
- Expand the UI with search, filtering, comparison, financing calculators, and dealer detail pages.
- Add better validation, error handling, and production deployment settings.
- Replace static sample data with real dealership and inventory data.

## License

This repository does not currently include a `LICENSE` file. Before publishing or distributing the project externally, add an explicit license document to define the usage and redistribution terms.

## Author

Phanikaduluri

