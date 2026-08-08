# YouTube Theater Mode Exit on Ask

A small Chrome extension: if you're watching YouTube in theater mode and
click the "Ask" (Gemini) button, the player switches to default (non-theater)
view before the Ask panel opens, and "Summarize the video" is selected for
you automatically.

## How it works

`content.js` watches for clicks on YouTube's "Ask" button. If the page is in
theater mode, it cancels that click, clicks YouTube's own theater/default
toggle button, waits 0.1s, then clicks the Ask button itself so YouTube's
real Ask panel opens into the default (non-theater) layout. Once the panel's
suggestion chips render, it clicks "Summarize the video" for you.

## Install (unpacked, for development/personal use)

1. Open `chrome://extensions`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select this folder.
4. Open any YouTube video, switch to theater mode, click "Ask" — it should
   switch to default view.

## Limitations

- Only matches `www.youtube.com` watch pages.
- Detects the "Ask" button by its `aria-label`, which YouTube localizes —
  only works on an English-language YouTube UI.
- Chrome/Chromium-based browsers only (Manifest V3).
