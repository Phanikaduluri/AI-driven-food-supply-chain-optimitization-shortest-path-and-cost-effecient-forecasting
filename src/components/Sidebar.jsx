import React, { useState } from 'react';
import { Network, Cpu, Settings2, Route, Navigation, Package, Thermometer, Clock, Truck, Save, Download, Trash2 } from 'lucide-react';
import { CITIES } from '../utils/graph';

const Sidebar = ({
  weights,
  onWeightChange,
  source,
  target,
  setSource,
  setTarget,
  cargoDetails,
  onCargoChange,
  handleRunACAR,
  waypoints,
  addWaypoint,
  removeWaypoint,
  clearWaypoints,
  selectedScenario,
  setSelectedScenario,
  scenarioPresets,
  trafficEvent,
  setTrafficEvent,
  showDijkstra,
  showACAR,
  showRiskHeatmap,
  setShowDijkstra,
  setShowACAR,
  setShowRiskHeatmap,
  savedScenarios,
  onSaveScenario,
  onLoadScenario,
  onExportJSON,
  onExportCSV,
  hasResults,
  routeName,
  setRouteName
}) => {
  const [nextWaypoint, setNextWaypoint] = useState('');
  const [saveName, setSaveName] = useState('');
  const [loadId, setLoadId] = useState('');

  const updateCargo = (field, value) => {
    onCargoChange(field, value);
  };

  const availableWaypoints = Object.values(CITIES).filter(city => (
    city.id !== source && city.id !== target && !waypoints.includes(city.id)
  ));

  const handleAddWaypoint = () => {
    if (!nextWaypoint) return;
    addWaypoint(nextWaypoint);
    setNextWaypoint('');
  };

  const handleSave = () => {
    onSaveScenario(saveName);
    setSaveName('');
  };

  const handleLoad = () => {
    if (!loadId) return;
    onLoadScenario(loadId);
  };

  return (
    <div className="sidebar">
      <div className="flex items-center gap-4 mb-8">
        <div className="stat-icon" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>
          <Network size={28} />
        </div>
        <div>
          <h2 className="gradient-text" style={{ fontSize: '1.5rem', margin: 0 }}>ACAR Core</h2>
          <span className="badge badge-blue">Policy Engine Active</span>
        </div>
      </div>

      <div className="glass-card mb-6">
        <h3 className="flex items-center gap-2 mb-4" style={{ fontSize: '1.1rem' }}>
          <Navigation size={18} /> Route Sequence
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {[source, ...waypoints, target].filter(Boolean).map((cityId, index) => {
            const city = CITIES[cityId];
            const isWaypoint = index > 0 && index < waypoints.length + 1;
            return (
              <span key={cityId} className="chip" style={{ background: isWaypoint ? 'rgba(255, 203, 5, 0.18)' : 'rgba(0, 184, 212, 0.12)' }}>
                {city?.name || cityId}
                {isWaypoint && (
                  <button type="button" className="chip-close" onClick={() => removeWaypoint(cityId)}>
                    <Trash2 size={12} />
                  </button>
                )}
              </span>
            );
          })}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label className="stat-label">Add Intermediate Stop</label>
          <div className="flex gap-2 mt-2">
            <select
              value={nextWaypoint}
              onChange={(e) => setNextWaypoint(e.target.value)}
              className="glass-panel"
              style={{ flex: 1, padding: '10px 12px', appearance: 'none', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.7)', color: 'var(--text-main)' }}
            >
              <option value="">Choose waypoint</option>
              {availableWaypoints.map(city => (
                <option key={`waypoint-${city.id}`} value={city.id}>{city.name}</option>
              ))}
            </select>
            <button type="button" className="btn btn-primary" onClick={handleAddWaypoint} disabled={!nextWaypoint}>
              Add
            </button>
          </div>
        </div>

        <button type="button" className="btn" onClick={clearWaypoints} style={{ width: '100%' }}>
          Clear All Waypoints
        </button>
      </div>

      <div className="glass-card mb-6">
        <h3 className="flex items-center gap-2 mb-4" style={{ fontSize: '1.1rem' }}>
          <Package size={18} /> Cargo & Scenario
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(scenarioPresets).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              className={`btn ${selectedScenario === key ? 'btn-primary' : ''}`}
              onClick={() => setSelectedScenario(key)}
              style={{ flex: '1 1 calc(50% - 8px)' }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex-col gap-3">
          <div>
            <label className="stat-label">Traffic Simulation</label>
            <div className="flex justify-between items-center mt-2 glass-panel" style={{ padding: '8px 12px' }}>
              <select
                value={trafficEvent}
                onChange={(e) => setTrafficEvent(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: 'Outfit', fontSize: '0.95rem', color: 'var(--text-main)', cursor: 'pointer' }}
              >
                <option value="none">Normal Traffic</option>
                <option value="monsoon">Monsoon Risk</option>
                <option value="congestion">High Congestion</option>
                <option value="heatwave">Heatwave</option>
              </select>
            </div>
          </div>

          <div>
            <label className="stat-label">Hub Temperature</label>
            <div className="flex justify-between items-center mt-2 glass-panel" style={{ padding: '8px 12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{cargoDetails.perishClass === 'high' ? 'High sensitivity' : cargoDetails.perishClass === 'medium' ? 'Medium sensitivity' : 'Low sensitivity'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card mb-6">
        <h3 className="flex items-center gap-2 mb-4" style={{ fontSize: '1.1rem' }}>
          <Settings2 size={18} /> Policy Tuning
        </h3>

        <div className="slider-container">
          <label className="stat-label">Cost Weight</label>
          <input type="range" min="0" max="100" value={weights.weightCost} onChange={(e) => onWeightChange('weightCost', Number(e.target.value))} />
          <div className="flex justify-between mt-2" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Low</span>
            <span>{weights.weightCost}%</span>
            <span>High</span>
          </div>
        </div>

        <div className="slider-container">
          <label className="stat-label">Risk Sensitivity</label>
          <input type="range" min="0" max="100" value={weights.weightRisk} onChange={(e) => onWeightChange('weightRisk', Number(e.target.value))} />
          <div className="flex justify-between mt-2" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Low</span>
            <span>{weights.weightRisk}%</span>
            <span>High</span>
          </div>
        </div>

        <div className="slider-container">
          <label className="stat-label">Carbon Priority</label>
          <input type="range" min="0" max="100" value={weights.weightCarbon} onChange={(e) => onWeightChange('weightCarbon', Number(e.target.value))} />
          <div className="flex justify-between mt-2" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Low</span>
            <span>{weights.weightCarbon}%</span>
            <span>High</span>
          </div>
        </div>
      </div>

      <div className="glass-card mb-6">
        <h3 className="flex items-center gap-2 mb-4" style={{ fontSize: '1.1rem' }}>
          <Route size={18} /> Map Layers
        </h3>

        <label className="toggle-row">
          <input type="checkbox" checked={showACAR} onChange={() => setShowACAR(prev => !prev)} />
          Show ACAR path
        </label>
        <label className="toggle-row">
          <input type="checkbox" checked={showDijkstra} onChange={() => setShowDijkstra(prev => !prev)} />
          Show Dijkstra path
        </label>
        <label className="toggle-row">
          <input type="checkbox" checked={showRiskHeatmap} onChange={() => setShowRiskHeatmap(prev => !prev)} />
          Enable risk heatmap
        </label>
      </div>

      <button
        className="btn btn-primary w-full mt-6 flex justify-center items-center gap-2"
        onClick={handleRunACAR}
        disabled={!source || !target}
        style={{ padding: '16px', fontSize: '1.05rem', opacity: (!source || !target) ? 0.5 : 1, cursor: (!source || !target) ? 'not-allowed' : 'pointer', boxShadow: '0 8px 25px var(--primary-glow)' }}
      >
        <Cpu size={20} /> Compute Optimal Route
      </button>

      <div className="glass-card mt-6">
        <h3 className="flex items-center gap-2 mb-4" style={{ fontSize: '1.1rem' }}>
          <Save size={18} /> Scenario Storage
        </h3>
        <div className="flex gap-2 mb-4">
          <input
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Scenario name"
            className="glass-panel"
            style={{ flex: 1, padding: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.8)' }}
          />
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
        <div className="flex gap-2 mb-4">
          <select
            value={loadId}
            onChange={(e) => setLoadId(e.target.value)}
            className="glass-panel"
            style={{ flex: 1, padding: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.8)' }}
          >
            <option value="">Load saved scenario</option>
            {savedScenarios.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <button type="button" className="btn" onClick={handleLoad} disabled={!loadId}>
            Load
          </button>
        </div>

        <div className="flex gap-2">
          <button type="button" className="btn btn-primary" onClick={onExportJSON} disabled={!hasResults}>
            <Download size={16} /> JSON
          </button>
          <button type="button" className="btn" onClick={onExportCSV} disabled={!hasResults}>
            CSV
          </button>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Multi-stop route planning with scenario-aware cost modeling and risk simulation.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
