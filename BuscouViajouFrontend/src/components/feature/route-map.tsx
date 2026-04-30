'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils/cn';

/**
 * RouteMap — mapa Leaflet com origem/destino/garagem usando OpenStreetMap.
 * Carregado dynamicamente com SSR off (Leaflet quebra em server-side).
 *
 * Tiles: {a,b,c}.tile.openstreetmap.org (gratuito, atribuição obrigatória).
 */

export interface RouteMapProps {
  origin: { lat: number; lng: number; label?: string };
  destination: { lat: number; lng: number; label?: string };
  garage?: { lat: number; lng: number; label?: string } | null;
  className?: string;
  height?: number;
}

const RouteMapClient = dynamic(() => import('./route-map.client').then((m) => m.RouteMapClient), {
  ssr: false,
  loading: () => (
    <div
      className="bg-bv-navy-50 rounded-bv-md flex items-center justify-center text-body-sm text-bv-navy/72 animate-pulse"
      style={{ height: 320 }}
    >
      Carregando mapa…
    </div>
  ),
});

export function RouteMap(props: RouteMapProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-bv-md border border-bv-navy/12',
        props.className,
      )}
      style={{ height: props.height ?? 320 }}
    >
      <RouteMapClient {...props} />
    </div>
  );
}
