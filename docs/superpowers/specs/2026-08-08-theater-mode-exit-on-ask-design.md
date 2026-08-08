# YouTube Theater Mode Exit on Ask — Design

## Purpose

When watching YouTube in theater mode and clicking the "Ask" (Gemini) button,
switch the player back to default (non-theater) view. Theater mode's wide
layout crowds the Ask panel; default view gives it more room.

## Approach

A Manifest V3 Chrome extension with a single content script.

- The content script attaches one `click` listener to `document` in the
  capture phase (event delegation — works even though YouTube is a SPA that
  re-renders the player and controls without a full page load).
- On click, it checks whether the event target is (or is inside) the button
  with `aria-label="Ask"`.
- If so, it checks whether `ytd-watch-flexy[theater]` is present in the DOM
  (YouTube's own signal that theater mode is active).
- If theater mode is active, it clicks `.ytp-size-button` — YouTube's native
  theater/default toggle button in the player chrome — to switch to default
  view.

### Why click the native toggle button instead of simulating the `T` key

Both were considered. Clicking `.ytp-size-button` directly fires YouTube's
own registered click handlers deterministically, regardless of how YouTube's
key handler treats `isTrusted`. Simulating a `T` keydown event would likely
also work (YouTube doesn't appear to gate player shortcuts on event trust),
but that's an assumption about unverified internal behavior. The real-button
click has no such assumption and is the more reliable choice.

`.ytp-size-button` is YouTube's long-standing player-chrome class (stable
for years), unlike the Ask button's obfuscated `ytSpecButtonShapeNext...`
classes — so we deliberately depend on `aria-label="Ask"` (stable, semantic)
for detection and `.ytp-size-button` (stable, long-lived) for the toggle,
avoiding the churn-prone generated classes on both elements.

## Files

- `manifest.json` — MV3 manifest. One content script matching
  `https://www.youtube.com/*`. No permissions required.
- `content.js` — the click listener described above (~10 lines).

## Edge cases

- Ask button clicked while already in default view: no-op (the
  `ytd-watch-flexy[theater]` check is false, nothing happens).
- Ask button not present yet when the script loads: irrelevant — event
  delegation on `document` means the listener works for elements added
  later, no `MutationObserver` needed.

## Out of scope

- No popup UI, no options page, no toolbar icon behavior — the extension is
  purely a passive content script.
- No support for switching *into* theater mode or any other player state.
