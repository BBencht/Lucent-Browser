const { app, BrowserWindow, globalShortcut, ipcMain, screen, net, session } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('enable-features', 'TouchpadOverscrollHistoryNavigation');
app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled');
if (process.platform === 'linux') {
  app.commandLine.appendSwitch('enable-transparent-visuals');
  app.commandLine.appendSwitch('disable-gpu-sandbox');
}

const getChromeUA = () => {
  if (process.platform === 'darwin') {
    return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
  } else if (process.platform === 'win32') {
    return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
  } else {
    return 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
  }
};

const getFirefoxUA = () => {
  if (process.platform === 'darwin') {
    return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:133.0) Gecko/20100101 Firefox/133.0';
  } else if (process.platform === 'win32') {
    return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0';
  } else {
    return 'Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0';
  }
};

const getPlatformHint = () => {
  if (process.platform === 'darwin') return '"macOS"';
  if (process.platform === 'win32') return '"Windows"';
  return '"Linux"';
};

app.userAgentFallback = getChromeUA();

function isGoogleAuthUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  return (
    lower.includes('accounts.google.') ||
    lower.includes('myaccount.google.') ||
    lower.includes('accounts.youtube.') ||
    lower.includes('oauth.googleusercontent.') ||
    lower.includes('accounts.google.hu') ||
    lower.includes('accounts.google.com')
  );
}

function configureSecureSession(targetSession) {
  if (!targetSession) return;
  const chromeUA = getChromeUA();
  const firefoxUA = getFirefoxUA();
  try {
    targetSession.setUserAgent(chromeUA);
  } catch (e) {}

  // 1. Safe Browsing: Third-Party Tracker & Telemetry Filter
  const TRACKER_DOMAINS = [
    'doubleclick.net',
    'google-analytics.com',
    'googletagmanager.com/gtag/js',
    'facebook.net/en_US/fbevents.js',
    'scorecardresearch.com',
    'criteo.net',
    'outbrain.com',
    'taboola.com'
  ];

  targetSession.webRequest.onBeforeRequest((details, callback) => {
    if (details.url && details.resourceType !== 'mainFrame') {
      const lowerUrl = details.url.toLowerCase();
      const initiator = (details.initiator || '').toLowerCase();

      // Don't block requests if it's on accounts.google.com, youtube.com, google.com or auth
      if (
        initiator.includes('google.') ||
        initiator.includes('youtube.') ||
        initiator.includes('gstatic.') ||
        lowerUrl.includes('accounts.google.') ||
        lowerUrl.includes('accounts.youtube.') ||
        lowerUrl.includes('gstatic.com') ||
        lowerUrl.includes('googleapis.com') ||
        isGoogleAuthUrl(details.url)
      ) {
        return callback({ cancel: false });
      }

      const isTracker = TRACKER_DOMAINS.some(domain => lowerUrl.includes(domain));
      if (isTracker) {
        return callback({ cancel: true });
      }
    }
    callback({ cancel: false });
  });

  // 2. Anti-Detection & Stealth Headers
  targetSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const headers = { ...details.requestHeaders };

    // Strip case-insensitive duplicates of user-agent, electron, x-client-data
    for (const key of Object.keys(headers)) {
      const lower = key.toLowerCase();
      if (lower === 'user-agent' || lower.includes('electron') || lower === 'x-client-data') {
        delete headers[key];
      }
    }

    const isGoogleAuth = isGoogleAuthUrl(details.url);

    if (isGoogleAuth) {
      // Use clean modern Firefox identity on Google Auth domains:
      // Completely bypasses Google's embedded Chromium webview block!
      headers['User-Agent'] = firefoxUA;
      delete headers['sec-ch-ua'];
      delete headers['sec-ch-ua-mobile'];
      delete headers['sec-ch-ua-platform'];
    } else {
      headers['User-Agent'] = chromeUA;
      headers['sec-ch-ua'] = '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"';
      headers['sec-ch-ua-mobile'] = '?0';
      headers['sec-ch-ua-platform'] = getPlatformHint();
    }

    // Enhanced Privacy Headers
    headers['DNT'] = '1';
    headers['Sec-GPC'] = '1';

    callback({ requestHeaders: headers });
  });
}

