# Theater Mode Exit on Ask Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Chrome extension that switches YouTube out of theater mode into default view whenever the "Ask" (Gemini) button is clicked, and publish it to a new GitHub repo.

**Architecture:** Manifest V3 extension, two plain (non-module) scripts loaded as a content script pair on `youtube.com/watch*` pages: `theater-logic.js` holds one pure, unit-testable decision function; `content.js` wires a single delegated `click` listener on `document` to that function and performs the DOM action (click YouTube's native `.ytp-size-button` toggle). No build step, no bundler, no dependencies.

**Tech Stack:** Vanilla JavaScript, Chrome Extension Manifest V3, Node's built-in `assert` module for the one unit test (no test framework).

## Global Constraints

- No external npm dependencies — plain JS only (per design spec).
- No build step — files load directly as browser content scripts.
- No extension permissions beyond the content script match pattern (per design spec).
- Content script matches `https://www.youtube.com/*` only.

---

### Task 1: Core toggle-decision logic + test

**Files:**
- Create: `theater-logic.js`
- Create: `test/theater-logic.test.js`

**Interfaces:**
- Produces: `shouldExitTheater(clickTarget, theaterModeActive)` — a function taking a DOM-like element (anything with an optional `.closest(selector)` method, or `null`/`undefined`) and a boolean, returning a boolean. Exported via `module.exports` when `typeof module !== 'undefined'` (so it works unmodified as a plain browser script AND via Node `require` in the test), and also assigned as a `var` in the global/script scope for `content.js` to consume directly in the browser (no `require`/`import` there).

- [ ] **Step 1: Write the failing test**

Create `test/theater-logic.test.js`:

```js
const assert = require('node:assert');
const { shouldExitTheater } = require('../theater-logic.js');

function fakeElement({ matchesAsk }) {
  return {
    closest(selector) {
      if (selector === 'button[aria-label="Ask"]' && matchesAsk) {
        return this;
      }
      return null;
    },
  };
}

// Click is on the Ask button, theater mode is on -> should exit theater mode.
assert.strictEqual(
  shouldExitTheater(fakeElement({ matchesAsk: true }), true),
  true,
  'Ask button click while in theater mode should return true'
);

// Click is on the Ask button, theater mode is off -> nothing to do.
assert.strictEqual(
  shouldExitTheater(fakeElement({ matchesAsk: true }), false),
  false,
  'Ask button click while already in default view should return false'
);

// Click is on an unrelated element, theater mode is on -> not our button.
assert.strictEqual(
  shouldExitTheater(fakeElement({ matchesAsk: false }), true),
  false,
  'Click on unrelated element should return false'
);

// Click target is null (defensive) -> should not throw, returns false.
assert.strictEqual(
  shouldExitTheater(null, true),
  false,
  'Null click target should return false'
);

console.log('All theater-logic tests passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node test/theater-logic.test.js`
Expected: `Error: Cannot find module '../theater-logic.js'` (file doesn't exist yet).

- [ ] **Step 3: Write minimal implementation**

Create `theater-logic.js`:

```js
function shouldExitTheater(clickTarget, theaterModeActive) {
  if (!clickTarget || typeof clickTarget.closest !== 'function') {
    return false;
  }
  const askButton = clickTarget.closest('button[aria-label="Ask"]');
  return Boolean(askButton) && theaterModeActive === true;
}

if (typeof module !== 'undefined') {
  module.exports = { shouldExitTheater };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node test/theater-logic.test.js`
Expected output: `All theater-logic tests passed.`

- [ ] **Step 5: Commit**

```bash
git add theater-logic.js test/theater-logic.test.js
git commit -m "Add theater-mode toggle decision logic with tests"
```

---

### Task 2: Extension wiring, manifest, and manual verification

**Files:**
- Create: `content.js`
- Create: `manifest.json`
- Create: `README.md`

**Interfaces:**
- Consumes: `shouldExitTheater(clickTarget, theaterModeActive)` from Task 1's `theater-logic.js` (loaded as a preceding plain script in the same content-script world, so it's available as a bare global function call — no `require`/`import`).

- [ ] **Step 1: Write content.js**

Create `content.js`:

```js
document.addEventListener(
  'click',
  (event) => {
    const theaterModeActive = Boolean(document.querySelector('ytd-watch-flexy[theater]'));
    if (shouldExitTheater(event.target, theaterModeActive)) {
      const toggleButton = document.querySelector('.ytp-size-button');
      if (toggleButton) {
        toggleButton.click();
      }
    }
  },
  true
);
```

- [ ] **Step 2: Write manifest.json**

Create `manifest.json`:

```json
{
  "manifest_version": 3,
  "name": "YouTube Theater Mode Exit on Ask",
  "version": "1.0.0",
  "description": "Switches YouTube out of theater mode into default view when you click the Ask button.",
  "content_scripts": [
    {
      "matches": ["https://www.youtube.com/*"],
      "js": ["theater-logic.js", "content.js"],
      "run_at": "document_start"
    }
  ]
}
```

- [ ] **Step 3: Write README.md**

Create `README.md`:

```markdown
# YouTube Theater Mode Exit on Ask

A small Chrome extension: if you're watching YouTube in theater mode and
click the "Ask" (Gemini) button, the player switches to default (non-theater)
view.

## Install (unpacked, for development/personal use)

1. Open `chrome://extensions`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select this folder.
4. Open any YouTube video, switch to theater mode, click "Ask" — it should
   switch to default view.

## Run tests

```bash
node test/theater-logic.test.js
```
```

- [ ] **Step 4: Run the unit test again to confirm nothing broke**

Run: `node test/theater-logic.test.js`
Expected output: `All theater-logic tests passed.`

- [ ] **Step 5: Manual smoke test in Chrome**

1. Load the extension unpacked per the README steps above.
2. Open a YouTube video (`https://www.youtube.com/watch?v=...`).
3. Click the theater-mode toggle (the `[ ]` icon in the player controls, or press `T`) to enter theater mode.
4. Click the "Ask" button.
5. Confirm: the player switches to default (non-theater) view.
6. Repeat while already in default view — confirm clicking "Ask" does nothing extra (no error in the DevTools console).

Expected: step 5 switches view; step 6 is a no-op with no console errors.

- [ ] **Step 6: Commit**

```bash
git add content.js manifest.json README.md
git commit -m "Add extension manifest, content script wiring, and README"
```

---

### Task 3: Create GitHub repo and push

**Files:** none (repo-level operation only)

**Interfaces:** none

- [ ] **Step 1: Confirm repo name and visibility with the user**

Ask the user (in chat, not silently): confirm the GitHub repo name (default suggestion: `youtube-ask-video-view`, matching the local directory) and whether it should be public or private. Creating a repo and pushing code publishes it — do not run the next step without an explicit answer.

- [ ] **Step 2: Create the repo and push**

```bash
gh repo create <confirmed-name> --<public-or-private> --source=. --remote=origin --push
```

Expected: command prints the new repo URL; `git remote -v` shows `origin` pointing at it; `git log` on GitHub matches local history (2-3 commits from Tasks 1 and 2, plus this repo-creation isn't itself a commit).

- [ ] **Step 3: Verify**

Run: `gh repo view <confirmed-name> --web` (or just report the URL to the user) to confirm the push succeeded and files are visible on GitHub.
