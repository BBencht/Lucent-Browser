const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const FRAMES_DIR = path.join(__dirname, '../scratch/frames');
const OUTPUT_MP4 = path.join(__dirname, '../assets/lucent_commercial.mp4');
const AUDIO_WAV  = path.join(__dirname, '../scratch/audio/commercial_soundtrack.wav');
const FFMPEG_BIN = path.join(__dirname, '../node_modules/ffmpeg-static/ffmpeg');

const FPS = 30;
const DURATION = 34.0;
const TOTAL_FRAMES = Math.floor(FPS * DURATION); // 1020 frames

if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
} else {
  // Clean existing frames
  const files = fs.readdirSync(FRAMES_DIR);
  for (const f of files) {
    if (f.endsWith('.png')) fs.unlinkSync(path.join(FRAMES_DIR, f));
  }
}

app.whenReady().then(async () => {
  console.log(`Starting Electron Video Renderer: 1920x1080 @ ${FPS}fps (${TOTAL_FRAMES} frames, ${DURATION}s)...`);

  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    frame: false,
    backgroundColor: '#04060a',
    webPreferences: {
      offscreen: false,
    },
  });

  const rendererHtml = path.join(__dirname, 'commercial_renderer.html');
  await win.loadFile(rendererHtml);

  // Warmup renderer
  await win.webContents.executeJavaScript('window.renderAtTime(0); true;');
  await new Promise(r => setTimeout(r, 600));

  console.log('Beginning frame-by-frame rendering...');
  const t0 = Date.now();

  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const timeSec = frame / FPS;
    await win.webContents.executeJavaScript(`window.renderAtTime(${timeSec.toFixed(4)}); true;`);

    const img = await win.webContents.capturePage();
    const frameNumber = String(frame).padStart(5, '0');
    const framePath = path.join(FRAMES_DIR, `frame_${frameNumber}.png`);
    fs.writeFileSync(framePath, img.toPNG());

    if ((frame + 1) % 100 === 0 || frame === TOTAL_FRAMES - 1) {
      const pct = (((frame + 1) / TOTAL_FRAMES) * 100).toFixed(1);
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      const fpsReal = ((frame + 1) / ((Date.now() - t0) / 1000)).toFixed(1);
      console.log(`[Frame ${frame + 1}/${TOTAL_FRAMES}] ${pct}% completed (${elapsed}s elapsed, ${fpsReal} fps render speed)`);
    }
  }

  const renderTime = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`All ${TOTAL_FRAMES} frames captured in ${renderTime}s! Encoding MP4 with FFmpeg...`);

  win.close();

  // FFmpeg high-quality H.264 encode with AAC audio
  const ffmpegCmd = `"${FFMPEG_BIN}" -y \
    -framerate ${FPS} \
    -i "${path.join(FRAMES_DIR, 'frame_%05d.png')}" \
    -i "${AUDIO_WAV}" \
    -c:v libx264 \
    -preset fast \
    -crf 19 \
    -pix_fmt yuv420p \
    -c:a aac \
    -b:a 256k \
    -shortest \
    -movflags +faststart \
    "${OUTPUT_MP4}"`;

  try {
    execSync(ffmpegCmd, { stdio: 'inherit' });
    const stat = fs.statSync(OUTPUT_MP4);
    console.log(`\n🎉 SUCCESS! Commercial Video Generated: ${OUTPUT_MP4} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
  } catch (err) {
    console.error('FFmpeg encoding failed:', err.message);
  }

  app.quit();
});
