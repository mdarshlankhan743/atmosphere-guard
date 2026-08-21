# AirGuard AI — Atmosphere Guard 🌫️

**Don't wait for pollution to peak. Predict it before it happens.**

AirGuard AI is an air-quality forecasting and early-warning platform for Delhi. A FastAPI backend serves a Random Forest model trained on the [DelhiPollDataset](https://huggingface.co/datasets/sachin-iitd/DelhiPollDataset) to predict PM2.5 one hour ahead, converts it to an EPA AQI score, and powers a React + TypeScript dashboard with live maps, forecasts, alerts, and decision-support tools.

📄 **[View the project presentation](docs/AirGuard_AI_Presentation.pdf)**

**Team Backtrackers** — NIET · Priyanshu Gupta (Lead), MD Arshlan Khan, Shivam Maddheshiya, Krashn Kumar

🔗 **Live prototype:** [airguard-final.vercel.app](https://atmosphere-guard-final.vercel.app/)

## Features

- **AI-powered PM2.5 forecasting** — a scikit-learn Random Forest model predicts PM2.5 concentration one hour ahead from live sensor and weather readings.
- **EPA AQI conversion** — predicted and current PM2.5 readings are converted into standard AQI values and category labels (Good → Hazardous).
- **Interactive dashboard** — overview metrics, a predictive pollution map, forecast charts, alerts, decision-support insights, and a citizen-facing view.
- **Location-aware data** — a snapshot of Delhi monitoring stations drives per-location predictions, risk levels, and contributing factors.
- **REST API** — endpoints for health checks, dashboard aggregation, per-location forecasts, alerts, and raw predictions.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Lucide icons |
| Backend | FastAPI, Uvicorn, Pydantic |
| ML | scikit-learn (Random Forest), pandas, numpy, joblib |
| Data | [DelhiPollDataset](https://huggingface.co/datasets/sachin-iitd/DelhiPollDataset), station snapshot JSON |

## Project Structure

```
atmosphere-guard/
├── docs/
│   └── AirGuard_AI_Presentation.pdf   # Problem statement & pitch deck
├── backend/                  # FastAPI ML service
│   ├── main.py                # API routes and app lifecycle
│   ├── aqi.py                 # PM2.5 → EPA AQI conversion
│   ├── preprocessing.py       # Feature engineering for the model
│   ├── dataset_service.py     # Dashboard/forecast/alert aggregation
│   ├── schemas.py             # Pydantic request/response models
│   ├── data/                  # Station snapshot data
│   ├── model/                 # Trained model (airguard_random_forest.pkl)
│   ├── Untitled0.ipynb        # Model training notebook
│   └── requirements.txt
├── src/                      # React frontend
│   ├── components/            # AQI cards, alerts, map, charts, navigation
│   ├── views/                 # Dashboard, forecast, map, alerts, citizen views
│   ├── services/api.ts        # Backend API client
│   └── types/                 # Shared TypeScript types
├── index.html
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11 (see `runtime.txt`)

### 1. Backend (FastAPI + ML model)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
uvicorn main:app --reload
```

Make sure the trained model file exists at `backend/model/airguard_random_forest.pkl`. Interactive API docs are then available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 2. Frontend (React + Vite)

```bash
# from the project root
npm install
cp .env.example .env    # set VITE_API_BASE_URL if the backend isn't on localhost:8000
npm run dev
```

The dashboard runs at [http://localhost:5173](http://localhost:5173).

## API Overview

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Service and model load status |
| `GET` | `/dashboard` | Aggregated metrics for the frontend dashboard |
| `GET` | `/locations` | List of monitoring locations |
| `GET` | `/locations/{id}` | Details for a single location |
| `GET` | `/forecast` | Forecast series for a location |
| `GET` | `/alerts` | Active air-quality alerts, optionally filtered by severity |
| `POST` | `/predict/current` | Derive AQI from a current PM2.5 reading |
| `POST` | `/predict/future` | Predict PM2.5 one hour ahead and return AQI |
| `POST` | `/predict` | Predict AQI for a given `locationId` |

See [`backend/README.md`](backend/README.md) for full request/response examples and model input details.

## Model

The model expects 14 features (lat, long, pressure, temperature, humidity, PM1.0, PM2.5, PM10, hour, day of week, month, and PM2.5 lag values from the previous 1–3 hours) and predicts `future_pm2_5`, the PM2.5 concentration one hour ahead. Training details are in `backend/Untitled0.ipynb`.

## License

No license has been specified for this project yet.
