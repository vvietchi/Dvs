const test = require("node:test");
const assert = require("node:assert");
require("../js/data.js");
require("../js/data-toeic.js");
const { TOPICS, GRAMMAR } = globalThis.CONTENT;
const words = TOPICS.flatMap((t) => t.words);

test("every word has english, ipa, vietnamese and an example", () => {
  for (const w of words) {
    assert.strictEqual(w.length, 4, JSON.stringify(w));
    assert.ok(w.every((f) => typeof f === "string" && f.trim()), JSON.stringify(w));
    assert.match(w[1], /^\/.+\/$/, `IPA for ${w[0]}`);
  }
});

test("no duplicate words or topic ids", () => {
  const en = words.map((w) => w[0].toLowerCase());
  assert.deepStrictEqual(en.filter((e, i) => en.indexOf(e) !== i), []);
  const ids = TOPICS.map((t) => t.id);
  assert.strictEqual(new Set(ids).size, ids.length);
});

test("TOEIC examples contain the headword (needed for fill-in-the-blank)", () => {
  const toeic = TOPICS.filter((t) => t.group === "TOEIC");
  assert.ok(toeic.length >= 10);
  for (const t of toeic) for (const [en, , , ex] of t.words) {
    assert.match(ex, new RegExp("\\b" + en + "\\b", "i"), `${t.id}: "${en}" not in "${ex}"`);
  }
});

test("grammar answers point at a valid option", () => {
  for (const g of GRAMMAR) for (const [q, opts, ans] of g.quiz) assert.ok(opts[ans], q);
});

require("../js/data-toeic-listening.js");
const { PART1, PART2 } = globalThis.CONTENT.TOEIC_LISTENING;

test("TOEIC Part 1 items have a scene, 4 options and a valid answer", () => {
  assert.ok(PART1.length >= 10);
  for (const q of PART1) {
    assert.ok(q.scene && q.vi && q.note);
    assert.strictEqual(q.options.length, 4);
    assert.ok(Number.isInteger(q.answer) && q.options[q.answer], q.options[0]);
  }
});

test("TOEIC Part 2 items have a question, 3 options and a valid answer", () => {
  assert.ok(PART2.length >= 20);
  for (const q of PART2) {
    assert.ok(q.q && q.vi && q.note);
    assert.strictEqual(q.options.length, 3, q.q);
    assert.ok(Number.isInteger(q.answer) && q.options[q.answer], q.q);
  }
});

test("TOEIC answer positions are spread out (no letter dominates)", () => {
  for (const [name, set, n] of [["Part 1", PART1, 4], ["Part 2", PART2, 3]]) {
    const counts = Array(n).fill(0);
    set.forEach((q) => counts[q.answer]++);
    assert.ok(Math.max(...counts) <= set.length / 2, `${name}: ${counts}`);
  }
});
