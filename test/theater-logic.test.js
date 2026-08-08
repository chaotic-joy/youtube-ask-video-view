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
