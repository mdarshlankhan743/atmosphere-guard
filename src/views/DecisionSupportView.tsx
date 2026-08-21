import React from 'react';
import { DashboardData } from '../types';
import { RiskBadge, TrendIndicator } from '../components/RiskBadge';
import { Shield, Info } from 'lucide-react';
import { EmptyState } from '../components/DataStateComponents';

interface DecisionSupportViewProps {
  data: DashboardData;
  onSelectArea: (areaId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const DecisionSupportView: React.FC<DecisionSupportViewProps> = ({
  data,
  onSelectArea,
  onNavigateTab
}) => {
  const isConnected = data.connectionStatus === 'CONNECTED';
  const priorityList = data.priorityList || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-data)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            DECISION SUPPORT DASHBOARD
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} style={{ color: 'var(--accent-data)' }} />
            Decision Support & Priority Guidance
          </h2>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
          Model-based recommendations for monitoring resource allocation
        </div>
      </div>

      {/* 4 Executive Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="grid-4col">
        <div className="card">
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>HIGH-RISK AREAS</span>
          <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isConnected ? 'var(--risk-high)' : 'var(--text-muted)', margin: '4px 0' }}>
            {data.metrics.hotspotsCount !== null ? data.metrics.hotspotsCount : '—'}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Monitoring stations in high risk</span>
        </div>

        <div className="card">
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>RISING AREAS</span>
          <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isConnected ? 'var(--accent-data)' : 'var(--text-muted)', margin: '4px 0' }}>
            {data.metrics.risingAreasCount !== null ? data.metrics.risingAreasCount : '—'}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Upward trend trajectory</span>
        </div>

        <div className="card">
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>ACTIVE ALERTS</span>
          <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isConnected ? 'var(--risk-critical)' : 'var(--text-muted)', margin: '4px 0' }}>
            {data.metrics.activeAlertsCount !== null ? data.metrics.activeAlertsCount : '—'}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Requires advisory review</span>
        </div>

        <div className="card-elevated" style={{ border: '1px solid var(--border-medium)' }}>
          <span style={{ fontSize: '10px', color: 'var(--accent-data)', fontWeight: 600, textTransform: 'uppercase' }}>FORECAST PEAK</span>
          <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-data)', margin: '4px 0' }}>
            {data.metrics.forecastAQI !== null ? data.metrics.forecastAQI : '—'}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent-data)' }}>Predicted max level</span>
        </div>
      </div>

      {/* Suggested Monitoring Priority Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Priority Ranking Table
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
              Populated directly by backend decision-support API endpoint
            </span>
          </div>
        </div>

        {priorityList.length > 0 ? (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>Priority</th>
                  <th>Area</th>
                  <th>Current AQI</th>
                  <th>Predicted AQI</th>
                  <th>Trend</th>
                  <th>Risk Level</th>
                  <th>Recommended Action</th>
                </tr>
              </thead>
              <tbody>
                {priorityList.map((row) => (
                  <tr key={row.priority}>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-data)' }}>
                      #{row.priority}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      <button 
                        onClick={() => {
                          onSelectArea(row.areaId);
                          onNavigateTab('map');
                        }}
                        style={{ color: 'var(--text-primary)', textDecoration: 'none', cursor: 'pointer', textAlign: 'left', background: 'transparent', border: 'none' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-data)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                      >
                        {row.areaName}
                      </button>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{row.currentAQI !== null ? row.currentAQI : '—'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-data)' }}>
                      {row.predictedAQI !== null ? row.predictedAQI : '—'}
                    </td>
                    <td>
                      <TrendIndicator trend={row.trend} showLabel={false} />
                    </td>
                    <td>
                      <RiskBadge level={row.risk} size="sm" />
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '380px' }}>
                      {row.recommendedAction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState 
            title="No Decision-Support Data Available"
            message="Decision-support insights will appear when prediction data is available from the FastAPI backend."
          />
        )}
      </div>

      {/* Explicit Operational Disclaimer */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '6px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <Info size={18} style={{ color: 'var(--accent-data)', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Governance Disclaimer:</strong> AirGuard AI provides decision support and does not autonomously make operational decisions. All priority rankings and action recommendations serve as advisory data inputs for municipal authorities.
        </div>
      </div>
    </div>
  );
};
