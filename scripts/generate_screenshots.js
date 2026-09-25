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
ipcMain.handle('get-search-suggestions', async (_e, q) => [
  q + ' liquid glass design',
  q + ' web standards',
  q + ' documentation'
]);
ipcMain.handle('clear-private-session', async () => true);
ipcMain.handle('clear-browser-data', async () => true);

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
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

  // Inject a luxury desktop background behind the app with modern macOS ambient wallpaper
  await win.webContents.executeJavaScript(`
    const bg = document.createElement('div');
    bg.id = 'screenshot-desktop-backdrop';
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
      <div style="position: absolute; top: 12%; left: 8%; width: 560px; height: 560px; background: radial-gradient(circle, rgba(14, 165, 233, 0.45) 0%, rgba(99, 102, 241, 0.25) 50%, transparent 70%); filter: blur(70px); pointer-events: none;"></div>
      <div style="position: absolute; bottom: 8%; right: 12%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(217, 70, 239, 0.4) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 70%); filter: blur(80px); pointer-events: none;"></div>
      <div style="position: absolute; top: 35%; right: 30%; width: 450px; height: 450px; background: radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 65%); filter: blur(60px); pointer-events: none;"></div>
    \`;
    Object.assign(bg.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '-1',
      background: 'linear-gradient(135deg, #07090e 0%, #0d121f 40%, #111827 70%, #07090e 100%)',
      overflow: 'hidden',
      pointerEvents: 'none'
    });
    document.body.prepend(bg);
  `);

  const assetsDir = path.join(__dirname, '../assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  // 1. CAPTURE PURE SEARCH CAPSULE (HERO SHOT)
  console.log('Capturing Pure Search Capsule...');
  await win.webContents.executeJavaScript(`
    switchToSearch();
    $searchInput.value = '';
    state.query = '';
    renderResults();
    $shell.classList.remove('has-results');
  `);
  await sleep(1000);
  const imgCapsule = await win.webContents.capturePage();
  fs.writeFileSync(path.join(assetsDir, 'screenshot_capsule.png'), imgCapsule.toPNG());
  console.log('Saved screenshot_capsule.png');

  // 2. CAPTURE SEARCH WITH SUGGESTIONS
  console.log('Capturing Search with Suggestions...');
  await win.webContents.executeJavaScript(`
    switchToSearch();
    $searchInput.value = 'liquid glass';
    state.query = 'liquid glass';
    renderResults();
    $shell.classList.add('has-results');
  `);
  await sleep(1000);
  const imgSearch = await win.webContents.capturePage();
  fs.writeFileSync(path.join(assetsDir, 'screenshot_search.png'), imgSearch.toPNG());
  console.log('Saved screenshot_search.png');

  // 3. CAPTURE FLOATING BROWSER MODE
  console.log('Capturing Browser Mode...');
  await win.webContents.executeJavaScript(`
    state.tabs = [];
    $wvWrapper.innerHTML = '';
    const tab1 = {
      id: 'tab_demo_1',
      url: 'https://en.wikipedia.org/wiki/Liquid_Glass',
      isPrivate: false,
      title: 'Liquid Glass — Wikipedia',
      icon: '🌐',
      faviconUrl: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
      webview: document.createElement('div'),
      history: [{ url: 'https://en.wikipedia.org/wiki/Liquid_Glass', title: 'Liquid Glass — Wikipedia', timestamp: Date.now() }],
      historyIndex: 0
    };
    const tab2 = {
      id: 'tab_demo_2',
      url: 'https://github.com/BBencht/Lucent-Browser',
      isPrivate: false,
      title: 'GitHub — BBencht/Lucent-Browser',
      icon: '🐙',
      faviconUrl: 'https://github.githubassets.com/favicons/favicon.png',
      webview: document.createElement('div'),
      history: [{ url: 'https://github.com/BBencht/Lucent-Browser', title: 'GitHub', timestamp: Date.now() }],
      historyIndex: 0
    };
    const tab3 = {
      id: 'tab_demo_3',
      url: 'https://duckduckgo.com',
      isPrivate: true,
      title: 'DuckDuckGo — Private Search',
      icon: '🕶️',
      faviconUrl: null,
      webview: document.createElement('div'),
      history: [],
      historyIndex: 0
    };
    state.tabs = [tab1, tab2, tab3];
    state.activeTabId = 'tab_demo_1';
    
    $wvWrapper.innerHTML = \`
      <div style="width: 100%; height: 100%; background: #12141a; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 50px; overflow: hidden; box-sizing: border-box;">
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px;">
          <span style="font-size: 32px;">🌐</span>
          <div>
            <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #f8fafc; letter-spacing: -0.02em;">Liquid Glass Architecture & Fluid Interfaces</h1>
            <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 14px;">From Wikipedia, the free encyclopedia</p>
          </div>
        </div>
        <div style="display: flex; gap: 32px; line-height: 1.7; font-size: 15px; color: #cbd5e1;">
          <div style="flex: 2;">
            <p style="margin-top: 0;">
              <b>Liquid Glass</b> is a contemporary user interface design language characterized by multi-layered chromatic diffusion, depth refractions, and optical specular highlights. It bridges tactile skeuomorphism and digital minimalism, rendering translucent surfaces that react dynamically to content and lighting.
            </p>
            <p>
              In modern computing environments such as macOS Liquid Glass and Windows Acrylic, interface elements serve as optical lenses over underlying desktop contexts, reducing visual friction and elevating user focus during deep work sessions.
            </p>
            <div style="margin-top: 24px; display: inline-flex; gap: 12px;">
              <span style="background: rgba(14, 165, 233, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;">✨ Fluid HUD Physics</span>
              <span style="background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(192, 132, 252, 0.3); color: #c084fc; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;">🛡️ Zero Tracking</span>
              <span style="background: rgba(52, 211, 153, 0.15); border: 1px solid rgba(52, 211, 153, 0.3); color: #34d399; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;">⚡ Instant Peek</span>
            </div>
          </div>
          <div style="flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px;">
            <div style="font-weight: 600; color: #f1f5f9; margin-bottom: 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Key Specifications</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;"><span style="color:#94a3b8;">Blur Radius</span><span style="font-weight:600; color:#38bdf8;">40px</span></div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;"><span style="color:#94a3b8;">Refraction</span><span style="font-weight:600; color:#a855f7;">Specular Edge</span></div>
            <div style="display: flex; justify-content: space-between; font-size: 13px;"><span style="color:#94a3b8;">Memory Mode</span><span style="font-weight:600; color:#34d399;">Ephemeral HUD</span></div>
          </div>
        </div>
      </div>
    \`;

    state.mode = 'browser';
    $searchView.classList.add('hidden');
    $browserView.classList.add('active');
    $shell.className = 'browser-mode';
    $urlText.textContent = 'https://en.wikipedia.org/wiki/Liquid_Glass';
    $loader.classList.add('hidden');
    renderTabs();
    updateNavControls();
  `);
  await sleep(1000);
  const imgBrowser = await win.webContents.capturePage();
  fs.writeFileSync(path.join(assetsDir, 'screenshot_browser.png'), imgBrowser.toPNG());
  console.log('Saved screenshot_browser.png');

  // 4. CAPTURE SETTINGS & THEMES MODAL
  console.log('Capturing Settings Modal...');
  await win.webContents.executeJavaScript(`
    openSettings();
  `);
  await sleep(1000);
  const imgSettings = await win.webContents.capturePage();
  fs.writeFileSync(path.join(assetsDir, 'screenshot_settings.png'), imgSettings.toPNG());
  console.log('Saved screenshot_settings.png');

  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
  app.quit();
});
