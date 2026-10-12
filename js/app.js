(function () {
  const { TOPICS, GRAMMAR, SENTENCES } = window.CONTENT;
  const STORE_KEY = "english-daily-v1";
  const NEW_PER_SESSION = 10;
  const app = document.getElementById("app");

  /* ---------- Data helpers ---------- */
  const ALL_WORDS = TOPICS.flatMap((t) =>
    t.words.map(([en, ipa, vi, ex]) => ({ en, ipa, vi, ex, topic: t.id }))
  );
  const topicWords = (id) => (id ? ALL_WORDS.filter((w) => w.topic === id) : ALL_WORDS);
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const today = () => new Date().toLocaleDateString("sv"); // YYYY-MM-DD in local time

  /* ---------- Persistent state ---------- */
  function load() {
    try {
      return { cards: {}, xp: 0, streak: { count: 0, last: null }, grammar: {}, ...JSON.parse(localStorage.getItem(STORE_KEY)) };
    } catch {
      return { cards: {}, xp: 0, streak: { count: 0, last: null }, grammar: {} };
    }
  }
  const state = load();
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
    renderStats();
  }
  function addXp(n) {
    state.xp += n;
    const t = today();
    if (state.streak.last !== t) {
      const yesterday = new Date(Date.now() - SRS.DAY).toLocaleDateString("sv");
      state.streak.count = state.streak.last === yesterday ? state.streak.count + 1 : 1;
      state.streak.last = t;
    }
    save();
  }
  const learnedCount = (words) => words.filter((w) => SRS.isLearned(state.cards[w.en])).length;
  const dueCount = (words) => words.filter((w) => state.cards[w.en] && SRS.isDue(state.cards[w.en])).length;

  function renderStats() {
    const streakAlive = state.streak.last === today() ||
      state.streak.last === new Date(Date.now() - SRS.DAY).toLocaleDateString("sv");
    document.getElementById("stats").innerHTML = `
      <span title="Chuỗi ngày học">🔥 ${streakAlive ? state.streak.count : 0}</span>
      <span title="Điểm kinh nghiệm">⭐ ${state.xp} XP</span>
      <span title="Từ đã thuộc">📚 ${learnedCount(ALL_WORDS)}/${ALL_WORDS.length}</span>`;
  }

  /* ---------- Speech ---------- */
  function speak(text, rate = 0.9) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = rate;
    const voice = speechSynthesis.getVoices().find((v) => v.lang.startsWith("en"));
    if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  }
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  /* ---------- Views ---------- */
  function topicCards(hrefBase) {
    return TOPICS.map((t) => {
      const words = topicWords(t.id);
      const pct = Math.round((learnedCount(words) / words.length) * 100);
      return `<button class="topic" data-href="${hrefBase}/${t.id}">
        <div class="icon">${t.icon}</div>
        <div class="name">${t.name}</div>
        <div class="meta">${words.length} từ · đã thuộc ${learnedCount(words)} · đến hạn ${dueCount(words)}</div>
        <div class="bar"><span style="width:${pct}%"></span></div>
      </button>`;
    }).join("");
  }
  function bindHrefs() {
    app.querySelectorAll("[data-href]").forEach((el) =>
      el.addEventListener("click", () => (location.hash = el.dataset.href))
    );
  }

  function viewHome() {
    const due = dueCount(ALL_WORDS);
    const grammarDone = Object.keys(state.grammar).length;
    app.innerHTML = `
      <h1>Chào bạn 👋</h1>
      <p class="sub">Mỗi ngày 15 phút: ôn thẻ từ đến hạn, học 10 từ mới, luyện nghe – nói một chút.</p>
      <div class="grid">
        <div class="card kpi"><div class="num">${due}</div><div class="label">Từ cần ôn hôm nay</div></div>
        <div class="card kpi"><div class="num">${learnedCount(ALL_WORDS)}</div><div class="label">Từ đã thuộc / ${ALL_WORDS.length}</div></div>
        <div class="card kpi"><div class="num">${grammarDone}/${GRAMMAR.length}</div><div class="label">Bài ngữ pháp đã làm</div></div>
        <div class="card kpi"><div class="num">${state.xp}</div><div class="label">Điểm XP</div></div>
      </div>
      <div class="row" style="margin-top:16px">
        <button class="btn primary" data-href="#/flashcards/all">${due ? `Ôn ${due} từ đến hạn` : "Bắt đầu học từ mới"}</button>
        <button class="btn" data-href="#/quiz">Làm trắc nghiệm</button>
      </div>
      <h2>Chủ đề từ vựng</h2>
      <div class="grid">${topicCards("#/flashcards")}</div>`;
    bindHrefs();
  }

  /* Flashcards with spaced repetition */
  function viewFlashcards(topicId) {
    if (!topicId) {
      app.innerHTML = `
        <h1>Thẻ từ</h1>
        <p class="sub">Lật thẻ, tự đánh giá mức độ nhớ. Hệ thống tự lên lịch ôn lại theo phương pháp lặp lại ngắt quãng.</p>
        <div class="row" style="margin-bottom:16px"><button class="btn primary" data-href="#/flashcards/all">Học tất cả chủ đề</button></div>
        <div class="grid">${topicCards("#/flashcards")}</div>`;
      return bindHrefs();
    }

    const words = topicWords(topicId === "all" ? null : topicId);
    const due = words.filter((w) => state.cards[w.en] && SRS.isDue(state.cards[w.en]));
    const fresh = words.filter((w) => !state.cards[w.en]).slice(0, NEW_PER_SESSION);
    const queue = [...shuffle(due), ...fresh];
    const topic = TOPICS.find((t) => t.id === topicId);
    let done = 0;
    let flipped = false;

    function render() {
      if (!queue.length) {
        app.innerHTML = `<div class="card empty">
          <h2>🎉 Hoàn thành!</h2>
          <p>${done ? `Bạn vừa ôn ${done} lượt thẻ.` : "Không có thẻ nào đến hạn trong chủ đề này."} Hãy quay lại sau để ôn tiếp.</p>
          <div class="row" style="justify-content:center">
            <button class="btn" data-href="#/flashcards">Chọn chủ đề khác</button>
            <button class="btn primary" data-href="#/quiz/${topicId === "all" ? "" : topicId}">Làm trắc nghiệm</button>
          </div></div>`;
        return bindHrefs();
      }
      const w = queue[0];
      const isNew = !state.cards[w.en];
      app.innerHTML = `
        <div class="row"><h1>${topic ? topic.icon + " " + topic.name : "Tất cả chủ đề"}</h1><span class="spacer"></span>
          <span class="progress">Còn ${queue.length} thẻ${isNew ? " · từ mới" : ""}</span></div>
        <div class="card flash" id="flash">
          <div class="word">${esc(w.en)}</div>
          <div class="ipa">${esc(w.ipa)}</div>
          ${flipped
            ? `<div class="meaning">${esc(w.vi)}</div><div class="example">“${esc(w.ex)}”</div>`
            : `<div class="hint">Bấm vào thẻ (hoặc phím Space) để xem nghĩa</div>`}
        </div>
        <div class="row" style="margin-top:10px">
          <button class="btn small" id="say">🔊 Nghe từ</button>
          ${flipped ? `<button class="btn small" id="sayEx">🔊 Nghe câu ví dụ</button>` : ""}
        </div>
        ${flipped ? `<div class="grades">
          <button class="btn" data-g="0">Quên<small>1</small></button>
          <button class="btn" data-g="1">Khó<small>2</small></button>
          <button class="btn" data-g="2">Nhớ<small>3</small></button>
          <button class="btn" data-g="3">Dễ<small>4</small></button>
        </div>` : ""}`;
      document.getElementById("flash").onclick = flip;
      document.getElementById("say").onclick = () => speak(w.en);
      const sayEx = document.getElementById("sayEx");
      if (sayEx) sayEx.onclick = () => speak(w.ex);
      app.querySelectorAll("[data-g]").forEach((b) => (b.onclick = () => grade(+b.dataset.g)));
    }
    function flip() {
      flipped = !flipped;
      if (flipped) speak(queue[0].en);
      render();
    }
    function grade(g) {
      const w = queue.shift();
      state.cards[w.en] = SRS.review(state.cards[w.en], g);
      if (g === 0) queue.push(w); // see it again this session
      done++;
      flipped = false;
      addXp(g === 0 ? 0 : 1);
      render();
    }
    keyHandler = (e) => {
      if (e.code === "Space") { e.preventDefault(); flip(); }
      else if (flipped && ["1", "2", "3", "4"].includes(e.key)) grade(+e.key - 1);
    };
    render();
  }

  /* Multiple-choice quiz */
  function viewQuiz(topicId) {
    const pool = topicWords(topicId || null);
    const questions = shuffle(pool).slice(0, 10).map((w) => {
      const toVi = Math.random() < 0.5;
      const others = shuffle(ALL_WORDS.filter((o) => o.en !== w.en)).slice(0, 3);
      const options = shuffle([w, ...others]);
      return {
        prompt: toVi ? w.en : w.vi,
        hint: toVi ? "Chọn nghĩa tiếng Việt đúng" : "Chọn từ tiếng Anh đúng",
        options: options.map((o) => (toVi ? o.vi : o.en)),
        answer: options.indexOf(w),
        word: w,
      };
    });
    let i = 0, score = 0, answered = false;
    const topic = TOPICS.find((t) => t.id === topicId);

    function render() {
      if (i >= questions.length) {
        app.innerHTML = `<div class="card empty">
          <h2>Kết quả: ${score}/${questions.length}</h2>
          <p>${score >= 8 ? "Xuất sắc! 🎉" : score >= 5 ? "Khá tốt, cố gắng thêm nhé! 💪" : "Hãy ôn lại thẻ từ rồi thử lại nhé."}</p>
          <div class="row" style="justify-content:center">
            <button class="btn" id="again">Làm lại</button>
            <button class="btn primary" data-href="#/flashcards/${topicId || "all"}">Ôn thẻ từ</button>
          </div></div>`;
        document.getElementById("again").onclick = () => viewQuiz(topicId);
        return bindHrefs();
      }
      const q = questions[i];
      app.innerHTML = `
        <div class="row"><h1>Trắc nghiệm</h1><span class="spacer"></span>
          <select id="topicSel" class="btn small">
            <option value="">Tất cả chủ đề</option>
            ${TOPICS.map((t) => `<option value="${t.id}" ${t.id === topicId ? "selected" : ""}>${t.name}</option>`).join("")}
          </select></div>
        <div class="card">
          <div class="progress">Câu ${i + 1}/${questions.length} · Đúng ${score} · ${q.hint}</div>
          <div class="question">${esc(q.prompt)} <button class="btn small" id="say">🔊</button></div>
          <div class="options">
            ${q.options.map((o, k) => `<button class="btn option" data-k="${k}">${k + 1}. ${esc(o)}</button>`).join("")}
          </div>
          <div id="fb"></div>
        </div>`;
      document.getElementById("topicSel").onchange = (e) => (location.hash = "#/quiz/" + e.target.value);
      document.getElementById("say").onclick = () => speak(q.word.en);
      app.querySelectorAll("[data-k]").forEach((b) => (b.onclick = () => choose(+b.dataset.k)));
      answered = false;
    }
    function choose(k) {
      if (answered) return next();
      answered = true;
      const q = questions[i];
      const btns = app.querySelectorAll("[data-k]");
      btns[q.answer].classList.add("correct");
      if (k === q.answer) { score++; addXp(2); }
      else btns[k].classList.add("wrong");
      document.getElementById("fb").innerHTML = `
        <div class="feedback ${k === q.answer ? "ok" : "no"}">
          ${k === q.answer ? "Chính xác!" : "Chưa đúng."} <b>${esc(q.word.en)}</b> ${esc(q.word.ipa)} = ${esc(q.word.vi)}
          <div class="row" style="margin-top:8px"><button class="btn small primary" id="next">Câu tiếp (Enter)</button></div>
        </div>`;
      document.getElementById("next").onclick = next;
      speak(q.word.en);
    }
    function next() { i++; render(); }
    keyHandler = (e) => {
      if (!answered && ["1", "2", "3", "4"].includes(e.key)) choose(+e.key - 1);
      else if (answered && e.key === "Enter") next();
    };
    render();
    if (!topic && topicId) location.hash = "#/quiz";
  }

  /* Listening / dictation */
  function viewListening() {
    let mode = "word";
    let item, checked;

    function pick() {
      const w = ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)];
      item = { text: mode === "word" ? w.en : w.ex, word: w };
      checked = false;
      render();
      setTimeout(() => speak(item.text, mode === "word" ? 0.85 : 0.9), 200);
    }
    function render() {
      app.innerHTML = `
        <h1>Nghe – chép chính tả</h1>
        <p class="sub">Nghe và gõ lại chính xác những gì bạn nghe được.</p>
        <div class="row" style="margin-bottom:12px">
          <button class="btn small ${mode === "word" ? "primary" : ""}" data-mode="word">Từ vựng</button>
          <button class="btn small ${mode === "sentence" ? "primary" : ""}" data-mode="sentence">Câu</button>
        </div>
        <div class="card">
          <div class="row" style="margin-bottom:12px">
            <button class="btn" id="play">🔊 Nghe</button>
            <button class="btn" id="slow">🐢 Nghe chậm</button>
          </div>
          <input type="text" id="answer" placeholder="Gõ những gì bạn nghe được rồi nhấn Enter…" autocomplete="off" autocapitalize="off" spellcheck="false">
          <div class="row" style="margin-top:12px">
            <button class="btn primary" id="check">Kiểm tra</button>
            <button class="btn" id="skip">Bỏ qua</button>
          </div>
          <div id="fb"></div>
        </div>`;
      app.querySelectorAll("[data-mode]").forEach((b) => (b.onclick = () => { mode = b.dataset.mode; pick(); }));
      document.getElementById("play").onclick = () => speak(item.text);
      document.getElementById("slow").onclick = () => speak(item.text, 0.6);
      document.getElementById("check").onclick = check;
      document.getElementById("skip").onclick = pick;
      const input = document.getElementById("answer");
      input.onkeydown = (e) => { if (e.key === "Enter") { e.stopPropagation(); checked ? pick() : check(); } };
      input.focus();
    }
    function check() {
      const typed = document.getElementById("answer").value;
      const sim = SRS.similarity(typed, item.text);
      checked = true;
      const cls = sim === 1 ? "ok" : sim >= 0.8 ? "mid" : "no";
      if (sim === 1) addXp(mode === "word" ? 2 : 4);
      document.getElementById("fb").innerHTML = `
        <div class="feedback ${cls}">
          ${sim === 1 ? "Hoàn hảo! ✅" : sim >= 0.8 ? `Gần đúng (${Math.round(sim * 100)}%)` : `Chưa đúng (${Math.round(sim * 100)}%)`}
          <div>Đáp án: <b>${esc(item.text)}</b> — ${esc(item.word.vi)}</div>
          <div class="row" style="margin-top:8px"><button class="btn small primary" id="next">Câu tiếp (Enter)</button></div>
        </div>`;
      document.getElementById("next").onclick = pick;
    }
    keyHandler = null;
    pick();
  }

  /* Speaking practice */
  function viewSpeaking() {
    let idx = Math.floor(Math.random() * SENTENCES.length);
    let rec = null;

    function render(result) {
      const s = SENTENCES[idx];
      app.innerHTML = `
        <h1>Luyện nói</h1>
        <p class="sub">Nghe câu mẫu, sau đó bấm micro và đọc to. Hệ thống sẽ so sánh với câu mẫu.</p>
        <div class="card">
          <div class="question">${esc(s)}</div>
          <div class="row">
            <button class="btn" id="play">🔊 Nghe mẫu</button>
            <button class="btn primary" id="mic" ${Recognition ? "" : "disabled"}>🎤 Bắt đầu nói</button>
            <span class="spacer"></span>
            <button class="btn" id="next">Câu khác ➜</button>
          </div>
          ${Recognition ? "" : `<div class="feedback mid">Trình duyệt này chưa hỗ trợ nhận dạng giọng nói. Hãy dùng Chrome hoặc Edge để luyện nói; bạn vẫn có thể nghe mẫu và tự đọc theo.</div>`}
          <div id="fb">${result || ""}</div>
        </div>`;
      document.getElementById("play").onclick = () => speak(s);
      document.getElementById("next").onclick = () => { idx = (idx + 1) % SENTENCES.length; render(); };
      document.getElementById("mic").onclick = listen;
    }
    function listen() {
      if (rec) return rec.stop();
      rec = new Recognition();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      const mic = document.getElementById("mic");
      mic.textContent = "⏹ Đang nghe… (bấm để dừng)";
      rec.onresult = (e) => {
        const alts = Array.from(e.results[0]);
        const target = SENTENCES[idx];
        const best = alts.map((a) => ({ text: a.transcript, sim: SRS.similarity(a.transcript, target) }))
          .sort((a, b) => b.sim - a.sim)[0];
        const pct = Math.round(best.sim * 100);
        if (pct >= 85) addXp(3);
        render(`<div class="feedback ${pct >= 85 ? "ok" : pct >= 60 ? "mid" : "no"}">
          Bạn nói: “${esc(best.text)}” — độ khớp <b>${pct}%</b>
          ${pct >= 85 ? " 🎉 Rất tốt!" : pct >= 60 ? " Khá ổn, thử lại để chuẩn hơn." : " Hãy nghe mẫu và thử lại nhé."}
        </div>`);
      };
      rec.onerror = (e) => {
        document.getElementById("fb").innerHTML = `<div class="feedback no">Không nhận được âm thanh (${esc(e.error)}). Kiểm tra quyền micro và thử lại.</div>`;
      };
      rec.onend = () => {
        rec = null;
        const m = document.getElementById("mic");
        if (m) m.textContent = "🎤 Bắt đầu nói";
      };
      rec.start();
    }
    keyHandler = null;
    render();
  }

  /* Grammar lessons */
  function viewGrammar(lessonId) {
    keyHandler = null;
    if (!lessonId) {
      app.innerHTML = `
        <h1>Ngữ pháp</h1>
        <p class="sub">Các chủ điểm ngữ pháp thông dụng trong công việc, mỗi bài kèm bài tập ngắn.</p>
        <div class="list">${GRAMMAR.map((g) => {
          const r = state.grammar[g.id];
          return `<button class="btn" data-href="#/grammar/${g.id}">${g.title}
            ${r !== undefined ? `<span style="float:right;color:var(--good)">✔ ${r}/${g.quiz.length}</span>` : ""}</button>`;
        }).join("")}</div>`;
      return bindHrefs();
    }
    const g = GRAMMAR.find((x) => x.id === lessonId);
    if (!g) return (location.hash = "#/grammar");
    const picks = {};
    app.innerHTML = `
      <p><a href="#/grammar">← Tất cả bài ngữ pháp</a></p>
      <div class="card lesson"><h3>${g.title}</h3>${g.body}</div>
      <h2>Bài tập</h2>
      ${g.quiz.map(([q, opts], qi) => `
        <div class="card" style="margin-bottom:10px">
          <div style="font-weight:600;margin-bottom:8px">${qi + 1}. ${esc(q)}</div>
          <div class="row">${opts.map((o, k) => `<button class="btn small option" data-q="${qi}" data-k="${k}">${esc(o)}</button>`).join("")}</div>
        </div>`).join("")}
      <div class="row"><button class="btn primary" id="submit">Nộp bài</button></div>
      <div id="fb"></div>`;
    app.querySelectorAll("[data-q]").forEach((b) => (b.onclick = () => {
      const qi = +b.dataset.q;
      picks[qi] = +b.dataset.k;
      app.querySelectorAll(`[data-q="${qi}"]`).forEach((x) => x.classList.toggle("primary", x === b));
    }));
    document.getElementById("submit").onclick = () => {
      let score = 0;
      g.quiz.forEach(([, , ans], qi) => {
        app.querySelectorAll(`[data-q="${qi}"]`).forEach((x) => {
          x.classList.remove("primary");
          if (+x.dataset.k === ans) x.classList.add("correct");
          else if (+x.dataset.k === picks[qi]) x.classList.add("wrong");
        });
        if (picks[qi] === ans) score++;
      });
      const prev = state.grammar[g.id] ?? -1;
      state.grammar[g.id] = Math.max(prev, score);
      addXp(score * 2);
      document.getElementById("fb").innerHTML =
        `<div class="feedback ${score === g.quiz.length ? "ok" : "mid"}">Bạn đúng ${score}/${g.quiz.length} câu.</div>`;
    };
  }

  /* ---------- Router ---------- */
  let keyHandler = null;
  document.addEventListener("keydown", (e) => {
    if (keyHandler && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLSelectElement)) keyHandler(e);
  });

  function route() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    keyHandler = null;
    const [name = "", arg] = location.hash.replace(/^#\/?/, "").split("/");
    document.querySelectorAll("#tabs a").forEach((a) => a.classList.toggle("active", a.dataset.route === name));
    const views = {
      "": viewHome,
      flashcards: viewFlashcards,
      quiz: viewQuiz,
      listening: viewListening,
      speaking: viewSpeaking,
      grammar: viewGrammar,
    };
    (views[name] || viewHome)(arg);
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => {}; // warm up voice list
  renderStats();
  route();
})();
