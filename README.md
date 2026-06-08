# JS Daily

A daily JavaScript coding challenge Chrome extension that replaces your new tab.

## Download

Latest build is generated automatically on every push to `main`.

1. Go to [Actions](https://github.com/maicolsantos/js-daily/actions/workflows/build.yml)
2. Click the most recent run
3. Download the artifact `js-daily-<sha>` under **Artifacts**
4. Unzip and [load unpacked](#load-in-chrome) in Chrome

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

- **Daily challenge** is picked deterministically by hashing today's date — same challenge for everyone on the same day.
- **Code runs in a sandboxed `<iframe>`** via `postMessage` — no `eval()` in the main thread.
- **Data persists in `chrome.storage.local`**: streak, solved IDs, and your code per challenge.
- **Solution tab** unlocks after you pass all test cases. Shows the problem description when no solution is available yet.
- **Docs tab** opens [devdocs.io/javascript](https://devdocs.io/javascript/) in the same tab.
- **Resizable panels** — drag the divider between problem and editor (min 20%, max 80%).
- **Keyboard shortcut** — `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows/Linux) runs your code.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v3
- Monaco Editor
- Chrome Extension Manifest V3
