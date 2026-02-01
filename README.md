# Ritual Rei Jeová - Sovereign Glass PWA

> *"Rule your mind or it will rule you."* - Horace

This is a personal, **offline-first PWA (Progressive Web App)** designed to manage the **King's Ritual**: a high-performance daily routine focused on Spirituality, Physique, and Kingdom Building (Work).

## 👑 Overview

The app was designed with the **"Sovereign Glass"** aesthetic: a premium, dark design with glassmorphism effects and fluid animations, evoking sobriety and focus.

### Key Features

*   **Daily Rituals**:
    *   **Spiritual**: 30min Timer with checklist and execution logs.
    *   **Physical**: Workout Logger (Pushups, Squats, Core) with session timer.
    *   **Kingdom (Work)**: Deep Work Blocks and "Client Demands" management.
    *   **Night**: Day review and emotional delivery.
*   **Smart Timers**:
    *   Support for manual save (early finish).
    *   "Free Mode" to add extra focus blocks.
*   **Statistics (Dashboard)**:
    *   Daily progress visualization (Performance Ring).
    *   Detailed history of completed activities.
*   **The King's Voice (Local AI)**:
    *   Contextual messaging system (Stoic/Biblical) based on time of day and progress.
*   **Offline-First**:
    *   All data saved locally via **Dexie.js** (IndexedDB) and `localStorage`.
    *   Works without internet.

## 🛠 Tech Stack

*   **Core**: React 19 + Vite 6
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS 4 + Framer Motion (Animations)
*   **Database**: Dexie.js (IndexedDB Wrapper)
*   **PWA**: vite-plugin-pwa (Service Workers)
*   **Icons**: Lucide React

## 🚀 How to Use

### Local Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Access `http://localhost:5173`.

### Mobile Access (Local)

To test on mobile via Wi-Fi:
1.  Ensure you are on the same Wi-Fi network.
2.  Run with the host flag:
    ```bash
    npm run dev -- --host
    ```
3.  Access the IP shown in the terminal (e.g., `192.168.1.XX:5173`).

### Production Build

To generate the optimized version (which works 100% offline):
```bash
npm run build
```
Files will be in the `dist` folder.

## 📱 PWA Installation

1.  Open the app in your browser (Chrome/Safari).
2.  In the menu, select **"Add to Home Screen"**.
3.  The app will be installed as a native application on your device.

---

*"The sluggard craves and gets nothing, but the desires of the diligent are fully satisfied."* - Proverbs 13:4
