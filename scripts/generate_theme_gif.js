const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { GIFEncoder, quantize, applyPalette } = require('gifenc');

ipcMain.on('resize', () => {});
ipcMain.on('hide', () => {});
ipcMain.on('hide-now', () => {});
ipcMain.on('toggle-fullscreen', () => {});
ipcMain.on('set-fullscreen', () => {});
ipcMain.on('closing-started', () => {});
ipcMain.handle('register-global-shortcut', async () => true);
ipcMain.handle('get-global-shortcut', async () => 'Alt+Space');
ipcMain.handle('get-search-suggestions', async () => []);
ipcMain.handle('clear-private-session', async () => true);
ipcMain.handle('clear-browser-data', async () => true);

const THEMES = [
  { id: 'deep-frost', name: 'Obsidian Ice (Classic)', tagColor: '#a78bfa' },
  { id: 'apple-liquid', name: 'Apple Liquid Glass', tagColor: '#38bdf8' },
  { id: 'apple-vision-light', name: 'Apple VisionOS Crystal', tagColor: '#60a5fa' },
  { id: 'midnight-aurora', name: 'Midnight Aurora', tagColor: '#34d399' },
  { id: 'sunset-amber', name: 'Sunset Amber', tagColor: '#fbbf24' },
  { id: 'oled-minimal', name: 'OLED Titanium', tagColor: '#e2e8f0' },
];

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 900,
    height: 340,
    show: false,
    frame: false,
    transparent: false,
    backgroundColor: '#0a0e17',
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  await win.loadFile(path.join(__dirname, '../spotlight.html'));

  await win.webContents.executeJavaScript(`
    const bg = document.createElement('div');
    bg.id = 'theme-backdrop';
    bg.innerHTML = \`
      <div id="orb-1" style="position: absolute; top: 10%; left: 15%; width: 450px; height: 450px; background: radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, transparent 70%); filter: blur(60px); pointer-events: none; transition: background 0.4s ease;"></div>
      <div id="orb-2" style="position: absolute; bottom: 10%; right: 15%; width: 450px; height: 450px; background: radial-gradient(circle, rgba(217, 70, 239, 0.4) 0%, transparent 70%); filter: blur(60px); pointer-events: none; transition: background 0.4s ease;"></div>
      <div id="theme-pill-indicator" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0, 0, 0, 0.65); border: 1px solid rgba(255, 255, 255, 0.15); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); padding: 5px 16px; border-radius: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12.5px; font-weight: 600; color: #fff; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); z-index: 100;">
        <span id="theme-dot-indicator" style="width: 8px; height: 8px; border-radius: 50%; background: #a78bfa;"></span>
        <span id="theme-name-text">Theme: Obsidian Ice (Classic)</span>
      </div>
    \`;
    Object.assign(bg.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '-1',
      background: 'linear-gradient(135deg, #07090e 0%, #0d121f 50%, #07090e 100%)',
      overflow: 'hidden',
      pointerEvents: 'none'
    });
    document.body.prepend(bg);

    state.mode = 'search';
    $shell.className = 'search-mode state-expanded';
    $shell.style.opacity = '1';
    $shell.style.transform = 'translate(-50%, -50%)';
    $shell.style.position = 'fixed';
    $shell.style.top = '44%';
    $shell.style.left = '50%';
    $searchView.classList.remove('hidden');
    $browserView.classList.remove('active');
    $resultsPnl.classList.remove('visible');
    $shell.classList.remove('has-results');
    $searchInput.value = '';
    $searchInput.placeholder = 'Search Google or enter a web address...';

    window.setThemeFromHost = function(themeId, themeName, tagColor) {
      document.body.setAttribute('data-theme', themeId);
      const dot = document.getElementById('theme-dot-indicator');
      const text = document.getElementById('theme-name-text');
      if (dot) dot.style.background = tagColor;
      if (text) text.textContent = 'Theme: ' + themeName;

      const orb1 = document.getElementById('orb-1');
      const orb2 = document.getElementById('orb-2');
      if (themeId === 'midnight-aurora') {
        orb1.style.background = 'radial-gradient(circle, rgba(45, 212, 191, 0.45) 0%, transparent 70%)';
        orb2.style.background = 'radial-gradient(circle, rgba(52, 211, 153, 0.4) 0%, transparent 70%)';
      } else if (themeId === 'sunset-amber') {
        orb1.style.background = 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)';
        orb2.style.background = 'radial-gradient(circle, rgba(249, 115, 22, 0.35) 0%, transparent 70%)';
      } else if (themeId === 'apple-liquid' || themeId === 'apple-vision-light') {
        orb1.style.background = 'radial-gradient(circle, rgba(14, 165, 233, 0.45) 0%, transparent 70%)';
        orb2.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 70%)';
      } else if (themeId === 'oled-minimal') {
        orb1.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)';
        orb2.style.background = 'radial-gradient(circle, rgba(148, 163, 184, 0.15) 0%, transparent 70%)';
      } else {
        orb1.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, transparent 70%)';
        orb2.style.background = 'radial-gradient(circle, rgba(217, 70, 239, 0.4) 0%, transparent 70%)';
      }
      return true;
    };
    true;
  `);

  const gif = GIFEncoder();
  const targetW = 800;
  const targetH = 300;
  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  console.log('Rendering all theme frames directly into GIF...');

  for (let i = 0; i < THEMES.length; i++) {
    const t = THEMES[i];
    await win.webContents.executeJavaScript(`window.setThemeFromHost('${t.id}', '${t.name}', '${t.tagColor}');`);
    await sleep(350);

    const nativeImg = await win.webContents.capturePage();
    const resized = nativeImg.resize({ width: targetW, height: targetH });
    const bgra = resized.toBitmap();
    const rgba = new Uint8Array(targetW * targetH * 4);
    for (let j = 0; j < bgra.length; j += 4) {
      rgba[j] = bgra[j + 2];     // R
      rgba[j + 1] = bgra[j + 1]; // G
      rgba[j + 2] = bgra[j];     // B
      rgba[j + 3] = bgra[j + 3]; // A
    }

    const palette = quantize(rgba, 256);
    const index = applyPalette(rgba, palette);
    // Display each theme for 1.4 seconds
    gif.writeFrame(index, targetW, targetH, { palette, delay: 1400 });
    console.log(`Frame ${i + 1}/${THEMES.length} encoded: ${t.name}`);
  }

  gif.finish();
  const buffer = Buffer.from(gif.bytes());
  const outPath = path.join(__dirname, '../assets/lucent_themes.gif');
  fs.writeFileSync(outPath, buffer);
  console.log(`SUCCESS! Created ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);

  app.quit();
});
