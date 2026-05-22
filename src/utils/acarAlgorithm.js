import { GRAPH } from './graph';

const normalize = (value, min = 0, max = 1) => Math.max(min, Math.min(value, max));

export const predictCostRF = (distance, transportType) => {
  if (transportType === 'road') {
    const daysOfTransit = Math.max(1, Math.ceil(distance / 550));
    const driverSalary = daysOfTransit * 1800;
    const fuelCost = distance * 22;
    const tollFee = distance * 2.2;
    const coldStorageFuel = distance * 4.5;
    return driverSalary + fuelCost + tollFee + coldStorageFuel;
  }

  if (transportType === 'train') {
    const railHandling = distance * 8;
    const coldChainPremium = 12000;
    return railHandling + coldChainPremium;
  }

  const airPremium = 14000;
  const perKmAir = 200;
  return distance * perKmAir + airPremium;
};

export const predictTime = (distance, transportType) => {
  if (transportType === 'air') return distance / 700;
  if (transportType === 'train') return distance / 80;
  return distance / 50;
};

const applyEdgeModifiers = (edge, modifiers = {}) => {
  const riskMultiplier = modifiers.riskMultiplier ?? 1;
  const trafficMultiplier = modifiers.trafficMultiplier ?? 1;
  const adjustedRisk = normalize(edge.baseRisk * riskMultiplier, 0, 1);
  const adjustedCarbon = edge.distance * edge.trafficDensity * 0.5 * trafficMultiplier;
  return { adjustedRisk, adjustedCarbon };
};

const buildPath = (prev, source, target) => {
  const path = [];
  let curr = target;
  if (prev[curr] !== undefined || curr === source) {
    while (curr) {
      path.unshift(curr);
      curr = prev[curr];
    }
  }
  return path;
};

const buildRouteMetrics = (path, transportType, modifiers = {}, label = 'Route') => {
  if (!path || path.length < 2) {
    return { type: label, path, totalDistance: 0, maxRisk: 0, totalCarbon: 0, totalTime: 0, rfPredictedCost: 0 };
  }

  let totalDistance = 0;
  let maxRisk = 0;
  let totalCarbon = 0;
  let totalTime = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const edge = GRAPH[path[i]].find(e => e.target === path[i + 1]);
    if (!edge) continue;
    const { adjustedRisk, adjustedCarbon } = applyEdgeModifiers(edge, modifiers);
    totalDistance += edge.distance;
    maxRisk = Math.max(maxRisk, adjustedRisk);
    totalCarbon += adjustedCarbon;
    totalTime += predictTime(edge.distance, transportType);
  }

  return {
    type: label,
    path,
    totalDistance,
    maxRisk,
    totalCarbon,
    totalTime,
    rfPredictedCost: predictCostRF(totalDistance, transportType)
  };
};

export const getDijkstraPath = (source, target, transportType, modifiers = {}) => {
  const distances = {};
  const prev = {};
  const queue = new Set(Object.keys(GRAPH));

  Object.keys(GRAPH).forEach(node => {
    distances[node] = Infinity;
  });
  distances[source] = 0;

  while (queue.size > 0) {
    let minNode = null;
    queue.forEach(node => {
      if (minNode === null || distances[node] < distances[minNode]) {
        minNode = node;
      }
    });

    if (minNode === null) break;
    if (minNode === target) break;
    queue.delete(minNode);

    GRAPH[minNode].forEach(neighbor => {
      if (!queue.has(neighbor.target)) return;
      const alt = distances[minNode] + neighbor.distance;
      if (alt < distances[neighbor.target]) {
        distances[neighbor.target] = alt;
        prev[neighbor.target] = minNode;
      }
    });
  }

  const path = buildPath(prev, source, target);
  return buildRouteMetrics(path, transportType, modifiers, 'Dijkstra');
};

export const getACARPath = (source, target, weights, transportType, modifiers = {}) => {
  const { weightCost, weightRisk, weightCarbon } = weights;
  const scores = {};
  const prev = {};
  const queue = new Set(Object.keys(GRAPH));

  Object.keys(GRAPH).forEach(node => {
    scores[node] = Infinity;
  });
  scores[source] = 0;

  while (queue.size > 0) {
    let minNode = null;
    queue.forEach(node => {
      if (minNode === null || scores[node] < scores[minNode]) {
        minNode = node;
      }
    });

    if (minNode === null) break;
    if (minNode === target) break;
    queue.delete(minNode);

    GRAPH[minNode].forEach(neighbor => {
      if (!queue.has(neighbor.target)) return;
      const { adjustedRisk, adjustedCarbon } = applyEdgeModifiers(neighbor, modifiers);
      const normDistance = neighbor.distance / 1000;
      const normRisk = adjustedRisk;
      const normCarbon = adjustedCarbon / 1000;
      const edgeCost = (normDistance * weightCost) + (normRisk * weightRisk * 1.5) + (normCarbon * weightCarbon);
      const alt = scores[minNode] + edgeCost;
      if (alt < scores[neighbor.target]) {
        scores[neighbor.target] = alt;
        prev[neighbor.target] = minNode;
      }
    });
  }

  const path = buildPath(prev, source, target);
  return buildRouteMetrics(path, transportType, modifiers, 'ACAR');
};

const buildMultiLegRoute = ({ stops, transportType, weights, modifiers = {}, strategy }) => {
  const routeResults = [];
  const fullPath = [];
  let totalDistance = 0;
  let maxRisk = 0;
  let totalCarbon = 0;
  let totalTime = 0;
  let totalCost = 0;

  for (let i = 0; i < stops.length - 1; i++) {
    const source = stops[i];
    const target = stops[i + 1];
    const segment = strategy === 'dijkstra'
      ? getDijkstraPath(source, target, transportType, modifiers)
      : getACARPath(source, target, weights, transportType, modifiers);

    if (!segment.path || segment.path.length === 0) {
      return {
        type: strategy === 'dijkstra' ? 'Dijkstra' : 'ACAR',
        path: [],
        totalDistance: 0,
        maxRisk: 0,
        totalCarbon: 0,
        totalTime: 0,
        rfPredictedCost: 0,
        legs: []
      };
    }

    if (fullPath.length > 0) {
      fullPath.pop();
    }
    fullPath.push(...segment.path);
    totalDistance += segment.totalDistance;
    maxRisk = Math.max(maxRisk, segment.maxRisk);
    totalCarbon += segment.totalCarbon;
    totalTime += segment.totalTime;
    totalCost += segment.rfPredictedCost;
    routeResults.push({ ...segment, source, target });
  }

  return {
    type: strategy === 'dijkstra' ? 'Dijkstra' : 'ACAR',
    path: fullPath,
    totalDistance,
    maxRisk,
    totalCarbon,
    totalTime,
    rfPredictedCost: totalCost,
    legs: routeResults
  };
};

export const getDijkstraRoute = (stops, transportType, modifiers = {}) => {
  if (!stops || stops.length < 2) return { type: 'Dijkstra', path: [], totalDistance: 0, maxRisk: 0, totalCarbon: 0, totalTime: 0, rfPredictedCost: 0, legs: [] };
  return buildMultiLegRoute({ stops, transportType, modifiers, strategy: 'dijkstra' });
};

export const getACARRoute = (stops, transportType, weights, modifiers = {}) => {
  if (!stops || stops.length < 2) return { type: 'ACAR', path: [], totalDistance: 0, maxRisk: 0, totalCarbon: 0, totalTime: 0, rfPredictedCost: 0, legs: [] };
  return buildMultiLegRoute({ stops, transportType, weights, modifiers, strategy: 'acar' });
};

