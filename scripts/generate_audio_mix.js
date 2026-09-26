const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SAMPLE_RATE = 44100;
const DURATION = 34.0;
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION);

console.log(`Generating 34-second cinematic background score and SFX (${TOTAL_SAMPLES} samples)...`);

const left = new Float32Array(TOTAL_SAMPLES);
const right = new Float32Array(TOTAL_SAMPLES);

// Helper functions for synthesis
function addSine(channel, startSec, durationSec, freq, volume, pan = 0.5, fade = 0.05) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(durationSec * SAMPLE_RATE);
  for (let i = 0; i < len; i++) {
    const idx = start + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;
    let env = 1.0;
    if (t < fade) env = t / fade;
    else if (t > durationSec - fade) env = (durationSec - t) / fade;
    const val = Math.sin(2 * Math.PI * freq * t) * volume * env;
    left[idx] += val * (1 - pan);
    right[idx] += val * pan;
  }
}

function addChime(startSec, baseFreq = 2200, volume = 0.25) {
  const freqs = [baseFreq, baseFreq * 1.334, baseFreq * 1.682, baseFreq * 2.12];
  freqs.forEach((f, idx) => {
    const start = Math.floor(startSec * SAMPLE_RATE);
    const len = Math.floor(2.5 * SAMPLE_RATE);
    const decay = 3.5 + idx;
    for (let i = 0; i < len; i++) {
      const pos = start + i;
      if (pos >= TOTAL_SAMPLES) break;
      const t = i / SAMPLE_RATE;
      const env = Math.exp(-decay * t);
      const val = Math.sin(2 * Math.PI * f * t) * volume * env * (1 / (idx + 1));
      left[pos] += val * 0.7;
      right[pos] += val * 0.7;
    }
  });
}

function addSubBass(startSec, durationSec, startFreq = 70, endFreq = 35, volume = 0.4) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(durationSec * SAMPLE_RATE);
  for (let i = 0; i < len; i++) {
    const pos = start + i;
    if (pos >= TOTAL_SAMPLES) break;
    const t = i / len;
    const freq = startFreq + (endFreq - startFreq) * t;
    const env = Math.sin(Math.PI * t);
    const val = Math.sin(2 * Math.PI * freq * (i / SAMPLE_RATE)) * volume * env;
    left[pos] += val * 0.5;
    right[pos] += val * 0.5;
  }
}

function addTypingClick(startSec, volume = 0.15) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(0.025 * SAMPLE_RATE);
  for (let i = 0; i < len; i++) {
    const pos = start + i;
    if (pos >= TOTAL_SAMPLES) break;
    const env = (len - i) / len;
    const noise = (Math.random() * 2 - 1) * 0.6;
    const click = Math.sin(2 * Math.PI * 3200 * (i / SAMPLE_RATE)) * 0.4;
    const val = (noise + click) * volume * env;
    left[pos] += val;
    right[pos] += val;
  }
}

function addWhoosh(startSec, durationSec = 0.5, volume = 0.2) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(durationSec * SAMPLE_RATE);
  for (let i = 0; i < len; i++) {
    const pos = start + i;
    if (pos >= TOTAL_SAMPLES) break;
    const t = i / len;
    const env = Math.sin(Math.PI * t);
    const noise = (Math.random() * 2 - 1);
    const filterMod = Math.sin(2 * Math.PI * (400 + 800 * t) * (i / SAMPLE_RATE));
    const val = noise * filterMod * volume * env;
    left[pos] += val * (1 - t);
    right[pos] += val * t;
  }
}

// 1. Scene 1 (0 - 6.2s): Tense low drone
for (let t = 0; t < 6.0; t += 0.1) {
  addSine(left, t, 0.2, 110, 0.08, 0.5, 0.05);
  addSine(left, t, 0.2, 164.8, 0.05, 0.5, 0.05);
}
// Scene 1 silence cutoff at 5.8s - 6.2s

// 2. Scene 2 (6.2s): Awakening Hero Drop
addSubBass(6.2, 1.8, 85, 38, 0.45);
addChime(6.25, 2400, 0.35);

// 3. Ambient Arpeggio Pulse (6.2s to 33s) - energetic Apple Keynote style
const chords = [
  // F Major / Dm / Bb / C progression
  { start: 6.2, dur: 4.8, notes: [349.23, 440.0, 523.25, 698.46] }, // F
  { start: 11.0, dur: 7.2, notes: [293.66, 349.23, 440.0, 587.33] }, // Dm
  { start: 18.2, dur: 6.0, notes: [233.08, 293.66, 349.23, 466.16] }, // Bb
  { start: 24.2, dur: 4.4, notes: [261.63, 329.63, 392.0, 523.25] }, // C
  { start: 28.6, dur: 5.4, notes: [349.23, 440.0, 523.25, 698.46] }, // Final F
];

