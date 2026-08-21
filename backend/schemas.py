from datetime import datetime as DateTime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class PredictByLocationRequest(BaseModel):
    locationId: str
    horizonHours: int = Field(default=1, ge=1, le=1)
    includeFactors: bool = False


# Feature order must match the notebook's `features` list used to train model2.
FEATURE_NAMES = [
    "lat",
    "long",
    "pressure",
    "temperature",
    "humidity",
    "pm1_0",
    "pm2_5",
    "pm10",
    "hour",
    "day_of_week",
    "month",
    "pm2_5_lag1",
    "pm2_5_lag2",
    "pm2_5_lag3",
]


class SensorInput(BaseModel):
    """Live sensor readings matching DelhiPollDataset columns + lag features."""

    datetime: DateTime = Field(
        ...,
        description="Observation timestamp (ISO 8601). Used to derive hour, day_of_week, and month.",
        examples=["2021-01-07T19:00:00+05:30"],
    )
    lat: float = Field(..., ge=28.0, le=29.0, description="Latitude (degrees)")
    long: float = Field(..., ge=76.5, le=77.5, description="Longitude (degrees)")
    pressure: float = Field(..., ge=900.0, le=1050.0, description="Atmospheric pressure (hPa)")
    temperature: float = Field(..., ge=-10.0, le=50.0, description="Air temperature (°C)")
    humidity: float = Field(..., ge=0.0, le=100.0, description="Relative humidity (%)")
    pm1_0: float = Field(..., ge=0.0, le=1000.0, description="PM1.0 concentration (µg/m³)")
    pm2_5: float = Field(..., ge=0.0, le=1000.0, description="PM2.5 concentration (µg/m³)")
    pm10: float = Field(..., ge=0.0, le=1500.0, description="PM10 concentration (µg/m³)")
    pm2_5_lag1: float = Field(
        ...,
        ge=0.0,
        le=1000.0,
        description="PM2.5 reading 1 hour earlier at the same location (µg/m³)",
    )
    pm2_5_lag2: float = Field(
        ...,
        ge=0.0,
        le=1000.0,
        description="PM2.5 reading 2 hours earlier at the same location (µg/m³)",
    )
    pm2_5_lag3: float = Field(
        ...,
        ge=0.0,
        le=1000.0,
        description="PM2.5 reading 3 hours earlier at the same location (µg/m³)",
    )

    @field_validator("datetime")
    @classmethod
    def datetime_must_be_timezone_aware(cls, value: DateTime) -> DateTime:
        if value.tzinfo is None:
            raise ValueError("datetime must include timezone information (e.g. +05:30)")
        return value


class FuturePredictRequest(SensorInput):
    hours_ahead: int = Field(
        default=1,
        ge=1,
        le=1,
        description="Prediction horizon in hours. The saved model supports 1 hour ahead only.",
    )


class PredictionResponse(BaseModel):
    pm2_5: float = Field(..., description="PM2.5 concentration used or predicted (µg/m³)")
    aqi: int = Field(..., ge=0, le=500, description="Air Quality Index derived from PM2.5")
    category: str = Field(..., description="EPA AQI category label")
    hours_ahead: Optional[int] = Field(
        default=None,
        description="Forecast horizon in hours (future endpoint only)",
    )


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_path: str
    timestamp: Optional[str] = Field(
        default=None,
        description="ISO 8601 timestamp for frontend connectivity checks",
    )
