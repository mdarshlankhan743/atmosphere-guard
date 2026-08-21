import React from 'react';
import { RiskLevel, TrendDirection } from '../types';
import { RiskBadge, TrendIndicator } from './RiskBadge';
import { Activity } from 'lucide-react';

interface AQICardProps {
  title: string;
  value: number | string | null;
  subtitle?: string;
  riskLevel?: RiskLevel;
  trend?: TrendDirection;
  icon?: React.ReactNode;
  highlight?: boolean;
  unit?: string;
}

export const AQICard: React.FC<AQICardProps> = ({
  title,
  value,
  subtitle,
  riskLevel = 'UNKNOWN',
  trend,
  icon,
  highlight = false,
  unit
}) => {
  const displayValue = value !== null && value !== undefined && value !== '' ? value : '—';

  return (
    <div 
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: highlight ? '4px solid var(--accent-data)' : undefined,
        minHeight: '120px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        {icon ? (
          <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
        ) : (
          <Activity size={18} style={{ color: 'var(--text-muted)' }} />
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
        <div className="metric-large" style={{ color: displayValue === '—' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
          {displayValue}
        </div>
        {unit && displayValue !== '—' && (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{unit}</span>
        )}
        {trend && displayValue !== '—' && <TrendIndicator trend={trend} showLabel={false} />}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
        <RiskBadge level={riskLevel} size="sm" />
        {subtitle && (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
