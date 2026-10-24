import { RunSession } from './RunSession';
import { formatPace, formatDuration, formatDistanceKm } from '../utils/format';

let clock = 1_700_000_000_000;
const session = new RunSession(() => clock);

const M_PER_DEG_LAT = 111195;
let lat = 19.076;
const lng = 72.8777;

session.start();
for (let s = 1; s <= 900; s++) {
  clock += 1000;
  const speed = s <= 450 ? 1000 / 300 : 1000 / 360; // 5:00/km then 6:00/km
  lat += speed / M_PER_DEG_LAT;
  session.addPoint({ lat, lng, ts: clock, accuracy: 8 });

  if (s === 450) {
    session.pause();
    clock += 60_000;          // 1 minute standing still
    session.resume();
  }
  if (s % 150 === 0) {
    const x = session.getSnapshot();
    console.log(
      formatDuration(x.elapsedSec),
      formatDistanceKm(x.distanceM) + ' km',
      'avg', formatPace(x.avgPace),
      'now', formatPace(x.currentPace)
    );
  }
}

const sum = session.stop();
console.log('--- finished ---');
console.log(formatDuration(sum.movingSec), formatDistanceKm(sum.distanceM), 'km, avg', formatPace(sum.avgPaceSecPerKm));
sum.laps.forEach((l) =>
  console.log(`split ${l.index}: ${formatDistanceKm(l.distanceM)} km  ${formatPace(l.paceSecPerKm)}`)
);