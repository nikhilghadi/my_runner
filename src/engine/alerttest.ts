import { PaceAlertChecker } from './PaceAlertChecker';
import { RunSnapshot } from './RunSession';

const checker = new PaceAlertChecker({
  enabled: true,
  fastLimitSec: 300,   // 5:00
  slowLimitSec: 360,   // 6:00
  source: 'average',
});

const snap = (t: number, avg: number): RunSnapshot => ({
  status: 'running',
  elapsedSec: t,
  distanceM: 500,
  avgPace: avg,
  currentPace: avg,
  laps: [],
});

console.log('t=10  slow   ->', checker.check(snap(10, 400)));  // null (grace period)
console.log('t=40  slow   ->', checker.check(snap(40, 400)));  // too_slow
console.log('t=45  slow   ->', checker.check(snap(45, 400)));  // null (cooldown)
console.log('t=55  slow   ->', checker.check(snap(55, 400)));  // too_slow
console.log('t=70  fast   ->', checker.check(snap(70, 280)));  // too_fast
console.log('t=90  in range->', checker.check(snap(90, 330))); // null