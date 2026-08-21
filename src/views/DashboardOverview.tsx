import React from 'react';
import { DashboardData, LocationNode } from '../types';
import { AQICard } from '../components/AQICard';
import { ForecastChart } from '../components/ForecastChart';
import { PollutionMap } from '../components/PollutionMap';
import { LocationInspector } from '../components/LocationInspector';
import { Activity, TrendingUp, Flame, MapPin, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface DashboardOverviewProps {
  data: DashboardData;
  selectedLocation: LocationNode | null;
  onSelectLocation: (loc: LocationNode) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  data,
  selectedLocation,
  onSelectLocation,
  onNavigateTab
}) => {
  const activeAlert = data.alerts && data.alerts.length > 0 ? data.alerts[0] : null;
  const isConnected = data.connectionStatus === 'CONNECTED';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 4 Primary Top Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="grid-4col">
        <AQICard
          title="CURRENT AQI"
          value={data.metrics.currentAQI}
          subtitle={isConnected ? "Observed grid level" : "Connect API to view data"}
          riskLevel={data.metrics.riskLevel}
          icon={<Activity size={18} />}
        />

        <AQICard
          title="FORECAST (+6H)"
          value={data.metrics.forecastAQI}
          subtitle={isConnected ? "Predicted max level" : "Connect API to view data"}
          riskLevel={isConnected ? "HIGH" : "UNKNOWN"}
          trend={isConnected ? "RISING" : undefined}
          highlight={true}
          icon={<TrendingUp size={18} style={{ color: 'var(--accent-data)' }} />}
        />

        <AQICard
          title="RISK ASSESSMENT"
          value={isConnected ? data.metrics.riskLevel : null}
          subtitle={isConnected ? "FastAPI model score" : "No backend connected"}
          riskLevel={data.metrics.riskLevel}
          icon={<Flame size={18} style={{ color: isConnected ? 'var(--risk-high)' : 'var(--text-muted)' }} />}
        />

        <AQICard
          title="EMERGING HOTSPOTS"
          value={data.metrics.hotspotsCount}
          subtitle={isConnected ? "High-risk location count" : "Connect API to view data"}
          riskLevel={isConnected && (data.metrics.hotspotsCount || 0) > 0 ? "CRITICAL" : "UNKNOWN"}
          trend={isConnected ? "RISING" : undefined}
          icon={<MapPin size={18} style={{ color: isConnected ? 'var(--risk-critical)' : 'var(--text-muted)' }} />}
        />
      </div>

      {/* Early Warning Component */}
      <div className="card-elevated" style={{ 
        borderLeft: `4px solid ${activeAlert ? 'var(--risk-high)' : 'var(--border-medium)'}`, 
        padding: '20px' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ 
              background: activeAlert ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-secondary)', 
              padding: '10px', 
              borderRadius: '4px', 
              color: activeAlert ? 'var(--risk-high)' : 'var(--text-muted)' 
            }}>
              {activeAlert ? <ShieldAlert size={22} /> : <CheckCircle2 size={22} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: activeAlert ? 'var(--risk-high)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {activeAlert ? `EARLY WARNING - ${activeAlert.severity}` : 'EARLY WARNING STATUS'}
                </span>
                {activeAlert?.area && (
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{activeAlert.area}</span>
                )}
              </div>
              <p style={{ fontSize: '13px', color: activeAlert ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 500 }}>
                {activeAlert 
                  ? `"${activeAlert.message}"`
                  : isConnected 
                    ? "No active air-quality warnings."
                    : "Warning data unavailable. Connect FastAPI service to receive live early warnings."
                }
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => onNavigateTab('forecast')} className="btn-secondary" style={{ fontSize: '12px', padding: '8px 14px' }}>
              View Forecast
            </button>
            <button onClick={() => onNavigateTab('alerts')} className="btn-primary" style={{ fontSize: '12px', padding: '8px 14px' }}>
              View Alerts
            </button>
          </div>
        </div>
      </div>

      {/* Forecast Chart Section */}
      <ForecastChart 
        data={data.forecastSeries} 
        onHorizonChange={() => onNavigateTab('forecast')}
      />

      {/* Map + Location Inspector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', minHeight: '540px' }} className="grid-2col">
        <PollutionMap 
          locations={data.locations}
          selectedLocation={selectedLocation}
          onSelectLocation={onSelectLocation}
        />

        <LocationInspector 
          location={selectedLocation}
          onViewFullForecast={() => onNavigateTab('forecast')}
        />
      </div>
    </div>
  );
};
