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
