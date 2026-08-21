import React, { useState } from 'react';
import { AlertItem } from '../types';
import { RiskBadge } from './RiskBadge';
import { MapPin, Clock, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

interface AlertCardProps {
  alert: AlertItem;
  onViewForecast?: (area: string) => void;
  onViewArea?: (area: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onViewForecast, onViewArea }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className="card" 
      style={{ 
        borderLeft: `4px solid ${
          alert.severity === 'CRITICAL' ? 'var(--risk-critical)' :
          alert.severity === 'HIGH' || alert.severity === 'VERY_HIGH' ? 'var(--risk-high)' :
          alert.severity === 'MODERATE' ? 'var(--risk-moderate)' : 'var(--risk-safe)'
        }`,
        padding: '16px',
        marginBottom: '12px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ 
            background: 'var(--bg-secondary)', 
            padding: '8px', 
            borderRadius: '4px',
            color: alert.severity === 'CRITICAL' ? 'var(--risk-critical)' : 'var(--accent-data)' 
          }}>
            <ShieldAlert size={18} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <RiskBadge level={alert.severity} size="sm" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} style={{ color: 'var(--text-muted)' }} /> {alert.area}
              </span>
              {alert.timestamp && (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={11} /> {alert.timestamp}
                </span>
              )}
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4, margin: '6px 0' }}>
              {alert.message}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{
            fontSize: '11px',
            padding: '3px 8px',
            borderRadius: '3px',
            background: alert.status === 'Active' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
            color: alert.status === 'Active' ? 'var(--risk-critical)' : 'var(--risk-safe)',
            fontWeight: 500
          }}>
            {alert.status}
          </span>
          <button 
            onClick={() => setExpanded(!expanded)} 
            style={{ color: 'var(--text-muted)', padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}
            title="Toggle Details"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '4px' }}>
          {alert.suggestedAction && (
            <>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                RECOMMENDED DECISION SUPPORT ACTION:
              </span>
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '10px' }}>
                {alert.suggestedAction}
              </p>
            </>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            {onViewForecast && (
              <button 
                onClick={() => onViewForecast(alert.area)}
                className="btn-outline" 
                style={{ fontSize: '11px', padding: '6px 12px' }}
              >
                View Forecast
              </button>
            )}
            {onViewArea && (
              <button 
                onClick={() => onViewArea(alert.area)}
                className="btn-outline" 
                style={{ fontSize: '11px', padding: '6px 12px' }}
              >
                View Area
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
