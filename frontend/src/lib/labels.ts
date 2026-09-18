import type { CenterStatus, IncidentSeverity, IncidentStatus, IncidentType, ResourceType, Role } from '@/api/types';
import type { BadgeTone } from '@/components/ui/badge';

export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  flood: 'Flood',
  fire: 'Fire',
  earthquake: 'Earthquake',
  landslide: 'Landslide',
  typhoon: 'Typhoon',
  other: 'Other',
};

export const INCIDENT_TYPE_TONES: Record<IncidentType, BadgeTone> = {
  flood: 'blue',
  fire: 'red',
  earthquake: 'orange',
  landslide: 'amber',
  typhoon: 'violet',
  other: 'slate',
};

export const SEVERITY_TONES: Record<IncidentSeverity, BadgeTone> = {
  low: 'green',
  moderate: 'amber',
  high: 'orange',
  critical: 'red',
};

export const STATUS_TONES: Record<IncidentStatus, BadgeTone> = {
  reported: 'slate',
  assessing: 'blue',
  responding: 'amber',
  resolved: 'green',
};

export const STATUS_LABELS: Record<IncidentStatus, string> = {
  reported: 'Reported',
  assessing: 'Assessing',
  responding: 'Responding',
  resolved: 'Resolved',
};

export const CENTER_STATUS_TONES: Record<CenterStatus, BadgeTone> = {
  active: 'green',
  standby: 'amber',
  closed: 'slate',
};

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  rice: 'Rice',
  water: 'Water',
  medicine: 'Medicine',
  blankets: 'Blankets',
  hygiene: 'Hygiene Kits',
  canned_goods: 'Canned Goods',
  clothing: 'Clothing',
  mats: 'Sleeping Mats',
  tents: 'Tents',
  other: 'Other',
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  responder: 'Responder',
  viewer: 'Viewer',
};

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-PH').format(n);
}