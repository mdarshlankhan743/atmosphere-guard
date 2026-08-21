import React, { useState } from 'react';
import { ForecastPoint } from '../types';
import { Activity, Server } from 'lucide-react';

interface ForecastChartProps {
  data: ForecastPoint[];
  title?: string;
  selectedHorizon?: string;
  onHorizonChange?: (horizon: string) => void;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  data,
  title = "Air Quality Forecast",
  selectedHorizon = "+6H",
  onHorizonChange
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ForecastPoint | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  // If no forecast data is available, render clean empty state
  if (!data || data.length === 0) {
    return (
      <div className="card" style={{ width: '100%', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} style={{ color: 'var(--accent-data)' }} />
              {title}
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
              Multi-horizon AQI & PM2.5 prediction timeline
            </span>
          </div>

          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '3px', borderRadius: '4px' }}>
            {['+2H', '+4H', '+6H', '+12H'].map(horizon => (
              <button
                key={horizon}
                onClick={() => onHorizonChange && onHorizonChange(horizon)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '3px',
                  background: selectedHorizon === horizon ? 'var(--bg-elevated)' : 'transparent',
                  color: selectedHorizon === horizon ? 'var(--accent-data)' : 'var(--text-secondary)',
                  border: selectedHorizon === horizon ? '1px solid var(--border-medium)' : 'none'
                }}
              >
                {horizon}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          border: '1px stroke var(--border-subtle)',
          borderRadius: '6px',
          background: 'var(--bg-secondary)',
          padding: '32px 20px',
          textAlign: 'center'
        }}>
          <Server size={32} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            No Forecast Data Available
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: '1.5' }}>
            Forecast data will appear here when the prediction service is connected.
          </p>
        </div>
      </div>
    );
  }

  // SVG Chart Geometry Constants
  const width = 800;
  const height = 300;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Extract numeric points safely
  const numericPredicted = data.map(d => d.predictedAQI).filter((v): v is number => v !== null);
  const numericObserved = data.map(d => d.observedAQI).filter((v): v is number => v !== null);
  const allValues = [...numericPredicted, ...numericObserved];

  const minY = Math.max(0, Math.min(...(allValues.length ? allValues : [50])) - 20);
  const maxY = Math.max(200, Math.max(...(allValues.length ? allValues : [200])) + 30);

  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return padding.top + graphHeight - ((clamped - minY) / (maxY - minY)) * graphHeight;
  };

  const getX = (index: number) => {
    if (data.length <= 1) return padding.left + graphWidth / 2;
    return padding.left + (index / (data.length - 1)) * graphWidth;
  };

  // Generate SVG Path String for Observed Line
  const observedPoints = data
    .map((d, i) => ({ x: getX(i), y: d.observedAQI !== null ? getY(d.observedAQI) : null, point: d }))
    .filter((p): p is { x: number; y: number; point: ForecastPoint } => p.y !== null);
  
  const observedPath = observedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Generate SVG Path String for Predicted Line
  const predictedPoints = data
    .map((d, i) => ({ x: getX(i), y: d.predictedAQI !== null ? getY(d.predictedAQI) : null, point: d }))
    .filter((p): p is { x: number; y: number; point: ForecastPoint } => p.y !== null);

  const predictedPath = predictedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const thresholdY = getY(200);
  const currentIndex = data.findIndex(d => d.timeLabel === 'Now');
  const currentX = currentIndex !== -1 ? getX(currentIndex) : getX(0);

  return (
    <div className="card" style={{ width: '100%', position: 'relative' }}>
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} style={{ color: 'var(--accent-data)' }} />
            {title}
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
            Solid line = Observed data | Dashed line = ML Model prediction
          </span>
        </div>

        {/* Horizon selector buttons */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '3px', borderRadius: '4px' }}>
          {['+2H', '+4H', '+6H', '+12H'].map(horizon => (
            <button
              key={horizon}
              onClick={() => onHorizonChange && onHorizonChange(horizon)}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '3px',
                background: selectedHorizon === horizon ? 'var(--bg-elevated)' : 'transparent',
                color: selectedHorizon === horizon ? 'var(--accent-data)' : 'var(--text-secondary)',
                border: selectedHorizon === horizon ? '1px solid var(--border-medium)' : 'none'
              }}
            >
              {horizon}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Container */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          style={{ width: '100%', height: 'auto', minWidth: '600px', display: 'block' }}
          onMouseLeave={() => { setHoveredPoint(null); setHoverPos(null); }}
        >
          {/* Background Grid Lines */}
          {[minY, Math.round((minY + maxY) / 2), maxY].map(val => (
            <g key={val}>
              <line 
                x1={padding.left} 
                y1={getY(val)} 
                x2={width - padding.right} 
                y2={getY(val)} 
                stroke="rgba(255,255,255,0.05)" 
                strokeDasharray="4 4" 
              />
              <text 
                x={padding.left - 8} 
                y={getY(val) + 4} 
                fill="var(--text-muted)" 
                fontSize="10" 
                textAnchor="end"
                fontFamily="var(--font-mono)"
              >
                {val}
              </text>
            </g>
          ))}

          {/* Risk Threshold Line (200 AQI if within bounds) */}
          {thresholdY >= padding.top && thresholdY <= height - padding.bottom && (
            <g>
              <line 
                x1={padding.left} 
                y1={thresholdY} 
                x2={width - padding.right} 
                y2={thresholdY} 
                stroke="var(--risk-high)" 
                strokeOpacity="0.4"
                strokeDasharray="2 2"
              />
              <text 
                x={width - padding.right - 10} 
                y={thresholdY - 6} 
                fill="var(--risk-high)" 
                fontSize="9" 
                fontWeight="600"
                textAnchor="end"
              >
                HIGH RISK THRESHOLD (200 AQI)
              </text>
            </g>
          )}

          {/* Current Time Marker Line ("Now") */}
          {currentIndex !== -1 && (
            <g>
              <line 
                x1={currentX} 
                y1={padding.top} 
                x2={currentX} 
                y2={height - padding.bottom} 
                stroke="var(--accent-data)" 
                strokeOpacity="0.3"
                strokeWidth="1.5"
              />
              <rect 
                x={currentX - 20} 
                y={padding.top - 18} 
                width={40} 
                height={16} 
                rx={3} 
                fill="var(--bg-elevated)" 
                stroke="var(--accent-data)" 
                strokeWidth="1"
              />
              <text 
                x={currentX} 
                y={padding.top - 6} 
                fill="var(--accent-data)" 
                fontSize="9" 
                fontWeight="700" 
                textAnchor="middle"
              >
                NOW
              </text>
            </g>
          )}

          {/* Predicted (Dashed) Line */}
          {predictedPath && (
            <path 
              d={predictedPath} 
              fill="none" 
              stroke="var(--accent-data)" 
              strokeWidth="2.5" 
              strokeDasharray="6 4"
            />
          )}

          {/* Observed (Solid) Line */}
          {observedPath && (
            <path 
              d={observedPath} 
              fill="none" 
              stroke="#F4F7FA" 
              strokeWidth="2.5" 
            />
          )}

          {/* Data Points */}
          {data.map((d, i) => {
            const x = getX(i);
            const yPred = d.predictedAQI !== null ? getY(d.predictedAQI) : null;
            const isObserved = d.observedAQI !== null;
            const yObs = isObserved ? getY(d.observedAQI!) : null;

            return (
              <g key={i}>
                <text 
                  x={x} 
                  y={height - padding.bottom + 18} 
                  fill={d.timeLabel === 'Now' ? 'var(--accent-data)' : 'var(--text-muted)'} 
                  fontSize="11" 
                  fontWeight={d.timeLabel === 'Now' ? '700' : '500'} 
                  textAnchor="middle"
                >
                  {d.timeLabel}
                </text>

                {yPred !== null && (
                  <circle 
                    cx={x} 
                    cy={yPred} 
                    r={d.timeLabel === 'Now' ? 5 : 4} 
                    fill={d.timeLabel === 'Now' ? 'var(--accent-data)' : 'var(--bg-surface)'} 
                    stroke="var(--accent-data)" 
                    strokeWidth="2" 
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => {
                      setHoveredPoint(d);
                      setHoverPos({ x, y: yPred });
                    }}
                  />
                )}

                {isObserved && yObs !== null && (
                  <circle 
                    cx={x} 
                    cy={yObs} 
                    r={3.5} 
                    fill="#F4F7FA" 
                    stroke="var(--bg-primary)" 
                    strokeWidth="1.5"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => {
                      setHoveredPoint(d);
                      setHoverPos({ x, y: yObs });
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Popup */}
        {hoveredPoint && hoverPos && (
          <div 
            style={{
              position: 'absolute',
              left: `${(hoverPos.x / width) * 100}%`,
              top: `${hoverPos.y - 80}px`,
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-medium)',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '11px',
              pointerEvents: 'none',
              zIndex: 10,
              boxShadow: 'var(--shadow-card)',
              minWidth: '140px'
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Time: {hoveredPoint.timeLabel} ({hoveredPoint.timestamp})
            </div>
            {hoveredPoint.observedAQI !== null && (
              <div style={{ color: 'var(--text-primary)' }}>
                Observed: <strong>{hoveredPoint.observedAQI} AQI</strong>
              </div>
            )}
            {hoveredPoint.predictedAQI !== null && (
              <div style={{ color: 'var(--accent-data)' }}>
                Predicted: <strong>{hoveredPoint.predictedAQI} AQI</strong>
              </div>
            )}
            {hoveredPoint.lowerBound !== undefined && hoveredPoint.upperBound !== undefined && (
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Range: {hoveredPoint.lowerBound} - {hoveredPoint.upperBound}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-secondary)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '2px', backgroundColor: '#F4F7FA', display: 'inline-block' }}></span>
          Observed Data
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '2px', borderTop: '2px dashed var(--accent-data)', display: 'inline-block' }}></span>
          AI Prediction
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '2px', borderTop: '2px dashed var(--risk-high)', display: 'inline-block' }}></span>
          High Risk Limit (200 AQI)
        </span>
      </div>
    </div>
  );
};
