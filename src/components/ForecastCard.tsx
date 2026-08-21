import React from 'react';
import { RiskLevel, TrendDirection } from '../types';
import { RiskBadge, TrendIndicator } from './RiskBadge';
import { Clock, AlertTriangle } from 'lucide-react';

interface ForecastCardProps {
  horizon: string;
  timeLabel: string;
  predictedAQI: number | string | null;
  riskLevel: RiskLevel;
  trend: TrendDirection;
  isCurrent?: boolean;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({
  horizon,
  timeLabel,
  predictedAQI,
  riskLevel,
  trend,
  isCurrent = false
}) => {
  const displayVal = predictedAQI !== null && predictedAQI !== undefined && predictedAQI !== '' ? predictedAQI : '—';

  return (
    <div 
      className="card" 
      style={{ 
        backgroundColor: isCurrent ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        borderColor: isCurrent ? 'var(--border-accent)' : 'var(--border-subtle)',
        padding: '16px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-data)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} /> {horizon}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{timeLabel}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0' }}>
        <span style={{ fontSize: '26px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: displayVal === '—' ? 'var(--text-muted)' : 'var(--text-primary)' }}>{displayVal}</span>
        {displayVal !== '—' && <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>AQI</span>}
        <div style={{ marginLeft: 'auto' }}>
          <TrendIndicator trend={trend} showLabel={false} />
        </div>
      </div>

      <div style={{ marginTop: '8px' }}>
        <RiskBadge level={riskLevel} size="sm" />
      </div>
    </div>
  );
};

interface HotspotCardProps {
  areaName: string;
  region: string;
  currentAQI: number | string | null;
  predictedAQI: number | string | null;
  riskLevel: RiskLevel;
  trend: TrendDirection;
  onSelect?: () => void;
}

export const HotspotCard: React.FC<HotspotCardProps> = ({
  areaName,
  region,
  currentAQI,
  predictedAQI,
  riskLevel,
  trend,
  onSelect
}) => {
  const currentVal = currentAQI !== null && currentAQI !== undefined ? currentAQI : '—';
  const predictedVal = predictedAQI !== null && predictedAQI !== undefined ? predictedAQI : '—';

  return (
    <div 
      className="card"
      onClick={onSelect}
      style={{
        cursor: onSelect ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{areaName}</h4>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{region}</span>
        </div>
        <RiskBadge level={riskLevel} size="sm" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '4px' }}>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>CURRENT</span>
          <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{currentVal}</span>
        </div>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>PREDICTED</span>
          <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-data)' }}>{predictedVal}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <AlertTriangle size={12} style={{ color: 'var(--risk-high)' }} /> High Risk Hotspot
        </span>
        <TrendIndicator trend={trend} />
      </div>
    </div>
  );
};
