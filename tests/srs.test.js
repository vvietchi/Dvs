const test = require("node:test");
const assert = require("node:assert");
const SRS = require("../js/srs.js");

const NOW = Date.UTC(2026, 0, 1);

test("new card graded Good is due tomorrow", () => {
  const c = SRS.review(SRS.newCard(), 2, NOW);
  assert.strictEqual(c.interval, 1);
  assert.strictEqual(c.due, NOW + SRS.DAY);
  assert.strictEqual(c.reps, 1);
});

test("intervals grow with consecutive Good reviews", () => {
  let c = SRS.newCard();
  const intervals = [];
  for (let i = 0; i < 4; i++) {
    c = SRS.review(c, 2, NOW);
    intervals.push(c.interval);
  }
  assert.deepStrictEqual(intervals, [1, 4, 10, 25]);
  assert.ok(SRS.isLearned(c));
});

test("Again resets progress and lowers ease (floor 1.3)", () => {
  let c = { reps: 5, interval: 30, ease: 1.4, due: 0 };
  c = SRS.review(c, 0, NOW);
  assert.strictEqual(c.reps, 0);
  assert.strictEqual(c.interval, 0);
  assert.strictEqual(c.ease, 1.3);
  assert.ok(c.due > NOW && c.due < NOW + SRS.DAY);
});

test("isDue", () => {
  assert.ok(SRS.isDue(undefined, NOW));
  assert.ok(SRS.isDue({ due: NOW - 1 }, NOW));
  assert.ok(!SRS.isDue({ due: NOW + 1 }, NOW));
});

test("similarity ignores case and punctuation", () => {
  assert.strictEqual(SRS.similarity("Nice to meet you.", "nice to meet you"), 1);
  assert.ok(SRS.similarity("colleage", "colleague") > 0.8);
  assert.ok(SRS.similarity("apple", "deadline") < 0.5);
});
