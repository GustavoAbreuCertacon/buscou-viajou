'use client';

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RouteMapProps } from './route-map';

/**
 * Implementação client-only do RouteMap.
 * Importado via dynamic({ ssr: false }) pra evitar SSR.
 */

const NAVY = '#0B2A43';
const GREEN = '#2B9366';

/** Marker SVG inline — pin com cor variável */
function pinIcon(color: string) {
  const html = `
    <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.2 0 0 7.2 0 16c0 11 16 24 16 24s16-13 16-24C32 7.2 24.8 0 16 0z" fill="${color}"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `;
  return L.divIcon({
    html,
    className: 'bv-leaflet-icon',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  });
}

export function RouteMapClient({ origin, destination, garage }: RouteMapProps) {
  const positions: LatLngExpression[] = [
    [origin.lat, origin.lng],
    [destination.lat, destination.lng],
  ];

  // Bounds incluindo todos os pontos
  const allPoints: LatLngExpression[] = [
    [origin.lat, origin.lng],
    [destination.lat, destination.lng],
    ...(garage ? [[garage.lat, garage.lng] as LatLngExpression] : []),
  ];
  const bounds = L.latLngBounds(allPoints);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [40, 40] }}
      scrollWheelZoom={false}
      className="h-full w-full bg-bv-navy-50"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline
        positions={positions}
        pathOptions={{ color: GREEN, weight: 4, opacity: 0.85, dashArray: '8 6' }}
      />
      <Marker position={[origin.lat, origin.lng]} icon={pinIcon(NAVY)}>
        <Popup>
          <strong>Origem</strong>
          <br />
          {origin.label ?? `${origin.lat}, ${origin.lng}`}
        </Popup>
      </Marker>
      <Marker position={[destination.lat, destination.lng]} icon={pinIcon(GREEN)}>
        <Popup>
          <strong>Destino</strong>
          <br />
          {destination.label ?? `${destination.lat}, ${destination.lng}`}
        </Popup>
      </Marker>
      {garage && (
        <Marker position={[garage.lat, garage.lng]} icon={pinIcon('#6C8DA6')}>
          <Popup>
            <strong>Garagem</strong>
            <br />
            {garage.label ?? `${garage.lat}, ${garage.lng}`}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
