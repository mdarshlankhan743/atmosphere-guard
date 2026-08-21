import React from 'react';
import { Wind, Shield, BarChart3, Map, Bell, LayoutDashboard, UserCheck, Settings } from 'lucide-react';
import { LocationSelector, DataStatus } from './DataStateComponents';
import { LocationNode, ConnectionStatus } from '../types';

interface NavbarProps {
  onOpenDashboard: () => void;
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDashboard, onNavigateSection }) => {
  return (
    <header style={{
      backgroundColor: 'rgba(7, 16, 24, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigateSection && onNavigateSection('hero')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-data)'
          }}>
            <Wind size={20} />
          </div>
          <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
            AIRGUARD <span style={{ color: 'var(--accent-data)', fontWeight: 400 }}>AI</span>
          </span>
        </div>

        {/* Links */}
        <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'how-it-works', label: 'How It Works' },
            { id: 'capabilities', label: 'Forecast' },
            { id: 'impact', label: 'Intelligence' }
          ].map(link => (
            <button
              key={link.id}
              onClick={() => onNavigateSection && onNavigateSection(link.id)}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action CTA Button */}
        <button onClick={onOpenDashboard} className="btn-primary">
          <LayoutDashboard size={15} />
          Open Dashboard
        </button>
      </div>
    </header>
  );
};

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeAlertsCount?: number | null;
  connectionStatus?: ConnectionStatus;
  onGoToLanding: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  activeAlertsCount,
  connectionStatus = 'UNAVAILABLE',
  onGoToLanding
}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={17} /> },
    { id: 'forecast', label: 'Forecast', icon: <BarChart3 size={17} /> },
    { id: 'map', label: 'Pollution Map', icon: <Map size={17} /> },
    { id: 'alerts', label: 'Alerts', icon: <Bell size={17} />, badge: activeAlertsCount && activeAlertsCount > 0 ? activeAlertsCount : undefined },
    { id: 'decision-support', label: 'Decision Support', icon: <Shield size={17} /> },
    { id: 'citizen', label: 'Citizen View', icon: <UserCheck size={17} /> }
  ];

  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-medium)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div 
        onClick={onGoToLanding}
        style={{
          padding: '20px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer'
        }}
        title="Return to Landing Page"
      >
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '6px',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-data)'
        }}>
          <Wind size={18} />
        </div>
        <div>
          <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.04em', color: 'var(--text-primary)', display: 'block', lineHeight: 1.1 }}>
            AIRGUARD <span style={{ color: 'var(--accent-data)', fontWeight: 400 }}>AI</span>
          </span>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Intelligence Platform
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', padding: '0 8px 8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          INTELLIGENCE VIEWS
        </span>

        {menuItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--accent-data)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-data)' : '3px solid transparent',
                textAlign: 'left',
                width: '100%',
                cursor: 'pointer',
                borderTop: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                transition: 'all 0.12s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: 'var(--risk-critical)',
                  padding: '2px 6px',
                  borderRadius: '10px'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings & System Status Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: connectionStatus === 'CONNECTED' ? 'var(--risk-safe)' : 'var(--risk-moderate)'
            }} />
            <span style={{ color: connectionStatus === 'CONNECTED' ? 'var(--risk-safe)' : 'var(--text-muted)', fontWeight: 600 }}>
              {connectionStatus === 'CONNECTED' ? 'FastAPI API Active' : 'API Standby'}
            </span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            VITE_API_BASE_URL Ready
          </span>
        </div>
      </div>
    </aside>
  );
};

interface AppHeaderProps {
  title: string;
  locations: LocationNode[];
  selectedLocationId: string;
  onSelectLocation: (id: string) => void;
  lastUpdated: string | null;
  connectionStatus: ConnectionStatus;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  locations,
  selectedLocationId,
  onSelectLocation,
  lastUpdated,
  connectionStatus,
  onRefreshData,
  isRefreshing
}) => {
  return (
    <header style={{
      padding: '16px 24px',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-medium)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <LocationSelector 
          locations={locations} 
          selectedId={selectedLocationId} 
          onSelect={onSelectLocation} 
        />

        <DataStatus 
          status={connectionStatus}
          lastUpdated={lastUpdated} 
          onRefresh={onRefreshData}
          isRefreshing={isRefreshing}
        />
      </div>
    </header>
  );
};
