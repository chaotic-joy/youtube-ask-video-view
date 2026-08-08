document.addEventListener(
  'click',
  (event) => {
    const theaterModeActive = Boolean(document.querySelector('ytd-watch-flexy[theater]'));
    if (shouldExitTheater(event.target, theaterModeActive)) {
      const toggleButton = document.querySelector('#movie_player .ytp-size-button');
      if (toggleButton) {
        const scrollY = window.scrollY;
        const restoreScroll = () => window.scrollTo(0, scrollY);
        window.addEventListener('scroll', restoreScroll, { passive: true });
        setTimeout(() => window.removeEventListener('scroll', restoreScroll), 500);
        setTimeout(() => toggleButton.click(), 0);
      }
    }
  },
  true
);
