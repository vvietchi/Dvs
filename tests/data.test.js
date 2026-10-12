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
