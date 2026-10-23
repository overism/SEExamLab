/* SE ExamLab — a standalone NESA-inspired, unofficial practice-examination web app.
   State is stored in the browser only. No submitted answers are sent to a server. */
(() => {
'use strict';
const PAPERS=window.SE_PAPERS, SOURCE=window.SE_SOURCE, APP=document.getElementById('app');
const KEY='se-examlab-v2';
const escapeHTML=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wordCount=v=>(String(v||'').trim().match(/\b[\w'-]+\b/g)||[]).length;
const qMark=q=>q.parts.reduce((a,p)=>a+p.marks,0);
const partKey=(q,p)=>`${q.n}.${p.id}`;
const now=()=>Date.now();
const readStore=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return {}}};
const stored=readStore();
const state={page:'home',paperIndex:0,questionIndex:0,stage:'reading',phaseEnds:0,answers:{},drafts:{},flags:[],notes:'',highlight:{},results:null,examStarted:0,completed:!!false,modal:null,ide:null,ideOutput:'',sqlOutputs:{},contrast:!!stored.contrast,scale:stored.scale||1,theme:stored.theme||'default',filter:'all',status:'',working:false};
const allSessions=stored.sessions||{};
let timerInterval=null,pyWorker=null,sqlLibraryPromise=null;
function persist(){
  if(state.page!=='home'){
    allSessions[PAPERS[state.paperIndex].id]={stage:state.stage,phaseEnds:state.phaseEnds,answers:state.answers,drafts:state.drafts,flags:state.flags,notes:state.notes,highlight:state.highlight,results:state.results,examStarted:state.examStarted,questionIndex:state.questionIndex,completed:state.completed};
  }
  try{localStorage.setItem(KEY,JSON.stringify({sessions:allSessions,contrast:state.contrast,scale:state.scale,theme:state.theme}))}catch(e){console.warn('Browser storage unavailable',e)}
}
function sessionFor(i){return allSessions[PAPERS[i].id];}
function currentPaper(){return PAPERS[state.paperIndex]}
function currentQuestion(){return currentPaper().questions[state.questionIndex]}
function currentPart(k){return currentQuestion().parts.find(p=>p.id===k)}
function answerOf(q,p){return state.answers[partKey(q,p)];}
function hasAnswer(q,p){const v=answerOf(q,p);if(p.type==='multi')return Array.isArray(v)&&v.length>0;if(p.type==='dropdown')return Array.isArray(v)&&v.some(Boolean);if(p.type==='diagram')return !!(v?.nodes?.some(n=>n.attributes.trim()||!/^Class \d+$/.test(n.name)));return String(v??'').trim().length>0}
function isAnswered(q){return q.parts.every(p=>hasAnswer(q,p));}
function completedCount(){return currentPaper().questions.filter(isAnswered).length}
function formatTime(s){s=Math.max(0,Math.floor(s));return `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
function remaining(){return Math.max(0,Math.ceil((state.phaseEnds-now())/1000))}
function topbar(exam=false){return `<header class="${exam?'exam-header':''}"><div class="topbar"><div class="brand"><div class="brand-mark">SE</div><div><div class="brand-title">ExamLab <span class="not-official">/ Software Engineering</span></div><div class="brand-sub">NSW HSC practice simulator · UNOFFICIAL</div></div></div><div class="top-actions">${exam?`<span id="timer" class="timer">${formatTime(remaining())}</span><button class="btn small" data-action="settings">Aa Settings</button><button class="btn small" data-action="notes">Scratchpad</button>${state.stage==='reading'?'':'<button class="btn small danger" data-action="finish">Submit</button>'}`:`<span class="pill">2025 marking structure</span><button class="btn small" data-action="settings">Display settings</button>`}</div></div>${exam?`<div class="exam-subnav"><span>${escapeHTML(currentPaper().title)} · ${state.stage==='reading'?'Reading time':'Working time'} · 80 marks</span><div class="exam-toolbar"><span>${completedCount()} / 27 questions completed</span><span>·</span><span>Autosaved on this device</span></div></div>`:''}</header>`}
function home(){
 state.page='home';clearInterval(timerInterval);timerInterval=null;
 const ps=PAPERS.map((p,i)=>{const ss=sessionFor(i);const done=ss?.results;return `<article class="paper"><span class="paper-count">MOCK EXAMINATION 0${i+1}</span><h3>${escapeHTML(p.title.replace(/^Paper \d+ — /,''))}</h3><p>${escapeHTML(p.subtitle)}. 27 questions · 80 marks · 2 h 20 min writing time.</p><span class="tag ${done?'good':ss?'warn':''}">${done?'Completed · '+Math.round(done.total)+'/80':ss?'Attempt in progress':'Not started'}</span><button class="btn ${!ss?'primary':''}" data-action="open-paper" data-paper="${i}">${done?'Review results':ss?'Resume paper':'Start practice paper'}</button></article>`}).join('');
 APP.innerHTML=topbar()+`<main class="shell"><section class="hero"><div><span class="eyebrow">HSC SOFTWARE ENGINEERING · 2025-ALIGNED</span><h1>A realistic exam desk.<br>Five complete practice papers.</h1><p>Work through full 80-mark papers with timed reading and working phases, question navigation, writing guides, Python testing and attachment, SQL query results, class diagrams and criterion-based feedback.</p><div class="split"><span class="tag">5 original exams</span><span class="tag">135 questions</span><span class="tag">Python IDE + SQL lab</span><span class="tag">Local autosave</span></div></div><aside class="hero-stat"><div class="stat-number">80<span class="muted" style="font-size:21px"> marks</span></div><div class="stat-caption">PER EXAMINATION</div><div class="stat-line"><span>Reading</span><b>10 min</b></div><div class="stat-line"><span>Working</span><b>140 min</b></div><div class="stat-line"><span>Questions</span><b>27</b></div><div class="stat-line"><span>Python / SQL / diagrams</span><b>Included</b></div></aside></section><h2 class="section-title">Choose a practice examination</h2><div class="paper-grid">${ps}</div><div class="two-col"><section class="info-box"><h3>Exam format analysed from 2025</h3><p>Questions 1–14 total 16 marks; 6 further objective marks appear within Questions 15 and 23 (22 objective marks total). Includes dropdowns, multi-select, data structures, Python programs (Q19 and Q26), SQL (Q21) and a class diagram (Q22). <a href="${SOURCE.markingGuidelines}" target="_blank" rel="noopener">Official 2025 marking grid ↗</a></p></section><section class="info-box"><h3>Automatic marking limitations</h3><p>Objective answers are exact-marked. Python executes against test cases and SQL queries run on real tables. Text and diagrams receive <b>indicative, rules-based</b> marks with rubric evidence and model answers; human markers may judge them differently. No responses are sent to an AI service.</p></section></div><p class="legal">Independently developed educational practice only. Not affiliated with NESA or endorsed as an official HSC exam, LockDown Browser or NESA marking platform. <a href="${SOURCE.officialExam}" target="_blank" rel="noopener">2025 official exam materials</a> · <a href="${SOURCE.practice}" target="_blank" rel="noopener">Official online exam information</a>. Browser local storage retains answers on this device. Python and SQL libraries require an internet connection on first use.</p></main>`;
}
function enterPaper(i){
 state.paperIndex=i;const ses=sessionFor(i);
 state.answers=ses?.answers||{};state.drafts=ses?.drafts||{};state.flags=ses?.flags||[];state.notes=ses?.notes||'';state.highlight=ses?.highlight||{};state.results=ses?.results||null;state.examStarted=ses?.examStarted||now();state.questionIndex=ses?.questionIndex||0;state.completed=ses?.completed||false;
 state.stage=ses?.stage||'reading';state.phaseEnds=ses?.phaseEnds||now()+600000;
 if(state.results){state.page='results';resultsPage();return;}
 if(state.stage==='reading'&&remaining()===0)startWork(false);
 else if(state.stage==='work'&&remaining()===0){submitPaper(true);return;}
 state.page='exam';state.modal=null;examPage();startTimer();persist();
}
function startTimer(){clearInterval(timerInterval);timerInterval=setInterval(()=>{if(state.page!=='exam')return;
   const t=document.getElementById('timer');if(t){t.textContent=formatTime(remaining());t.classList.toggle('warn',remaining()<300)}const rt=document.getElementById('reading-clock');if(rt)rt.textContent=formatTime(remaining());
   if(remaining()<=0){if(state.stage==='reading')startWork(true);else submitPaper(true)}
 },1000)}
function startWork(render=true){state.stage='work';state.phaseEnds=now()+140*60000;state.questionIndex=0;persist();if(render){examPage();startTimer()}}
function readingScreen(){
 const q=currentQuestion(),nums=currentPaper().questions.map((qq,i)=>`<button class="number-cell ${state.questionIndex===i?'active':''} ${state.flags.includes(qq.n)?'flagged':''}" data-action="jump" data-index="${i}" aria-label="Question ${qq.n}">${qq.n}</button>`).join('');
 const content=q.parts.map(p=>`<section class="part"><div class="part-title"><strong>${q.parts.length>1?'('+p.id+') ':''}${p.type==='python'?'Python task':p.type==='sql'?'SQL task':p.type==='diagram'?'Diagram task':'Question'}</strong><span>${p.marks} mark${p.marks===1?'':'s'}</span></div><p class="part-prompt">${markedText(p.prompt,q.n)}</p><div class="hint">You can read and highlight this question now. Response fields unlock when working time starts.</div></section>`).join('');
 return `${topbar(true)}<main class="exam-layout"><section class="question-panel"><div class="reading-notice"><div><span class="eyebrow">READING TIME · ANSWERS LOCKED</span><h2>Read, navigate, flag and highlight questions.</h2><p>10 minutes to read. During working time, you have 2 hours 20 minutes for all 27 questions (80 marks). For Python, run and <b>attach</b> code before submission. Suggested word counts are <b>not limits</b>.</p></div><div class="reading-actions"><span id="reading-clock" class="reading-label">${formatTime(remaining())}</span><button class="btn primary" data-action="begin-work">Begin working time →</button></div></div><div class="question-body"><div class="question-top"><h1>Question ${q.n} <span class="gray">· ${escapeHTML(q.title||'')}</span></h1><span class="mark-chip">${qMark(q)} marks</span></div>${q.stimulus?`<div class="scenario">${markedText(q.stimulus,q.n)}</div>`:''}${content}</div><div class="question-footer"><button class="btn" data-action="nav" data-delta="-1" ${state.questionIndex===0?'disabled':''}>← Previous</button><div class="split"><button class="btn small" data-action="flag">${state.flags.includes(q.n)?'◆ Flagged':'◇ Flag question'}</button><button class="btn primary" data-action="nav" data-delta="1" ${state.questionIndex===26?'disabled':''}>Next question →</button></div></div></section><aside class="side-panel"><h3>Question navigation</h3><p class="fine muted">Reading time · responses disabled</p><div class="number-grid">${nums}</div><div class="tool-line"><button class="btn small" data-action="highlight">Highlight selection</button><button class="btn small" data-action="clear-highlight">Clear highlights</button></div><div class="side-tips">NESA's official reading time allows browsing, flagging, and highlighting. This is an independently built simulation, not the actual secure exam environment.</div></aside></main><div id="toast" class="toast" hidden></div>`
}
function markedText(raw,n){
 let html=escapeHTML(raw),fragments=state.highlight[n]||[];
 for(const phrase of fragments){const escaped=escapeHTML(phrase);if(!escaped)continue;
  const re=new RegExp(escaped.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi');
  html=html.replace(re,match=>`<mark class="selection-highlight">${match}</mark>`);
 }
 return html;
}
function highlightSelection(){
 const selection=window.getSelection(),text=selection?.toString()?.trim()||'';
 if(!text||text.length>260){state.status='Select a phrase in the question or stimulus (up to 260 characters).';notify();return}
 const anchor=selection.anchorNode?.parentElement;
 if(!anchor?.closest('.scenario,.part-prompt')){state.status='Select text in the question or stimulus to highlight it.';notify();return}
 const n=currentQuestion().n;state.highlight[n]=[...new Set([...(state.highlight[n]||[]),text])];persist();examPage();
}
function notify(){const el=document.getElementById('toast');if(el){el.textContent=state.status;el.hidden=false;setTimeout(()=>el.hidden=true,3500)}}
function questionPanel(q){let body=`<div class="question-top"><h1>Question ${q.n} <span class="gray">· ${escapeHTML(q.title||'')}</span></h1><span class="mark-chip">${qMark(q)} marks</span></div>`;
 if(q.stimulus)body+=`<div class="scenario">${markedText(q.stimulus,q.n)}</div>`;
 q.parts.forEach((p,j)=>{const key=partKey(q,p);body+=`<section class="part" id="part-${escapeHTML(p.id)}"><div class="part-title"><strong>${q.parts.length>1?`(${p.id}) `:''}${p.type==='python'?'Python programming':p.type==='sql'?'SQL query':p.type==='diagram'?'Class diagram':'Response'}</strong><span>${p.marks} mark${p.marks!==1?'s':''}</span></div><p class="part-prompt">${markedText(p.prompt,q.n)}</p>${answerUI(q,p,key)}</section>`});
 return `<div class="question-body">${body}</div><div class="question-footer"><button class="btn" data-action="nav" data-delta="-1" ${state.questionIndex===0?'disabled':''}>← Previous</button><div class="split"><button class="btn small" data-action="flag">${state.flags.includes(q.n)?'◆ Flagged':'◇ Flag question'}</button><button class="btn primary" data-action="nav" data-delta="1">${state.questionIndex===26?'Review & submit':'Next question →'}</button></div></div>`}
function answerUI(q,p,key){const v=answerOf(q,p);
 if(p.type==='mc'||p.type==='multi')return `<div class="answer-grid">${p.options.map((label,k)=>`<label class="answer-option"><input type="${p.type==='mc'?'radio':'checkbox'}" name="${key}" data-ans="${key}" data-type="${p.type}" value="${k}" ${p.type==='mc'?String(v)===String(k)?'checked':'':(v||[]).includes(k)?'checked':''}><span>${escapeHTML(label)}</span></label>`).join('')}</div>${p.type==='multi'?'<p class="hint">Select all correct statements. Incorrect additional selections may affect credit.</p>':''}`;
 if(p.type==='dropdown')return `<table class="dropdown-rows"><thead><tr><th>Statement / property</th><th>Response</th></tr></thead><tbody>${p.rows.map((r,j)=>`<tr><td>${escapeHTML(r.label)}</td><td><select data-ans="${key}" data-type="dropdown" data-row="${j}" aria-label="${escapeHTML(r.label)}"><option value="">Select…</option>${p.choices.map(x=>`<option value="${escapeHTML(x)}" ${(v||[])[j]===x?'selected':''}>${escapeHTML(x)}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table>`;
 if(p.type==='written')return `<textarea class="answer-box" data-ans="${key}" data-type="written" aria-label="Written response" placeholder="Enter your response here...">${escapeHTML(v||'')}</textarea><div class="word-counter"><span data-count="${key}">${wordCount(v)}</span> words · suggested length ${p.wordGuide} words · <b>not a limit</b></div>`;
 if(p.type==='python')return `<div class="practice-banner">Python 3 · run test input in the IDE, then attach your solution. <b>Only attached code is assessed.</b></div><div class="tool-line"><button class="btn primary" data-action="ide" data-key="${key}">Open Python IDE</button><span class="tag ${v?'good':'warn'}">${v?'Code attached':'Not attached'}</span></div>${v?`<pre class="code-stimulus">${escapeHTML(String(v).slice(0,3500))}</pre>`:'<p class="hint">No submitted code. The IDE retains an independent draft.</p>'}`;
 if(p.type==='sql')return `<p class="hint">Read-only SQLite-style SELECT queries are supported. Use the table shown below.</p><div class="db-schema"><div class="schema-title">${escapeHTML(p.schema.name)} table</div>${tableHTML(p.schema.columns,p.schema.rows)}</div><label class="schema-title" for="sql-input">SQL query</label><textarea id="sql-input" spellcheck="false" class="sql-editor" data-ans="${key}" data-type="sql" placeholder="SELECT ...">${escapeHTML(v||'')}</textarea><div class="tool-line"><button class="btn primary" data-action="run-sql" data-key="${key}">▶ Run query</button><span class="hint">The query is saved automatically</span></div><div class="schema-title">Query output</div><div class="output-area" id="sql-output">${state.sqlOutputs[key]||'Run the query to inspect its output.'}</div>`;
 if(p.type==='diagram')return diagramUI(q,p,key);
 return '';
}
function tableHTML(cols,rows){return `<table class="sql-table"><thead><tr>${cols.map(x=>`<th>${escapeHTML(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(c=>`<td>${escapeHTML(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`}
function diagramInitial(p){return {nodes:[0,1,2,3].map((_,i)=>({id:'node'+i,name:'Class '+(i+1),attributes:'',parent:i===0?'':'node0',x:i===0?260:(30+(i-1)*215),y:i===0?30:230}))}}
function diagramUI(q,p,key){let ans=answerOf(q,p);if(!ans){ans=diagramInitial(p);state.answers[key]=ans}
 const opts=ans.nodes.map(n=>`<option value="${escapeHTML(n.id)}">${escapeHTML(n.name)}</option>`).join('');
 return `<div class="diagram-tool" data-diagram="${key}"><div class="diagram-top"><strong>Class diagram builder</strong><span class="hint">Edit names/attributes, choose superclass, drag boxes to position them.</span><button class="btn tiny" data-action="add-node" data-key="${key}">+ Class</button></div><div class="diagram-canvas" id="diagram-canvas" data-key="${key}"><svg class="diagram-svg" viewBox="0 0 770 420" preserveAspectRatio="none" id="diagram-lines"><defs><marker id="inherit-arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto-start-reverse"><path d="M 0 0 L 12 6 L 0 12 z" fill="white" stroke="#4b6c81" stroke-width="1.3"/></marker></defs></svg>${ans.nodes.map(n=>`<div class="diagram-node" data-drag="${escapeHTML(n.id)}" style="left:${n.x}px;top:${n.y}px"><div class="diagram-node-h" data-handle="${escapeHTML(n.id)}">${escapeHTML(n.name)}</div><div class="diagram-node-b">${escapeHTML(n.attributes||'—')}</div></div>`).join('')}</div><div class="diagram-editors"><div class="schema-title">Edit classes and inheritance</div>${ans.nodes.map(n=>`<div class="node-edit-row"><input aria-label="Class name" data-node="${n.id}" data-field="name" value="${escapeHTML(n.name)}"><input aria-label="Attributes, one per line" data-node="${n.id}" data-field="attributes" value="${escapeHTML(n.attributes)}" placeholder="id: int; name: str"><select aria-label="Superclass" data-node="${n.id}" data-field="parent"><option value="">No superclass</option>${ans.nodes.filter(o=>o.id!==n.id).map(o=>`<option value="${o.id}" ${n.parent===o.id?'selected':''}>Extends ${escapeHTML(o.name)}</option>`).join('')}</select><button class="btn tiny danger" data-action="delete-node" data-key="${key}" data-node="${n.id}">×</button></div>`).join('')}</div></div>`;
}
function examPage(){state.page='exam';document.body.classList.toggle('contrast',state.contrast);document.body.dataset.theme=state.theme;document.documentElement.style.setProperty('--fontScale',state.scale);
 if(state.stage==='reading'){APP.innerHTML=readingScreen();return}
 const q=currentQuestion();const flags=state.flags;const nav=currentPaper().questions.map((qq,i)=>`<button class="number-cell ${state.questionIndex===i?'active':''} ${isAnswered(qq)?'answered':''} ${flags.includes(qq.n)?'flagged':''}" aria-label="Question ${qq.n}${isAnswered(qq)?' answered':''}" data-action="jump" data-index="${i}">${qq.n}</button>`).join('');
 APP.innerHTML=topbar(true)+`<main class="exam-layout"><section class="question-panel">${questionPanel(q)}</section><aside class="side-panel"><div class="side-head"><h3>Question navigation</h3><span class="tag">${qMark(q)} marks</span></div><div class="progress-track"><div style="width:${completedCount()/27*100}%"></div></div><span class="fine gray">${completedCount()} complete · ${27-completedCount()} incomplete</span><div class="number-grid">${nav}</div><div class="legend"><span><i class="dot a"></i>Complete</span><span><i class="dot"></i>Unanswered</span><span><i class="dot f"></i>Flagged</span></div><div class="side-tips">Your answers save on this device. Use the flag control for questions to revisit. The suggested word count is not enforced.</div><div class="tool-line"><button class="btn small" data-action="highlight">Highlight selection</button><button class="btn small" data-action="clear-highlight">Clear highlights</button></div><div class="split" style="margin-top:16px"><button class="btn small" data-action="notes">Scratchpad</button><button class="btn small" data-action="finish">Review submission</button></div></aside></main><div id="toast" class="toast" hidden></div>`;
 if(q.parts.some(p=>p.type==='diagram'))drawDiagram();
 persist();
}
function drawDiagram(){const q=currentQuestion(),p=q.parts.find(x=>x.type==='diagram');if(!p)return;const ans=answerOf(q,p);const canvas=document.getElementById('diagram-canvas'),svg=document.getElementById('diagram-lines');if(!canvas||!svg)return;
 // Preserve SVG defs while replacing connector lines
 svg.querySelectorAll('line').forEach(el=>el.remove());
 ans.nodes.forEach(n=>{if(!n.parent)return;const parent=ans.nodes.find(x=>x.id===n.parent);if(!parent)return;const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',n.x+87);line.setAttribute('y1',n.y+4);line.setAttribute('x2',parent.x+87);line.setAttribute('y2',parent.y+76);line.setAttribute('stroke','#4b6c81');line.setAttribute('stroke-width','2');line.setAttribute('marker-end','url(#inherit-arrow)');svg.appendChild(line)});
}
function setAnswer(key,v){state.answers[key]=v;persist();const count=document.querySelector(`[data-count="${key}"]`);if(count)count.textContent=wordCount(v);const progress=document.querySelector('.progress-track > div');if(progress)progress.style.width=(completedCount()/27*100)+'%';}
function nav(i){state.questionIndex=Math.max(0,Math.min(26,i));persist();examPage();window.scrollTo({top:0,behavior:'instant'})}
function showModal(inner){state.modal=true;document.body.insertAdjacentHTML('beforeend',`<div class="modal-bg" id="modal-bg"><div class="modal" role="dialog" aria-modal="true">${inner}</div></div>`)}
function closeModal(){state.modal=null;document.getElementById('modal-bg')?.remove()}
function settings(){showModal(`<h2>Display settings</h2><p>These practice display preferences are not official NESA exam settings.</p><label class="check-line"><input id="contrast-cb" type="checkbox" ${state.contrast?'checked':''}> Higher contrast</label><div class="schema-title" style="margin-top:20px">Background colour</div><div class="settings-scale"><button class="btn small" data-action="set-theme" data-theme="default">White</button><button class="btn small" data-action="set-theme" data-theme="cream">Cream</button><button class="btn small" data-action="set-theme" data-theme="blue">Pale blue</button></div><div class="schema-title" style="margin-top:20px">Text size</div><div class="settings-scale"><button class="btn" data-action="set-scale" data-size="0.90">A−</button><button class="btn" data-action="set-scale" data-size="1">A</button><button class="btn" data-action="set-scale" data-size="1.15">A+</button><button class="btn" data-action="set-scale" data-size="1.3">A++</button></div><div class="modal-controls"><button class="btn primary" data-action="close-modal">Done</button></div>`)}
function notes(){showModal(`<h2>Scratchpad</h2><p>Private notes for this practice paper. Not graded, and not part of your submitted response.</p><textarea id="notes-input" class="answer-box" style="min-height:270px">${escapeHTML(state.notes)}</textarea><div class="modal-controls"><button class="btn primary" data-action="close-modal">Close scratchpad</button></div>`)}
function confirmFinish(){const incomplete=currentPaper().questions.filter(q=>!isAnswered(q)).map(q=>q.n);showModal(`<h2>Submit practice examination?</h2><p>${completedCount()} of 27 questions are complete. ${incomplete.length?`Incomplete questions: ${incomplete.join(', ')}.`:'Every question has a response.'}</p><div class="exam-note">Submitting ends this attempt. Python and SQL are marked from attached code and saved queries; written-response marks are indicative. You can still review all model answers afterward.</div><div class="modal-controls"><button class="btn" data-action="close-modal">Return to exam</button><button class="btn danger" data-action="submit-confirm">Submit & mark now</button></div>`)}
function openIDE(key){const [n,id]=key.split('.'),q=currentPaper().questions[Number(n)-1],p=q.parts.find(x=>x.id===id);state.ide={key,q,p};state.ideOutput='';const code=state.drafts[key]??state.answers[key]??p.starter??'';
 document.body.insertAdjacentHTML('beforeend',`<div class="ide-overlay" id="ide-overlay" role="dialog" aria-modal="true" aria-label="Python editor"><div class="ide-card"><div class="ide-head"><div><b>Python IDE</b> <span class="fine">· Question ${n} · ${p.marks} marks</span></div><button class="btn small" data-action="close-ide">Close ✕</button></div><div class="ide-layout"><div class="ide-pane"><div class="tool-line"><strong>main.py</strong><span class="pill">Python 3 · WebAssembly</span></div><textarea id="ide-code" spellcheck="false" class="code-editor" aria-label="Python source code">${escapeHTML(code)}</textarea><div class="tool-line"><span class="fine muted">Tab inserts 4 spaces. Code is autosaved as a draft.</span><button class="btn small" data-action="ide-reset">Reset starter</button></div></div><div class="ide-pane"><div class="schema-title">Test input (one line per input() call)</div><textarea id="ide-stdin" class="answer-box" style="height:120px;min-height:120px;font-family:monospace" spellcheck="false">${escapeHTML(p.tests[0].stdin)}</textarea><div class="tool-line"><button class="btn primary" id="run-python" data-action="run-python">▶ Run Python</button><span class="fine muted">First run downloads the Python runtime.</span></div><div class="schema-title">Output / errors</div><pre id="ide-output" class="output-area" aria-live="polite">Write or paste Python, then Run Python.</pre></div></div><div class="ide-foot"><span class="fine muted">Only attached code is assessed. Drafts are not submitted.</span><div class="split"><button class="btn" data-action="close-ide">Keep draft</button><button class="btn primary" data-action="attach-code">Attach code to question →</button></div></div></div></div>`);
}
function closeIDE(){if(state.ide){state.drafts[state.ide.key]=document.getElementById('ide-code')?.value??state.drafts[state.ide.key];persist()}document.getElementById('ide-overlay')?.remove();if(pyWorker){pyWorker.terminate();pyWorker=null}state.ide=null}
function workerExecute(code,tests,timeout=35000){return new Promise((resolve,reject)=>{
 const worker=new Worker('./python-worker.js'),timer=setTimeout(()=>{worker.terminate();reject(Error('Python execution timed out. Check for an infinite loop or slow runtime download.'))},timeout);
 worker.onmessage=e=>{clearTimeout(timer);worker.terminate();if(e.data?.ok)resolve(e.data.results);else reject(Error(e.data?.error||'Python runtime could not load. Check internet access.'))};
 worker.onerror=e=>{clearTimeout(timer);worker.terminate();reject(Error('Could not start Python runtime. An internet connection is required on first use.'))};
 worker.postMessage({code,tests});
 })}
async function runPython(){if(!state.ide)return;const code=document.getElementById('ide-code').value,stdin=document.getElementById('ide-stdin').value,key=state.ide.key;
 state.drafts[key]=code;persist();const output=document.getElementById('ide-output'),btn=document.getElementById('run-python');btn.disabled=true;btn.textContent='Running…';output.textContent='Loading Python / executing program…';
 try{const [r]=await workerExecute(code,[{stdin}],45000);output.textContent=(r.stdout||'(no stdout)')+(r.stderr?'\n'+r.stderr:'')+(r.error?'\n'+r.error:'')}
 catch(e){output.textContent=String(e.message||e)}finally{btn.disabled=false;btn.textContent='▶ Run Python'}
}
function ensureSQL(){if(sqlLibraryPromise)return sqlLibraryPromise;sqlLibraryPromise=new Promise((resolve,reject)=>{
 if(window.initSqlJs){resolve(window.initSqlJs({locateFile:f=>`https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/${f}`}));return}
 const script=document.createElement('script');script.src='https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.js';script.onload=()=>resolve(window.initSqlJs({locateFile:f=>`https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/${f}`}));script.onerror=()=>reject(Error('SQL runtime unavailable. Connect to the internet and retry.'));document.head.appendChild(script)
 });return sqlLibraryPromise;
}
function validateSQL(query){const clean=query.trim().replace(/;\s*$/,'');if(!/^(SELECT|WITH)\s/i.test(clean))throw Error('Only SELECT and WITH queries are supported.');if(/;/.test(clean))throw Error('Only one read-only query can be run at a time.');if(/\b(INSERT|DELETE|DROP|UPDATE|ALTER|ATTACH|DETACH|PRAGMA|REPLACE|CREATE|VACUUM)\b/i.test(clean))throw Error('This editor only accepts read-only SQL.');return clean}
async function executeSQL(p,query){const SQL=await ensureSQL(),db=new SQL.Database();try{
 const cols=p.schema.columns,rows=p.schema.rows;
 db.run(`CREATE TABLE "${p.schema.name}" (${cols.map((c,j)=>`"${c}" ${typeof rows[0][j]==='number'?'NUMERIC':'TEXT'}`).join(', ')})`);
 const insert=db.prepare(`INSERT INTO "${p.schema.name}" VALUES (${cols.map(()=>'?').join(', ')})`);
 rows.forEach(row=>insert.run(row));insert.free();
 return db.exec(validateSQL(query));
 }finally{db.close()}}
async function runSQL(key){const [n,id]=key.split('.'),p=currentPaper().questions[Number(n)-1].parts.find(x=>x.id===id);const output=document.getElementById('sql-output');if(output)output.textContent='Running query…';try{const r=await executeSQL(p,state.answers[key]||'');const html=r.length?tableHTML(r[0].columns,r[0].values):'<span class="muted">Query completed with no rows.</span>';state.sqlOutputs[key]=html;if(output)output.innerHTML=html}
 catch(e){const error=`Error: ${String(e.message||e)}`;state.sqlOutputs[key]=escapeHTML(error);if(output)output.textContent=error}}
function keyMatches(t,text){try{return new RegExp(t,'i').test(text)}catch{return text.toLowerCase().includes(t.toLowerCase())}}
function markObjective(p,ans){let points=0,checks=[];
 if(p.type==='mc'){points=Number(ans)===p.correct?p.marks:0;checks=[{label:'Correct option: '+p.options[p.correct],hit:points>0}];}
 if(p.type==='multi'){let a=Array.isArray(ans)?ans:[],b=p.correct;points=a.length===b.length&&a.every(x=>b.includes(x))?1:0;checks=[{label:'Correct selections: '+b.map(x=>p.options[x]).join('; '),hit:points===1}];}
 if(p.type==='dropdown'){const vals=Array.isArray(ans)?ans:[],correct=p.rows.reduce((n,r,j)=>n+(vals[j]===r.correct),0);const thresh=p.thresholds||[p.rows.length];for(let z=0;z<thresh.length;z++)if(correct>=thresh[z]){points=p.marks-z;break}checks=p.rows.map((r,j)=>({label:`${r.label}: ${r.correct}`,hit:vals[j]===r.correct}));}
 return {score:points,checks};}
function markWritten(p,text){text=String(text||'').trim();if(!text)return{score:0,checks:p.criteria.map(c=>({label:c.label,hit:false}))};const checks=p.criteria.map(c=>({label:c.label,hit:c.all.every(pattern=>keyMatches(pattern,text))}));let score=Math.min(p.marks,checks.filter(x=>x.hit).length);
 // Prevent a one-line list of buzzwords from obtaining maximum credit when explanation was asked for.
 if(wordCount(text)<12&&p.marks>=3)score=Math.min(score,1);
 if(wordCount(text)<30&&p.marks>=5)score=Math.min(score,2);
 return {score,checks};}
function sqlGrade(p,q,res){const checks=[{label:'Query runs and returns grouped counts',hit:false},{label:'Correctly restricts to the required status',hit:false},{label:'Produces the correct label/count pairs',hit:false},{label:'Sorts by descending frequency',hit:false}];
 if(!q?.trim()||!res||res.error)return{score:0,checks};
 const r=res.data?.[0];if(!r||!r.values?.length)return{score:0,checks};
 let pairs=r.values.map(row=>{const nums=row.filter(v=>typeof v==='number'),labels=row.filter(v=>typeof v==='string');return [String(labels[0]??''),Number(nums[0])]});
 checks[0].hit=/\b(count|sum)\s*\(/i.test(q)&&/group\s+by/i.test(q)&&pairs.every(x=>x[0]&&Number.isFinite(x[1]));
 checks[1].hit=/\bwhere\b/i.test(q)&&/\bstatus\b/i.test(q)&&p.filter.some(v=>new RegExp(v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i').test(q));
 const expected=p.expected.map(([a,b])=>[String(a),Number(b)]);
 const normalize=a=>JSON.stringify(a.slice().sort((x,y)=>x[0].localeCompare(y[0])));
 checks[2].hit=normalize(pairs)===normalize(expected);
 checks[3].hit=/order\s+by/i.test(q)&&/desc/i.test(q)&&pairs.every((x,i)=>i===0||pairs[i-1][1]>=x[1]);
 return{score:checks.filter(c=>c.hit).length,checks};}
function diagramGrade(p,ans){const checks=[{label:'Superclass contains common fields exactly once',hit:false},{label:'Models all three specialised classes',hit:false},{label:'Connects subclasses to the superclass using inheritance',hit:false}];if(!ans?.nodes)return{score:0,checks};
 const nodes=ans.nodes,superNode=nodes.find(n=>n.name.toLowerCase().replace(/\s/g,'')===p.diagram.names[0].toLowerCase());
 checks[0].hit=!!superNode&&p.diagram.common.every(x=>superNode.attributes.toLowerCase().includes(x.split(':')[0].toLowerCase()))&&nodes.filter(n=>n!==superNode).every(n=>!p.diagram.common.some(x=>n.attributes.toLowerCase().includes(x.split(':')[0].toLowerCase())));
 checks[1].hit=p.diagram.names.slice(1).every(name=>nodes.some(n=>n.name.toLowerCase().replace(/\s/g,'')===name.toLowerCase()));
 checks[2].hit=!!superNode&&p.diagram.names.slice(1).every(name=>nodes.find(n=>n.name.toLowerCase()===name.toLowerCase())?.parent===superNode.id);
 return{score:checks.filter(c=>c.hit).length,checks};}
function codeGrade(p,attached,results){const total=p.tests.length;if(!String(attached||'').trim())return{score:0,checks:[{label:'No code attached',hit:false}]};if(!results||results.error)return{score:0,checks:[{label:results?.error||'Python was not available for marking',hit:false}]};
 const checks=p.tests.map((test,i)=>{const res=results.output[i],correct=!!res&&!res.error&&String(res.stdout).toLowerCase().includes(test.contains.toLowerCase());return{label:`Automated test ${i+1}: ${correct?'passed':'failed'} (input: ${test.stdin.replace(/\n/g,' / ')})`,hit:correct}});
 const pass=checks.filter(c=>c.hit).length;return{score:Math.round(p.marks*pass/total),checks};}
async function submitPaper(auto=false){if(state.working)return;closeModal();state.working=true;clearInterval(timerInterval);state.page='marking';APP.innerHTML=topbar()+`<main class="reading-screen"><div class="card"><h1>Marking your attempt</h1><p>Evaluating objective answers, criteria and code test cases. Python may need to load a WebAssembly runtime.</p><div class="progress-track"><div style="width:35%"></div></div><p id="mark-progress">Checking answers…</p></div></main>`;
 const paper=currentPaper(),codeResults={},sqlResults={};
 const codes=paper.questions.flatMap(q=>q.parts.filter(p=>p.type==='python').map(p=>({q,p,key:partKey(q,p)})));
 for(let j=0;j<codes.length;j++){
  const {p,key}=codes[j];document.getElementById('mark-progress').textContent=`Running Python test cases ${j+1} of ${codes.length}…`;
  if(!state.answers[key]?.trim()){codeResults[key]=null;continue}
  try{codeResults[key]={output:await workerExecute(state.answers[key],p.tests,55000)}}catch(e){codeResults[key]={error:String(e.message||e)}}
 }
 const sqlParts=paper.questions.flatMap(q=>q.parts.filter(p=>p.type==='sql').map(p=>({p,key:partKey(q,p)})));
 for(const {p,key} of sqlParts){document.getElementById('mark-progress').textContent='Running final SQL query…';if(!state.answers[key]?.trim())continue;try{sqlResults[key]={data:await executeSQL(p,state.answers[key])}}catch(e){sqlResults[key]={error:String(e.message||e)}}}
 let total=0,breakdown={};
 paper.questions.forEach(q=>{
 const parts=q.parts.map(p=>{const key=partKey(q,p),ans=state.answers[key];let result;
 if(['mc','multi','dropdown'].includes(p.type))result=markObjective(p,ans);
 if(p.type==='written')result=markWritten(p,ans);
 if(p.type==='diagram')result=diagramGrade(p,ans);
 if(p.type==='sql')result=sqlGrade(p,ans,sqlResults[key]);
 if(p.type==='python')result=codeGrade(p,ans,codeResults[key]);
 total+=result.score;return{id:p.id,score:result.score,max:p.marks,checks:result.checks,answer:ans??null};
 });breakdown[q.n]=parts;
 });
 state.results={total,breakdown,endedAt:now(),auto,allCorrect:false};state.stage='result';state.completed=true;state.working=false;persist();resultsPage();
}
function reviewQ(q){const rp=state.results.breakdown[q.n],score=rp.reduce((s,p)=>s+p.score,0),max=qMark(q);
 return `<article class="review"><div class="review-head" data-action="toggle-review" data-number="${q.n}" tabindex="0"><h3>Question ${q.n} · ${escapeHTML(q.title)}</h3><span class="tag ${score===max?'good':score===0?'bad':'warn'}">${score} / ${max}</span></div><div class="review-detail" id="review-${q.n}" style="display:${q.n===15?'block':'none'}">${q.stimulus?`<p class="fine muted">${escapeHTML(q.stimulus)}</p>`:''}${q.parts.map((p,j)=>{const r=rp[j];let your=r.answer;if(p.type==='diagram')your=(your?.nodes||[]).map(n=>`${n.name} [${n.attributes}] ${n.parent?'extends '+(your.nodes.find(x=>x.id===n.parent)?.name||'unknown'):''}`).join('\n');if(Array.isArray(your))your=JSON.stringify(your);return `<div class="review-part"><div class="split" style="justify-content:space-between"><b>${q.parts.length>1?'('+p.id+') ':''}${escapeHTML(p.prompt)}</b><span class="tag">${r.score} / ${r.max}</span></div><p class="fine gray">Your response:</p><pre class="sample-answer" style="background:#fff">${escapeHTML(your||'No answer')}</pre><div class="schema-title">Marking criteria ${p.type==='written'||p.type==='diagram'?'· indicative':''}</div>${r.checks.map(ch=>`<div class="criterion ${ch.hit?'hit':''}">${ch.hit?'✓':'○'} ${escapeHTML(ch.label)}</div>`).join('')}<div class="schema-title" style="margin-top:15px">${p.type==='mc'||p.type==='multi'||p.type==='dropdown'?'Correct answers':'Example full-credit response'}</div><pre class="sample-answer">${escapeHTML(exemplar(p))}</pre></div>`}).join('')}</div></article>`;
}
function exemplar(p){if(p.sample)return p.sample;if(p.type==='mc')return p.options[p.correct];if(p.type==='multi')return p.correct.map(x=>p.options[x]).join('; ');if(p.type==='dropdown')return p.rows.map(r=>`${r.label}: ${r.correct}`).join('\n');return ''}
function resultsPage(){state.page='results';clearInterval(timerInterval);const total=state.results.total,p=currentPaper(),unanswered=p.questions.filter(q=>!isAnswered(q)).length;
 APP.innerHTML=topbar()+`<main class="result-wrap"><div class="result-hero"><div><div class="eyebrow">PRACTICE EXAM COMPLETE · NOT AN OFFICIAL MARK</div><h1>${escapeHTML(p.title)}</h1><p class="muted">Instant criterion review across ${p.questionCount} questions · ${new Date(state.results.endedAt).toLocaleString('en-AU')}</p><span class="tag warn">Written and diagram scores are indicative</span></div><div><div class="score-number">${total}<span class="muted" style="font-size:29px"> / 80</span></div><div class="result-metrics"><div class="metric"><b>${Math.round(total/80*100)}%</b><small>Practice percentage</small></div><div class="metric"><b>${unanswered}</b><small>Incomplete questions</small></div></div></div></div><div class="tool-line" style="margin-top:21px"><div><h2 class="section-title" style="margin:0">Review your responses</h2><p class="fine muted" style="margin:0">Review the model answers and which marking criteria were detected.</p></div><div class="split"><button class="btn small" data-action="print">Print feedback</button><button class="btn small" data-action="export">Export attempt (.json)</button><button class="btn small" data-action="go-home">Other papers</button><button class="btn small danger" data-action="restart">Reset this paper</button></div></div><div class="exam-note">Your marks are for practice only. Objective items are checked exactly, SQL and Python against machine-verifiable tests, and extended responses using a limited rule-based rubric. The evaluator may miss valid alternative explanations or give credit to incomplete writing. Read the criteria and model answer yourself before relying on a result.</div><div class="review-filter"><button class="btn small" data-action="filter" data-filter="all">All questions</button><button class="btn small" data-action="filter" data-filter="missed">Marks lost</button><button class="btn small" data-action="expand-all">Expand all</button><button class="btn small" data-action="collapse-all">Collapse all</button></div><div id="reviews">${p.questions.filter(q=>state.filter!=='missed'||state.results.breakdown[q.n].some(x=>x.score<x.max)).map(reviewQ).join('')}</div><p class="legal">Sources for question formats: <a href="${SOURCE.officialExam}" target="_blank" rel="noopener">NESA 2025 exam pack</a> and <a href="${SOURCE.markingGuidelines}" target="_blank" rel="noopener">2025 marking guidelines</a>. These are original practice prompts and independently authored exemplars.</p></main>`;
}
function exportAttempt(){const blob=new Blob([JSON.stringify({paper:currentPaper().title,answers:state.answers,results:state.results,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=`se-examlab-paper-${state.paperIndex+1}-results.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
let dragging=null;
document.addEventListener('pointerdown',e=>{const handle=e.target.closest('[data-handle]');if(!handle)return;const q=currentQuestion(),p=q.parts.find(x=>x.type==='diagram');if(!p)return;const el=handle.closest('.diagram-node');const node=answerOf(q,p).nodes.find(x=>x.id===handle.dataset.handle);if(!node)return;dragging={node,el,startX:e.clientX,startY:e.clientY,initialX:node.x,initialY:node.y};handle.setPointerCapture(e.pointerId)});
document.addEventListener('pointermove',e=>{if(!dragging)return;dragging.node.x=Math.min(550,Math.max(0,dragging.initialX+e.clientX-dragging.startX));dragging.node.y=Math.min(340,Math.max(0,dragging.initialY+e.clientY-dragging.startY));dragging.el.style.left=dragging.node.x+'px';dragging.el.style.top=dragging.node.y+'px';drawDiagram()});
document.addEventListener('pointerup',()=>{if(dragging){dragging=null;persist()}});
document.addEventListener('input',e=>{
 const t=e.target;if(t.dataset.ans){const key=t.dataset.ans;
 if(t.dataset.type==='written'||t.dataset.type==='sql')setAnswer(key,t.value);
 if(t.dataset.type==='mc')setAnswer(key,Number(t.value));
 if(t.dataset.type==='multi'){const vals=Array.from(document.querySelectorAll(`[data-ans="${key}"]:checked`)).map(x=>Number(x.value));setAnswer(key,vals)}
 }
 if(t.id==='notes-input'){state.notes=t.value;persist()}
 if(t.id==='ide-code'&&state.ide){state.drafts[state.ide.key]=t.value;persist()}
 if(t.dataset.node){const q=currentQuestion(),p=q.parts.find(x=>x.type==='diagram');if(!p)return;const ans=answerOf(q,p);const node=ans.nodes.find(n=>n.id===t.dataset.node);if(node){node[t.dataset.field]=t.value;persist();const el=document.querySelector(`[data-drag="${node.id}"]`);if(el){el.querySelector('.diagram-node-h').textContent=node.name;el.querySelector('.diagram-node-b').textContent=node.attributes||'—'}}}
});
document.addEventListener('change',e=>{const t=e.target;
 if(t.dataset.ans&&t.dataset.type==='dropdown'){const v=[...(state.answers[t.dataset.ans]||[])];v[Number(t.dataset.row)]=t.value;setAnswer(t.dataset.ans,v)}
 if(t.dataset.ans&&t.dataset.type==='mc')setAnswer(t.dataset.ans,Number(t.value));
 if(t.dataset.ans&&t.dataset.type==='multi')setAnswer(t.dataset.ans,Array.from(document.querySelectorAll(`[data-ans="${t.dataset.ans}"]:checked`)).map(x=>Number(x.value)));
 if(t.dataset.field==='parent'){const p=currentQuestion().parts.find(x=>x.type==='diagram'),ans=answerOf(currentQuestion(),p);ans.nodes.find(x=>x.id===t.dataset.node).parent=t.value;drawDiagram();persist()}
 if(t.id==='contrast-cb'){state.contrast=t.checked;document.body.classList.toggle('contrast',t.checked);persist()}
});
document.addEventListener('keydown',e=>{if(e.target.id==='ide-code'&&e.key==='Tab'){e.preventDefault();let t=e.target,start=t.selectionStart,end=t.selectionEnd;t.setRangeText('    ',start,end,'end');state.drafts[state.ide.key]=t.value;persist()}
 if(e.key==='Escape'){if(state.ide)closeIDE();else closeModal()}
 if((e.key==='Enter'||e.key===' ')&&e.target.matches('.review-head')){e.preventDefault();e.target.click()}
});
document.addEventListener('click',async e=>{const control=e.target.closest('[data-action]');if(!control)return;const action=control.dataset.action;
 if(action==='open-paper')enterPaper(Number(control.dataset.paper));
 else if(action==='go-home')home();
 else if(action==='begin-work')startWork();
 else if(action==='jump')nav(Number(control.dataset.index));
 else if(action==='nav'){const next=state.questionIndex+Number(control.dataset.delta);if(next>26){if(state.stage==='work')confirmFinish()}else nav(next)}
 else if(action==='highlight')highlightSelection();
 else if(action==='clear-highlight'){delete state.highlight[currentQuestion().n];persist();examPage()}
 else if(action==='flag'){const n=currentQuestion().n;state.flags=state.flags.includes(n)?state.flags.filter(x=>x!==n):[...state.flags,n];persist();examPage()}
 else if(action==='finish')confirmFinish();
 else if(action==='submit-confirm')submitPaper(false);
 else if(action==='close-modal')closeModal();
 else if(action==='settings')settings();
 else if(action==='notes')notes();
 else if(action==='set-theme'){state.theme=control.dataset.theme;document.body.dataset.theme=state.theme;persist()}
 else if(action==='set-scale'){state.scale=Number(control.dataset.size);document.documentElement.style.setProperty('--fontScale',state.scale);persist()}
 else if(action==='ide')openIDE(control.dataset.key);
 else if(action==='close-ide')closeIDE();
 else if(action==='run-python')runPython();
 else if(action==='attach-code'){const ide=state.ide;if(!ide)return;setAnswer(ide.key,document.getElementById('ide-code').value);closeIDE();examPage()}
 else if(action==='ide-reset'&&state.ide){document.getElementById('ide-code').value=state.ide.p.starter||'';state.drafts[state.ide.key]=state.ide.p.starter||'';persist()}
 else if(action==='run-sql')runSQL(control.dataset.key);
 else if(action==='add-node'){const key=control.dataset.key,p=currentPart(key.split('.')[1]),ans=answerOf(currentQuestion(),p);const n=ans.nodes.length;ans.nodes.push({id:'new'+Date.now().toString(36),name:'New Class',attributes:'',parent:'',x:Math.min(500,20+n*33),y:330});persist();examPage()}
 else if(action==='delete-node'){const key=control.dataset.key,p=currentPart(key.split('.')[1]),ans=answerOf(currentQuestion(),p);if(ans.nodes.length<=1)return;ans.nodes=ans.nodes.filter(x=>x.id!==control.dataset.node);ans.nodes.forEach(n=>{if(n.parent===control.dataset.node)n.parent=''});persist();examPage()}
 else if(action==='toggle-review'){const d=document.getElementById('review-'+control.dataset.number);if(d)d.style.display=d.style.display==='none'?'block':'none'}
 else if(action==='filter'){state.filter=control.dataset.filter;resultsPage()}
 else if(action==='expand-all')document.querySelectorAll('.review-detail').forEach(el=>el.style.display='block');
 else if(action==='collapse-all')document.querySelectorAll('.review-detail').forEach(el=>el.style.display='none');
 else if(action==='print')window.print();
 else if(action==='export')exportAttempt();
 else if(action==='restart'){showModal(`<h2>Reset this practice paper?</h2><p>All saved answers, diagrams and results for this paper will be permanently cleared from this device.</p><div class="modal-controls"><button class="btn" data-action="close-modal">Cancel</button><button class="btn danger" data-action="confirm-reset">Clear and restart</button></div>`)}
 else if(action==='confirm-reset'){delete allSessions[currentPaper().id];state.page='home';persist();closeModal();home()}
});
window.addEventListener('beforeunload',()=>{if(state.page==='exam'||state.page==='results')persist()});
document.documentElement.style.setProperty('--fontScale',state.scale);document.body.classList.toggle('contrast',state.contrast);document.body.dataset.theme=state.theme;
home();
})();