let win = null;
let visible = false;
let browserMode = false;
let currentMode = 'search'; // 'search' | 'results' | 'browser'
let isFullscreen = false;
let currentGlobalShortcut = 'Alt+Space';

const W_SEARCH = 780;
const H_SEARCH = 70;

function layout(mode, count = 0) {
  const currentBounds = (win && !win.isDestroyed()) ? win.getBounds() : { x: 0, y: 0, width: 1, height: 1 };
  const display = screen.getDisplayMatching(currentBounds) || screen.getPrimaryDisplay();
  const { width: sw, height: sh } = display.workAreaSize;
  const waX = display.workArea.x;
  const waY = display.workArea.y;

  const cx = Math.round(waX + (sw - W_SEARCH) / 2);
  const cy = Math.round(waY + sh * 0.16);

  if (mode === 'browser' && isFullscreen) {
    return {
      x: display.bounds.x,
      y: display.bounds.y,
      width: display.bounds.width,
      height: display.bounds.height,
    };
  }

  if (mode === 'browser') {
    const bw = Math.min(1180, Math.round(sw * 0.84));
    const bh = Math.min(820, Math.round(sh * 0.84));
    return {
      x: Math.round(waX + (sw - bw) / 2),
      y: Math.round(waY + (sh - bh) / 2),
      width: bw,
      height: bh,
    };
  }

  if (mode === 'results') {
    const h = Math.min(540, H_SEARCH + Math.max(1, count) * 52 + 36);
    return { x: cx, y: cy, width: W_SEARCH, height: h };
  }

  if (mode === 'settings') {
    return { x: cx, y: cy, width: W_SEARCH, height: 500 };
  }

  // Exact pill dimensions with padding for spring bounce in search mode
  return { x: cx, y: cy, width: W_SEARCH, height: H_SEARCH };
}

let wasFullscreen = false;

function setFullscreenState(flag) {
  if (!win || win.isDestroyed()) return;
  const wantFullscreen = !!flag;
  isFullscreen = wantFullscreen;
  if (!wantFullscreen) {
    wasFullscreen = false;
  }

  win.setResizable(true);

  if (wantFullscreen) {
    if (process.platform === 'darwin') {
      try { win.setVisibleOnAllWorkspaces(false); } catch (e) {}
      try { win.setAlwaysOnTop(false); } catch (e) {}
    }
    try {
      win.setFullScreen(true);
    } catch (err) {
      console.warn('win.setFullScreen(true) failed:', err);
    }
    win.setHasShadow(false);
  } else {
    try {
      if (win.isFullScreen()) {
        win.setFullScreen(false);
      }
    } catch (err) {
      console.warn('win.setFullScreen(false) failed:', err);
    }
    if (process.platform === 'darwin') {
      try {
        if (!browserMode || currentMode !== 'browser') {
          win.setAlwaysOnTop(true, 'floating');
          win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
        }
      } catch (e) {}
    }
    win.setHasShadow(false);
    if (!win.isFullScreen()) {
      win.setBounds(layout('browser'), false);
    }
  }

  win.webContents.send('fullscreen-change', isFullscreen);
}

function registerGlobalHotkey(shortcut) {
  try {
    globalShortcut.unregisterAll();
    const ok = globalShortcut.register(shortcut, toggle);
    if (ok) {
      currentGlobalShortcut = shortcut;
      console.log('✓ Registered new global shortcut:', shortcut);
      return { success: true, shortcut };
    } else {
      globalShortcut.register(currentGlobalShortcut, toggle);
      return { success: false, error: 'The shortcut is already in use or unavailable.' };
    }
  } catch (err) {
    globalShortcut.register(currentGlobalShortcut, toggle);
    return { success: false, error: err.message };
  }
}

