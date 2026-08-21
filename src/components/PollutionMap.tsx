import React, { useState } from 'react';
import { LocationNode, RiskLevel, ForecastHorizon } from '../types';
import { Map, Filter, Compass, MapPin, Server } from 'lucide-react';

interface PollutionMapProps {
  locations: LocationNode[];
  selectedLocation: LocationNode | null;
  onSelectLocation: (loc: LocationNode) => void;
  horizon?: ForecastHorizon;
  onHorizonChange?: (h: ForecastHorizon) => void;
}

export const PollutionMap: React.FC<PollutionMapProps> = ({
  locations = [],
  selectedLocation,
  onSelectLocation,
  horizon = 'NOW',
  onHorizonChange
}) => {
  const [activeRiskFilter, setActiveRiskFilter] = useState<string>('ALL');

  const filteredLocations = locations.filter(loc => {
    if (activeRiskFilter === 'ALL') return true;
    return loc.riskLevel === activeRiskFilter;
  });

  const getMarkerColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'SAFE': return 'var(--risk-safe)';
      case 'MODERATE': return 'var(--risk-moderate)';
      case 'HIGH': return 'var(--risk-high)';
      case 'VERY_HIGH': return 'var(--risk-very-high)';
      case 'CRITICAL': return 'var(--risk-critical)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '520px' }}>
      {/* Map Control Toolbar */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-medium)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Map size={16} style={{ color: 'var(--accent-data)' }} />
          <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Predictive Pollution Map</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Geospatial Spatial Grid</span>
        </div>

        {/* Time Horizon Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>TIME HORIZON:</span>
          <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-surface)', padding: '2px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            {(['NOW', '+2H', '+4H', '+6H'] as ForecastHorizon[]).map(h => (
              <button
                key={h}
                onClick={() => onHorizonChange && onHorizonChange(h)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '3px',
                  background: horizon === h ? 'var(--accent-data)' : 'transparent',
                  color: horizon === h ? '#071018' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={13} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Filter:</span>
          {['ALL', 'HIGH', 'CRITICAL'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveRiskFilter(filter)}
              style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '3px',
                border: '1px solid',
                borderColor: activeRiskFilter === filter ? 'var(--accent-data)' : 'var(--border-subtle)',
                background: activeRiskFilter === filter ? 'rgba(85, 199, 232, 0.15)' : 'transparent',
                color: activeRiskFilter === filter ? 'var(--accent-data)' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas & Map Container */}
      <div style={{ flex: 1, position: 'relative', backgroundColor: '#050c13', overflow: 'hidden', minHeight: '440px' }}>
        {/* Map Dark Grid Pattern SVG Background */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
          </defs>

          <rect width="100" height="100" fill="url(#grid)" />
          <path d="M 10 50 Q 50 45 90 50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" strokeDasharray="1 1" />
          <path d="M 50 10 Q 48 50 52 90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" strokeDasharray="1 1" />
        </svg>

        {/* Legend Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          background: 'rgba(13, 23, 33, 0.85)',
          backdropFilter: 'blur(4px)',
          border: '1px solid var(--border-medium)',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '10px',
          display: 'flex',
          gap: '12px',
          zIndex: 5
        }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>RISK SPECTRUM:</span>
          <span style={{ color: 'var(--risk-safe)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>● Low</span>
          <span style={{ color: 'var(--risk-moderate)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>● Moderate</span>
          <span style={{ color: 'var(--risk-high)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>● High</span>
          <span style={{ color: 'var(--risk-critical)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>● Critical</span>
        </div>

        {/* Coordinate Overlay */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(13, 23, 33, 0.85)',
          border: '1px solid var(--border-subtle)',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 5
        }}>
          <Compass size={13} style={{ color: 'var(--accent-data)' }} />
          <span>Spatial Grid | API Layer Active</span>
        </div>

        {/* Empty State overlay when no locations exist */}
        {(!locations || locations.length === 0) && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: 'rgba(5, 12, 19, 0.75)',
            backdropFilter: 'blur(2px)',
            zIndex: 15,
            padding: '24px',
            textAlign: 'center'
          }}>
            <Server size={32} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              No Location Data Available
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: '1.5' }}>
              Pollution intelligence will appear here when location data is available.
            </p>
          </div>
        )}

        {/* Location Node Pins (Only rendered when real backend locations exist) */}
        {filteredLocations.map(loc => {
          const isSelected = selectedLocation?.id === loc.id;
          const color = getMarkerColor(loc.riskLevel);
          const rawValue = horizon === 'NOW' ? loc.currentAQI : loc.predictedAQI;
          const displayValue = rawValue !== null && rawValue !== undefined ? rawValue : '—';

          return (
            <div
              key={loc.id}
              onClick={() => onSelectLocation(loc)}
              style={{
                position: 'absolute',
                left: `${loc.lng}%`,
                top: `${loc.lat}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: isSelected ? 20 : 10
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}>
                <div style={{
                  backgroundColor: isSelected ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                  border: `2px solid ${isSelected ? 'var(--accent-data)' : color}`,
                  borderRadius: '4px',
                  padding: '4px 8px',
                  boxShadow: 'var(--shadow-card)',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    display: 'inline-block'
                  }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>{loc.name}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isSelected ? 'var(--accent-data)' : color }}>
                    {displayValue}
                  </span>
                </div>

                <div style={{ width: '2px', height: '8px', backgroundColor: color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
