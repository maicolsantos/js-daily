# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server at localhost:5173 (chrome.storage unavailable, falls back to sessionStorage)
npm run build    # tsc type-check + vite build + copy manifest.json and icons to dist/
```

No test suite. Type-check only: `npx tsc --noEmit`.

To load in Chrome: `chrome://extensions` → Developer mode → Load unpacked → select `dist/`.

## Architecture

Chrome Extension MV3 — single-page React app replacing the new tab.

**Code execution pipeline** (`src/lib/`):
- `runner.ts` spawns a Web Worker from a blob URL, terminates it after 5s timeout
- `testRunner.ts` builds the worker script string: extracts user's function via `new Function(userCode + '\nreturn fnName;')()`, runs test cases, deep-compares results, posts back `{ type: 'results', results[] }` via `self.postMessage`
- Never `eval()` on the main thread

**Daily challenge selection** (`useChallenge.ts`): deterministic hash of `new Date().toDateString()` mod `challenges.length` — same challenge globally each day.

**Storage** (`useStorage.ts`): wraps `chrome.storage.local` with a sessionStorage fallback for dev. Schema: `{ streak, lastSolvedDate, solvedIds[], code: Record<challengeId, string> }`. Code auto-saves debounced 500ms.

**Solved-state logic** (`App.tsx`): `alreadySolvedOnLoad` ref captures whether the challenge was solved *before* this session. `justSolved` state tracks in-session solves. "Come back tomorrow" only shows if solved on a prior load — solving during a session keeps the editor visible with results.

**Compose challenge** uses sentinel strings `__COMPOSE_TEST_1__` / `__COMPOSE_TEST_2__` as test `input` because the test cases involve passing functions as arguments, which can't be JSON-serialized. The worker script special-cases these sentinels.

**PostCSS/Tailwind configs** use `.cjs` extension (`postcss.config.cjs`, `tailwind.config.cjs`) because `package.json` sets `"type": "module"`.
