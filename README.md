# YouTube Theater Mode Exit on Ask

A small Chrome extension: if you're watching YouTube in theater mode and
click the "Ask" (Gemini) button, the player switches to default (non-theater)
view.

## How it works

A content script watches for clicks on YouTube's "Ask" button. If the page
is currently in theater mode (`ytd-watch-flexy[theater]` is present), it
clicks YouTube's own theater/default toggle button (`.ytp-size-button`) to
switch back to default view. No YouTube pages, video data, or click activity
are read, stored, or sent anywhere — the extension only ever reads whether
theater mode is on and clicks one existing button.

## Install (unpacked, for development/personal use)

1. Open `chrome://extensions`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select this folder.
4. Open any YouTube video, switch to theater mode, click "Ask" — it should
   switch to default view.

## Limitations

- Only matches `www.youtube.com` watch pages (not `m.youtube.com` or
  `music.youtube.com`).
- Detects the "Ask" button by its `aria-label`, which YouTube localizes —
  this only works on an English-language YouTube UI.
- Chrome/Chromium-based browsers only (Manifest V3).
- If nothing happens on click: open DevTools > Console for errors, and
  confirm the "Ask" button is present (it's a staged rollout feature not
  available to every account yet).

## Run tests

```bash
node test/theater-logic.test.js
```
