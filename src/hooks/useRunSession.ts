import { useEffect, useState } from 'react';
import { useRunStore } from '../store/runStore';
import { ForegroundLocationSource } from '../services/location/ForegroundLocationSource';
import { ensureLocationPermission } from '../services/permissions';

export type PermissionState = 'checking' | 'granted' | 'denied';

export function useRunSession() {
  const snapshot = useRunStore((s) => s.snapshot);
  const gpsAccuracy = useRunStore((s) => s.gpsAccuracy);
  const [permission, setPermission] = useState<PermissionState>('checking');
  const lastAlert = useRunStore((s) => s.lastAlert);

  useEffect(() => {
    useRunStore.getState().reset();
    const source = new ForegroundLocationSource();
    let cancelled = false;

    (async () => {
      const ok = await ensureLocationPermission();
      if (cancelled) return;
      setPermission(ok ? 'granted' : 'denied');
      if (ok) {
        await source.start((p) => useRunStore.getState().onPoint(p));
        if (cancelled) await source.stop();
      }
    })();

    const timer = setInterval(() => useRunStore.getState().tick(), 1000);

    return () => {
      cancelled = true;
      clearInterval(timer);
      source.stop();
    };
  }, []);

  const { start, pause, resume, stop } = useRunStore.getState();
  return { snapshot, gpsAccuracy, permission, lastAlert, start, pause, resume, stop };
}