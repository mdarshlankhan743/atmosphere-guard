"""Load real DelhiPollDataset sensor snapshots and build dashboard payloads."""

from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import pandas as pd

from aqi import pm25_to_aqi
from preprocessing import build_feature_row
from schemas import SensorInput

DATA_DIR = Path(__file__).resolve().parent / "data"
SNAPSHOT_PATH = DATA_DIR / "stations_snapshot.json"
DELHI_DATASET_URL = (
    "https://huggingface.co/datasets/sachin-iitd/DelhiPollDataset/resolve/main/test.csv"
)

# Delhi NCR grid labels keyed by rounded lat/long pairs from the training dataset.
LOCATION_NAMES: dict[tuple[float, float], tuple[str, str]] = {
    (28.498, 77.294): ("Okhla Industrial", "South Delhi"),
    (28.624, 77.273): ("Civil Lines", "North Delhi"),
    (28.633, 77.273): ("Kashmere Gate", "North Delhi"),
    (28.588, 77.222): ("Dwarka Sector 8", "South West Delhi"),
    (28.507, 77.294): ("Okhla Phase 3", "South Delhi"),
    (28.571, 77.202): ("Vasant Kunj", "South Delhi"),
    (28.632, 77.219): ("Pitampura", "North West Delhi"),
    (28.704, 77.102): ("Rohini Sector 16", "North West Delhi"),
}


def _round_coord(value: float) -> float:
    return round(value, 3)


def _location_label(lat: float, long: float, index: int) -> tuple[str, str]:
    key = (_round_coord(lat), _round_coord(long))
    if key in LOCATION_NAMES:
        return LOCATION_NAMES[key]
    return (f"Delhi Grid {index + 1}", "Delhi NCR")


def category_to_risk(category: str) -> str:
    mapping = {
        "Good": "SAFE",
        "Moderate": "MODERATE",
        "Unhealthy for Sensitive Groups": "HIGH",
        "Unhealthy": "HIGH",
        "Very Unhealthy": "VERY_HIGH",
        "Hazardous": "CRITICAL",
    }
    return mapping.get(category, "UNKNOWN")


def aqi_to_risk(aqi: int) -> str:
    if aqi <= 50:
        return "SAFE"
    if aqi <= 100:
        return "MODERATE"
    if aqi <= 150:
        return "HIGH"
    if aqi <= 200:
        return "HIGH"
    if aqi <= 300:
        return "VERY_HIGH"
    return "CRITICAL"


def _trend(current_aqi: int, predicted_aqi: int) -> str:
    delta = predicted_aqi - current_aqi
    if delta >= 10:
        return "RISING"
    if delta <= -10:
        return "FALLING"
    return "STABLE"


def _row_to_sensor_input(row: pd.Series) -> SensorInput:
    return SensorInput(
        datetime=row["datetime"],
        lat=float(row["lat"]),
        long=float(row["long"]),
        pressure=float(row["pressure"]),
        temperature=float(row["temperature"]),
        humidity=float(row["humidity"]),
        pm1_0=float(row["pm1_0"]),
        pm2_5=float(row["pm2_5"]),
        pm10=float(row["pm10"]),
        pm2_5_lag1=float(row["pm2_5_lag1"]),
        pm2_5_lag2=float(row["pm2_5_lag2"]),
        pm2_5_lag3=float(row["pm2_5_lag3"]),
    )


def _prepare_dataset_frame(df: pd.DataFrame) -> pd.DataFrame:
    frame = df.copy()
    frame["datetime"] = pd.to_datetime(frame["dateTime"], utc=True)
    frame = frame.sort_values(["lat", "long", "datetime"])

    grouped = []
    for (_, _), group in frame.groupby(["lat", "long"], sort=False):
        part = group.copy()
        part["pm2_5_lag1"] = part["pm2_5"].shift(1)
        part["pm2_5_lag2"] = part["pm2_5"].shift(2)
        part["pm2_5_lag3"] = part["pm2_5"].shift(3)
        grouped.append(part)

    ready = pd.concat(grouped, ignore_index=True)
    ready = ready.dropna(subset=["pm2_5_lag1", "pm2_5_lag2", "pm2_5_lag3"])
    ready = ready.sort_values("datetime", ascending=False)
    return ready


