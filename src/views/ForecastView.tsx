import React, { useState } from 'react';
import { DashboardData, LocationNode } from '../types';
import { ForecastChart } from '../components/ForecastChart';
import { ForecastCard } from '../components/ForecastCard';
import { RiskBadge, TrendIndicator } from '../components/RiskBadge';
import { LocationSelector, EmptyState } from '../components/DataStateComponents';
import { BarChart3, Clock } from 'lucide-react';

interface ForecastViewProps {
  data: DashboardData;
  selectedLocation: LocationNode | null;
  onSelectLocation: (loc: LocationNode) => void;
}

export const ForecastView: React.FC<ForecastViewProps> = ({
  data,
  selectedLocation,
  onSelectLocation
}) => {
  const [activeHorizon, setActiveHorizon] = useState<string>('+6H');
  const isConnected = data.connectionStatus === 'CONNECTED';

  const currentAQIDisplay = selectedLocation?.currentAQI !== null && selectedLocation?.currentAQI !== undefined ? selectedLocation.currentAQI : '—';
  const predictedAQIDisplay = selectedLocation?.predictedAQI !== null && selectedLocation?.predictedAQI !== undefined ? selectedLocation.predictedAQI : '—';
  const pm25CurrentDisplay = selectedLocation?.pm25Current !== null && selectedLocation?.pm25Current !== undefined ? `${selectedLocation.pm25Current} µg/m³` : '—';
  const pm25PredictedDisplay = selectedLocation?.pm25Predicted !== null && selectedLocation?.pm25Predicted !== undefined ? `${selectedLocation.pm25Predicted} µg/m³` : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Controls */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-data)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            FORECAST ANALYTICS
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} style={{ color: 'var(--accent-data)' }} />
            Air Quality Forecast {selectedLocation ? `- ${selectedLocation.name}` : ''}
          </h2>
        </div>

        <LocationSelector 
          locations={data.locations} 
          selectedId={selectedLocation?.id || ''} 
          onSelect={(id) => {
            const found = data.locations.find(l => l.id === id);
            if (found) onSelectLocation(found);
          }} 
        />
      </div>

      {/* Summary KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="grid-4col">
        <div className="card">
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>CURRENT OBSERVED</span>
          <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-mono)', margin: '4px 0' }}>{currentAQIDisplay}</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>PM2.5: {pm25CurrentDisplay}</span>
        </div>

        <div className="card-elevated" style={{ border: '1px solid var(--border-medium)' }}>
          <span style={{ fontSize: '10px', color: 'var(--accent-data)', fontWeight: 600 }}>PREDICTED AQI</span>
          <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-data)', margin: '4px 0' }}>{predictedAQIDisplay}</div>
          <span style={{ fontSize: '11px', color: 'var(--accent-data)' }}>PM2.5: {pm25PredictedDisplay}</span>
        </div>

        <div className="card">
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>MODEL TREND</span>
          <div style={{ margin: '8px 0' }}>
            <TrendIndicator trend={selectedLocation?.trend || 'UNKNOWN'} />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {isConnected ? "API Stream Active" : "No Trend Connected"}
          </span>
        </div>

        <div className="card">
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>RISK CLASSIFICATION</span>
          <div style={{ margin: '8px 0' }}>
            <RiskBadge level={selectedLocation?.riskLevel || 'UNKNOWN'} size="lg" />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {isConnected ? "FastAPI ML Output" : "Standby"}
          </span>
        </div>
      </div>

      {/* Main Forecast Chart */}
      <ForecastChart 
        data={data.forecastSeries}
        selectedHorizon={activeHorizon}
        onHorizonChange={setActiveHorizon}
      />

      {/* Multi-Horizon Timeline Section */}
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={16} style={{ color: 'var(--accent-data)' }} />
          Multi-Horizon Forecast Steps
        </h3>

        {data.forecastSeries && data.forecastSeries.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {data.forecastSeries.map((pt, i) => (
              <ForecastCard 
                key={i}
                horizon={pt.timeLabel} 
                timeLabel={pt.timestamp} 
                predictedAQI={pt.predictedAQI ?? '—'} 
                riskLevel={pt.predictedAQI !== null ? (pt.predictedAQI >= 300 ? 'CRITICAL' : pt.predictedAQI >= 200 ? 'HIGH' : 'MODERATE') : 'UNKNOWN'} 
                trend="STABLE" 
                isCurrent={pt.timeLabel === 'Now'} 
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No Forecast Steps Available"
            message="Connect the prediction service to populate multi-horizon forecast timeline cards."
          />
        )}
      </div>

      {/* Detailed Forecast Point Matrix Table */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Forecast Timeline Breakdown Table</h3>
        {data.forecastSeries && data.forecastSeries.length > 0 ? (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Horizon</th>
                  <th>Timestamp</th>
                  <th>Observed AQI</th>
                  <th>Predicted AQI</th>
                  <th>Uncertainty Range</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {data.forecastSeries.map((pt, i) => (
                  <tr key={i} style={{ backgroundColor: pt.timeLabel === 'Now' ? 'rgba(85, 199, 232, 0.05)' : undefined }}>
                    <td style={{ fontWeight: 600, color: pt.timeLabel === 'Now' ? 'var(--accent-data)' : 'var(--text-primary)' }}>
                      {pt.timeLabel}
                    </td>
                    <td>{pt.timestamp}</td>
                    <td>{pt.observedAQI !== null && pt.observedAQI !== undefined ? `${pt.observedAQI} AQI` : '—'}</td>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-data)' }}>
                      {pt.predictedAQI !== null && pt.predictedAQI !== undefined ? `${pt.predictedAQI} AQI` : '—'}
                    </td>
                    <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {pt.lowerBound !== undefined && pt.upperBound !== undefined ? `${pt.lowerBound} - ${pt.upperBound}` : '—'}
                    </td>
                    <td>
                      <RiskBadge 
                        level={pt.predictedAQI !== null ? (pt.predictedAQI >= 300 ? 'CRITICAL' : pt.predictedAQI >= 200 ? 'HIGH' : 'MODERATE') : 'UNKNOWN'} 
                        size="sm" 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '16px 0' }}>
            No forecast table data received from backend API.
          </p>
        )}
      </div>
    </div>
  );
};
