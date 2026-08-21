import React, { useState, useEffect } from 'react';
import { DashboardData, LocationNode } from './types';
import { apiService } from './services/api';
import { LandingPage } from './views/LandingPage';
import { DashboardOverview } from './views/DashboardOverview';
import { ForecastView } from './views/ForecastView';
import { PollutionMapView } from './views/PollutionMapView';
import { AlertsView } from './views/AlertsView';
import { DecisionSupportView } from './views/DecisionSupportView';
import { CitizenView } from './views/CitizenView';
import { Sidebar, AppHeader } from './components/Navigation';
import { LoadingState, ErrorState } from './components/DataStateComponents';

export const App: React.FC = () => {
  // Navigation mode: 'landing' vs 'dashboard'
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');

  // Active tab within Dashboard
  const [activeTab, setActiveTab] = useState<string>('overview');

  // API state management
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationNode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDashboardData();
      setDashboardData(data);
      setSelectedLocation(data.selectedLocation);
    } catch (err: any) {
      setError(err?.message || "Unable to check FastAPI service endpoint");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefreshData = async () => {
    try {
      setIsRefreshing(true);
      const data = await apiService.getDashboardData();
      setDashboardData(data);
      if (data.selectedLocation) {
        setSelectedLocation(data.selectedLocation);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSelectLocation = (id: string) => {
    if (!dashboardData) return;
    const found = dashboardData.locations.find(l => l.id === id);
    if (found) {
      setSelectedLocation(found);
    }
  };

  const handleSelectLocationNode = (node: LocationNode) => {
    setSelectedLocation(node);
  };

  const handleSelectLocationByName = (name: string) => {
    if (!dashboardData) return;
    const found = dashboardData.locations.find(l => l.name.toLowerCase().includes(name.toLowerCase()));
    if (found) {
      setSelectedLocation(found);
    }
  };

  // Render Landing Page
  if (viewMode === 'landing') {
    return <LandingPage onOpenDashboard={() => setViewMode('dashboard')} />;
  }

  // Handle Initial Loading
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <LoadingState message="Connecting to AirGuard AI Forecast Engine..." />
      </div>
    );
  }

  // Error fallback
  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', padding: '24px' }}>
        <ErrorState title="System Notice" message={error} onRetry={loadData} />
      </div>
    );
  }

  // Default empty state wrapper if dashboardData is null
  const currentData: DashboardData = dashboardData || {
    metrics: {
      currentAQI: null,
      forecastAQI: null,
      riskLevel: 'UNKNOWN',
      hotspotsCount: null,
      risingAreasCount: null,
      activeAlertsCount: null,
    },
    selectedLocation: null,
    locations: [],
    forecastSeries: [],
    alerts: [],
    priorityList: [],
    lastUpdated: null,
    connectionStatus: 'UNAVAILABLE'
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Air Quality Overview';
      case 'forecast': return 'Air Quality Forecast';
      case 'map': return 'Predictive Pollution Map';
      case 'alerts': return 'Air Quality Alerts';
      case 'decision-support': return 'Air Quality Decision Support';
      case 'citizen': return 'Citizen Air Dashboard';
      default: return 'Air Quality Overview';
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        activeAlertsCount={currentData.metrics.activeAlertsCount}
        connectionStatus={currentData.connectionStatus}
        onGoToLanding={() => setViewMode('landing')}
      />

      {/* Main Content Workspace Area */}
      <div className="main-content">
        {/* Header Bar */}
        <AppHeader
          title={getTabTitle()}
          locations={currentData.locations}
          selectedLocationId={selectedLocation?.id || ''}
          onSelectLocation={handleSelectLocation}
          lastUpdated={currentData.lastUpdated}
          connectionStatus={currentData.connectionStatus}
          onRefreshData={handleRefreshData}
          isRefreshing={isRefreshing}
        />

        {/* View Switcher Container */}
        <main className="page-body">
          {activeTab === 'overview' && (
            <DashboardOverview
              data={currentData}
              selectedLocation={selectedLocation}
              onSelectLocation={handleSelectLocationNode}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'forecast' && (
            <ForecastView
              data={currentData}
              selectedLocation={selectedLocation}
              onSelectLocation={handleSelectLocationNode}
            />
          )}

          {activeTab === 'map' && (
            <PollutionMapView
              data={currentData}
              selectedLocation={selectedLocation}
              onSelectLocation={handleSelectLocationNode}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsView
              data={currentData}
              onNavigateTab={setActiveTab}
              onSelectLocationByName={handleSelectLocationByName}
            />
          )}

          {activeTab === 'decision-support' && (
            <DecisionSupportView
              data={currentData}
              onSelectArea={handleSelectLocation}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'citizen' && (
            <CitizenView
              data={currentData}
              onNavigateMap={() => setActiveTab('map')}
            />
          )}
        </main>
      </div>
    </div>
  );
};
