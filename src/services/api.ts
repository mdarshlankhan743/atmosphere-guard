// AIRGUARD AI - Centralized API Integration Layer
// Strictly communicates with real FastAPI ML backend (VITE_API_BASE_URL)
// ZERO fake environmental data or hardcoded mock numbers.

import { 
  DashboardData, 
  ForecastPoint, 
  LocationNode, 
  AlertItem, 
  PredictPayload, 
  PredictResponse,
  RiskLevel,
  ConnectionStatus
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const DEFAULT_TIMEOUT_MS = 15000;

class AirGuardApiService {
  private apiBaseUrl: string = API_BASE_URL;

  public getBaseUrl(): string {
    return this.apiBaseUrl;
  }

  // Health check endpoint (GET /health or /api/v1/health)
  public async checkHealth(): Promise<{ isHealthy: boolean; timestamp: string | null }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
      
      const response = await fetch(`${this.apiBaseUrl}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        return { 
          isHealthy: json.model_loaded === true || json.status === 'ok', 
          timestamp: json.timestamp || new Date().toISOString() 
        };
      }
      return { isHealthy: false, timestamp: null };
    } catch {
      return { isHealthy: false, timestamp: null };
    }
  }

  // GET /dashboard
  // Returns real dashboard payload from FastAPI or clean empty state if disconnected
  public async getDashboardData(): Promise<DashboardData> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

      const res = await fetch(`${this.apiBaseUrl}/dashboard`, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        return {
          metrics: {
            currentAQI: json.metrics?.currentAQI ?? null,
            forecastAQI: json.metrics?.forecastAQI ?? null,
            riskLevel: json.metrics?.riskLevel ?? 'UNKNOWN',
            hotspotsCount: json.metrics?.hotspotsCount ?? null,
            risingAreasCount: json.metrics?.risingAreasCount ?? null,
            activeAlertsCount: json.metrics?.activeAlertsCount ?? null,
          },
          selectedLocation: json.selectedLocation ?? null,
          locations: json.locations ?? [],
          forecastSeries: json.forecastSeries ?? [],
          alerts: json.alerts ?? [],
          priorityList: json.priorityList ?? [],
          lastUpdated: json.lastUpdated || new Date().toISOString(),
          connectionStatus: 'CONNECTED'
        };
      }
    } catch {
      // Backend is unavailable - return clean empty state with NO fake environmental data
    }

    return {
      metrics: {
        currentAQI: null,
        forecastAQI: null,
        riskLevel: 'UNKNOWN',
        hotspotsCount: null,
        risingAreasCount: null,
        activeAlertsCount: null,
      },
      selectedLocation: null,
      locations: [],
      forecastSeries: [],
      alerts: [],
      priorityList: [],
      lastUpdated: null,
      connectionStatus: 'UNAVAILABLE'
    };
  }

  // GET /locations
  public async getLocations(): Promise<{ locations: LocationNode[]; status: ConnectionStatus }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

      const res = await fetch(`${this.apiBaseUrl}/locations`, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return { locations: Array.isArray(data) ? data : data.locations || [], status: 'CONNECTED' };
      }
    } catch {
      // Return empty list when backend disconnected
    }

    return { locations: [], status: 'UNAVAILABLE' };
  }

  // GET /locations/{id}
  public async getLocationById(id: string): Promise<LocationNode | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

      const res = await fetch(`${this.apiBaseUrl}/locations/${id}`, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Return null on failure
    }
    return null;
  }

  // GET /forecast?locationId={id}&horizon={hours}
  public async getForecast(locationId?: string, horizonHours: number = 6): Promise<{
    locationId: string | null;
    series: ForecastPoint[];
    currentAQI: number | null;
    predictedAQI: number | null;
    status: ConnectionStatus;
  }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

      const queryParams = new URLSearchParams();
      if (locationId) queryParams.append('locationId', locationId);
      queryParams.append('horizon', horizonHours.toString());

      const res = await fetch(`${this.apiBaseUrl}/forecast?${queryParams.toString()}`, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        return {
          locationId: json.locationId || locationId || null,
          series: json.series || [],
          currentAQI: json.currentAQI ?? null,
          predictedAQI: json.predictedAQI ?? null,
          status: 'CONNECTED'
        };
      }
    } catch {
      // Disconnected state
    }

    return {
      locationId: locationId || null,
      series: [],
      currentAQI: null,
      predictedAQI: null,
      status: 'UNAVAILABLE'
    };
  }

  // GET /alerts?severity={filter}
  public async getAlerts(severityFilter?: RiskLevel | 'ALL'): Promise<{ alerts: AlertItem[]; status: ConnectionStatus }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

      const queryParams = new URLSearchParams();
      if (severityFilter && severityFilter !== 'ALL') {
        queryParams.append('severity', severityFilter);
      }

      const res = await fetch(`${this.apiBaseUrl}/alerts?${queryParams.toString()}`, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return { alerts: Array.isArray(data) ? data : data.alerts || [], status: 'CONNECTED' };
      }
    } catch {
      // Disconnected state
    }

    return { alerts: [], status: 'UNAVAILABLE' };
  }

  // POST /predict - Inference trigger endpoint
  public async predict(payload: PredictPayload): Promise<PredictResponse | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

      const res = await fetch(`${this.apiBaseUrl}/predict`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // API call failed
    }

    return null;
  }
}

export const apiService = new AirGuardApiService();
