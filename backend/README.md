# AirGuard AQI Prediction API

FastAPI backend for AirGuard that serves a scikit-learn Random Forest model trained in `Untitled0.ipynb` on the [DelhiPollDataset](https://huggingface.co/datasets/sachin-iitd/DelhiPollDataset).

The saved model (`airguard_random_forest.pkl`) predicts **PM2.5 one hour ahead** (`future_pm2_5`). The API converts PM2.5 concentrations to EPA AQI values and category labels.

## Setup

1. Place your trained model file in the `model/` directory:

   ```
   model/airguard_random_forest.pkl
   ```

2. Create a virtual environment and install dependencies:

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Run the server:

   ```bash
   uvicorn main:app --reload
   ```

4. Open interactive docs at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## Model inputs

The model expects 14 features in this order (no scaler/encoder was used during training):

| Feature | Source |
|---|---|
| `lat`, `long`, `pressure`, `temperature`, `humidity`, `pm1_0`, `pm2_5`, `pm10` | Live sensor readings |
| `hour`, `day_of_week`, `month` | Derived from `datetime` |
| `pm2_5_lag1`, `pm2_5_lag2`, `pm2_5_lag3` | PM2.5 from 1, 2, and 3 hours earlier at the same location |

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Service and model load status |
| `POST` | `/predict/current` | AQI from current `pm2_5` reading |
| `POST` | `/predict/future` | Predict PM2.5 1 hour ahead, return AQI |

### Example request

```json
{
  "datetime": "2021-01-07T19:00:00+05:30",
  "lat": 28.498,
  "long": 77.2938,
  "pressure": 988.75,
  "temperature": 32.2,
  "humidity": 35.64,
  "pm1_0": 85.86,
  "pm2_5": 137.98,
  "pm10": 150.68,
  "pm2_5_lag1": 120.0,
  "pm2_5_lag2": 115.0,
  "pm2_5_lag3": 110.0
}
```

### Example response

```json
{
  "pm2_5": 137.98,
  "aqi": 189,
  "category": "Unhealthy"
}
```
