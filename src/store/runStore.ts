import { create } from 'zustand';
import { RunSession, RunSnapshot, RunSummary } from '../engine/RunSession';
import { GeoPoint } from '../engine/geo';

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
  reset: () => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => RunSummary;
  onPoint: (p: GeoPoint) => void;
  tick: () => void;
};

export const useRunStore = create<RunState>((set, get) => ({
  session: new RunSession(),
  snapshot: emptySnapshot,
  gpsAccuracy: null,

  reset: () =>
    set({ session: new RunSession(), snapshot: emptySnapshot, gpsAccuracy: null }),

  start: () => {
    get().session.start();
    get().tick();
  },
  pause: () => {
    get().session.pause();
    get().tick();
  },
  resume: () => {
    get().session.resume();
    get().tick();
  },
  stop: () => {
    const summary = get().session.stop();
    get().tick();
    return summary;
  },

  onPoint: (p) => {
    const { session } = get();
    session.addPoint(p);
    set({ gpsAccuracy: p.accuracy, snapshot: session.getSnapshot() });
  },

  // Called every second by the UI. Time is derived from timestamps,
  // so this only refreshes the display and can't cause drift.
  tick: () => set({ snapshot: get().session.getSnapshot() }),
}));