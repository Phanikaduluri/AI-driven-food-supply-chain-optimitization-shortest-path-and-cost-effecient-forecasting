import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import MetricsOverlay from './components/MetricsOverlay';
import { getDijkstraRoute, getACARRoute } from './utils/acarAlgorithm';
import Login from './components/Login';
import { CITIES } from './utils/graph';

const SCENARIO_PRESETS = {
  standard: {
    label: 'Standard Logistics',
    cargoDetails: {
      type: 'produce',
      perishClass: 'medium',
      maxTransit: 72,
      shelfLife: 96,
      transportType: 'road'
    },
    weights: { weightCost: 12, weightRisk: 65, weightCarbon: 30 }
  },
  fragile: {
    label: 'Fragile Pharma',
    cargoDetails: {
      type: 'pharma',
      perishClass: 'high',
      maxTransit: 24,
      shelfLife: 48,
      transportType: 'air'
    },
    weights: { weightCost: 18, weightRisk: 95, weightCarbon: 15 }
  },
  urgent: {
    label: 'Urgent Delivery',
    cargoDetails: {
      type: 'produce',
      perishClass: 'high',
      maxTransit: 24,
      shelfLife: 72,
      transportType: 'air'
    },
    weights: { weightCost: 30, weightRisk: 80, weightCarbon: 10 }
  },
  sustainable: {
    label: 'Sustainable Route',
    cargoDetails: {
      type: 'produce',
      perishClass: 'low',
      maxTransit: 96,
      shelfLife: 168,
      transportType: 'train'
    },
    weights: { weightCost: 8, weightRisk: 55, weightCarbon: 50 }
  }
};

