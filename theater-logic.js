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
