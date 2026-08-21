import React, { useState } from 'react';
import { DashboardData } from '../types';
import { AlertCard } from '../components/AlertCard';
import { EmptyState } from '../components/DataStateComponents';
import { Bell, CheckCircle2 } from 'lucide-react';

interface AlertsViewProps {
  data: DashboardData;
  onNavigateTab: (tab: string) => void;
  onSelectLocationByName: (areaName: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  data,
  onNavigateTab,
  onSelectLocationByName
}) => {
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MODERATE' | 'RESOLVED'>('ALL');
  const isConnected = data.connectionStatus === 'CONNECTED';
  const alerts = data.alerts || [];

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'ALL') return true;
    if (filter === 'HIGH') return alert.severity === 'HIGH' || alert.severity === 'CRITICAL' || alert.severity === 'VERY_HIGH';
    if (filter === 'MODERATE') return alert.severity === 'MODERATE';
    if (filter === 'RESOLVED') return alert.status === 'Resolved';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Filter Controls */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--risk-critical)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            EARLY WARNING SYSTEM
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} style={{ color: 'var(--risk-critical)' }} />
            Air Quality Alerts ({filteredAlerts.length})
          </h2>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '4px' }}>
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'HIGH', label: 'High & Critical' },
            { id: 'MODERATE', label: 'Moderate' },
            { id: 'RESOLVED', label: 'Resolved' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '3px',
                background: filter === f.id ? 'var(--bg-elevated)' : 'transparent',
                color: filter === f.id ? 'var(--accent-data)' : 'var(--text-secondary)',
                border: filter === f.id ? '1px solid var(--border-medium)' : 'none',
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Stats Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="grid-4col">
        <div className="card">
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL ALERTS</span>
          <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {isConnected ? alerts.length : '—'}
          </div>
        </div>
        <div className="card">
          <span style={{ fontSize: '10px', color: 'var(--risk-critical)', fontWeight: 600 }}>ACTIVE ALERTS</span>
          <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--risk-critical)' }}>
            {isConnected ? alerts.filter(a => a.status === 'Active').length : '—'}
          </div>
        </div>
        <div className="card">
          <span style={{ fontSize: '10px', color: 'var(--risk-high)', fontWeight: 600 }}>HIGH / CRITICAL</span>
          <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--risk-high)' }}>
            {isConnected ? alerts.filter(a => a.severity === 'HIGH' || a.severity === 'CRITICAL' || a.severity === 'VERY_HIGH').length : '—'}
          </div>
        </div>
        <div className="card">
          <span style={{ fontSize: '10px', color: 'var(--risk-safe)', fontWeight: 600 }}>RESOLVED</span>
          <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--risk-safe)' }}>
            {isConnected ? alerts.filter(a => a.status === 'Resolved').length : '—'}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div>
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onViewForecast={() => onNavigateTab('forecast')}
              onViewArea={() => {
                onSelectLocationByName(alert.area);
                onNavigateTab('map');
              }}
            />
          ))
        ) : (
          <EmptyState 
            title={isConnected ? "No Active Alerts" : "Warning Data Unavailable"} 
            message={isConnected ? "No active air-quality warnings match the selected filter." : "Connect the FastAPI service to view early warning alerts."} 
            icon={<CheckCircle2 size={32} style={{ color: 'var(--risk-safe)', opacity: 0.7 }} />}
          />
        )}
      </div>
    </div>
  );
};