const TRAFFIC_EVENTS = {
  none: { label: 'Normal Traffic', riskMultiplier: 1, trafficMultiplier: 1 },
  monsoon: { label: 'Monsoon Risk', riskMultiplier: 1.25, trafficMultiplier: 1.05 },
  congestion: { label: 'High Congestion', riskMultiplier: 1.1, trafficMultiplier: 1.25 },
  heatwave: { label: 'Heatwave', riskMultiplier: 1.35, trafficMultiplier: 1.1 }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [source, setSource] = useState('DELHI');
  const [target, setTarget] = useState('BENGALURU');
  const [waypoints, setWaypoints] = useState([]);
  const [cargoDetails, setCargoDetails] = useState(SCENARIO_PRESETS.standard.cargoDetails);
  const [weights, setWeights] = useState(SCENARIO_PRESETS.standard.weights);
  const [selectedScenario, setSelectedScenario] = useState('standard');
  const [trafficEvent, setTrafficEvent] = useState('none');
  const [showDijkstra, setShowDijkstra] = useState(true);
  const [showACAR, setShowACAR] = useState(true);
  const [showRiskHeatmap, setShowRiskHeatmap] = useState(false);
  const [results, setResults] = useState(null);
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [routeName, setRouteName] = useState('');

  useEffect(() => {
    const stored = window.localStorage.getItem('acar_saved_scenarios');
    if (stored) {
      try {
        setSavedScenarios(JSON.parse(stored));
      } catch (err) {
        console.warn('Unable to parse saved scenarios', err);
      }
    }
  }, []);

  useEffect(() => {
    const preset = SCENARIO_PRESETS[selectedScenario];
    if (preset) {
      setCargoDetails(preset.cargoDetails);
      setWeights(preset.weights);
    }
  }, [selectedScenario]);

  const persistScenarios = (items) => {
    setSavedScenarios(items);
    window.localStorage.setItem('acar_saved_scenarios', JSON.stringify(items));
  };

  const handleWeightChange = (field, value) => {
    setWeights(prev => ({ ...prev, [field]: value }));
    if (selectedScenario !== 'custom') setSelectedScenario('custom');
  };

  const handleCargoChange = (field, value) => {
    setCargoDetails(prev => ({ ...prev, [field]: value }));
    if (selectedScenario !== 'custom') setSelectedScenario('custom');
  };

  const addWaypoint = (cityId) => {
    if (!cityId || waypoints.includes(cityId) || cityId === source || cityId === target) return;
    setWaypoints(prev => [...prev, cityId]);
    if (selectedScenario !== 'custom') setSelectedScenario('custom');
  };

  const removeWaypoint = (cityId) => {
    setWaypoints(prev => prev.filter(item => item !== cityId));
  };

  const clearWaypoints = () => setWaypoints([]);

  const routeStops = [source, ...waypoints, target].filter(Boolean);
  const modifiers = {
    riskMultiplier: TRAFFIC_EVENTS[trafficEvent]?.riskMultiplier ?? 1,
    trafficMultiplier: TRAFFIC_EVENTS[trafficEvent]?.trafficMultiplier ?? 1
  };

  const handleRunACAR = () => {
    if (routeStops.length < 2) return;

    const dijkstraResult = getDijkstraRoute(routeStops, cargoDetails.transportType, modifiers);
    const acarResult = getACARRoute(routeStops, cargoDetails.transportType, weights, modifiers);
    setResults({ dijkstra: dijkstraResult, acar: acarResult });
  };

  const downloadFile = (filename, content, mimeType = 'application/json') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleSaveScenario = (name) => {
    const trimmed = (name || '').trim();
    const payload = {
      id: `scenario-${Date.now()}`,
      name: trimmed || `Scenario ${savedScenarios.length + 1}`,
      source,
      target,
      waypoints,
      cargoDetails,
      weights,
      selectedScenario,
      trafficEvent,
      showDijkstra,
      showACAR,
      showRiskHeatmap
    };
    persistScenarios([payload, ...savedScenarios]);
  };

  const handleLoadScenario = (id) => {
    const saved = savedScenarios.find(item => item.id === id);
    if (!saved) return;
    setSource(saved.source);
    setTarget(saved.target);
    setWaypoints(saved.waypoints || []);
    setCargoDetails(saved.cargoDetails);
    setWeights(saved.weights);
    setSelectedScenario(saved.selectedScenario || 'custom');
    setTrafficEvent(saved.trafficEvent || 'none');
    setShowDijkstra(saved.showDijkstra ?? true);
    setShowACAR(saved.showACAR ?? true);
    setShowRiskHeatmap(saved.showRiskHeatmap ?? false);
    setResults(null);
  };

  const handleExportJSON = () => {
    if (!results) return;
    const payload = {
      name: routeName || 'ACAR route export',
      routeStops: routeStops.map(id => CITIES[id]?.name || id),
      config: {
        cargoDetails,
        weights,
        selectedScenario,
        trafficEvent,
        showDijkstra,
        showACAR,
        showRiskHeatmap
      },
      results
    };
    downloadFile(`acar-route-${Date.now()}.json`, JSON.stringify(payload, null, 2));
  };

  const handleExportCSV = () => {
    if (!results) return;
    const csvRows = [
      ['Field', 'Value'],
      ['Route stops', routeStops.map(id => CITIES[id]?.name || id).join(' → ')],
      ['Scenario', selectedScenario],
      ['Traffic event', TRAFFIC_EVENTS[trafficEvent]?.label || trafficEvent],
      ['Transport mode', cargoDetails.transportType],
      ['ACAR total distance', results.acar.totalDistance],
      ['ACAR total time (hrs)', results.acar.totalTime.toFixed(1)],
      ['ACAR cost', results.acar.rfPredictedCost],
      ['Dijkstra total distance', results.dijkstra.totalDistance],
      ['Dijkstra total time (hrs)', results.dijkstra.totalTime.toFixed(1)],
      ['Dijkstra cost', results.dijkstra.rfPredictedCost]
    ];
    const csvContent = csvRows.map(row => row.map(value => `"${value}"`).join(',')).join('\n');
    downloadFile(`acar-route-${Date.now()}.csv`, csvContent, 'text/csv');
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        weights={weights}
        onWeightChange={handleWeightChange}
        source={source}
        target={target}
        setSource={setSource}
        setTarget={setTarget}
        cargoDetails={cargoDetails}
        onCargoChange={handleCargoChange}
        handleRunACAR={handleRunACAR}
        waypoints={waypoints}
        addWaypoint={addWaypoint}
        removeWaypoint={removeWaypoint}
        clearWaypoints={clearWaypoints}
        selectedScenario={selectedScenario}
        setSelectedScenario={setSelectedScenario}
        scenarioPresets={SCENARIO_PRESETS}
        trafficEvent={trafficEvent}
        setTrafficEvent={setTrafficEvent}
        showDijkstra={showDijkstra}
        showACAR={showACAR}
        showRiskHeatmap={showRiskHeatmap}
        setShowDijkstra={setShowDijkstra}
        setShowACAR={setShowACAR}
        setShowRiskHeatmap={setShowRiskHeatmap}
        savedScenarios={savedScenarios}
        onSaveScenario={handleSaveScenario}
        onLoadScenario={handleLoadScenario}
        onExportJSON={handleExportJSON}
        onExportCSV={handleExportCSV}
        hasResults={!!results}
        routeName={routeName}
        setRouteName={setRouteName}
      />

      <main className="main-content">
        <div className="top-bar">
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>ACAR Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Autonomous Context Aware Routing for Perishable Logistics</p>
          </div>
          <div className="flex gap-3" style={{ alignItems: 'center' }}>
            <span className="badge badge-blue">{SCENARIO_PRESETS[selectedScenario]?.label || 'Custom'}</span>
            <span className="badge badge-green">{TRAFFIC_EVENTS[trafficEvent]?.label}</span>
          </div>
        </div>

        <MapArea
          dijkstraPath={results?.dijkstra.path || []}
          acarPath={results?.acar.path || []}
          selectedSource={source}
          selectedTarget={target}
          waypoints={waypoints}
          addWaypoint={addWaypoint}
          removeWaypoint={removeWaypoint}
          setSource={setSource}
          setTarget={setTarget}
          showDijkstraPath={showDijkstra}
          showACARPath={showACAR}
          showRiskOverlay={showRiskHeatmap}
        />

        <MetricsOverlay
          results={results}
          routeStops={routeStops}
          cargoDetails={cargoDetails}
          selectedScenario={selectedScenario}
          trafficEvent={trafficEvent}
        />
      </main>
    </div>
  );
}

export default App;
