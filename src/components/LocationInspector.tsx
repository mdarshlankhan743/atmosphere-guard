import React from 'react';
import { LocationNode, FactorItem } from '../types';
import { RiskBadge, TrendIndicator } from './RiskBadge';
import { MapPin, Wind, Thermometer, Droplets, AlertTriangle, Server } from 'lucide-react';

interface FactorBreakdownProps {
  factors?: FactorItem[];
}

export const FactorBreakdown: React.FC<FactorBreakdownProps> = ({ factors = [] }) => {
  if (!factors || factors.length === 0) {
    return (
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        No model factors provided by the connected API response.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {factors.map(factor => {
        const getLevelColor = (lvl: string) => {
          if (lvl === 'High' || lvl === 'Unfavorable') return 'var(--risk-high)';
          if (lvl === 'Moderate') return 'var(--risk-moderate)';
          return 'var(--risk-safe)';
        };

        return (
          <div key={factor.id} style={{ background: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{factor.name}</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: getLevelColor(factor.level), textTransform: 'uppercase' }}>
                {factor.level}
              </span>
            </div>

            {/* Impact score progress bar */}
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-surface)', borderRadius: '2px', overflow: 'hidden', margin: '4px 0' }}>
              <div 
                style={{ 
                  width: `${factor.impactScore}%`, 
                  height: '100%', 
                  backgroundColor: getLevelColor(factor.level) 
                }} 
              />
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.3, marginTop: '4px' }}>
              {factor.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

interface LocationInspectorProps {
  location: LocationNode | null;
  onViewFullForecast?: () => void;
}

export const LocationInspector: React.FC<LocationInspectorProps> = ({ location, onViewFullForecast }) => {
  if (!location) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', height: '100%', minHeight: '380px', padding: '32px 20px', textAlign: 'center' }}>
        <Server size={32} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
          No Location Selected
        </h4>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '300px', lineHeight: '1.5' }}>
          Select a location from the map or dropdown to inspect station telemetry and model factors.
        </p>
      </div>
    );
  }

  const currentAQIDisplay = location.currentAQI !== null && location.currentAQI !== undefined ? location.currentAQI : '—';
  const predictedAQIDisplay = location.predictedAQI !== null && location.predictedAQI !== undefined ? location.predictedAQI : '—';
  const pm25CurrentDisplay = location.pm25Current !== null && location.pm25Current !== undefined ? `${location.pm25Current} µg/m³` : '—';
  const windDisplay = location.windSpeed !== null && location.windSpeed !== undefined ? `${location.windSpeed} km/h ${location.windDirection || ''}` : '—';
  const tempDisplay = location.temperature !== null && location.temperature !== undefined ? `${location.temperature} °C` : '—';
  const humidityDisplay = location.humidity !== null && location.humidity !== undefined ? `${location.humidity} %` : '—';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--accent-data)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            LOCATION INSPECTOR
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={18} style={{ color: 'var(--accent-data)' }} />
            {location.name}
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{location.region}</span>
        </div>
        <RiskBadge level={location.riskLevel} size="md" />
      </div>

      {/* Primary AQI & Forecast Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '2px' }}>CURRENT AQI</span>
          <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{currentAQIDisplay}</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>PM2.5: {pm25CurrentDisplay}</span>
        </div>

        <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-medium)' }}>
          <span style={{ fontSize: '10px', color: 'var(--accent-data)', fontWeight: 600, display: 'block', marginBottom: '2px' }}>PREDICTED AQI</span>
          <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-data)' }}>{predictedAQIDisplay}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <TrendIndicator trend={location.trend} />
          </div>
        </div>
      </div>

      {/* Meteorological Telemetry Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: 'var(--bg-secondary)', padding: '8px 10px', borderRadius: '4px', fontSize: '11px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Wind size={13} style={{ color: 'var(--text-muted)' }} />
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>WIND</span>
            <span>{windDisplay}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Thermometer size={13} style={{ color: 'var(--text-muted)' }} />
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>TEMP</span>
            <span>{tempDisplay}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Droplets size={13} style={{ color: 'var(--text-muted)' }} />
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>HUMIDITY</span>
            <span>{humidityDisplay}</span>
          </div>
        </div>
      </div>

      {/* Explainable Factors Section */}
      <div style={{ marginTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <AlertTriangle size={14} style={{ color: 'var(--accent-data)' }} />
          <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
            FACTORS ASSOCIATED WITH FORECAST
          </h4>
        </div>

        {location.explanation ? (
          <div style={{ background: 'rgba(85, 199, 232, 0.06)', border: '1px solid rgba(85, 199, 232, 0.15)', padding: '10px 12px', borderRadius: '4px', marginBottom: '12px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.4 }}>
              "{location.explanation}"
            </p>
          </div>
        ) : null}

        <FactorBreakdown factors={location.factors} />
      </div>

      {onViewFullForecast && (
        <button 
          onClick={onViewFullForecast} 
          className="btn-primary" 
          style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', paddingTop: '10px', paddingBottom: '10px' }}
        >
          View Detailed Station Analytics
        </button>
      )}
    </div>
  );
};
