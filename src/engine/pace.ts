import { PACE_WINDOW_SEC } from '../utils/constants';

// Average pace in sec/km. Returns null until there's enough distance.
export function avgPace(movingSec: number, distanceM: number): number | null {
  if (distanceM < 20 || movingSec <= 0) return null;
  return movingSec / (distanceM / 1000);
}

type Sample = { t: number; d: number }; // t = seconds, d = cumulative meters

// Current pace over the last few seconds (sec/km)
export class RollingPace {
  private samples: Sample[] = [];

  constructor(private windowSec: number = PACE_WINDOW_SEC) {}

  add(tSec: number, cumulativeM: number) {
    this.samples.push({ t: tSec, d: cumulativeM });
    while (
      this.samples.length > 2 &&
      tSec - this.samples[0].t > this.windowSec
    ) {
      this.samples.shift();
    }
  }

  // nowSec is used so the value goes stale (null) when you stop moving
  get(nowSec: number): number | null {
    if (this.samples.length < 2) return null;
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    if (nowSec - last.t > this.windowSec) return null;
    const dd = last.d - first.d;
    const dt = last.t - first.t;
    if (dd < 5 || dt <= 0) return null;
    return dt / (dd / 1000);
  }

  reset() {
    this.samples = [];
  }
}