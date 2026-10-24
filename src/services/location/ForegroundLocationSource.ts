import * as Location from 'expo-location';
import { LocationSource } from './LocationSource';
import { GeoPoint } from '../../engine/geo';

export class ForegroundLocationSource implements LocationSource {
  private sub: Location.LocationSubscription | null = null;

  async start(onPoint: (p: GeoPoint) => void) {
    this.sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 0,
      },
      (loc) =>
        onPoint({
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
          ts: loc.timestamp,
          accuracy: loc.coords.accuracy,
        })
    );
  }

  async stop() {
    this.sub?.remove();
    this.sub = null;
  }
}