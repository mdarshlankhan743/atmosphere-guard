import React, { useState } from 'react';
import { DashboardData, LocationNode, ForecastHorizon } from '../types';
import { PollutionMap } from '../components/PollutionMap';
import { LocationInspector } from '../components/LocationInspector';

interface PollutionMapViewProps {
  data: DashboardData;
  selectedLocation: LocationNode | null;
  onSelectLocation: (loc: LocationNode) => void;
  onNavigateTab: (tab: string) => void;
}

export const PollutionMapView: React.FC<PollutionMapViewProps> = ({
  data,
  selectedLocation,
  onSelectLocation,
  onNavigateTab
}) => {
  const [horizon, setHorizon] = useState<ForecastHorizon>('NOW');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* Full-size Intelligence Map & Location Inspector View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '20px', minHeight: '680px' }} className="grid-2col">
        <PollutionMap
          locations={data.locations}
          selectedLocation={selectedLocation}
          onSelectLocation={onSelectLocation}
          horizon={horizon}
          onHorizonChange={setHorizon}
        />

        <LocationInspector 
          location={selectedLocation}
          onViewFullForecast={() => onNavigateTab('forecast')}
        />
      </div>
    </div>
  );
};