function createWindow() {
  const b = layout(currentMode);
  win = new BrowserWindow({
    ...b,
    frame: false,
    titleBarStyle: 'hidden',
    transparent: true,
    backgroundColor: '#00000000',
    resizable: true,
    movable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    show: false,
    fullscreenable: true,
    simpleFullScreen: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
    },
  });

  win.setHasShadow(false);
  if (process.platform === 'darwin') {
    try {
      win.setWindowButtonVisibility(false);
    } catch (e) {}
  }
  if (process.platform === 'win32' || process.platform === 'linux') {
    win.setMenuBarVisibility(false);
  }
  win.loadFile('spotlight.html');
  try {
    win.setAlwaysOnTop(true, 'floating');
  } catch (e) {
    try { win.setAlwaysOnTop(true); } catch (err) {}
  }
  try {
    if (process.platform === 'darwin') {
      win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    } else {
      win.setVisibleOnAllWorkspaces(true);
    }
  } catch (e) {}

  win.on('blur', () => {
    if (!win || isClosing) return;
    try {
      const cursor = screen.getCursorScreenPoint();
      const bounds = win.getBounds();
      const isCursorOutside = (
        cursor.x < bounds.x ||
        cursor.x > bounds.x + bounds.width ||
        cursor.y < bounds.y ||
        cursor.y > bounds.y + bounds.height
      );
      if (isCursorOutside) {
        hide();
      } else {
        setTimeout(() => {
          if (win && !win.isFocused()) {
            const c = screen.getCursorScreenPoint();
            const b = win.getBounds();
            if (c.x < b.x || c.x > b.x + b.width || c.y < b.y || c.y > b.y + b.height) {
              hide();
            }
          }
        }, 120);
      }
    } catch {
      hide();
    }
  });

  win.on('enter-full-screen', () => {
    isFullscreen = true;
    win.webContents.send('fullscreen-change', true);
  });

  win.on('leave-full-screen', () => {
    isFullscreen = false;
    win.setHasShadow(false);
    if (process.platform === 'darwin') {
      try {
        if (!browserMode || currentMode !== 'browser') {
          win.setAlwaysOnTop(true, 'floating');
          win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
        }
      } catch (e) {}
    }
    win.setBounds(layout(currentMode), false);
    win.webContents.send('fullscreen-change', false);
  });

  win.on('app-command', (_e, cmd) => {
    if (cmd === 'browser-backward') {
      win.webContents.send('gesture-nav', 'back');
    } else if (cmd === 'browser-forward') {
      win.webContents.send('gesture-nav', 'fwd');
    }
  });

  win.on('swipe', (_event, direction) => {
    if (direction === 'right') {
      win.webContents.send('gesture-nav', 'back');
    } else if (direction === 'left') {
      win.webContents.send('gesture-nav', 'fwd');
    }
  });
}

let hideTimer = null;
let isClosing = false;

function show() {
  if (!win) return;
  clearTimeout(hideTimer);
  isClosing = false;
  const targetMode = (currentMode === 'browser') ? 'browser' : 'search';
  if (targetMode === 'search' && isFullscreen) {
    wasFullscreen = true;
    setFullscreenState(false);
  }
  if (targetMode === 'browser' && (isFullscreen || wasFullscreen)) {
    wasFullscreen = false;
    setFullscreenState(true);
  } else {
    win.setBounds(layout(targetMode));
  }
  win.setHasShadow(false);

  const doShow = () => {
    if (win) win.webContents.send('open', targetMode);
    win.show();
    win.focus();
    visible = true;
  };

  if (win.webContents.isLoading()) {
    win.webContents.once('did-finish-load', doShow);
  } else {
    doShow();
  }
}

function hide() {
  if (!win || !visible) return;
  if (isClosing) return;
  isClosing = true;
  win.webContents.send('close');
  clearTimeout(hideTimer);
  // Fallback safety timeout in case renderer doesn't reply
  hideTimer = setTimeout(() => {
    if (win) {
      win.hide();
    }
    visible = false;
    isClosing = false;
  }, 1400);
}

function toggle() {
  if (visible && !isClosing) {
    hide();
  } else {
    show();
  }
}

ipcMain.on('resize', (_e, mode, count) => {
  if (!win) return;
  currentMode = mode;
  browserMode = (mode === 'browser');

  if (!browserMode && isFullscreen) {
    wasFullscreen = true;
    setFullscreenState(false);
  }

  win.setResizable(browserMode);
  win.setHasShadow(false);
  if (!win.isFullScreen()) {
    win.setBounds(layout(mode, count), false);
  }
  if (browserMode) {
    win.focus();
  }
});

ipcMain.on('closing-started', () => {
  isClosing = true;
});

ipcMain.on('toggle-fullscreen', () => {
  if (!win || !browserMode) return;
  const target = !isFullscreen;
  if (!target) {
    wasFullscreen = false;
  }
  setFullscreenState(target);
});

