<div align="center">

<img src="assets/lucent_horizontal_logo.png" alt="Lucent Browser" width="520" style="border-radius: 14px; margin-bottom: 20px; box-shadow: 0 16px 40px rgba(0,0,0,0.4);" />

# Lucent Browser (v1.1.1)

### *Ultra-minimalist, floating Liquid Glass HUD browser for Windows, macOS & Linux.*
**Universal floating search capsule and full-featured desktop web browser in one sleek, modern translucent interface.**

[![Version](https://img.shields.io/badge/version-1.1.1-00f0ff?style=for-the-badge)](https://github.com/BBencht/Lucent-Browser/releases)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue?style=for-the-badge)](https://github.com/BBencht/Lucent-Browser)
[![License](https://img.shields.io/badge/license-MIT-0984e3?style=for-the-badge)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-44.4.3-47a248?style=for-the-badge&logo=electron&logoColor=white)](https://electronjs.org)

</div>

---

## 🌟 What is Lucent Browser?

**Lucent Browser** is a next-generation, distraction-free desktop web browser designed from the ground up for **Windows**, **macOS**, and **Linux**. It reimagines everyday web browsing by merging the instantaneous convenience of a floating command capsule with an ultra-modern translucent Liquid Glass interface.

With a single global keystroke (**`Alt + Space`** on Windows/Linux or **`⌥ + Space`** on macOS), Lucent floats into view from the center of your screen as a sleek glass capsule. Type a query or web address, and the capsule smoothly expands into a high-performance floating glass browser — or seamlessly glides into full-screen mode for immersive deep work. When you're done, tap `Escape` or dismiss it, and it pulls up, contracts into a glowing liquid orb, and dissolves gracefully back into your desktop.

---

## ✨ Key Features

- **Modern Liquid Glass & Acrylic Aesthetics:**  
  Engineered with multi-layered `backdrop-filter` blur, chromatic diffusion, specular edge highlights, and deep glassmorphic refractions that feel right at home on modern desktop interfaces (Windows Acrylic & Mica, macOS Liquid Glass, and Linux desktop environments).
- **Fluid Morphing Physics:**  
  Lucent does not simply pop onto your screen. It emerges as a glowing frosted glass circle, stretches horizontally into the floating search capsule with spring physics, and unrolls into the browser workspace.
- **Floating & Fullscreen Modes:**  
  Toggle between a focused floating glass window and an immersive distraction-free fullscreen canvas with a single key (`F11` on Windows/Linux or `⌃⌘F` on macOS).
- **Universal Search Omnibox with Live Suggestions:**  
  Instant search autocompletion, fuzzy browsing history search, and one-click search engine switching across **Google, DuckDuckGo, Bing, Brave, and Ecosia**.
- **Multi-Tab Architecture & Isolated Incognito Partitions:**  
  Seamless tab management with standard keyboard shortcuts (`Ctrl+T` / `⌘T`, `Ctrl+W` / `⌘W`, `Ctrl+1-9` / `⌘1-9`). Private tabs run in isolated memory partitions that automatically purge all cache, storage, and cookies upon closure.
- **Stealth Security & Anti-Detection Engine:**  
  Automatic filtering of third-party telemetry, ad trackers, and analytic beacons, paired with contextual User-Agent masking to bypass embedded Chromium webview blocks.
- **Precision Touchpad & Gesture Navigation:**  
  Natural two-finger horizontal swipe navigation on Windows precision touchpads and Mac trackpads for fluid back and forward history navigation.
- **Customizable Shortcuts & Glass Themes:**  
  Configure your global summon hotkey, in-app navigation shortcuts, and choose between 5 glass themes (Deep Obsidian Frost, Apple Liquid Glass, Apple VisionOS Crystal, Midnight Neon Aurora, Pure OLED Minimal) through the built-in visual settings panel.

---

## 📥 Download & Install

Pre-built, standalone application packages for **Windows**, **macOS**, and **Linux** are available directly on the **[Releases Page](https://github.com/BBencht/Lucent-Browser/releases)**:

| Platform | Architecture | Package Format | Download |
| :--- | :--- | :--- | :--- |
| **Windows** | 64-bit (Windows 10+) | Setup Installer | [**Installer (.exe)**](https://github.com/BBencht/Lucent-Browser/releases/download/v1.1.1/Lucent-Browser-Setup-1.1.1.exe) |
| **Windows** | 64-bit (Windows 10+) | Portable Archive | [**Portable (.zip)**](https://github.com/BBencht/Lucent-Browser/releases/download/v1.1.1/Lucent-Browser-1.1.1-win.zip) |
| **macOS** | Apple Silicon | Disk Image | [**Apple Silicon (.dmg)**](https://github.com/BBencht/Lucent-Browser/releases/download/v1.1.1/Lucent-Browser-1.1.1-arm64.dmg) |
| **macOS** | Intel | Disk Image | [**Intel (.dmg)**](https://github.com/BBencht/Lucent-Browser/releases/download/v1.1.1/Lucent-Browser-1.1.1.dmg) |
| **Linux** | x86_64 | Standalone Package | [**AppImage (.AppImage)**](https://github.com/BBencht/Lucent-Browser/releases/download/v1.1.1/Lucent-Browser-1.1.1.AppImage) |
| **Linux** | x86_64 | Compressed Tarball | [**Tarball (.tar.gz)**](https://github.com/BBencht/Lucent-Browser/releases/download/v1.1.1/lucent-browser-1.1.1.tar.gz) |

> **Tip for macOS users:** You can also install and launch directly from Terminal with:  
> `curl -fsSL https://raw.githubusercontent.com/BBencht/Lucent-Browser/main/install.sh | bash`

---

## 🛡️ First-Time Launch & Security Guide

Because Lucent Browser is an independent open-source project without expensive corporate code-signing certificates, your operating system may display a standard security notice upon first launch. Here is how to open it in seconds:

### Windows (SmartScreen)
1. When opening the installer or `.exe`, Windows Defender SmartScreen may display a protection dialog.
2. Click **"More info"** under the warning text.
3. Click the **"Run anyway"** button.
4. The application will start immediately.

### macOS (Gatekeeper)
Gatekeeper flags unsigned downloaded applications by default. Choose whichever option is easiest:
* **Terminal (Fastest — 2 seconds):** After dragging `Lucent Browser.app` to `/Applications`, run:
  ```bash
  xattr -cr "/Applications/Lucent Browser.app"
  ```
* **System Settings:** Double-click the app $\rightarrow$ click **Cancel** on the alert $\rightarrow$ open **System Settings** $\rightarrow$ **Privacy & Security** $\rightarrow$ scroll to **Security** $\rightarrow$ click **"Open Anyway"**.
* **Finder Right-Click:** Right-click (or `Control`-click) on **`Lucent Browser.app`** in your Applications folder $\rightarrow$ choose **Open** from the menu $\rightarrow$ click **Open** on the prompt.

### Linux (.AppImage)
1. Mark the downloaded `.AppImage` file as executable:
   ```bash
   chmod +x Lucent-Browser-*.AppImage
   ./Lucent-Browser-*.AppImage
   ```
2. Or right-click the `.AppImage` $\rightarrow$ **Properties** $\rightarrow$ **Permissions** $\rightarrow$ check **"Allow executing file as program"**.

---

## ⌨️ Keyboard Shortcuts Reference

| Windows / Linux | macOS | Action |
| :--- | :--- | :--- |
| **`Alt + Space`** | **`⌥ + Space`** | **Summon / Dismiss Lucent from anywhere (Global Hotkey)** |
| **`Ctrl + T`** | **`⌘ + T`** | Open New Tab (via Search Capsule) |
| **`Ctrl + Shift + N`** | **`⌘ + Shift + N`** | Open New Private / Incognito Tab |
| **`Ctrl + W`** | **`⌘ + W`** | Close Active Tab |
| **`Ctrl + Shift + T`** | **`⌘ + Shift + T`** | Reopen Recently Closed Tab |
| **`Ctrl + L`** | **`⌘ + L`** | Focus Search / URL Address Bar |
| **`Ctrl + 1` ... `Ctrl + 9`** | **`⌘ + 1` ... `⌘ + 9`** | Switch directly to Tab 1 through 9 |
| **`F11`** | **`⌃ + ⌘ + F`** | Toggle Fullscreen Mode |
| **`Alt + Left`** / **`Alt + Right`** | **`⌘ + [`** / **`⌘ + ]`** | Navigate Back / Forward in History |
| **`Ctrl + R`** or **`F5`** | **`⌘ + R`** | Reload Current Web Page |
| **`Escape`** | **`Escape`** | Dismiss Search Results / Close Settings / Exit Fullscreen |

---

## 🆕 What's New in v1.1.1

- 🎯 **Floating Capsule Settings Positioning & Alignment Fix:** Fixed an issue where opening Settings from the capsule search bar pushed the settings panel down to the bottom half of the screen. When opened from Search mode, the capsule smoothly expands into a dedicated, draggable, beautifully aligned Settings window with full visibility of all theme cards, engine options, and shortcuts without vertical displacement.
- 🛡️ **Frosted Glass Backing & Readability:** High-opacity frosted acrylic backing across all themes ensures zero background bleed-through from desktop windows or wallpaper.
- 🎨 **Universal Glass Themes:** High-contrast light and dark themes with crisp card borders, dark text, and crystal glass accents.
- 🌐 **Full English UI Localization:** Search bar, settings dialogs, shortcut configurator, navigation tooltips, contextual history popups, and notification toasts localized to English.

---

## 🚀 Development & Build from Source

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `yarn`

### 1. Clone the repository
```bash
git clone https://github.com/BBencht/Lucent-Browser.git
cd Lucent-Browser
```

### 2. Install dependencies
```bash
npm install
```

### 3. Launch Lucent Browser
```bash
npm start
```

Press **`Alt + Space`** (or **`⌥ + Space`**) to toggle the browser!

---

## 📦 Building Standalone Binaries

Lucent is pre-configured with `electron-builder` to package standalone executable applications for all major desktop platforms:

- **Windows (.exe installer & .zip portable):**
  ```bash
  npm run dist:win
  ```
- **macOS (.dmg installer & .zip):**
  ```bash
  npm run dist:mac
  ```
- **Linux (.AppImage & .tar.gz):**
  ```bash
  npm run dist:linux
  ```

Packaged distribution bundles will be generated in the `dist/` directory.

---

## 🛠️ Architecture & Under the Hood

- **Core Engine:** [Electron](https://www.electronjs.org/) + Chromium
- **User Interface:** Vanilla JavaScript (ES6+), GPU-accelerated CSS transforms, CSS backdrop filtering
- **Content Isolation:** Electron `<webview>` tags running in partitioned sessions with strict `contextIsolation` and disabled node integration for bulletproof security
- **Cross-Platform:** Windows (64-bit), macOS (Apple Silicon & Intel), Linux (all major distributions)

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete details.

---

<div align="center">
  <sub>Crafted with passion by <b>Bence Bodori</b> • 2026</sub>
</div>
