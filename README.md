# JS Daily

A daily JavaScript coding challenge Chrome extension that replaces your new tab.

## Setup

### Prerequisites
- Node.js 18+
- npm

### Install & Build

```bash
npm install
npm run build
```

### Load in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `dist/` folder

Your new tab is now JS Daily.

## Development

```bash
npm run dev
```

Opens at `http://localhost:5173` for development. Note: `chrome.storage` is unavailable in the browser — the app falls back to `sessionStorage` automatically.

## How It Works

- **Daily challenge** is picked deterministically by hashing today's date mod 10 — same challenge for everyone on the same day.
- **Code runs in a sandboxed `<iframe>`** via `postMessage` — no `eval()` in the main thread.
- **Data persists in `chrome.storage.local`**: streak, solved IDs, and your code per challenge.
- **Solution tab** unlocks after you pass all test cases.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v3
- Monaco Editor
- Chrome Extension Manifest V3
