const {boot}=require('./lib');
(async()=>{
 const w=await boot();const E=w.SE_ENGINE,P=w.SE_PAPERS;
 const run=async(code,stdin,echo=false)=>(await E.workerExecute(code,[{stdin}],{echo,testMs:8000}))[0];
 console.log('home text:',w.document.querySelector('.hero h1').textContent.replace(/\s+/g,' '),'|',[...w.document.querySelectorAll('.hero .tag')].map(x=>x.textContent).join(', '));
 console.log('card label:',w.document.querySelector('.paper-count').textContent);
 // python basics
 console.log('prompt suppressed:',JSON.stringify((await run('n=input("Name: ")\nprint("Hi "+n)','Bo')).stdout));
 console.log('prompt echoed    :',JSON.stringify((await run('n=input("Name: ")\nprint("Hi "+n)','Bo',true)).stdout));
 console.log('EOF error:',(await run('input()\ninput()','x')).error.split('\n').slice(-1)[0]);
 console.log('isolation:',JSON.stringify((await E.workerExecute('try:\n    c+=1\nexcept NameError:\n    c=1\nprint(c)',[{stdin:''},{stdin:''}],{})).map(r=>r.stdout)));
 const t=Date.now();const hung=await E.workerExecute('x=input()\nwhile x=="loop":\n    pass\nprint("ok")',[{stdin:'a'},{stdin:'loop'},{stdin:'b'}],{testMs:3000});
 console.log('hang partial credit:',hung.map(r=>r.timeout?'TIMEOUT':r.stdout.trim()),((Date.now()-t)/1000).toFixed(1)+'s');
 process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
