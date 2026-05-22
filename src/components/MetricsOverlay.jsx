import React from 'react';
import { Route, BrainCircuit, Activity, Sparkles } from 'lucide-react';

const MetricCard = ({ title, stats, accentColor }) => {
  return (
    <div className="glass-card" style={{ padding: '18px 22px', borderColor: accentColor, borderWidth: '1px', borderStyle: 'solid' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 style={{ fontSize: '1rem', color: accentColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {title}
          </h4>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Stops: {stats.path.length}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: accentColor }}>₹{new Intl.NumberFormat('en-IN').format(Math.round(stats.rfPredictedCost))}</span>
        </div>
      </div>

      <div className="metrics-grid">
        <div>
          <span className="stat-label">Distance</span>
          <div className="data-value">{stats.totalDistance.toFixed(0)} km</div>
        </div>
        <div>
          <span className="stat-label">Risk</span>
          <div className="data-value">{(stats.maxRisk * 100).toFixed(0)}%</div>
        </div>
        <div>
          <span className="stat-label">Carbon</span>
          <div className="data-value">{stats.totalCarbon.toFixed(0)} u</div>
        </div>
        <div>
          <span className="stat-label">ETA</span>
          <div className="data-value">{stats.totalTime.toFixed(1)} hrs</div>
        </div>
      </div>
    </div>
  );
};

const MetricsOverlay = ({ results, routeStops, cargoDetails, selectedScenario, trafficEvent }) => {
  if (!results) return null;

  return (
    <div className="metrics-overlay">
      <div className="glass-card" style={{ padding: '24px', borderRadius: '22px', background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(255,255,255,0.8)' }}>
        <div className="flex justify-between gap-4 mb-6" style={{ flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <span className="badge badge-blue">{selectedScenario === 'custom' ? 'Custom' : selectedScenario}</span>
              <span className="badge badge-green">{trafficEvent}</span>
            </div>
            <h3 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>Route Summary</h3>
            <p style={{ color: 'var(--text-muted)' }}>{routeStops.map(stop => stop).join(' → ')}</p>
          </div>
          <div style={{ minWidth: '220px' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
              <Sparkles size={18} />
              <span style={{ fontWeight: 700 }}>Cargo</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>{cargoDetails.type} • {cargoDetails.transportType} • {cargoDetails.perishClass}</p>
          </div>
        </div>

        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 320px' }}>
            <MetricCard title="ACAR Optimized" stats={results.acar} accentColor="var(--primary)" />
          </div>
          <div style={{ flex: '1 1 320px' }}>
            <MetricCard title="Baseline Dijkstra" stats={results.dijkstra} accentColor="var(--danger)" />
          </div>
        </div>

        <div className="glass-card" style={{ marginTop: '20px', padding: '18px 20px' }}>
          <h4 style={{ marginBottom: '14px' }}>Analytics Snapshot</h4>
          <div className="chart-row">
            <div className="chart-block">
              <span className="stat-label">Distance Efficiency</span>
              <div className="chart-bar" style={{ width: `${Math.min(100, (results.acar.totalDistance / Math.max(1, results.dijkstra.totalDistance)) * 100)}%`, background: 'var(--primary)' }} />
            </div>
            <div className="chart-block">
              <span className="stat-label">Risk Reduction</span>
              <div className="chart-bar" style={{ width: `${Math.min(100, Math.max(0, (1 - results.acar.maxRisk / Math.max(0.01, results.dijkstra.maxRisk))) * 100)}%`, background: 'var(--accent)' }} />
            </div>
            <div className="chart-block">
              <span className="stat-label">Carbon Trend</span>
              <div className="chart-bar" style={{ width: `${Math.min(100, (results.acar.totalCarbon / Math.max(1, results.dijkstra.totalCarbon)) * 100)}%`, background: 'var(--secondary)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsOverlay;
