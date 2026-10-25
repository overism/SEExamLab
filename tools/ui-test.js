// jsdom UI walkthrough (no real browser available here): render, navigate, answer, run SQL/Python, submit, review, persistence.
const {boot}=require('./lib');
let pass=0,fail=0;const t=(n,c,x='')=>{if(c){pass++;console.log('  ok  '+n)}else{fail++;console.log('  FAIL '+n+' '+x)}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const until=async(f,ms=30000)=>{const s=Date.now();while(Date.now()-s<ms){try{const v=f();if(v)return v}catch{}await sleep(100)}return null};
(async()=>{
 const w=await boot('data.js',w=>{
  const P=w.SE_PAPERS,clone=JSON.parse(JSON.stringify(P[0]));clone.id=99;clone.title='Paper 99 — UI fixture';
  const wards={name:'Wards',columns:['WardID','WardName','Capacity'],rows:[['W1','Emergency',20],['W2','General',35]]};
  const pats={name:'Patients',columns:['PatientID','WardID','Priority','Status'],rows:[[101,'W1','High','Waiting'],[102,'W2','Medium','Admitted'],[103,'W1','High','Waiting'],[104,'W1','High','Waiting']]};
  clone.questions[20].parts[0]={id:'a',type:'sql',marks:4,prompt:'List wards with more than one high-priority waiting patient, largest first.',tables:[wards,pats],ordered:true,
    sample:"SELECT w.WardName, COUNT(*) AS n FROM Patients p JOIN Wards w ON p.WardID=w.WardID WHERE p.Priority='High' AND p.Status='Waiting' GROUP BY w.WardID HAVING COUNT(*)>1 ORDER BY n DESC"};
  clone.questions[21].parts[0]={id:'a',type:'diagram',marks:3,prompt:'Construct a class diagram.',spec:{classes:[{name:'Animal',attrs:['colour','size'],parent:null},{name:'Dog',attrs:['breed'],parent:'Animal'},{name:'Cat',attrs:['indoor'],parent:'Animal'}]}};
  P.push(clone);
 });
 const $=s=>w.document.querySelector(s),$$=s=>[...w.document.querySelectorAll(s)];
 const click=s=>{const el=typeof s==='string'?$(s):s;if(!el)throw Error('missing '+s);el.click()};
 const setVal=(el,v,type='input')=>{el.value=v;el.dispatchEvent(new w.Event(type,{bubbles:true}))};
 console.log('Homepage');
 const NP=w.SE_PAPERS.length,TQ=NP*27,TM=NP*80;
 t('shows a card per paper and the paper count in the hero',$$('.paper').length===NP&&new RegExp(NP+' complete practice papers').test($('.hero h1').textContent));
 t(`hero stats are computed (${NP} papers, ${TQ} questions, ${TM} marks)`,new RegExp(NP+' original exams').test(document_text())&&new RegExp(TQ+' questions').test(document_text())&&new RegExp(TM+' marks').test(document_text()),$('.hero').textContent);
 function document_text(){return w.document.body.textContent}
 t('card number zero-padded from id',$$('.paper-count').map(x=>x.textContent).slice(-1)[0]==='MOCK EXAMINATION 99');
 console.log('Paper 01 partial attempt (existing-attempt preservation)');
 click('[data-action="open-paper"][data-paper="0"]');click('[data-action="begin-work"]');
 const r=$('input[data-ans="1.a"][value="0"]');r.checked=true;r.dispatchEvent(new w.Event('change',{bubbles:true}));
 const ls=()=>JSON.parse(w.localStorage.getItem('se-examlab-v2'));
 t('paper 1 answer saved under session id 1',ls().sessions['1']?.answers['1.a']===0);
 click('[data-action="jump"][data-index="0"]');
 w.eval("document.querySelector('[data-action=\"jump\"]')");
 // go home via settings? use top navigation: re-run home through the results path is not available mid-exam; reload the page state instead
 console.log('Paper 06 walkthrough');
 // Navigate home by recreating the app (simulates page reload) — storage must survive
 const w2=await boot('data.js',()=>{});w2.localStorage.setItem('se-examlab-v2',w.localStorage.getItem('se-examlab-v2'));
 // second boot has its own jsdom storage; verify instead on original window using beforeunload persistence
 t('storage key unchanged (se-examlab-v2)',typeof w.localStorage.getItem('se-examlab-v2')==='string');
 // use a fresh boot with the fixture and a seeded legacy session to prove old attempts remain
 const seed=JSON.stringify({sessions:{'1':ls().sessions['1']},contrast:false,scale:1,theme:'default'});
 const w3=await boot('data.js',w=>{const P=w.SE_PAPERS,c=JSON.parse(JSON.stringify(P[0]));c.id=99;c.title='Paper 99 — UI fixture';
  const wards={name:'Wards',columns:['WardID','WardName','Capacity'],rows:[['W1','Emergency',20],['W2','General',35]]};
  const pats={name:'Patients',columns:['PatientID','WardID','Priority','Status'],rows:[[101,'W1','High','Waiting'],[102,'W2','Medium','Admitted'],[103,'W1','High','Waiting'],[104,'W1','High','Waiting']]};
  c.questions[20].parts[0]={id:'a',type:'sql',marks:4,prompt:'List wards with more than one high-priority waiting patient, largest first.',tables:[wards,pats],ordered:true,sample:"SELECT w.WardName, COUNT(*) AS n FROM Patients p JOIN Wards w ON p.WardID=w.WardID WHERE p.Priority='High' AND p.Status='Waiting' GROUP BY w.WardID HAVING COUNT(*)>1 ORDER BY n DESC"};
  c.questions[21].parts[0]={id:'a',type:'diagram',marks:3,prompt:'Construct a class diagram.',spec:{classes:[{name:'Animal',attrs:['colour','size'],parent:null},{name:'Dog',attrs:['breed'],parent:'Animal'},{name:'Cat',attrs:['indoor'],parent:'Animal'}]}};
  P.push(c);w.localStorage.setItem('se-examlab-v2',seed)},);
 // NOTE: boot() evaluates app.js after mutate, so the seeded storage is read on load.
 const $3=s=>w3.document.querySelector(s),$$3=s=>[...w3.document.querySelectorAll(s)];
 const tag=$$3('.paper')[0].querySelector('.tag').textContent;
 t('legacy in-progress attempt still shown after expansion ("'+tag+'")',/in progress/i.test(tag));
 const c3=s=>{const el=$3(s);if(!el)throw Error('missing '+s);el.click()};
 const N3=w3.SE_PAPERS.length-1;
 c3(`[data-action="open-paper"][data-paper="${N3}"]`);
 t('reading screen for the fixture paper',/Reading time/i.test(w3.document.body.textContent));
 c3('[data-action="begin-work"]');
 // Python Q19
 c3('[data-action="jump"][data-index="18"]');c3('[data-action="ide"]');
 const code=w3.document.getElementById('ide-code');code.value='a=input("Enter code: ")\nb=input("Confirm code: ")\nprint("Access granted" if a==b and len(a)==4 else "Access denied")';code.dispatchEvent(new w3.Event('input',{bubbles:true}));
 setVal.call(null,w3.document.getElementById('ide-stdin'),'A5x9\nA5x9');
 c3('#run-python');const out=await until(()=>{const o=w3.document.getElementById('ide-output').textContent;return /Access|Error|Trace/.test(o)?o:null},60000);
 t('IDE run echoes prompts like a terminal: '+JSON.stringify(out),/Enter code: A5x9/.test(out)&&/Access granted/.test(out));
 c3('[data-action="attach-code"]');
 t('code attached tag',/Code attached/.test(w3.document.body.textContent));
 // SQL Q21 (two tables)
 c3('[data-action="jump"][data-index="20"]');
 t('both tables displayed',$$3('.db-schema').length===2);
 const sq=w3.document.getElementById('sql-input');setVal(sq,"SELECT WardName, COUNT(*) FROM Patients p JOIN Wards w ON p.WardID=w.WardID WHERE Priority='High' AND Status='Waiting' GROUP BY w.WardID HAVING COUNT(*)>1 ORDER BY 2 DESC");
 c3('[data-action="run-sql"]');const tbl=await until(()=>$3('#sql-output table'));
 t('SQL run shows result table',!!tbl&&/Emergency/.test(tbl.textContent)&&/3/.test(tbl.textContent),tbl&&tbl.textContent);
 // Diagram Q22
 c3('[data-action="jump"][data-index="21"]');
 t('diagram starts with no inheritance preselected',$$3('select[data-field="parent"]').every(s=>s.value===''));
 const names=['Animal','Dog','Cat','Class 4'],attrs=['colour: str; size: int','breed: str','indoor: bool',''];
 $$3('input[data-field="name"]').forEach((el,i)=>setVal(el,names[i]));$$3('input[data-field="attributes"]').forEach((el,i)=>setVal(el,attrs[i]));
 const sel=$$3('select[data-field="parent"]'),opts=[...sel[1].options].map(o=>({v:o.value,t:o.textContent}));
 const animalId=opts.find(o=>/Animal/.test(o.t)).v;setVal(sel[1],animalId,'change');setVal($$3('select[data-field="parent"]')[2],animalId,'change');
 // submit
 c3('[data-action="finish"]');c3('[data-action="submit-confirm"]');
 const score=await until(()=>$3('.score-number'),90000);
 t('results page appears',!!score);
 const revs=Object.fromEntries($$3('.review').map(r=>{const m=r.querySelector('h3').textContent.match(/Question (\d+)/);return[m[1],r.querySelector('.tag').textContent.trim()]}));
 t('Q19 python 3/3',revs[19]==='3 / 3',revs[19]);t('Q21 sql 4/4',revs[21]==='4 / 4',revs[21]);t('Q22 diagram 3/3',revs[22]==='3 / 3',revs[22]);
 t('Q1 unanswered mc scores 0 (paper 6 had no answers)',revs[1]==='0 / 1',revs[1]);
 c3('[data-action="go-home"]');
 t('home shows completed fixture paper with score',/Completed · \d+\/80/.test($$3('.paper')[N3].textContent),$$3('.paper')[N3].textContent);
 t('paper 01 attempt untouched after finishing fixture paper',JSON.parse(w3.localStorage.getItem('se-examlab-v2')).sessions['1']?.answers['1.a']===0);
 c3(`[data-action="open-paper"][data-paper="${N3}"]`);
 t('finished paper re-opens on results page',!!$3('.score-number'));
 console.log(`\n${pass} passed, ${fail} failed`);process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(2)});