chords.forEach(c => {
  // Pad
  c.notes.forEach((f, idx) => {
    addSine(left, c.start, c.dur, f, 0.045, idx % 2 === 0 ? 0.35 : 0.65, 0.6);
    addSine(left, c.start, c.dur, f * 0.5, 0.05, 0.5, 0.6); // bass note
  });

  // Melodic 16th note synth arpeggios
  const step = 0.16;
  const numSteps = Math.floor(c.dur / step);
  for (let s = 0; s < numSteps; s++) {
    const note = c.notes[s % c.notes.length] * (s % 4 === 3 ? 2 : 1);
    addSine(left, c.start + s * step, 0.14, note, 0.035, (s % 2) * 0.4 + 0.3, 0.02);
  }
});

// Sound Effects synchronization
// Scene 3 typing (11.6s - 13.2s)
for (let t = 11.6; t <= 13.0; t += 0.09 + Math.random() * 0.04) {
  addTypingClick(t, 0.12);
}
// Scene 3 dismiss whoosh (16.8s)
addWhoosh(16.6, 0.45, 0.22);

// Scene 4 code typing (18.6s - 20.0s)
for (let t = 18.6; t <= 19.8; t += 0.08 + Math.random() * 0.05) {
  addTypingClick(t, 0.13);
}
// Scene 4 fullscreen bloom whoosh + sub drop (20.8s)
addSubBass(20.8, 1.5, 90, 40, 0.4);
addWhoosh(20.8, 0.6, 0.25);

// Scene 5 theme morph chimes (24.3s, 25.5s, 26.8s)
addChime(24.3, 2100, 0.2);
addChime(25.5, 2600, 0.2);
addChime(26.8, 3200, 0.25);

// Scene 6 grand finale chord & crystal bell (28.8s)
addSubBass(28.8, 2.5, 75, 30, 0.5);
addChime(29.0, 2400, 0.4);

// Convert Float32 to 16-bit PCM Buffer
const pcmBuffer = Buffer.alloc(44 + TOTAL_SAMPLES * 4);
pcmBuffer.write('RIFF', 0);
pcmBuffer.writeUInt32LE(36 + TOTAL_SAMPLES * 4, 4);
pcmBuffer.write('WAVE', 8);
pcmBuffer.write('fmt ', 12);
pcmBuffer.writeUInt32LE(16, 16);
pcmBuffer.writeUInt16LE(1, 20); // PCM
pcmBuffer.writeUInt16LE(2, 22); // Stereo
pcmBuffer.writeUInt32LE(SAMPLE_RATE, 24);
pcmBuffer.writeUInt32LE(SAMPLE_RATE * 4, 28);
pcmBuffer.writeUInt16LE(4, 32);
pcmBuffer.writeUInt16LE(16, 34);
pcmBuffer.write('data', 36);
pcmBuffer.writeUInt32LE(TOTAL_SAMPLES * 4, 40);

let offset = 44;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  // Limiter / soft clipping
  let l = Math.max(-0.95, Math.min(0.95, left[i]));
  let r = Math.max(-0.95, Math.min(0.95, right[i]));
  pcmBuffer.writeInt16LE(Math.floor(l * 32767), offset);
  pcmBuffer.writeInt16LE(Math.floor(r * 32767), offset + 2);
  offset += 4;
}

const bgmPath = path.join(__dirname, '../scratch/audio/backing_track.wav');
fs.writeFileSync(bgmPath, pcmBuffer);
console.log(`Backing track written: ${bgmPath} (${(pcmBuffer.length / 1024 / 1024).toFixed(2)} MB)`);

// Now use FFmpeg to mix voiceovers with background track!
const ffmpeg = path.join(__dirname, '../node_modules/ffmpeg-static/ffmpeg');
const outputPath = path.join(__dirname, '../scratch/audio/commercial_soundtrack.wav');

// Delays in ms:
// vo_1: 400ms
// vo_2: 6400ms
// vo_3: 11000ms
// vo_4: 18400ms
// vo_5: 24400ms
// vo_6: 29000ms
const filter = `
[1:a]adelay=400|400,volume=1.35[a1];
[2:a]adelay=6400|6400,volume=1.4[a2];
[3:a]adelay=11000|11000,volume=1.4[a3];
[4:a]adelay=18400|18400,volume=1.4[a4];
[5:a]adelay=24400|24400,volume=1.4[a5];
[6:a]adelay=29000|29000,volume=1.45[a6];
[0:a]volume=0.9[abg];
[abg][a1][a2][a3][a4][a5][a6]amix=inputs=7:duration=first:dropout_transition=2[outa]
`.trim().replace(/\n/g, '');

const cmd = `"${ffmpeg}" -y -i "${bgmPath}" \
  -i scratch/audio/vo_1.wav \
  -i scratch/audio/vo_2.wav \
  -i scratch/audio/vo_3.wav \
  -i scratch/audio/vo_4.wav \
  -i scratch/audio/vo_5.wav \
  -i scratch/audio/vo_6.wav \
  -filter_complex "${filter}" -map "[outa]" -c:a pcm_s16le "${outputPath}"`;

console.log('Mixing audio with FFmpeg...');
execSync(cmd, { stdio: 'inherit' });
console.log(`SUCCESS! Master soundtrack created: ${outputPath}`);
