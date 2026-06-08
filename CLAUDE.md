# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server at localhost:5173 (chrome.storage unavailable, falls back to sessionStorage)
npm run build    # tsc type-check + vite build + copy manifest.json and icons to dist/
npx tsc --noEmit # type-check only
```

No test suite. Type-check only: `npx tsc --noEmit`.

To load in Chrome: `chrome://extensions` → Developer mode → Load unpacked → select `dist/`.

## Architecture

Chrome Extension MV3 — single-page React app replacing the new tab.

**Layout** (`App.tsx`): two panels (ProblemPanel 40% / EditorPanel 60%) separated by a draggable divider. Min 20%, max 80% each. `leftPct` state drives inline `width` styles.

**Code execution pipeline** (`src/lib/`):
- `runner.ts` creates a hidden sandboxed `<iframe>` pointing to `sandbox.html`, posts `{ type: 'run', userCode, testCases }` via `postMessage('*')` (required — sandboxed pages have `null` origin), terminates after 5s timeout. Guards response with `e.source !== iframe.contentWindow`.
- `testRunner.ts` builds the script string injected into the sandbox: extracts user's function via regex + `new Function`, runs test cases, deep-compares results, posts back `{ type: 'results', results[] }`.
- Never `eval()` on the main thread.

**Keyboard shortcut**: `Cmd/Ctrl+Enter` triggers Run. Registered via `editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, ...)` in `onMount` so it works inside Monaco. Also registered on `window` for outside the editor. `handleRunRef` keeps the callback fresh without re-registering the Monaco command.

**Daily challenge selection** (`useChallenge.ts`): deterministic hash of `new Date().toDateString()` mod `challenges.length` — same challenge globally each day.

**Storage** (`useStorage.ts`): wraps `chrome.storage.local` with a sessionStorage fallback for dev. Schema: `{ streak, lastSolvedDate, solvedIds[], code: Record<challengeId, string> }`. Code auto-saves debounced 500ms. All write callbacks (`update`, `saveCode`, `markSolved`) read fresh data from storage before merging to avoid stale closure overwrites.

**Solved-state logic** (`App.tsx`): `alreadySolvedOnLoad` ref captures whether the challenge was solved *before* this session. `justSolved` state tracks in-session solves. "Come back tomorrow" only shows if solved on a prior load — solving during a session keeps the editor visible with results.

**Tabs**: Problem / Solution / Docs. Solution unlocks after solving. Docs is an `<a target="_self">` link to `https://devdocs.io/javascript/` — opens in same tab, not inside the app. Solution tab shows problem content (description, examples, constraints) when no solution is available.

**Compose challenge** uses sentinel strings `__COMPOSE_TEST_1__` / `__COMPOSE_TEST_2__` as test `input` because the test cases involve passing functions as arguments, which can't be JSON-serialized. The worker script special-cases these sentinels.

**PostCSS/Tailwind configs** use `.cjs` extension (`postcss.config.cjs`, `tailwind.config.cjs`) because `package.json` sets `"type": "module"`.

## CI

`.github/workflows/build.yml` — triggers on push to `main`, runs `npm ci && npm run build`, uploads `dist/` as artifact `js-daily-<sha>` (30-day retention). Requires PAT with `workflow` scope to push workflow file changes.
