/* ===== Papers 06+ : explicit question data (no shared templates) ===== */
(() => {
  const NEW = [];
  /* ---- helpers ---- */
  const mc = (prompt, options, correct, why) => ({type:'mc', prompt, options, correct, marks:1, sample: options[correct] + (why ? ' — ' + why : '')});
  const multi = (prompt, options, correct, why) => ({type:'multi', prompt, options, correct, marks:1, sample: correct.map(i => options[i]).join('; ') + (why ? ' — ' + why : '')});
  const rows = (prompt, items, choices, marks, thresholds) => ({type:'dropdown', prompt, rows:items.map(x => ({label:x[0], correct:x[1]})), choices, marks, thresholds});
  const cr = (label, all, none) => { const c = {label, all:[].concat(all)}; if (none) c.none = [].concat(none); return c; };
  const written = (prompt, marks, wordGuide, sample, criteria) => ({type:'written', prompt, marks, wordGuide, sample, criteria});
  const python = (prompt, marks, starter, sample, tests, extra) => ({type:'python', prompt, marks, wordGuide:0, starter, sample, tests, ...(extra || {})});
  const sql = (prompt, marks, tables, sample, opts) => ({type:'sql', prompt, marks, wordGuide:0, tables, sample, ...opts});
  const diagram = (prompt, marks, spec, sample) => ({type:'diagram', prompt, marks, wordGuide:0, spec, sample});
  /* at least TWO of the supplied word-families must appear (for "TWO ways" questions) */
  const twoOf = (...fam) => fam.map((a, i) => fam.slice(i + 1).map(b => `(?=[\\s\\S]*(${a}))(?=[\\s\\S]*(${b}))`).join('|')).filter(Boolean).join('|');
  const Q = (n, title, stimulus, parts) => ({n, title, stimulus: stimulus || '', parts: parts.map((p, i) => ({id: 'abcdefgh'[i], ...p}))});
  const paper = (id, title, subtitle, questions) => {
    const marks = questions.reduce((s, q) => s + q.parts.reduce((a, p) => a + p.marks, 0), 0);
    if (questions.length !== 27 || marks !== 80) throw Error(`Invalid paper ${id}: ${questions.length} q ${marks} marks`);
    questions.forEach((q, i) => { if (q.n !== i + 1) throw Error(`Paper ${id}: question ${i + 1} is numbered ${q.n}`); });
    return {id, title: `Paper ${String(id).padStart(2, '0')} — ${title}`, subtitle, questionCount: 27, marks: 80, readingMinutes: 10, workingMinutes: 140, questions};
  };
  const H = {mc, multi, rows, cr, written, python, sql, diagram, twoOf, Q, paper};
