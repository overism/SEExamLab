# SE ExamLab — NSW HSC Software Engineering practice simulator

**Independent, unofficial educational project. Not produced by or endorsed by NESA.** This website simulates question formats and workflows; it is **not** NESA's secure LockDown Browser and cannot enforce real exam security controls.

## What's included

- Separate, original practice examinations (the homepage counts them automatically). **27 questions and 80 marks each**, following the 2025 paper's overall allocation.
- **10-minute reading phase** (browse, flag, highlight; answer controls locked), followed by a **140-minute working phase**. You can begin working early.
- Single-choice, multiple-selection, dropdown/matching, pseudocode, short and extended writing, Python programming, SQL query writing and inheritance-diagram tasks.
- **Python 3 IDE**: runs code and displays stdout/errors. Keep a draft, or explicitly **Attach code to question** for submission. At submission, attached programs are exercised with several inputs.
- **SQL database lab**: a distinct SQLite-style example database accompanies each SQL question. Run queries and see tabular results immediately below the query editor.
- Non-binding, live suggested word counts; response autosaving; flag/navigation palette; scratchpad; background and text-size accessibility settings; confirmation before submission.
- Results page with criterion details, model answers, a provisional numeric score, and downloadable JSON report.

## Run locally

For working Python and SQL execution, **serve these files over HTTP(S)** rather than opening `index.html` as a `file://` document. On a computer with Python installed, open a terminal in this folder and run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser. Alternatively, deploy this folder to GitHub Pages or another static web host.

**Online dependencies:** The Python interpreter loads Pyodide 0.27.7 from jsDelivr; the SQL interpreter loads SQL.js 1.13.0 from Cloudflare CDN. They must be reachable on the first and subsequent runs; neither package is bundled in this download. The exam pages, marking rubrics and autosaved responses are otherwise local to the browser. For a fully offline venue, vendor these dependencies separately and update the library URLs.

## Marking and integrity

- Multiple choice, multiple-selection and dropdown answers receive deterministic credit, including partial-credit thresholds for some matching tasks.
- Python grading runs **attached** code against explicit test cases. Tests can assert **exact output** (`expect`), so a program that merely contains the right word no longer passes. Each test runs in a fresh namespace; `input()` raises `EOFError` when input runs out; marking suppresses `input()` prompts (the IDE still shows them); a test that loops forever is recorded as a timeout and the other tests still run, so partial credit survives. It is not a proof of correctness; unseen edge cases can still exist.
- SQL questions can use several tables (with NULLs). The marker runs your query **and a reference query** on the visible data and on hidden datasets, then compares result *values*: column order and aliases are ignored, rows tied on the sort key may appear in any order, and joins, subqueries, `HAVING`, `CASE` and `AVG` are all fine. Hard-coded answers fail the hidden data. Papers 01–05 keep their original single-table analyser.
- Class diagrams can be graded against a specification (classes, attribute homes, inheritance links, optional types; extra classes allowed; attribute spelling style ignored). Extended writing and class diagrams receive **indicative, rules-based scores**, not grades from a trained NESA human marker. The criteria can produce false positives or miss valid alternative phrasings. Review the example answers and evaluate your responses critically.
- Data is stored in your browser's `localStorage`. No exam answers are transmitted to a server operated by this project, but the third-party Python/SQL runtime scripts download over the internet. Clearing site data erases progress. JSON export is available from the results screen.
- This is not an examination security tool or a cheating-prevention mechanism; it cannot prevent screenshots, switching tabs, external resources or unauthorised actions.

## Alignment with 2025

The public 2025 HSC Software Engineering paper used **27 numbered questions**, **80 total marks**, **22 objective-response marks**, **58 short-answer marks**, **10 minutes reading** and **2 hours 20 minutes working**. The 22 objective marks include the 16 marks in Questions 1–14, plus dropdown/matching marks in Questions 15(a) and 23(c). The practice exams preserve this mark distribution while using **new question material**.

The uploaded *2025 Software Engineering sample full-mark responses* helped set the expected depth of answers, including contextualised PWA/privacy explanations, SQL aggregation, executable Python, server-side programming, neural networks, and AI bias. The practice model answers are newly authored, not verbatim copies of NESA examples. The 2025 exam video is not reproduced; every practice case instead provides original written stimuli.

Official resources:

- [NESA 2025 exam pack, marking guidelines and sample responses](https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/software-engineering/2025)
- [Official 2025 marking guidelines (PDF)](https://www.nsw.gov.au/sites/default/files/noindex/2025-12/2025-hsc-software-engineering-mg.pdf)
- [Online HSC exam platform features](https://curriculum.nsw.edu.au/assessment-and-reporting/assessment-in-stage-6/online-hsc-exams)

## Files

- `index.html`: page entry point
- `styles.css`: desktop/responsive UI styles
- `data.js`: five original exam question banks and associated criteria
- `app.js`: exam UI, persistence, lab controls and marking rules
- `python-worker.js`: isolated Python runner powered by Pyodide (per-test namespaces, exact stdout capture)
- `tools/`: validation and regression tests (developer only)

All files are plain HTML/CSS/JavaScript; no build step, account, API key, or app server is required.

## Tests (developer)

`tools/` contains Node scripts that exercise the real `app.js`, `python-worker.js` and `data.js` (jsdom + npm copies of Pyodide and sql.js; no browser needed):

```bash
cd tools && npm install
node validate.js            # structure + every model answer through the real marking engine
node engine-test.js         # Python / SQL / diagram / written marking regression tests
node ui-test.js             # jsdom walkthrough: render, IDE, SQL lab, diagram, submit, persistence
```

Optional data fields are documented at the top of `data.js`. These scripts are not needed to run the website.

## Authoring new papers

Question data lives in `src/`: `legacy.js` (Papers 01–05), `common.js` (helpers) and one `pNN.js` per new paper. `node tools/build.js` concatenates them into `data.js`. Every paper is explicit data (no shared templates), is checked to have 27 questions and 80 marks when built, and `tools/validate.js` runs every model answer, Python mutant (deliberately wrong programs that must lose marks) and SQL hidden dataset through the real marking engine. Python `mutants` arrays are for validation only and are ignored by the website.
