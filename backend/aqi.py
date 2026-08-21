"""Convert PM2.5 concentration (µg/m³) to EPA AQI and category."""

from __future__ import annotations

# EPA PM2.5 breakpoints (24-hour standard, used for instantaneous AQI estimates).
PM25_BREAKPOINTS: list[tuple[float, float, int, int, str]] = [
    (0.0, 12.0, 0, 50, "Good"),
    (12.1, 35.4, 51, 100, "Moderate"),
    (35.5, 55.4, 101, 150, "Unhealthy for Sensitive Groups"),
    (55.5, 150.4, 151, 200, "Unhealthy"),
    (150.5, 250.4, 201, 300, "Very Unhealthy"),
    (250.5, 500.4, 301, 500, "Hazardous"),
]


def pm25_to_aqi(pm25: float) -> tuple[int, str]:
    """Return (AQI, category) for a PM2.5 concentration in µg/m³."""
    concentration = max(0.0, float(pm25))

    if concentration > 500.4:
        return 500, "Hazardous"

    for c_low, c_high, i_low, i_high, category in PM25_BREAKPOINTS:
        if c_low <= concentration <= c_high:
            aqi = round(((i_high - i_low) / (c_high - c_low)) * (concentration - c_low) + i_low)
            return int(aqi), category

    return 500, "Hazardous"
