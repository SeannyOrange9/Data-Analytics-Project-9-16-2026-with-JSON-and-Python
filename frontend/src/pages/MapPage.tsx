import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Tooltip } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Building2, Users, Siren, Layers, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/button';
import { useAsync } from '@/lib/useAsync';
import { fetchHouseholds, fetchCenters, fetchIncidents } from '@/api/services';
import { cn } from '@/lib/cn';
import {
  INCIDENT_TYPE_LABELS,
  INCIDENT_TYPE_TONES,
  SEVERITY_TONES,
  STATUS_LABELS,
  STATUS_TONES,
  formatDateTime,
} from '@/lib/labels';
import type { IncidentSeverity } from '@/api/types';

const SEVERITY_COLOR: Record<IncidentSeverity, string> = {
  low: '#10b981',
  moderate: '#f59e0b',
  high: '#f97316',
  critical: '#e11d3f',
};

const SEVERITY_RADIUS: Record<IncidentSeverity, number> = {
  low: 300,
  moderate: 350,
  high: 400,
  critical: 450,
};

function centerIcon() {
  return divIcon({
    className: '',
    html: `<div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;background:#1d6cf5;border:2px solid #fff;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,.4)"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4"/></svg></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function incidentIcon(severity: IncidentSeverity) {
  const color = SEVERITY_COLOR[severity];
  return divIcon({
    className: '',
    html: `<div style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;background:${color};border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.4)"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

interface LayerState {
  households: boolean;
  centers: boolean;
  incidents: boolean;
}

export function MapPage() {
  const households = useAsync(() => fetchHouseholds());
  const centers = useAsync(() => fetchCenters());
  const incidents = useAsync(() => fetchIncidents());
  const [layers, setLayers] = useState<LayerState>({ households: true, centers: true, incidents: true });

  const loading = households.loading || centers.loading || incidents.loading;

  const toggle = (key: keyof LayerState) =>
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  const layerToggles: Array<{ key: keyof LayerState; label: string; icon: React.ReactNode }> = [
    { key: 'households', label: 'Households', icon: <Users className="h-3.5 w-3.5" /> },
    { key: 'centers', label: 'Evacuation centers', icon: <Building2 className="h-3.5 w-3.5" /> },
    { key: 'incidents', label: 'Incidents', icon: <Siren className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Operations Map"
        description="Households, evacuation centers and incident zones. Click markers for details."
        icon={<MapPin className="h-5 w-5" />}
      />

      <div className="relative min-h-[70vh] flex-1 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        {loading && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <Spinner className="h-8 w-8 text-brand-600" />
          </div>
        )}

        <MapContainer
          center={[14.092, 121.15]}
          zoom={13}
          scrollWheelZoom
          className="absolute inset-0 h-full w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {layers.incidents &&
            (incidents.data ?? []).map((inc) =>
              inc.lat !== undefined && inc.lng !== undefined ? (
                <CircleMarker
                  key={`incident-zone-${inc.id}`}
                  center={[inc.lat, inc.lng]}
                  pathOptions={{ color: SEVERITY_COLOR[inc.severity], fillColor: SEVERITY_COLOR[inc.severity], fillOpacity: 0.1, weight: 1.5, dashArray: '6' }}
                  radius={SEVERITY_RADIUS[inc.severity]}
                >
                  <Popup>
                    <div className="min-w-[180px]">
                      <p className="mb-1 text-sm font-semibold text-slate-900">{inc.title}</p>
                      <div className="mb-1.5 flex flex-wrap gap-1">
                        <Badge tone={INCIDENT_TYPE_TONES[inc.type]}>{INCIDENT_TYPE_LABELS[inc.type]}</Badge>
                        <Badge tone={SEVERITY_TONES[inc.severity]}>{inc.severity}</Badge>
                        <Badge tone={STATUS_TONES[inc.status]}>{STATUS_LABELS[inc.status]}</Badge>
                      </div>
                      <p className="text-xs text-slate-500">{inc.barangay} · {formatDateTime(inc.reported_at)}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ) : null,
            )}

          {layers.incidents &&
            (incidents.data ?? []).map((inc) =>
              inc.lat !== undefined && inc.lng !== undefined ? (
                <Marker
                  key={`incident-pin-${inc.id}`}
                  position={[inc.lat, inc.lng]}
                  icon={incidentIcon(inc.severity)}
                >
                  <Popup>
                    <div className="min-w-[180px]">
                      <p className="mb-1 text-sm font-semibold text-slate-900">{inc.title}</p>
                      <div className="mb-1.5 flex flex-wrap gap-1">
                        <Badge tone={INCIDENT_TYPE_TONES[inc.type]}>{INCIDENT_TYPE_LABELS[inc.type]}</Badge>
                        <Badge tone={SEVERITY_TONES[inc.severity]}>{inc.severity}</Badge>
                        <Badge tone={STATUS_TONES[inc.status]}>{STATUS_LABELS[inc.status]}</Badge>
                      </div>
                      <p className="text-xs text-slate-500">{inc.barangay} · {formatDateTime(inc.reported_at)}</p>
                    </div>
                  </Popup>
                  <Tooltip direction="top" offset={[0, -12]}>
                    {inc.title}
                  </Tooltip>
                </Marker>
              ) : null,
            )}

          {layers.centers &&
            (centers.data ?? []).map((c) => (
              <Marker key={`center-${c.id}`} position={[c.lat, c.lng]} icon={centerIcon()}>
                <Popup>
                  <div className="min-w-[180px]">
                    <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                    <div className="mt-1 space-y-0.5 text-xs text-slate-600">
                      <p>{c.barangay} · {c.address}</p>
                      <p>Occupancy: <b>{c.current_occupants}</b> / {c.capacity}</p>
                      <p>Load: <b>{Math.round((c.current_occupants / c.capacity) * 100)}%</b></p>
                    </div>
                  </div>
                </Popup>
                <Tooltip direction="top" offset={[0, -12]}>
                  {c.name}
                </Tooltip>
              </Marker>
            ))}

          {layers.households &&
            (households.data?.items ?? []).map((h) => (
              <CircleMarker
                key={`household-${h.id}`}
                center={[h.lat, h.lng]}
                pathOptions={{ color: '#cbd5e1', fillColor: '#0f172a', fillOpacity: 0.8, weight: 1 }}
                radius={5}
              >
                <Popup>
                  <div className="max-w-[220px]">
                    <p className="text-sm font-semibold text-slate-900">{h.head_name}</p>
                    <p className="text-xs text-slate-500">{h.household_no}</p>
                    <div className="mt-1 space-y-0.5 text-xs text-slate-600">
                      <p>{h.address}</p>
                      <p>Size: {h.size} ({h.children_count} children, {h.elderly_count} elderly, {h.pwd_count} PWD)</p>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
        </MapContainer>

        <div className="absolute left-3 top-3 z-[600] rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Layers className="h-3.5 w-3.5 text-brand-600" />
            Data layers
          </div>
          <div className="space-y-1.5">
            {layerToggles.map((lt) => (
              <button
                key={lt.key}
                onClick={() => toggle(lt.key)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <span
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded border',
                    layers[lt.key] ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white',
                  )}
                >
                  {layers[lt.key] && (
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </span>
                {lt.icon}
                {lt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}