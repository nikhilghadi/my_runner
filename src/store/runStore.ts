import { create } from 'zustand';
import { RunSession, RunSnapshot, RunSummary } from '../engine/RunSession';
import { GeoPoint } from '../engine/geo';
import { PaceAlertChecker, AlertKind } from '../engine/PaceAlertChecker';
import { useSettingsStore } from './settingsStore';
import { playAlert } from '../services/alerts';

const emptySnapshot: RunSnapshot = {
  status: 'idle',
  elapsedSec: 0,
  distanceM: 0,
  avgPace: null,
  currentPace: null,
  laps: [],
};

type RunState = {
  session: RunSession;
  snapshot: RunSnapshot;
  gpsAccuracy: number | null;
  checker: PaceAlertChecker | null;
  lastAlert: { kind: AlertKind; at: number } | null;
  reset: () => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => RunSummary;
  onPoint: (p: GeoPoint) => void;
  tick: () => void;
};

export const useRunStore = create<RunState>((set, get) => {
  // Refresh the snapshot, then fire an alert if needed
  const refresh = () => {
    const snapshot = get().session.getSnapshot();
    set({ snapshot });
    const { checker } = get();
    if (checker && snapshot.status === 'running') {
      const kind = checker.check(snapshot);
      if (kind) {
        playAlert(kind);
        set({ lastAlert: { kind, at: Date.now() } });
      }
    }
  };

  return {
    session: new RunSession(),
    snapshot: emptySnapshot,
    gpsAccuracy: null,
    checker: null,
    lastAlert: null,

    reset: () =>
      set({
        session: new RunSession(),
        snapshot: emptySnapshot,
        gpsAccuracy: null,
        checker: null,
        lastAlert: null,
      }),

    start: () => {
      // Alert settings are frozen when the run starts
      const cfg = useSettingsStore.getState().alert;
      set({ checker: new PaceAlertChecker(cfg), lastAlert: null });
      get().session.start();
      refresh();
    },
    pause: () => {
      get().session.pause();
      refresh();
    },
    resume: () => {
      get().session.resume();
      refresh();
    },
    stop: () => {
      const summary = get().session.stop();
      refresh();
      return summary;
    },

    onPoint: (p) => {
      get().session.addPoint(p);
      set({ gpsAccuracy: p.accuracy });
      refresh();
    },

    tick: () => refresh(),
  };
});