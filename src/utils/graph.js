export const CITIES = {
  DELHI: { id: 'DELHI', name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  MUMBAI: { id: 'MUMBAI', name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  BENGALURU: { id: 'BENGALURU', name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  CHENNAI: { id: 'CHENNAI', name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  KOLKATA: { id: 'KOLKATA', name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  HYDERABAD: { id: 'HYDERABAD', name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  AHMEDABAD: { id: 'AHMEDABAD', name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  PUNE: { id: 'PUNE', name: 'Pune', lat: 18.5204, lng: 73.8567 },
  JAIPUR: { id: 'JAIPUR', name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  LUCKNOW: { id: 'LUCKNOW', name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  NAGPUR: { id: 'NAGPUR', name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
  BHOPAL: { id: 'BHOPAL', name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
  SURAT: { id: 'SURAT', name: 'Surat', lat: 21.1702, lng: 72.8311 },
  KANPUR: { id: 'KANPUR', name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
  PATNA: { id: 'PATNA', name: 'Patna', lat: 25.5941, lng: 85.1376 },
};

// Base physical distances (heuristic for Dijkstra)
// Risk varies based on temperature / condition
// Carbon scales with distance and traffic factors.
export const EDGES = [
  { source: 'DELHI', target: 'JAIPUR', distance: 280, baseRisk: 0.2, trafficDensity: 0.8 },
  { source: 'DELHI', target: 'LUCKNOW', distance: 550, baseRisk: 0.4, trafficDensity: 0.6 },
  { source: 'JAIPUR', target: 'AHMEDABAD', distance: 660, baseRisk: 0.5, trafficDensity: 0.4 },
  { source: 'LUCKNOW', target: 'BHOPAL', distance: 600, baseRisk: 0.3, trafficDensity: 0.5 },
  { source: 'LUCKNOW', target: 'KOLKATA', distance: 1000, baseRisk: 0.6, trafficDensity: 0.7 },
  { source: 'AHMEDABAD', target: 'MUMBAI', distance: 520, baseRisk: 0.4, trafficDensity: 0.9 },
  { source: 'AHMEDABAD', target: 'BHOPAL', distance: 580, baseRisk: 0.4, trafficDensity: 0.5 },
  { source: 'BHOPAL', target: 'NAGPUR', distance: 350, baseRisk: 0.2, trafficDensity: 0.4 },
  { source: 'KOLKATA', target: 'NAGPUR', distance: 1100, baseRisk: 0.7, trafficDensity: 0.6 },
  { source: 'MUMBAI', target: 'PUNE', distance: 150, baseRisk: 0.1, trafficDensity: 0.9 },
  { source: 'PUNE', target: 'HYDERABAD', distance: 560, baseRisk: 0.4, trafficDensity: 0.6 },
  { source: 'NAGPUR', target: 'HYDERABAD', distance: 500, baseRisk: 0.3, trafficDensity: 0.5 },
  { source: 'HYDERABAD', target: 'BENGALURU', distance: 570, baseRisk: 0.4, trafficDensity: 0.7 },
  { source: 'HYDERABAD', target: 'CHENNAI', distance: 630, baseRisk: 0.5, trafficDensity: 0.6 },
  { source: 'BENGALURU', target: 'CHENNAI', distance: 350, baseRisk: 0.3, trafficDensity: 0.8 },
  { source: 'PUNE', target: 'BENGALURU', distance: 840, baseRisk: 0.6, trafficDensity: 0.6 },
  { source: 'AHMEDABAD', target: 'SURAT', distance: 260, baseRisk: 0.2, trafficDensity: 0.7 },
  { source: 'SURAT', target: 'MUMBAI', distance: 280, baseRisk: 0.3, trafficDensity: 0.8 },
  { source: 'LUCKNOW', target: 'KANPUR', distance: 90, baseRisk: 0.1, trafficDensity: 0.5 },
  { source: 'KANPUR', target: 'BHOPAL', distance: 500, baseRisk: 0.4, trafficDensity: 0.6 },
  { source: 'LUCKNOW', target: 'PATNA', distance: 540, baseRisk: 0.5, trafficDensity: 0.4 },
  { source: 'PATNA', target: 'KOLKATA', distance: 580, baseRisk: 0.4, trafficDensity: 0.5 },
];

// Reconstruct edge map for bi-directional search
export const GRAPH = (() => {
  const g = {};
  Object.keys(CITIES).forEach(c => g[c] = []);
  EDGES.forEach(e => {
    g[e.source].push({ ...e, target: e.target });
    g[e.target].push({ ...e, target: e.source });
  });
  return g;
})();
