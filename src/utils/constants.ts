export const GPS_MAX_ACCURACY_M = 20;      // ignore worse GPS fixes
export const PACE_WINDOW_SEC = 15;         // rolling window for current pace
export const ALERT_COOLDOWN_SEC = 10;      // min gap between alerts
export const GRACE_PERIOD_SEC = 30;        // no pace alerts at start
export const DB_NAME = 'my_runner.db';

export const MIN_SEGMENT_M = 2;     // ignore GPS drift smaller than this
export const MAX_SPEED_MPS = 12;    // reject GPS jumps faster than this
export const ALERT_MIN_DISTANCE_M = 100;   // no pace alerts before this distance