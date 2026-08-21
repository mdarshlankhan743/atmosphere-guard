// AIRGUARD AI - Core TypeScript Definitions

export type RiskLevel = 'SAFE' | 'MODERATE' | 'HIGH' | 'VERY_HIGH' | 'CRITICAL' | 'UNKNOWN';
export type TrendDirection = 'RISING' | 'FALLING' | 'STABLE' | 'UNKNOWN';
export type ForecastHorizon = 'NOW' | '+2H' | '+4H' | '+6H' | '+12H' | '+24H';
export type ConnectionStatus = 'CONNECTED' | 'UNAVAILABLE' | 'LOADING' | 'ERROR';

export interface FactorItem {
  id: string;
  name: string;
  level: 'High' | 'Moderate' | 'Low';
  description: string;
  impactScore: number; // 0-100 scale for UI display
}

export interface LocationNode {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  currentAQI: number | null;
  predictedAQI: number | null;
  riskLevel: RiskLevel;
  trend: TrendDirection;
  pm25Current: number | null; // µg/m³
  pm25Predicted: number | null; // µg/m³
  temperature: number | null; // °C
  humidity: number | null; // %
  windSpeed: number | null; // km/h
  windDirection?: string | null;
  factors?: FactorItem[];
  explanation?: string;
}

export interface ForecastPoint {
  timeLabel: string; // e.g. "Now", "+2H", "+4H", "+6H"
  timestamp: string;
  observedAQI: number | null; // Null for future predictions or missing data
  predictedAQI: number | null;
  upperBound?: number | null;
  lowerBound?: number | null;
  riskThreshold?: number | null;
}

export interface AlertItem {
  id: string;
  severity: RiskLevel;
  area: string;
  message: string;
  timestamp: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  suggestedAction?: string;
  expectedDirection?: string;
  forecastPeriod?: string;
}

export interface PriorityItem {
  priority: number;
  areaId: string;
  areaName: string;
  currentAQI: number | null;
  predictedAQI: number | null;
  trend: TrendDirection;
  risk: RiskLevel;
  recommendedAction: string;
}

export interface DashboardMetrics {
  currentAQI: number | null;
  forecastAQI: number | null;
  riskLevel: RiskLevel;
  hotspotsCount: number | null;
  risingAreasCount: number | null;
  activeAlertsCount: number | null;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  selectedLocation: LocationNode | null;
  locations: LocationNode[];
  forecastSeries: ForecastPoint[];
  alerts: AlertItem[];
  priorityList: PriorityItem[];
  lastUpdated: string | null;
  connectionStatus: ConnectionStatus;
}

// Future FastAPI Contract Interfaces
export interface PredictPayload {
  locationId: string;
  horizonHours: number;
  includeFactors?: boolean;
}

export interface PredictResponse {
  locationId: string;
  forecastHorizon: string;
  predictedAQI: number;
  riskLevel: RiskLevel;
  confidenceScore: number;
  factors: FactorItem[];
  modelTimestamp: string;
}

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  connectionStatus: ConnectionStatus;
  lastUpdated: string | null;
}