def _download_latest_snapshots(max_locations: int = 8) -> list[dict[str, Any]]:
    df = pd.read_csv(DELHI_DATASET_URL)
    ready = _prepare_dataset_frame(df)

    snapshots: list[dict[str, Any]] = []
    seen: set[tuple[float, float]] = set()

    for _, row in ready.iterrows():
        key = (_round_coord(float(row["lat"])), _round_coord(float(row["long"])))
        if key in seen:
            continue
        seen.add(key)

        dt = pd.Timestamp(row["datetime"]).to_pydatetime()
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone(timedelta(hours=5, minutes=30)))

        snapshots.append(
            {
                "datetime": dt.isoformat(),
                "lat": float(row["lat"]),
                "long": float(row["long"]),
                "pressure": float(row["pressure"]),
                "temperature": float(row["temperature"]),
                "humidity": float(row["humidity"]),
                "pm1_0": float(row["pm1_0"]),
                "pm2_5": float(row["pm2_5"]),
                "pm10": float(row["pm10"]),
                "pm2_5_lag1": float(row["pm2_5_lag1"]),
                "pm2_5_lag2": float(row["pm2_5_lag2"]),
                "pm2_5_lag3": float(row["pm2_5_lag3"]),
            }
        )

        if len(snapshots) >= max_locations:
            break

    return snapshots


def load_sensor_snapshots(force_refresh: bool = False) -> list[dict[str, Any]]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    if SNAPSHOT_PATH.exists() and not force_refresh:
        with SNAPSHOT_PATH.open("r", encoding="utf-8") as handle:
            payload = json.load(handle)
        return payload["snapshots"]

    snapshots = _download_latest_snapshots()
    with SNAPSHOT_PATH.open("w", encoding="utf-8") as handle:
        json.dump({"source": DELHI_DATASET_URL, "snapshots": snapshots}, handle, indent=2)
    return snapshots


def predict_location(model: Any, snapshot: dict[str, Any], index: int) -> dict[str, Any]:
    row = pd.Series(snapshot)
    row["datetime"] = pd.Timestamp(snapshot["datetime"])
    sensor = _row_to_sensor_input(row)

    current_aqi, current_category = pm25_to_aqi(sensor.pm2_5)
    features = build_feature_row(sensor)
    predicted_pm25 = float(model.predict(features)[0])
    predicted_aqi, predicted_category = pm25_to_aqi(predicted_pm25)

    name, region = _location_label(sensor.lat, sensor.long, index)
    location_id = f"loc-{index + 1:02d}-{_round_coord(sensor.lat)}-{_round_coord(sensor.long)}"

    return {
        "id": location_id,
        "name": name,
        "region": region,
        "lat": sensor.lat,
        "lng": sensor.long,
        "currentAQI": current_aqi,
        "predictedAQI": predicted_aqi,
        "riskLevel": aqi_to_risk(max(current_aqi, predicted_aqi)),
        "trend": _trend(current_aqi, predicted_aqi),
        "pm25Current": round(sensor.pm2_5, 2),
        "pm25Predicted": round(predicted_pm25, 2),
        "temperature": round(sensor.temperature, 2),
        "humidity": round(sensor.humidity, 2),
        "windSpeed": None,
        "windDirection": None,
        "factors": [
            {
                "id": "pm25",
                "name": "PM2.5",
                "level": "High" if sensor.pm2_5 >= 55.4 else "Moderate" if sensor.pm2_5 >= 35.5 else "Low",
                "description": f"Observed PM2.5 {sensor.pm2_5:.1f} µg/m³ ({current_category})",
                "impactScore": min(100, int(current_aqi / 5)),
            },
            {
                "id": "humidity",
                "name": "Humidity",
                "level": "High" if sensor.humidity >= 70 else "Moderate" if sensor.humidity >= 40 else "Low",
                "description": f"Relative humidity {sensor.humidity:.1f}%",
                "impactScore": min(100, int(sensor.humidity)),
            },
        ],
        "explanation": (
            f"Random Forest predicts PM2.5 will move from {sensor.pm2_5:.1f} to "
            f"{predicted_pm25:.1f} µg/m³ ({current_category} → {predicted_category})."
        ),
        "sensorInput": sensor.model_dump(mode="json"),
        "currentCategory": current_category,
        "predictedCategory": predicted_category,
    }


def build_forecast_series(selected: dict[str, Any]) -> list[dict[str, Any]]:
    observed = selected["currentAQI"]
    predicted = selected["predictedAQI"]
    base_time = datetime.fromisoformat(selected["sensorInput"]["datetime"])

    horizons = [
        ("Now", base_time, observed, observed),
        ("+1H", base_time + timedelta(hours=1), None, predicted),
        ("+2H", base_time + timedelta(hours=2), None, None),
        ("+4H", base_time + timedelta(hours=4), None, None),
        ("+6H", base_time + timedelta(hours=6), None, None),
    ]

    series: list[dict[str, Any]] = []
    for label, timestamp, observed_aqi, predicted_aqi in horizons:
        point: dict[str, Any] = {
            "timeLabel": label,
            "timestamp": timestamp.isoformat(),
            "observedAQI": observed_aqi,
            "predictedAQI": predicted_aqi,
        }
        if predicted_aqi is not None and label != "Now":
            margin = max(5, int(predicted_aqi * 0.08))
            point["lowerBound"] = max(0, predicted_aqi - margin)
            point["upperBound"] = min(500, predicted_aqi + margin)
        series.append(point)
    return series


