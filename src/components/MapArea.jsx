import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CITIES, EDGES } from '../utils/graph';

const MapArea = ({
  dijkstraPath,
  acarPath,
  selectedSource,
  selectedTarget,
  waypoints,
  addWaypoint,
  removeWaypoint,
  setSource,
  setTarget,
  showDijkstraPath,
  showACARPath,
  showRiskOverlay
}) => {
  const handleCityClick = (cityId) => {
    if (!selectedSource) {
      setSource(cityId);
    } else if (!selectedTarget && cityId !== selectedSource) {
      setTarget(cityId);
    } else if (waypoints.includes(cityId)) {
      removeWaypoint(cityId);
    } else if (cityId !== selectedSource && cityId !== selectedTarget) {
      addWaypoint(cityId);
    }
  };

  const center = [22.0, 79.0];

  const pathMatches = (edgePath, edge) => {
    for (let i = 0; i < edgePath.length - 1; i++) {
      if ((edgePath[i] === edge.source && edgePath[i + 1] === edge.target) ||
          (edgePath[i] === edge.target && edgePath[i + 1] === edge.source)) {
        return true;
      }
    }
    return false;
  };

  const getRiskColor = (edge) => {
    const score = Math.min(1, edge.baseRisk + edge.trafficDensity * 0.12);
    const red = Math.round(230 * score + 30 * (1 - score));
    const green = Math.round(160 * (1 - score) + 220 * score);
    return `rgba(${red}, ${green}, 60, 0.35)`;
  };

  return (
    <div className="map-container" style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {EDGES.map((edge, index) => {
          const c1 = CITIES[edge.source];
          const c2 = CITIES[edge.target];
          const isACAR = pathMatches(acarPath, edge);
          const isDijkstra = pathMatches(dijkstraPath, edge);

          let color = 'rgba(0,0,0,0.12)';
          let weight = 2;
          let dashArray = '5, 5';
          let opacity = 0.5;

          if (isACAR && showACARPath) {
            color = '#00b8d4';
            weight = 5;
            dashArray = 'none';
            opacity = 0.9;
          }

          if (isDijkstra && showDijkstraPath) {
            color = isACAR ? '#6c63ff' : '#ef4444';
            weight = isACAR ? 5 : 4;
            dashArray = 'none';
            opacity = 0.85;
          }

          if (!isACAR && !isDijkstra && showRiskOverlay) {
            color = getRiskColor(edge);
            weight = 3;
            dashArray = '6, 8';
            opacity = 0.55;
          }

          return (
            <Polyline
              key={`edge-${index}`}
              positions={[[c1.lat, c1.lng], [c2.lat, c2.lng]]}
              pathOptions={{ color, weight, dashArray, opacity }}
            />
          );
        })}

        {Object.values(CITIES).map((city) => {
          const isSource = city.id === selectedSource;
          const isTarget = city.id === selectedTarget;
          const isWaypoint = waypoints.includes(city.id);
          const isPathNode = acarPath.includes(city.id) || dijkstraPath.includes(city.id);

          let fillColor = 'rgba(0,0,0,0.1)';
          let color = 'rgba(0,0,0,0.3)';
          let radius = 6;
          let fillOpacity = 0.5;

          if (isSource) {
            fillColor = '#16a34a';
            color = '#16a34a';
            radius = 10;
            fillOpacity = 0.95;
          } else if (isTarget) {
            fillColor = '#a855f7';
            color = '#a855f7';
            radius = 10;
            fillOpacity = 0.95;
          } else if (isWaypoint) {
            fillColor = '#facc15';
            color = '#b45309';
            radius = 9;
            fillOpacity = 0.85;
          } else if (isPathNode) {
            fillColor = '#00b8d4';
            color = '#00b8d4';
            radius = 8;
            fillOpacity = 0.9;
          }

          const roleLabel = isSource ? 'Source' : isTarget ? 'Target' : isWaypoint ? 'Waypoint' : isPathNode ? 'Route' : 'City';

          return (
            <CircleMarker
              key={city.id}
              center={[city.lat, city.lng]}
              radius={radius}
              pathOptions={{ color, fillColor, fillOpacity, weight: 2 }}
              eventHandlers={{ click: () => handleCityClick(city.id) }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={isSource || isTarget || isWaypoint || isPathNode}>
                <span style={{ fontFamily: 'Outfit', fontWeight: 600 }}>{city.name} ({roleLabel})</span>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapArea;
