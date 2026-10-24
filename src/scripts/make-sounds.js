const fs = require('fs');
const path = require('path');

const RATE = 22050;

function tone(freq, ms, vol = 0.9) {
  const n = Math.floor((RATE * ms) / 1000);
  const out = new Int16Array(n);
  for (let i = 0; i < n; i++) {
    const env = Math.min(1, i / 200, (n - i) / 400); // fade in/out, no clicks
    out[i] = Math.sin((2 * Math.PI * freq * i) / RATE) * env * vol * 32767;
  }
  return out;
}

function silence(ms) {
  return new Int16Array(Math.floor((RATE * ms) / 1000));
}

function concat(parts) {
  const total = parts.reduce((a, p) => a + p.length, 0);
  const out = new Int16Array(total);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function wav(samples) {
  const data = Buffer.from(samples.buffer, samples.byteOffset, samples.byteLength);
  const h = Buffer.alloc(44);
  h.write('RIFF', 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write('WAVE', 8);
  h.write('fmt ', 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);       // PCM
  h.writeUInt16LE(1, 22);       // mono
  h.writeUInt32LE(RATE, 24);
  h.writeUInt32LE(RATE * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write('data', 36);
  h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

const dir = path.join(__dirname, '..', 'assets', 'sounds');
fs.mkdirSync(dir, { recursive: true });

// Too slow: two low beeps
fs.writeFileSync(
  path.join(dir, 'alert_slow.wav'),
  wav(concat([tone(500, 300), silence(150), tone(500, 300)]))
);

// Too fast: three high beeps
fs.writeFileSync(
  path.join(dir, 'alert_fast.wav'),
  wav(concat([tone(1300, 140), silence(90), tone(1300, 140), silence(90), tone(1300, 140)]))
);

console.log('Sounds written to', dir);