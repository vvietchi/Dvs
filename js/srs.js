/*
 * Spaced repetition (simplified SM-2).
 * Each card state: { reps, interval (days), ease, due (epoch ms) }
 * Grades: 0 = Again, 1 = Hard, 2 = Good, 3 = Easy
 */
(function (root) {
  const DAY = 24 * 60 * 60 * 1000;

  function newCard() {
    return { reps: 0, interval: 0, ease: 2.5, due: 0 };
  }

  function review(card, grade, now) {
    now = now ?? Date.now();
    const c = { ...newCard(), ...card };

    if (grade === 0) {
      c.reps = 0;
      c.interval = 0;
      c.ease = Math.max(1.3, c.ease - 0.2);
      c.due = now + 10 * 60 * 1000; // review again in 10 minutes
      return c;
    }

    if (c.reps === 0) c.interval = grade === 3 ? 3 : 1;
    else if (c.reps === 1) c.interval = grade === 3 ? 7 : grade === 1 ? 2 : 4;
    else {
      const factor = grade === 1 ? 1.2 : grade === 3 ? c.ease * 1.3 : c.ease;
      c.interval = Math.max(c.interval + 1, Math.round(c.interval * factor));
    }

    if (grade === 1) c.ease = Math.max(1.3, c.ease - 0.15);
    if (grade === 3) c.ease = c.ease + 0.15;

    c.reps += 1;
    c.due = now + c.interval * DAY;
    return c;
  }

  function isDue(card, now) {
    return !card || card.due <= (now ?? Date.now());
  }

  /** A word counts as "learned" once its interval reaches 4+ days. */
  function isLearned(card) {
    return !!card && card.interval >= 4;
  }

  /** Normalized similarity (0..1) between two strings, by Levenshtein distance. */
  function similarity(a, b) {
    const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
    a = norm(a);
    b = norm(b);
    if (!a && !b) return 1;
    const m = a.length, n = b.length;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return 1 - prev[n] / Math.max(m, n);
  }

  const api = { DAY, newCard, review, isDue, isLearned, similarity };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.SRS = api;
})(typeof window !== "undefined" ? window : globalThis);
