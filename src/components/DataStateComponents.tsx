import React from 'react';
import { LocationNode, ConnectionStatus } from '../types';
import { RefreshCw, MapPin, AlertCircle, Inbox, Loader2, Server, CheckCircle2 } from 'lucide-react';

interface LocationSelectorProps {
  locations: LocationNode[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ locations, selectedId, onSelect }) => {
  if (!locations || locations.length === 0) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '6px 12px' }}>
        <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Location: No locations connected</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '4px', padding: '6px 12px' }}>
      <MapPin size={14} style={{ color: 'var(--accent-data)' }} />
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>Location:</span>
      <select 
        value={selectedId} 
        onChange={(e) => onSelect(e.target.value)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: '13px',
          fontWeight: 600,
          outline: 'none',
          cursor: 'pointer'
        }}
      >
        {locations.map(loc => (
          <option key={loc.id} value={loc.id} style={{ background: '#0D1721', color: '#F4F7FA' }}>
            {loc.name} {loc.riskLevel !== 'UNKNOWN' ? `(${loc.riskLevel})` : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

interface DataStatusProps {
  status: ConnectionStatus;
  lastUpdated?: string | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const DataStatus: React.FC<DataStatusProps> = ({
  status,
  lastUpdated,
  onRefresh,
  isRefreshing = false
}) => {
  const isConnected = status === 'CONNECTED';
  
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      background: 'var(--bg-surface)',
      border: `1px solid ${isConnected ? 'rgba(34, 197, 94, 0.25)' : 'var(--border-subtle)'}`,
      padding: '5px 12px',
      borderRadius: '6px',
      fontSize: '11px',
      color: 'var(--text-secondary)'
    }}>
      {/* Connection Indicator */}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
        {isConnected ? (
          <>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--risk-safe)', boxShadow: '0 0 6px rgba(34, 197, 94, 0.6)' }} />
            <span style={{ color: 'var(--risk-safe)' }}>FASTAPI CONNECTED</span>
          </>
        ) : (
          <>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--risk-moderate)' }} />
            <span style={{ color: 'var(--text-muted)' }}>NO DATA CONNECTED</span>
          </>
        )}
      </span>

      <span style={{ width: '1px', height: '12px', backgroundColor: 'var(--border-subtle)' }} />

      <span style={{ color: 'var(--text-muted)' }}>
        {isConnected && lastUpdated ? `Updated: ${lastUpdated}` : 'Prediction Service Disconnected'}
      </span>

      {onRefresh && (
        <button 
          onClick={onRefresh}
          disabled={isRefreshing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-data)',
            fontSize: '11px',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '4px'
          }}
          title="Check backend health & sync data"
        >
          <RefreshCw size={11} className={isRefreshing ? 'spin' : ''} />
          {isRefreshing ? 'Checking...' : 'Check API'}
        </button>
      )}
    </div>
  );
};

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading air quality prediction data..." }) => {
  return (
    <div className="card" style={{ padding: '48px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
      <Loader2 size={28} style={{ color: 'var(--accent-data)', animation: 'spin 1.2s linear infinite' }} />
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{message}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "API Disconnected",
  message = "Unable to connect to the FastAPI prediction server. Verify VITE_API_BASE_URL endpoint status.", 
  onRetry 
}) => {
  return (
    <div className="card" style={{ padding: '36px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', borderLeft: '4px solid var(--risk-critical)' }}>
      <AlertCircle size={26} style={{ color: 'var(--risk-critical)' }} />
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h4>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '420px' }}>{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary" style={{ fontSize: '12px', padding: '6px 16px' }}>
          Retry API Check
        </button>
      )}
    </div>
  );
};

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "No Data Available", 
  message = "Connect the AirGuard prediction service to view live intelligence.",
  icon
}) => {
  return (
    <div className="card" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      {icon || <Server size={32} style={{ color: 'var(--text-muted)', opacity: 0.7 }} />}
      <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h4>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '400px', lineHeight: '1.5' }}>{message}</p>
    </div>
  );
};