def build_alerts(locations: list[dict[str, Any]]) -> list[dict[str, Any]]:
    alerts: list[dict[str, Any]] = []
    for location in locations:
        predicted = location["predictedAQI"]
        risk = aqi_to_risk(predicted)
        if predicted < 151:
            continue

        severity = "HIGH" if predicted < 201 else "VERY_HIGH" if predicted < 301 else "CRITICAL"
        alerts.append(
            {
                "id": f"alert-{location['id']}",
                "severity": severity,
                "area": location["name"],
                "message": (
                    f"Predicted AQI {predicted} ({location['predictedCategory']}) in the next hour. "
                    f"Trend is {location['trend'].lower()}."
                ),
                "timestamp": location["sensorInput"]["datetime"],
                "status": "Active",
                "suggestedAction": "Limit outdoor exposure and monitor sensitive groups.",
                "expectedDirection": location["trend"],
                "forecastPeriod": "+1H",
            }
        )

    alerts.sort(key=lambda item: item["severity"], reverse=True)
    return alerts


def build_priority_list(locations: list[dict[str, Any]]) -> list[dict[str, Any]]:
    ranked = sorted(locations, key=lambda loc: loc["predictedAQI"], reverse=True)
    priorities: list[dict[str, Any]] = []
    for index, location in enumerate(ranked[:5], start=1):
        action = (
            "Deploy mobile monitoring and issue public advisory."
            if location["predictedAQI"] >= 200
            else "Increase sampling frequency and track trend."
        )
        priorities.append(
            {
                "priority": index,
                "areaId": location["id"],
                "areaName": location["name"],
                "currentAQI": location["currentAQI"],
                "predictedAQI": location["predictedAQI"],
                "trend": location["trend"],
                "risk": location["riskLevel"],
                "recommendedAction": action,
            }
        )
    return priorities


class DashboardService:
    def __init__(self) -> None:
        self._locations: list[dict[str, Any]] = []
        self._last_updated: str | None = None

    def refresh(self, model: Any, force_dataset_refresh: bool = False) -> None:
        snapshots = load_sensor_snapshots(force_refresh=force_dataset_refresh)
        self._locations = [predict_location(model, snapshot, index) for index, snapshot in enumerate(snapshots)]
        self._last_updated = datetime.now(timezone.utc).isoformat()

    @property
    def locations(self) -> list[dict[str, Any]]:
        return self._locations

    def get_location(self, location_id: str) -> dict[str, Any] | None:
        for location in self._locations:
            if location["id"] == location_id:
                return location
        return None

    def build_dashboard(self, selected_location_id: str | None = None) -> dict[str, Any]:
        if not self._locations:
            raise RuntimeError("Dashboard data has not been loaded yet")

        selected = self._locations[0]
        if selected_location_id:
            found = self.get_location(selected_location_id)
            if found is not None:
                selected = found

        public_locations = [{key: value for key, value in loc.items() if key != "sensorInput"} for loc in self._locations]
        public_selected = {key: value for key, value in selected.items() if key != "sensorInput"}

        hotspots = sum(1 for loc in self._locations if loc["predictedAQI"] >= 151)
        rising = sum(1 for loc in self._locations if loc["trend"] == "RISING")
        alerts = build_alerts(self._locations)

        max_predicted = max(loc["predictedAQI"] for loc in self._locations)
        avg_current = round(sum(loc["currentAQI"] for loc in self._locations) / len(self._locations))

        return {
            "metrics": {
                "currentAQI": avg_current,
                "forecastAQI": max_predicted,
                "riskLevel": aqi_to_risk(max_predicted),
                "hotspotsCount": hotspots,
                "risingAreasCount": rising,
                "activeAlertsCount": len([alert for alert in alerts if alert["status"] == "Active"]),
            },
            "selectedLocation": public_selected,
            "locations": public_locations,
            "forecastSeries": build_forecast_series(selected),
            "alerts": alerts,
            "priorityList": build_priority_list(self._locations),
            "lastUpdated": self._last_updated,
        }

    def build_forecast(self, location_id: str | None = None) -> dict[str, Any]:
        selected = self._locations[0]
        if location_id:
            found = self.get_location(location_id)
            if found is not None:
                selected = found
        return {
            "locationId": selected["id"],
            "series": build_forecast_series(selected),
            "currentAQI": selected["currentAQI"],
            "predictedAQI": selected["predictedAQI"],
        }
