document.addEventListener(
  'click',
  (event) => {
    const theaterModeActive = Boolean(document.querySelector('ytd-watch-flexy[theater]'));
    if (shouldExitTheater(event.target, theaterModeActive)) {
      const toggleButton = document.querySelector('#movie_player .ytp-size-button');
      if (toggleButton) {
        toggleButton.click();
      }
    }
  },
  true
);
