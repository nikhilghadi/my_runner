import { GeoPoint } from '../../engine/geo';

export interface LocationSource {
  start(onPoint: (p: GeoPoint) => void): Promise<void>;
  stop(): Promise<void>;
}