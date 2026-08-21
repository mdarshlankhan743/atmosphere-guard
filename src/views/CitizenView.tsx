import React from 'react';
import { DashboardData } from '../types';
import { RiskBadge, TrendIndicator } from '../components/RiskBadge';
import { ShieldAlert, Map, HelpCircle, CheckCircle2 } from 'lucide-react';

interface CitizenViewProps {
  data: DashboardData;
  onNavigateMap: () => void;
}

export const CitizenView: React.FC<CitizenViewProps> = ({ data, onNavigateMap }) => {
  const isConnected = data.connectionStatus === 'CONNECTED';
  const activeAlert = data.alerts && data.alerts.length > 0 ? data.alerts[0] : null;

  const currentAQIDisplay = data.metrics.currentAQI !== null && data.metrics.currentAQI !== undefined ? data.metrics.currentAQI : '—';
  const forecastAQIDisplay = data.metrics.forecastAQI !== null && data.metrics.forecastAQI !== undefined ? data.metrics.forecastAQI : '—';

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-data)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          CITIZEN AIR QUALITY VIEW
        </span>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '4px' }}>
          Your Local Air & Forecast
        </h2>
      </div>

      {/* Main YOUR AIR Card */}
      <div className="card-elevated" style={{ textAlign: 'center', padding: '36px 24px', border: '1px solid var(--border-medium)' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          YOUR AIR NOW
        </span>

        {/* Big AQI Number */}
        <div style={{ fontSize: '72px', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1, margin: '16px 0 8px', color: currentAQIDisplay === '—' ? 'var(--text-muted)' : '#F4F7FA' }}>
          {currentAQIDisplay}
        </div>

        {/* Risk Badge */}
        <div style={{ display: 'inline-flex', marginBottom: '24px' }}>
          <RiskBadge level={data.metrics.riskLevel} size="lg" />
        </div>

        {/* Forecast Banner Row */}
        <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>PREDICTED AQI</span>
            <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-data)' }}>
              {forecastAQIDisplay}
            </span>
          </div>

          <div style={{ height: '30px', width: '1px', backgroundColor: 'var(--border-medium)' }} />

          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>HEALTH ADVISORY</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isConnected ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {isConnected ? "Check station advisory" : "Connect API for advice"}
            </span>
          </div>
        </div>
      </div>

      {/* Early Warning Card */}
      <div className="card" style={{ borderLeft: `4px solid ${activeAlert ? 'var(--risk-high)' : 'var(--border-medium)'}`, padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          {activeAlert ? (
            <ShieldAlert size={22} style={{ color: 'var(--risk-high)', flexShrink: 0, marginTop: '2px' }} />
          ) : (
            <CheckCircle2 size={22} style={{ color: 'var(--risk-safe)', flexShrink: 0, marginTop: '2px' }} />
          )}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: activeAlert ? 'var(--risk-high)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {activeAlert ? 'EARLY WARNING' : 'EARLY WARNING STATUS'}
            </h4>
            <p style={{ fontSize: '14px', color: activeAlert ? 'var(--text-primary)' : 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
              {activeAlert 
                ? `"${activeAlert.message}"` 
                : isConnected 
                  ? "No active air-quality warnings." 
                  : "Warning data unavailable."}
            </p>
          </div>
        </div>
      </div>

      {/* WHY IS THE FORECAST CHANGING? Card */}
      <div className="card" style={{ padding: '20px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-data)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <HelpCircle size={16} /> WHY IS THE FORECAST CHANGING?
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
          {data.selectedLocation?.explanation 
            ? data.selectedLocation.explanation 
            : isConnected 
              ? "Model factor breakdown will be derived from backend atmospheric inputs."
              : "Connect FastAPI backend to view forecast factor insights."}
        </p>
      </div>

      {/* VIEW MAP CTA Button */}
      <button 
        onClick={onNavigateMap}
        className="btn-primary" 
        style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '14px' }}
      >
        <Map size={16} /> VIEW POLLUTION MAP
      </button>
    </div>
  );
};
