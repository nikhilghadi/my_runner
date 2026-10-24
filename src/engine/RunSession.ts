import { GeoPoint, distanceM, isAccurateEnough } from './geo';
import { avgPace, RollingPace } from './pace';
import { MIN_SEGMENT_M, MAX_SPEED_MPS, GPS_MAX_ACCURACY_M } from '../utils/constants';

export type RunStatus = 'idle' | 'running' | 'paused' | 'finished';

export type Lap = {
  index: number;
  distanceM: number;
  durationSec: number;
  paceSecPerKm: number;
};

export type RunSnapshot = {
  status: RunStatus;
  elapsedSec: number;
  distanceM: number;
  avgPace: number | null;
  currentPace: number | null;
  laps: Lap[];
};

export type RunSummary = {
  startedAt: number;
  endedAt: number;
  movingSec: number;
  distanceM: number;
  avgPaceSecPerKm: number | null;
  laps: Lap[];
  points: GeoPoint[];
};

export class RunSession {
  private status: RunStatus = 'idle';
  private startedAt = 0;
  private endedAt = 0;
  private accumulatedMs = 0;   // moving time before the current running stretch
  private resumedAt = 0;       // when the current running stretch began
  private distM = 0;
  private anchor: GeoPoint | null = null;
  private prevMovingMs = 0;
  private points: GeoPoint[] = [];
  private laps: Lap[] = [];
  private nextSplitM = 1000;
  private lastSplitMs = 0;
  private rolling = new RollingPace();

  constructor(private now: () => number = Date.now) {}

  start() {
    if (this.status !== 'idle') return;
    this.startedAt = this.now();
    this.resumedAt = this.startedAt;
    this.status = 'running';
  }

  pause() {
    if (this.status !== 'running') return;
    this.accumulatedMs += this.now() - this.resumedAt;
    this.anchor = null;          // don't count distance across the pause
    this.rolling.reset();
    this.status = 'paused';
  }

  resume() {
    if (this.status !== 'paused') return;
    this.resumedAt = this.now();
    this.status = 'running';
  }

  private movingMsAt(ts: number) {
    return this.accumulatedMs + Math.max(0, ts - this.resumedAt);
  }

  // Feed GPS points here. Returns true if the point was used.
  addPoint(p: GeoPoint): boolean {
    if (this.status !== 'running') return false;
    if (!isAccurateEnough(p, GPS_MAX_ACCURACY_M)) return false;
    if (p.ts < this.resumedAt) return false;

    const movingMs = this.movingMsAt(p.ts);

    // First usable point (start or after resume): just set the anchor
    if (!this.anchor) {
      this.anchor = p;
      this.prevMovingMs = movingMs;
      this.points.push(p);
      this.rolling.add(p.ts / 1000, this.distM);
      return true;
    }

    const dtSec = (p.ts - this.anchor.ts) / 1000;
    if (dtSec <= 0) return false;
    const seg = distanceM(this.anchor, p);
    if (seg / dtSec > MAX_SPEED_MPS) return false;   // GPS jump
    if (seg < MIN_SEGMENT_M) return false;           // drift; anchor stays put

    const prevDist = this.distM;
    this.distM += seg;

    // Complete every km boundary crossed by this segment
    while (this.distM >= this.nextSplitM) {
      const frac = (this.nextSplitM - prevDist) / seg;
      const crossMs = this.prevMovingMs + frac * (movingMs - this.prevMovingMs);
      const durSec = (crossMs - this.lastSplitMs) / 1000;
      this.laps.push({
        index: this.laps.length + 1,
        distanceM: 1000,
        durationSec: durSec,
        paceSecPerKm: durSec,
      });
      this.lastSplitMs = crossMs;
      this.nextSplitM += 1000;
    }

    this.anchor = p;
    this.prevMovingMs = movingMs;
    this.points.push(p);
    this.rolling.add(p.ts / 1000, this.distM);
    return true;
  }

  private elapsedMs(): number {
    return this.status === 'running'
      ? this.accumulatedMs + (this.now() - this.resumedAt)
      : this.accumulatedMs;
  }

  getSnapshot(): RunSnapshot {
    const elapsedSec = this.elapsedMs() / 1000;
    return {
      status: this.status,
      elapsedSec,
      distanceM: this.distM,
      avgPace: avgPace(elapsedSec, this.distM),
      currentPace:
        this.status === 'running' ? this.rolling.get(this.now() / 1000) : null,
      laps: [...this.laps],
    };
  }

  stop(): RunSummary {
    if (this.status === 'running') {
      this.accumulatedMs += this.now() - this.resumedAt;
    }
    if (this.status !== 'finished') {
      this.status = 'finished';
      this.endedAt = this.now();

      // Add the last partial km if it's long enough to matter
      const remaining = this.distM - (this.nextSplitM - 1000);
      if (remaining >= 100) {
        const durSec = (this.accumulatedMs - this.lastSplitMs) / 1000;
        this.laps.push({
          index: this.laps.length + 1,
          distanceM: remaining,
          durationSec: durSec,
          paceSecPerKm: durSec / (remaining / 1000),
        });
      }
    }

    const movingSec = this.accumulatedMs / 1000;
    return {
      startedAt: this.startedAt,
      endedAt: this.endedAt,
      movingSec,
      distanceM: this.distM,
      avgPaceSecPerKm: avgPace(movingSec, this.distM),
      laps: [...this.laps],
      points: [...this.points],
    };
  }
}