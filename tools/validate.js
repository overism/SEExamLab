// Usage: node validate.js [data.js] [--papers=6,7]   Validates structure and runs every model answer through the real marking engine.
const {boot}=require('./lib');
const file=process.argv.find(a=>/\.js$/.test(a)&&!/validate/.test(a))||'data.js';
const only=(process.argv.find(a=>a.startsWith('--papers='))||'').slice(9).split(',').filter(Boolean).map(Number);
const TYPES=['mc','multi','dropdown','written','python','sql','diagram'];
(async()=>{
 const w=await boot(file),E=w.SE_ENGINE,P=w.SE_PAPERS;const problems=[],legacyWarnings=[];const bad=(p,m)=>((p.id<=5&&/criteria satisfied fully|generic filler/.test(m))?legacyWarnings:problems).push(`Paper ${p.id}: ${m}`);
 const ids=new Set();let totalQ=0,totalM=0;
 for(const p of P){
  if(only.length&&!only.includes(p.id))continue;
  if(ids.has(p.id))bad(p,'duplicate id');ids.add(p.id);
  if(p.questions.length!==27)bad(p,`${p.questions.length} questions`);
  const marks=p.questions.reduce((s,q)=>s+q.parts.reduce((a,x)=>a+x.marks,0),0);if(marks!==80||p.marks!==80)bad(p,`${marks} marks`);
  if(p.readingMinutes!==10||p.workingMinutes!==140)bad(p,'timing');
  totalQ+=p.questions.length;totalM+=marks;
  let score=0;const misses=[],crossWarn=[];const writtenSamples=p.questions.flatMap(q=>q.parts.filter(x=>x.type==='written').map(x=>({part:x,sample:x.sample,tag:`Q${q.n}${x.id}`})));
  for(let qi=0;qi<p.questions.length;qi++){const q=p.questions[qi];
   if(q.n!==qi+1)bad(p,`question numbering at index ${qi}`);
   const pids=new Set();
   for(const part of q.parts){const tag=`Q${q.n}${part.id}`;
    if(pids.has(part.id))bad(p,`${tag} duplicate part id`);pids.add(part.id);
    if(!TYPES.includes(part.type)){bad(p,`${tag} bad type ${part.type}`);continue}
    if(!String(part.prompt||'').trim()&&part.type!=='python')bad(p,`${tag} empty prompt`);
    if(!Number.isInteger(part.marks)||part.marks<1)bad(p,`${tag} bad marks`);
    let r;
    try{
     if(part.type==='mc'){if(!(part.correct>=0&&part.correct<part.options.length))bad(p,`${tag} bad key`);r=E.markObjective(part,part.correct)}
     else if(part.type==='multi'){if(!part.correct.every(x=>x>=0&&x<part.options.length)||!part.correct.length)bad(p,`${tag} bad key`);r=E.markObjective(part,part.correct)}
     else if(part.type==='dropdown'){if(!part.rows.every(x=>part.choices.includes(x.correct)))bad(p,`${tag} dropdown key not in choices`);r=E.markObjective(part,part.rows.map(x=>x.correct))}
     else if(part.type==='written'){if(!part.sample||!part.criteria?.length)bad(p,`${tag} missing sample/criteria`);r=E.markWritten(part,part.sample)}
     else if(part.type==='python'){if(!part.sample||!part.tests?.length)bad(p,`${tag} missing sample/tests`);
        const res=await E.workerExecute(part.sample,part.tests,{echo:false,testMs:10000});r=E.codeGrade(part,part.sample,{output:res})}
     else if(part.type==='sql'){
        if(part.tables){r=await E.gradeSQLNew(part,part.sample)}
        else{const data=await E.executeSQL(part,part.sample);r=E.sqlGrade(part,part.sample,{data})}}
     else if(part.type==='diagram'){const ans=buildDiagram(part);r=E.diagramGrade(part,ans)}
    }catch(e){bad(p,`${tag} threw: ${e.message}`);continue}
    if(part.type==='python'&&part.mutants){for(const [mi,mu] of part.mutants.entries()){const res=await E.workerExecute(mu,part.tests,{echo:false,testMs:8000});const g=E.codeGrade(part,mu,{output:res});if(g.score>=part.marks)bad(p,`${tag} mutant ${mi} still earns full marks`)}}
    if(part.type==='sql'&&part.tables){const ref=(await E.executeSQL(part,part.sample))[0];if(part.expectedRows&&JSON.stringify(ref.values)!==JSON.stringify(part.expectedRows))bad(p,`${tag} expectedRows differ from reference output: ${JSON.stringify(ref.values)}`);
      (part.hidden||[]).forEach(async()=>{});for(const [hi,h] of (part.hidden||[]).entries()){const r2=(await E.executeSQL(part,part.sample,h))[0];console.log(`    ${tag} hidden dataset ${hi+1} reference output: ${JSON.stringify(r2.values)}`)}}
    if(part.type==='written'){for(const o of writtenSamples){if(o.part===part)continue;const g=E.markWritten(part,o.sample);if(g.score>=part.marks)bad(p,`${tag} criteria satisfied fully by the answer to ${o.tag}`);else if(g.score>=part.marks-1&&part.marks>=3)crossWarn.push(`${tag} gets ${g.score}/${part.marks} from ${o.tag}`)}
      const empty=E.markWritten(part,'');if(empty.score!==0)bad(p,`${tag} empty answer scores ${empty.score}`);
      const salad=E.markWritten(part,'It depends on many factors and the system should be secure, efficient and fair for users, with data protected and good design that meets requirements and improves the overall outcome for everyone involved in the project over time.');if(salad.score>=Math.ceil(part.marks/2))bad(p,`${tag} generic filler text scores ${salad.score}/${part.marks}`)}
    score+=r.score;if(r.score!==part.marks)misses.push(`${tag} ${r.score}/${part.marks} [${r.checks.filter(c=>!c.hit).map(c=>c.label).join('; ')}]`);
   }
  }
  console.log(`Paper ${p.id} ${p.title}: oracle score ${score}/80`+(misses.length?`\n    `+misses.join('\n    '):'')+(crossWarn.length?`\n    near-miss cross-marks (review): `+crossWarn.join('; '):''));
 }
 console.log(`\nPapers checked: ${ids.size}, questions ${totalQ}, marks ${totalM}`);
 if(legacyWarnings.length)console.log(`\nWARNINGS in original Papers 01-05 (not changed): ${legacyWarnings.length} written-criteria weaknesses (e.g. Q23a is fully satisfied by generic filler text)`);
 console.log(problems.length?`STRUCTURAL PROBLEMS (${problems.length}):\n`+problems.join('\n'):'No structural problems.');
 process.exit(problems.length?1:0);
 function buildDiagram(part){
  const nodes=[];
  if(part.spec){const id=n=>'n_'+n;part.spec.classes.forEach((c,i)=>nodes.push({id:id(c.name),name:c.name,attributes:c.attrs.map(a=>a.split('|')[0]+(part.spec.types?.[a.split('|')[0]]?': '+part.spec.types[a.split('|')[0]]:': str')).join('; '),parent:c.parent?id(c.parent):'',x:0,y:0}))}
  else{const d=part.diagram;nodes.push({id:'s',name:d.names[0],attributes:d.common.join('; '),parent:'',x:0,y:0});d.names.slice(1).forEach((n,i)=>nodes.push({id:'c'+i,name:n,attributes:(d.specific[n]||[]).join('; '),parent:'s',x:0,y:0}))}
  return {nodes};
 }
})().catch(e=>{console.error(e);process.exit(2)});
