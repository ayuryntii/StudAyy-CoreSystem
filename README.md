# <p align="center">⚡ STUDAYY : CORE_SYSTEM_V2.5 ⚡</p>

<p align="center">
  <img src="https://img.shields.io/badge/VERSION-2.5.0-00ffff?style=for-the-badge&logo=probot&logoColor=00ffff" alt="Version">
  <img src="https://img.shields.io/badge/THEME-CYBER_HUD-ff00ff?style=for-the-badge&logo=visual-studio-code&logoColor=ff00ff" alt="Theme">
  <img src="https://img.shields.io/badge/SECURITY-LOCAL_SYNC-00ff00?style=for-the-badge&logo=esotericsoftware&logoColor=00ff00" alt="Security">
</p>

---

## 🇮🇩 Tentang Aplikasi (Indonesian)
*Web **studayy** adalah platform manajemen tugas dan materi belajar personal yang dibangun dengan estetika futuristik Cyberpunk/HUD. Berbeda dengan aplikasi manajemen tugas biasa, **studayy** memprioritaskan privasi penuh melalui teknologi **Local IndexedDB**—seluruh data Anda (tugas, catatan, hingga foto kamera) terenkripsi secara lokal di browser Anda, bukan di server cloud pihak ketiga.*

---

## 🌌 Project Overview
**Studayy** is a high-fidelity Single Page Application (SPA) designed for students who demand a professional, immersive, and secure environment to organize their academic life. It transforms mundane task management into a "System Operator" experience, featuring real-time system stats, a side-drawer HUD navigation, and specialized data modules.

### 🛠️ Core Modules

| Module | Protocol | Description |
| :--- | :--- | :--- |
| **DATA_VAULT** | `TASK_MANAGEMENT` | Advanced task tracking with category filtering and real-time status updates. |
| **ARCHIVE** | `KNOWLEDGE_BASE` | A dedicated terminal for logging lecture summaries and essential study materials. |
| **UPLINK** | `DATA_INPUT` | High-speed entry point for new tasks and materials with drag-and-drop support. |
| **CAMERA** | `IMAGE_OS` | Built-in HUD camera interface with natural color optimization and precise cropping tools. |
| **GALLERY** | `VISUAL_STORAGE` | A secure grid to browse all captured visual data packets. |

---

## 🚀 Key Features

- **🌐 Immersive HUD Interface**: A premium "System Core" aesthetic featuring glassmorphism, glowing accents, and dynamic scanline overlays.
- **📱 Responsive Terminal**: Fully optimized for mobile terminals and high-resolution desktop stations with a seamless side-drawer navigation.
- **🔐 Zero-Server Privacy**: Your data belongs to you. No logins, no cloud tracking, just pure localized storage via **LocalForage**.
- **📸 Integrated Image Processing**: Capture materials via camera and refine them using the integrated **Cropper.js** engine without leaving the HUD.
- **⚡ High-Performance SPA**: Blazing fast route transitions using vanilla JavaScript—no heavy frameworks required.

---

## 🏗️ Technical Architecture

### Tech Stack
- **Engine**: Vanilla JavaScript (ES6+)
- **Styling**: Advanced CSS3 (CSS Variables, Flexbox/Grid, Backdrop-filters)
- **Data Persistence**: IndexedDB via `localforage.js`
- **Optics**: `cropper.js` for image manipulation
- **Icons**: Font Awesome 6.4 (Pro Aesthetic)

### System Core Details
- **Architecture**: Single Page Application (SPA)
- **Encryption**: Local-Side Data Scoping
- **Uptime Logic**: Real-time session counter (Live HUD Uptime)

---

## 🛠️ Setup & Deployment

### Local Execution
1. Clone this repository or download the source terminal.
2. Run a local server (e.g., Live Server in VS Code).
3. Access the HUD via `http://localhost:5500`.

### Cloud Deployment (Netlify)
1. Push this project to your GitHub repository.
2. Connect your GitHub to **Netlify**.
3. Deploy for 24/7 global access through your own `.netlify.app` terminal.

---

<p align="center">
  <i>"Architecting scalable digital workflows for the modern student."</i><br>
  <b>[ SYSTEM_STATUS: STABLE ]</b>
</p>
