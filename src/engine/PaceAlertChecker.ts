import { RunSnapshot } from './RunSession';
import {
  GRACE_PERIOD_SEC,
  ALERT_COOLDOWN_SEC,
  ALERT_MIN_DISTANCE_M,
} from '../utils/constants';

export type AlertKind = 'too_slow' | 'too_fast';

export type PaceAlertConfig = {
  enabled: boolean;
  fastLimitSec: number;   // sec/km. Alert if pace is faster (smaller) than this
  slowLimitSec: number;   // sec/km. Alert if pace is slower (bigger) than this
  source: 'average' | 'current';
};

export class PaceAlertChecker {
  private lastAlertSec = -Infinity;

  constructor(private cfg: PaceAlertConfig) {}

  // Returns an alert kind if one should fire right now, otherwise null
  check(s: RunSnapshot): AlertKind | null {
    if (!this.cfg.enabled) return null;
    if (s.elapsedSec < GRACE_PERIOD_SEC) return null;
    if (s.distanceM < ALERT_MIN_DISTANCE_M) return null;

    const pace = this.cfg.source === 'average' ? s.avgPace : s.currentPace;
    if (pace == null) return null;

    let kind: AlertKind | null = null;
    if (pace > this.cfg.slowLimitSec) kind = 'too_slow';
    else if (pace < this.cfg.fastLimitSec) kind = 'too_fast';
    if (!kind) return null;

    if (s.elapsedSec - this.lastAlertSec < ALERT_COOLDOWN_SEC) return null;
    this.lastAlertSec = s.elapsedSec;
    return kind;
  }
}