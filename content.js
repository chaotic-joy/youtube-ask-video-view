document.addEventListener(
  'click',
  (event) => {
    const askButton = event.target.closest?.('button[aria-label="Ask"]');
    const theaterModeActive = Boolean(document.querySelector('ytd-watch-flexy[theater]'));
    if (!askButton || !theaterModeActive) {
      return;
    }

    const toggleButton = document.querySelector('#movie_player .ytp-size-button');
    if (!toggleButton) {
      return;
    }

    // 1. Toggle theater mode to default view.
    event.preventDefault();
    event.stopPropagation();
    toggleButton.click();

    // 2. Wait 0.1s, then 3. click the Ask button (re-queried in case the
    // DOM was rebuilt when theater mode exited).
    setTimeout(() => {
      document.querySelector('button[aria-label="Ask"]')?.click();
    }, 100);
  },
  true
);
