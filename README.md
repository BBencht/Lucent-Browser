<div align="center">

<img src="assets/lucent_horizontal_logo.png" alt="Lucent Browser" width="480" style="border-radius: 12px; margin-bottom: 16px;" />

# Lucent Browser (v1.0.0)

### *Ultra-minimalist, floating Liquid Glass Spotlight browser.*
**macOS Sequoia & visionOS esztétika • Villámgyors lebegő kereső és teljes értékű böngésző egyben**

[![Version](https://img.shields.io/badge/version-1.0.0-00f0ff?style=for-the-badge)](https://github.com/BBencht/Lucent-Browser/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=for-the-badge)](https://github.com/BBencht/Lucent-Browser)
[![License](https://img.shields.io/badge/license-MIT-0984e3?style=for-the-badge)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-44.4.3-47a248?style=for-the-badge&logo=electron&logoColor=white)](https://electronjs.org)

</div>

---

## 🌟 Mi az a Lucent Browser? / What is Lucent?

A **Lucent Browser** egy új generációs, figyelemelterelés-mentes webböngésző, amely a macOS Spotlight gyorsaságát és a legmodernebb *Liquid Glass* (folyékony üveg) felületet ötvözi.

Egyetlen gyorsbillentyűvel (`Alt + Szóköz` vagy `⌥ + Space`) bármikor felugrik a képernyő közepén egy lebegő, áttetsző üvegkapszulaként. Beírod a keresést vagy az URL-t, és a kapszula zökkenőmentesen kinyílik egy teljes funkcionalitású, lebegő vagy akár natív teljes képernyős böngészővé. Ha végeztél, egy gombnyomással visszaugrik a kapszulába és elenyészik.

---

## ✨ Főbb funkciók / Key Features

- 🫧 **Valódi Liquid Glass felület (visionOS & macOS Sequoia):**  
  Többrétegű `backdrop-filter` elmosás, prizmatikus él-csillanás, fényes üvegtükröződés és sötét, elegáns prémium megjelenés.
- 🪄 **Folyékony átmenetek és rugalmas animációk:**  
  A böngésző nem csak hirtelen megjelenik: kis folyékony üveggömbből nyúlik ki kapszulává, majd abból terül szét böngészővé, bezáráskor pedig látványosan visszahúzódik és elenyészik.
- 🖥️ **Valódi natív macOS Teljes Képernyő (Dedicated Space):**  
  Támogatja a valódi macOS Space-eket (`⌃⌘F` vagy `F11`): a menüsor és a Dock elcsúszik, zavartalan immerszív böngészést biztosítva. Kilépéskor azonnal visszavált a kompakt lebegő üvegablakba.
- 🔍 **Spotlight Omnibox & Élő javaslatok:**  
  Valós idejű Google keresési javaslatok, intelligens előzmény-kiegészítés és több keresőmotor közvetlen támogatása (Google, DuckDuckGo, Bing, Brave, Ecosia).
- 📑 **Lapkezelés & Inkognitó mód:**  
  Többlapos böngészés, privát / inkognitó fülek teljesen izolált munkamenettel, melyek bezáráskor automatikusan törlik a gyorsítótárat és sütiket.
- 🛡️ **Beépített lopakodó védelem (Stealth & Anti-Detection):**  
  - Harmadik féltől származó reklám- és telemetria-követők automatikus szűrése.
  - Speciális User-Agent maszkolás, amely a Google bejelentkezési oldalakon modern Firefox identitást használ, így kiküszöböli a Google beágyazott böngészőkre vonatkozó tiltását!
- 👆 **Trackpad gesztusvezérlés:**  
  Kétujjas vízszintes csúsztatással (swipe) azonnali visszalépés vagy előrelépés az előzményekben.
- ⚙️ **Testreszabható gyorsbillentyűk és témák:**  
  Minden fontos billentyűkombináció (köztük a globális felugró hotkey) és a színvilág egy kattintással személyre szabható a beépített beállítások panelen.

---

## ⌨️ Gyorsbillentyűk / Keyboard Shortcuts

| Billentyű | Művelet / Action |
| :--- | :--- |
| **`Alt + Space`** *(vagy `⌥ + Space`)* | **Lucent megnyitása / elrejtése bárhonnan (Globális)** |
| **`⌘ + T`** / `Ctrl + T` | Új fül nyitása (Spotlight keresőn keresztül) |
| **`⌘ + Shift + N`** / `Ctrl + Shift + N` | Új inkognitó (privát) fül |
| **`⌘ + W`** / `Ctrl + W` | Aktív fül bezárása |
| **`⌘ + Shift + T`** / `Ctrl + Shift + T` | Legutóbb bezárt fül újranyitása |
| **`⌘ + L`** / `Ctrl + L` | Kereső / URL sáv kijelölése |
| **`⌘ + 1` ... `⌘ + 9`** | Váltás a fülek között |
| **`⌃ + ⌘ + F`** vagy **`F11`** | Valódi macOS teljes képernyő ki/be |
| **`⌘ + [`** / **`⌘ + ]`** | Vissza / Előre az előzményekben |
| **`⌘ + R`** | Oldal újratöltése |
| **`Esc`** | Teljes képernyő elhagyása / Keresés megszakítása |

---

## 🚀 Telepítés és Futtatás / Installation & Quick Start

### Előfeltételek:
- [Node.js](https://nodejs.org/) (v18 vagy újabb ajánlott)
- `npm` vagy `yarn`

### 1. Klónozd a tárolót:
```bash
git clone https://github.com/BBencht/Lucent-Browser.git
cd Lucent-Browser
```

### 2. Telepítsd a függőségeket:
```bash
npm install
```

### 3. Indítsd el a böngészőt:
```bash
npm start
```

---

## 📦 Futtatható alkalmazás fordítása / Building Binaries

Ha szeretnél telepítőcsomagot készíteni:

- **macOS (.app / .zip):**
  ```bash
  npm run dist:mac
  ```
- **Windows (.zip):**
  ```bash
  npm run dist:win
  ```
- **Linux (AppImage / .tar.gz):**
  ```bash
  npm run dist:linux
  ```

A kész binárisok a `dist/` mappában fognak megjelenni.

---

## 🛠️ Technikai felépítés / Architecture

- **Keretrendszer:** [Electron](https://www.electronjs.org/) + Chromium
- **Frontend:** Pure Modern Vanilla JS (ES6+), High-performance Web Components, CSS Houdini & GPU-accelerated transforms
- **Web tartalom izoláció:** Electron `<webview>` tag szeparált session partíciókkal és `contextIsolation`-nel
- **Platformok:** macOS (Apple Silicon & Intel), Windows 10/11, Linux

---

## 📄 Licenc / License

Ez a projekt a **MIT Licenc** alatt érhető el. Lásd a [LICENSE](LICENSE) fájlt a részletekért.

---

<div align="center">
  <sub>Készítette: <b>Bence Bodori</b> • 2026</sub>
</div>
