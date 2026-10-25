/* Executes untrusted practice submissions inside a dedicated, terminable browser worker.
   Pyodide executes Python in WebAssembly; no execution occurs on the hosting server. */
let runtimePromise;
const BASE='https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';
async function setup(){
  if (!runtimePromise) runtimePromise=(async()=>{
    importScripts(BASE+'pyodide.js');
    return loadPyodide({indexURL:BASE});
  })();
  return runtimePromise;
}
self.onmessage=async({data})=>{
  const results=[];
  try{
    const py=await setup();
    for(const test of data.tests){
      const inputs=String(test.stdin||'').split(/\r?\n/);
      let next=0, stdout=[],stderr=[];
      py.setStdin({stdin:()=>next<inputs.length ? inputs[next++]:'',isatty:false});
      py.setStdout({batched:s=>stdout.push(s)});
      py.setStderr({batched:s=>stderr.push(s)});
      let error='';
      try{
        const code=String(data.code||'');
        await py.runPythonAsync(code);
      }catch(e){error=String(e).slice(0,3500);}
      results.push({stdout:stdout.join('\n').slice(0,10000),stderr:stderr.join('\n').slice(0,10000),error});
    }
    self.postMessage({ok:true,results});
  }catch(e){self.postMessage({ok:false,error:String(e)});}
};
