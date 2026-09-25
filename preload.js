const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('GlassAPI', {
  platform: process.platform,

  resize: (mode, count) => ipcRenderer.send('resize', mode, count),
  hide: () => ipcRenderer.send('hide'),
  hideNow: () => ipcRenderer.send('hide-now'),
  toggleFullscreen: () => ipcRenderer.send('toggle-fullscreen'),
  setFullscreen: (flag) => ipcRenderer.send('set-fullscreen', flag),
  closingStarted: () => ipcRenderer.send('closing-started'),
  registerGlobalShortcut: (shortcut) => ipcRenderer.invoke('register-global-shortcut', shortcut),
  getGlobalShortcut: () => ipcRenderer.invoke('get-global-shortcut'),
  onOpen: (cb) => ipcRenderer.on('open', (_e, mode) => cb(mode)),
  onClose: (cb) => ipcRenderer.on('close', () => cb()),
  onFullscreenChange: (cb) => ipcRenderer.on('fullscreen-change', (_e, isFs) => cb(isFs)),
  getSearchSuggestions: (query) => ipcRenderer.invoke('get-search-suggestions', query),
  onGestureNav: (cb) => ipcRenderer.on('gesture-nav', (_e, dir) => cb(dir)),
  clearPrivateSession: () => ipcRenderer.invoke('clear-private-session'),
  clearBrowserData: () => ipcRenderer.invoke('clear-browser-data'),
  onOpenUrlInTab: (cb) => ipcRenderer.on('open-url-in-tab', (_e, url) => cb(url)),
});
