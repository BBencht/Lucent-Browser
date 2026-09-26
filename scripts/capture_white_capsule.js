const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

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

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
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
    bg.id = 'white-hero-backdrop';
    bg.innerHTML = \`
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 32px; background: rgba(0,0,0,0.45); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.85); z-index: 1000;">
        <div style="display: flex; gap: 18px; align-items: center;">
          <span style="font-size: 15px; opacity: 0.95;"></span>
          <span style="font-weight: 700; color: #fff;">Lucent</span>
          <span style="opacity: 0.75;">File</span>
          <span style="opacity: 0.75;">Edit</span>
          <span style="opacity: 0.75;">View</span>
          <span style="opacity: 0.75;">History</span>
          <span style="opacity: 0.75;">Bookmarks</span>
          <span style="opacity: 0.75;">Window</span>
          <span style="opacity: 0.75;">Help</span>
        </div>
        <div style="display: flex; gap: 14px; align-items: center; opacity: 0.85; font-size: 12.5px;">
          <span>🔋 100%</span>
          <span>Wi-Fi</span>
          <span>Fri 9:41 PM</span>
        </div>
      </div>
      <div style="position: absolute; top: 18%; left: 12%; width: 560px; height: 560px; background: radial-gradient(circle, rgba(14, 165, 233, 0.45) 0%, rgba(99, 102, 241, 0.25) 50%, transparent 70%); filter: blur(75px); pointer-events: none;"></div>
      <div style="position: absolute; bottom: 12%; right: 12%; width: 580px; height: 580px; background: radial-gradient(circle, rgba(217, 70, 239, 0.38) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 70%); filter: blur(80px); pointer-events: none;"></div>
      <div style="position: absolute; top: 35%; right: 30%; width: 450px; height: 450px; background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 65%); filter: blur(60px); pointer-events: none;"></div>
    \`;
    Object.assign(bg.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '-1',
      background: 'linear-gradient(135deg, #07090e 0%, #0d121f 50%, #111827 75%, #07090e 100%)',
      overflow: 'hidden',
      pointerEvents: 'none'
    });
    document.body.prepend(bg);

    // Apply Apple VisionOS Crystal (Pure White) theme
    document.body.setAttribute('data-theme', 'apple-vision-light');

    state.mode = 'search';
    $shell.className = 'search-mode state-expanded';
    $shell.style.opacity = '1';
    $shell.style.transform = 'translate(-50%, -50%)';
    $shell.style.position = 'fixed';
    $shell.style.top = '45%';
    $shell.style.left = '50%';
    $searchView.classList.remove('hidden');
    $browserView.classList.remove('active');
    $resultsPnl.classList.remove('visible');
    $shell.classList.remove('has-results');
    $searchInput.value = '';
    $searchInput.placeholder = 'Search Google or enter a web address...';
    true;
  `);

  await new Promise(r => setTimeout(r, 600));
  const img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, '../assets/screenshot_white_capsule.png'), img.toPNG());
  console.log('WHITE CAPSULE CAPTURED!');
  app.quit();
});
