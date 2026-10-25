// Opens every paper in jsdom, starts working time and renders each of the 27 questions, checking parts/controls appear.
const {boot}=require('./lib');
(async()=>{
 const errors=[];let bad=0,visited=0;const NP=(await boot()).SE_PAPERS.length;
 for(let pi=0;pi<NP;pi++){
  const w=await boot();w.addEventListener('error',e=>errors.push(e.message));
  const $=s=>w.document.querySelector(s),$$=s=>[...w.document.querySelectorAll(s)];
  const P=w.SE_PAPERS[pi];
  visited++;$(`[data-action="open-paper"][data-paper="${pi}"]`).click();$('[data-action="begin-work"]').click();
  for(let qi=0;qi<27;qi++){
   $(`[data-action="jump"][data-index="${qi}"]`).click();
   const q=P.questions[qi],body=$('.question-body');
   const inputs=$$('.question-body [data-ans], .question-body textarea, .question-body select, .question-body [data-action="ide"], .question-body #sql-input, .question-body .diagram-tool').length;
   const need=q.parts.length;
   if(!body||!new RegExp('Question '+q.n+'\\b').test(body.textContent)||inputs<need){bad++;console.log(`Paper ${P.id} Q${q.n}: render problem (controls ${inputs}/${need})`)}
   q.parts.forEach(p=>{if(p.type==='sql'&&p.tables&&$$('.db-schema').length!==p.tables.length){bad++;console.log(`Paper ${P.id} Q${q.n}: tables not all shown`)}});
  }
 }
 console.log(`visited ${visited}/${NP} papers, 27 questions each; problems: ${bad}; script errors: ${errors.length}`);
 process.exit(bad||errors.length?1:0);
})().catch(e=>{console.error(e);process.exit(2)});
