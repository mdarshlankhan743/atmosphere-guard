from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import joblib
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from aqi import pm25_to_aqi
from dataset_service import DashboardService
from preprocessing import build_feature_row
from schemas import (
    FuturePredictRequest,
    HealthResponse,
    PredictByLocationRequest,
    PredictionResponse,
    SensorInput,
)

MODEL_PATH = Path(__file__).resolve().parent / "model" / "airguard_random_forest.pkl"

app_state: dict[str, Any] = {"model": None, "dashboard": DashboardService()}


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not MODEL_PATH.exists():
        raise RuntimeError(
            f"Model file not found at {MODEL_PATH}. "
            "Place airguard_random_forest.pkl in the model/ directory."
        )

    try:
        app_state["model"] = joblib.load(MODEL_PATH)
    except Exception as exc:
        raise RuntimeError(f"Failed to load model from {MODEL_PATH}: {exc}") from exc

    dashboard: DashboardService = app_state["dashboard"]
    try:
        dashboard.refresh(app_state["model"])
    except Exception as exc:
        raise RuntimeError(f"Failed to load DelhiPollDataset snapshots: {exc}") from exc

    yield

    app_state["model"] = None


app = FastAPI(
    title="AirGuard AQI Prediction API",
    description=(
        "Predicts PM2.5 (1 hour ahead) using a Random Forest model trained on the "
        "DelhiPollDataset, and derives EPA AQI categories from PM2.5 concentrations."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, HTTPException):
        raise exc
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {exc}"},
    )


def _get_model():
    model = app_state.get("model")
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded")
    return model


def _predict_future_pm25(payload: SensorInput) -> float:
    model = _get_model()
    features = build_feature_row(payload)

    try:
        prediction = model.predict(features)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {exc}") from exc

    return float(prediction[0])


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok" if app_state.get("model") is not None else "degraded",
        model_loaded=app_state.get("model") is not None,
        model_path=str(MODEL_PATH),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


def _dashboard_service() -> DashboardService:
    dashboard: DashboardService | None = app_state.get("dashboard")
    if dashboard is None or not dashboard.locations:
        raise HTTPException(status_code=503, detail="Dashboard data is not ready")
    return dashboard


@app.get("/dashboard")
def dashboard(selectedLocationId: str | None = Query(default=None)) -> dict[str, Any]:
    """Aggregate real ML predictions for the React dashboard."""
    return _dashboard_service().build_dashboard(selectedLocationId)


@app.get("/locations")
def list_locations() -> list[dict[str, Any]]:
    locations = _dashboard_service().locations
    return [{key: value for key, value in location.items() if key != "sensorInput"} for location in locations]


@app.get("/locations/{location_id}")
def get_location(location_id: str) -> dict[str, Any]:
    location = _dashboard_service().get_location(location_id)
    if location is None:
        raise HTTPException(status_code=404, detail=f"Location '{location_id}' not found")
    return {key: value for key, value in location.items() if key != "sensorInput"}


@app.get("/forecast")
def forecast(
    locationId: str | None = Query(default=None),
    horizon: int = Query(default=6, ge=1, le=24),
) -> dict[str, Any]:
    """Return forecast series for a location. Model supports +1H predictions."""
    _ = horizon
    return _dashboard_service().build_forecast(locationId)


@app.get("/alerts")
def alerts(severity: str | None = Query(default=None)) -> list[dict[str, Any]]:
    all_alerts = build_alerts_from_dashboard(_dashboard_service())
    if severity is None or severity.upper() == "ALL":
        return all_alerts
    target = severity.upper()
    return [alert for alert in all_alerts if alert["severity"] == target]


def build_alerts_from_dashboard(dashboard: DashboardService) -> list[dict[str, Any]]:
    from dataset_service import build_alerts

    return build_alerts(dashboard.locations)


@app.post("/predict/current", response_model=PredictionResponse)
def predict_current(payload: SensorInput) -> PredictionResponse:
    """Derive current AQI from the live PM2.5 reading in the request."""
    try:
        aqi, category = pm25_to_aqi(payload.pm2_5)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"AQI calculation failed: {exc}") from exc

    return PredictionResponse(
        pm2_5=payload.pm2_5,
        aqi=aqi,
        category=category,
    )


@app.post("/predict/future", response_model=PredictionResponse)
def predict_future(payload: FuturePredictRequest) -> PredictionResponse:
    """Predict PM2.5 one hour ahead and return the derived AQI."""
    if payload.hours_ahead != 1:
        raise HTTPException(
            status_code=400,
            detail=(
                "This model was trained to predict PM2.5 exactly 1 hour ahead "
                "(future_pm2_5 = shift(-1) per location). hours_ahead must be 1."
            ),
        )

    predicted_pm25 = _predict_future_pm25(payload)

    try:
        aqi, category = pm25_to_aqi(predicted_pm25)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"AQI calculation failed: {exc}") from exc

    return PredictionResponse(
        pm2_5=round(predicted_pm25, 2),
        aqi=aqi,
        category=category,
        hours_ahead=payload.hours_ahead,
    )


@app.post("/predict")
def predict_by_location(payload: PredictByLocationRequest) -> dict[str, Any]:
    """Frontend compatibility endpoint that maps a location to real sensor input."""
    dashboard = _dashboard_service()
    location = dashboard.get_location(payload.locationId)
    if location is None:
        raise HTTPException(status_code=404, detail=f"Location '{payload.locationId}' not found")

    sensor_payload = FuturePredictRequest.model_validate(location["sensorInput"])
    prediction = predict_future(sensor_payload)

    response: dict[str, Any] = {
        "locationId": payload.locationId,
        "forecastHorizon": "+1H",
        "predictedAQI": prediction.aqi,
        "riskLevel": aqi_to_risk(prediction.aqi),
        "confidenceScore": 0.85,
        "factors": location.get("factors", []) if payload.includeFactors else [],
        "modelTimestamp": datetime.now(timezone.utc).isoformat(),
        "pm2_5": prediction.pm2_5,
        "category": prediction.category,
    }
    return response


def aqi_to_risk(aqi: int) -> str:
    from dataset_service import aqi_to_risk as _aqi_to_risk

    return _aqi_to_risk(aqi)
