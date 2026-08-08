document.addEventListener(
  'click',
  (event) => {
    const theaterModeActive = Boolean(document.querySelector('ytd-watch-flexy[theater]'));
    if (shouldExitTheater(event.target, theaterModeActive)) {
      const toggleButton = document.querySelector('#movie_player .ytp-size-button');
      if (toggleButton) {
        const t0 = performance.now();
        const scrollY = window.scrollY;
        console.log('[theater-debug] click detected, scrollY=%d, t=%dms', scrollY, 0);
        const logScroll = () => {
          console.log('[theater-debug] scroll event, scrollY=%d, t=%dms', window.scrollY, Math.round(performance.now() - t0));
        };
        window.addEventListener('scroll', logScroll, { passive: true });
        setTimeout(() => {
          window.removeEventListener('scroll', logScroll);
          console.log('[theater-debug] done watching, final scrollY=%d, t=%dms', window.scrollY, Math.round(performance.now() - t0));
        }, 3000);
        setTimeout(() => {
          console.log('[theater-debug] clicking toggle, scrollY=%d, t=%dms', window.scrollY, Math.round(performance.now() - t0));
          toggleButton.click();
        }, 0);
      }
    }
  },
  true
);
