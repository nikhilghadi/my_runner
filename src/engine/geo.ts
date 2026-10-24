export type GeoPoint = {
  lat: number;
  lng: number;
  ts: number;                 // ms since epoch
  accuracy: number | null;    // meters
};

const R = 6371000;
const toRad = (d: number) => (d * Math.PI) / 180;

// Haversine distance in meters
export function distanceM(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function isAccurateEnough(p: GeoPoint, maxAccuracyM: number): boolean {
  return p.accuracy == null || p.accuracy <= maxAccuracyM;
}

import { GPS_MAX_ACCURACY_M } from '../utils/constants';

// GPS counts as ready once we've received a fix accurate enough to be used
export function isGpsReady(accuracy: number | null): boolean {
  return accuracy != null && accuracy <= GPS_MAX_ACCURACY_M;
}