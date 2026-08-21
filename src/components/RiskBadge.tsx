import React from 'react';
import { RiskLevel, TrendDirection } from '../types';
import { ShieldCheck, AlertTriangle, Flame, ShieldAlert, TrendingUp, TrendingDown, Minus, HelpCircle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, showIcon = true, size = 'md' }) => {
  const getBadgeConfig = (risk: RiskLevel) => {
    switch (risk) {
      case 'SAFE':
        return {
          label: 'SAFE',
          className: 'badge-safe',
          icon: <ShieldCheck size={14} />
        };
      case 'MODERATE':
        return {
          label: 'MODERATE',
          className: 'badge-moderate',
          icon: <AlertTriangle size={14} />
        };
      case 'HIGH':
        return {
          label: 'HIGH',
          className: 'badge-high',
          icon: <AlertTriangle size={14} />
        };
      case 'VERY_HIGH':
        return {
          label: 'VERY HIGH',
          className: 'badge-very-high',
          icon: <Flame size={14} />
        };
      case 'CRITICAL':
        return {
          label: 'CRITICAL',
          className: 'badge-critical',
          icon: <ShieldAlert size={14} />
        };
      case 'UNKNOWN':
      default:
        return {
          label: 'NO DATA',
          className: 'badge-unknown',
          icon: <HelpCircle size={14} />
        };
    }
  };

  const config = getBadgeConfig(level);
  const paddingStyle = size === 'sm' ? { padding: '2px 6px', fontSize: '10px' } : size === 'lg' ? { padding: '6px 14px', fontSize: '12px' } : {};

  return (
    <span className={`badge-risk ${config.className}`} style={paddingStyle} title={`Risk Level: ${config.label}`}>
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};

interface TrendIndicatorProps {
  trend: TrendDirection;
  showLabel?: boolean;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({ trend, showLabel = true }) => {
  if (trend === 'RISING') {
    return (
      <span style={{ color: 'var(--risk-high)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
        <TrendingUp size={16} />
        {showLabel && <span>Rising</span>}
      </span>
    );
  }
  if (trend === 'FALLING') {
    return (
      <span style={{ color: 'var(--risk-safe)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
        <TrendingDown size={16} />
        {showLabel && <span>Falling</span>}
      </span>
    );
  }
  if (trend === 'STABLE') {
    return (
      <span style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
        <Minus size={16} />
        {showLabel && <span>Stable</span>}
      </span>
    );
  }
  return (
    <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
      <Minus size={16} />
      {showLabel && <span>—</span>}
    </span>
  );
};
