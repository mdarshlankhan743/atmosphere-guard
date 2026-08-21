import React from 'react';
import { Navbar } from '../components/Navigation';
import { 
  Wind, 
  MapPin, 
  HelpCircle, 
  Bell, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Globe,
  Database,
  Cpu,
  Server
} from 'lucide-react';

interface LandingPageProps {
  onOpenDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenDashboard }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onOpenDashboard();
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      {/* Top Navbar */}
      <Navbar onOpenDashboard={onOpenDashboard} onNavigateSection={scrollToSection} />

      {/* Hero Section */}
      <section id="hero" style={{ padding: '80px 24px 60px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'center' }} className="grid-2col">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', padding: '6px 12px', borderRadius: '4px', marginBottom: '20px' }}>
              <Wind size={14} style={{ color: 'var(--accent-data)' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-data)' }}>
                "Don't wait for pollution to peak. Predict it before it happens."
              </span>
            </div>

            <h1 style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '20px' }}>
              Know Where the Air Is Going.
            </h1>

            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '540px' }}>
              AirGuard AI forecasts upcoming pollution, identifies emerging hotspots, and provides early warnings before air quality deteriorates.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button onClick={onOpenDashboard} className="btn-primary" style={{ padding: '14px 28px', fontSize: '14px' }}>
                Explore AirGuard <ArrowRight size={16} />
              </button>
              <button onClick={onOpenDashboard} className="btn-secondary" style={{ padding: '14px 28px', fontSize: '14px' }}>
                View Intelligence
              </button>
            </div>
          </div>

          {/* Hero Visual Preview - Static Abstract Platform Interface Placeholder */}
          <div className="card-elevated" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AIRGUARD PLATFORM ARCHITECTURE PREVIEW
              </span>
              <span style={{ fontSize: '10px', color: 'var(--accent-data)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Server size={12} /> API Integration Ready
              </span>
            </div>

            {/* Metric Placeholders without Fake Environmental Numbers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>CURRENT AQI</span>
                <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>—</div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Awaiting API Stream</span>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '4px', border: '1px solid var(--border-medium)' }}>
                <span style={{ fontSize: '10px', color: 'var(--accent-data)', fontWeight: 600, display: 'block' }}>PREDICTED AQI (+6H)</span>
                <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-data)' }}>—</div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ML Model Standby</span>
              </div>
            </div>

            {/* Abstract Spatial Vector Layout Placeholder */}
            <div style={{ background: '#050c13', height: '140px', borderRadius: '4px', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <svg viewBox="0 0 100 40" style={{ width: '100%', height: '80px', opacity: 0.4 }}>
                <path d="M 10 25 Q 30 10 50 25 T 90 15" fill="none" stroke="var(--accent-data)" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="10" y1="35" x2="90" y2="35" stroke="rgba(255,255,255,0.1)" strokeDasharray="2 2" />
              </svg>
              <div style={{ position: 'absolute', bottom: '8px', fontSize: '10px', color: 'var(--text-muted)' }}>
                Predictive Pollution Vector | Spatial Grid Ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Value Proposition Section */}
      <section id="capabilities" style={{ padding: '60px 24px', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-data)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              CORE PLATFORM CAPABILITIES
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>
              Four Core Capabilities
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="grid-4col">
            <div className="card">
              <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: 'var(--bg-elevated)', color: 'var(--accent-data)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <BarChart3 size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>PREDICT</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Forecast upcoming air pollution and PM2.5 levels before conditions peak.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: 'var(--bg-elevated)', color: 'var(--accent-data)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <MapPin size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>LOCATE</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Identify emerging high-risk pollution hotspots across monitored locations.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: 'var(--bg-elevated)', color: 'var(--accent-data)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <HelpCircle size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>EXPLAIN</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Show important atmospheric factors associated with the forecast.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: 'var(--bg-elevated)', color: 'var(--risk-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Bell size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>ALERT</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Provide early warning notifications when air quality risk increases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--risk-high)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            THE MONITORING GAP
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: 700, marginTop: '8px' }}>
            Knowing today's AQI is not enough.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }} className="grid-3col">
          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
              01 / CURRENT
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>What is happening now?</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Standard monitoring reports ambient air quality after exposure has already occurred, providing zero lead time for preventive intervention.
            </p>
          </div>

          <div className="card" style={{ padding: '24px', borderColor: 'var(--border-medium)', background: 'var(--bg-elevated)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-data)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
              02 / FUTURE
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>What is likely to happen next?</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Predictive models forecast pollution trends hours in advance, enabling proactive health advisories and operational decisions.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
              03 / PRIORITY
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Where should attention go first?</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Emerging hotspots are identified so authorities and citizens can prioritize resource allocation and targeted precautions.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', background: 'var(--bg-surface)', padding: '20px', borderRadius: '6px', border: '1px solid var(--border-medium)', maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--accent-data)' }}>
            "AirGuard AI adds a predictive intelligence layer to air-quality monitoring."
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '60px 24px', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-data)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              DATA FLOW ARCHITECTURE
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>
              How AirGuard AI Operates
            </h2>
          </div>

          {/* Clean Data-Flow Diagram */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '6px', padding: '32px', maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', alignItems: 'center', textAlign: 'center' }} className="grid-3col">
              <div style={{ padding: '14px 10px', background: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <Database size={20} style={{ color: 'var(--accent-data)', marginBottom: '8px' }} />
                <div style={{ fontSize: '11px', fontWeight: 700 }}>AIR QUALITY + WEATHER DATA</div>
              </div>

              <div style={{ color: 'var(--accent-data)', fontWeight: 700, fontSize: '18px' }}>↓</div>

              <div style={{ padding: '14px 10px', background: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <Cpu size={20} style={{ color: 'var(--accent-data)', marginBottom: '8px' }} />
                <div style={{ fontSize: '11px', fontWeight: 700 }}>DATA PROCESSING & ML MODEL</div>
              </div>

              <div style={{ color: 'var(--accent-data)', fontWeight: 700, fontSize: '18px' }}>↓</div>

              <div style={{ padding: '14px 10px', background: 'var(--bg-elevated)', borderRadius: '4px', border: '1px solid var(--border-medium)' }}>
                <Zap size={20} style={{ color: 'var(--accent-data)', marginBottom: '8px' }} />
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-data)' }}>AQI / PM2.5 FORECAST</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '28px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--risk-safe)' }} /> HOTSPOT DETECTION
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--risk-safe)' }} /> EARLY WARNING
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" style={{ padding: '60px 24px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-data)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              INTELLIGENCE IMPACT
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>
              Targeted Stakeholder Support
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="grid-3col">
            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--accent-data)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} /> CITIZENS
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <li>✓ Advance forecast visibility</li>
                <li>✓ Health risk warnings before pollution peaks</li>
                <li>✓ Simplified personal action advice</li>
              </ul>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--accent-data)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} /> AUTHORITIES
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <li>✓ Emerging hotspot identification</li>
                <li>✓ Decision-support priority rankings</li>
                <li>✓ Model factor breakdown</li>
              </ul>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--accent-data)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} /> PLATFORM INTEGRATION
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <li>✓ FastAPI ready architecture</li>
                <li>✓ Isolated data transformation layer</li>
                <li>✓ Standardized JSON contracts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--bg-primary)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '38px', fontWeight: 800, marginBottom: '12px' }}>
            Don't wait for pollution to peak.
          </h2>
          <p style={{ fontSize: '20px', color: 'var(--accent-data)', fontWeight: 600, marginBottom: '32px' }}>
            Predict it before it happens.
          </p>
          <button onClick={onOpenDashboard} className="btn-primary" style={{ padding: '16px 36px', fontSize: '15px' }}>
            Open AirGuard Intelligence <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};
