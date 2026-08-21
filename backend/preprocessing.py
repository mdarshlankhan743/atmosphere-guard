from __future__ import annotations

import pandas as pd

from schemas import FEATURE_NAMES, SensorInput


def build_feature_row(payload: SensorInput) -> pd.DataFrame:
    """Build a single-row DataFrame in the exact column order the model expects."""
    dt = pd.Timestamp(payload.datetime)

    row = {
        "lat": payload.lat,
        "long": payload.long,
        "pressure": payload.pressure,
        "temperature": payload.temperature,
        "humidity": payload.humidity,
        "pm1_0": payload.pm1_0,
        "pm2_5": payload.pm2_5,
        "pm10": payload.pm10,
        "hour": dt.hour,
        "day_of_week": dt.dayofweek,
        "month": dt.month,
        "pm2_5_lag1": payload.pm2_5_lag1,
        "pm2_5_lag2": payload.pm2_5_lag2,
        "pm2_5_lag3": payload.pm2_5_lag3,
    }

    return pd.DataFrame([row], columns=FEATURE_NAMES)