ipcMain.on('set-fullscreen', (_e, flag) => {
  if (!win) return;
  const want = !!flag;
  if (!want) {
    wasFullscreen = false;
  }
  setFullscreenState(want);
});

ipcMain.handle('register-global-shortcut', (_e, newShortcut) => {
  return registerGlobalHotkey(newShortcut);
});

ipcMain.handle('get-global-shortcut', () => {
  return currentGlobalShortcut;
});

ipcMain.handle('get-search-suggestions', async (_e, query) => {
  if (!query || typeof query !== 'string' || !query.trim()) return [];
  try {
    const q = encodeURIComponent(query.trim());
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${q}`;
    const res = await net.fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (Array.isArray(json) && Array.isArray(json[1])) {
      return json[1].slice(0, 8);
    }
    return [];
  } catch (err) {
    return [];
  }
});

ipcMain.on('hide', hide);
ipcMain.on('hide-now', () => {
  clearTimeout(hideTimer);
  if (win) win.hide();
  visible = false;
  isClosing = false;
  if (!browserMode && isFullscreen) {
    wasFullscreen = true;
    setFullscreenState(false);
  }
});

ipcMain.handle('clear-private-session', async () => {
  try {
    const privSession = session.fromPartition('glass_private_session');
    await privSession.clearStorageData();
    await privSession.clearCache();
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('clear-browser-data', async () => {
  try {
    const profSession = session.fromPartition('persist:glass_profile');
    await profSession.clearStorageData();
    await profSession.clearCache();
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

app.whenReady().then(() => {
  // Configure default & custom partitions for anti-detection & persistence
  configureSecureSession(session.defaultSession);
  configureSecureSession(session.fromPartition('persist:glass_profile'));
  configureSecureSession(session.fromPartition('glass_private_session'));

  createWindow();
  const defaultShortcuts = process.platform === 'darwin'
    ? ['Alt+Space', 'CommandOrControl+Shift+Space', 'CommandOrControl+K']
    : (process.platform === 'win32'
        ? ['Alt+Space', 'Control+Shift+Space', 'Control+Alt+Space', 'Alt+K']
        : ['Alt+Space', 'Control+Alt+Space', 'Control+Shift+Space', 'Super+Space']);

  for (const sc of defaultShortcuts) {
    if (globalShortcut.register(sc, toggle)) {
      currentGlobalShortcut = sc;
      console.log('✓ Registered shortcut:', sc);
      break;
    }
  }
  setTimeout(show, 200);
});

app.on('web-contents-created', (_event, contents) => {
  contents.setMaxListeners(50);
  // Completely prevent separate popup windows; open every new window/link as a tab inside Glass Spotlight
  contents.setWindowOpenHandler((details) => {
    const targetUrl = details.url;
    if (targetUrl && targetUrl !== 'about:blank') {
      if (win && !win.isDestroyed()) {
        win.webContents.send('open-url-in-tab', targetUrl);
      }
    }
    return { action: 'deny' };
  });

  let swipeDelta = 0;
  let swipeCooldown = false;
  let swipeResetTimer = null;

  contents.on('input-event', (_ev, input) => {
    if (input.type === 'mouseWheel') {
      // Precision trackpad horizontal swipe detection
      if (Math.abs(input.deltaX) > Math.abs(input.deltaY) * 1.05) {
        swipeDelta += input.deltaX;
        clearTimeout(swipeResetTimer);
        swipeResetTimer = setTimeout(() => { swipeDelta = 0; }, 280);

        if (!swipeCooldown) {
          if (swipeDelta < -30) { // Swiping right -> Back
            swipeCooldown = true;
            swipeDelta = 0;
            if (win && !win.isDestroyed()) win.webContents.send('gesture-nav', 'back');
            setTimeout(() => { swipeCooldown = false; }, 550);
          } else if (swipeDelta > 30) { // Swiping left -> Forward
            swipeCooldown = true;
            swipeDelta = 0;
            if (win && !win.isDestroyed()) win.webContents.send('gesture-nav', 'fwd');
            setTimeout(() => { swipeCooldown = false; }, 550);
          }
        }
      } else if (Math.abs(input.deltaY) > 12) {
        swipeDelta = 0;
      }
    }
  });
});

app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', e => e.preventDefault());

