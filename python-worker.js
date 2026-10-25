/* Executes untrusted practice submissions inside a dedicated, terminable browser worker.
   Pyodide runs Python in WebAssembly; nothing executes on the hosting server.
   Protocol — in:  {code, tests:[{stdin}], echo}
              out: {type:'ready'} once, then {type:'result', index, result:{stdout,stderr,error}} per test, then {type:'done'};
                   {type:'fatal', error} if the runtime cannot load.
   Each test runs in a fresh namespace with its own stdin. input() raises EOFError when stdin is exhausted (like a real console).
   echo=true (IDE) prints prompts and typed input like a terminal; echo=false (marking) prints nothing for input(), so a
   student's prompt text can never affect an exact-output assertion. */
let runtimePromise;
const BASE='https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';
const HARNESS=String.raw`
import sys, io, builtins, json, traceback
def _se_run(code, stdin, echo):
    out = io.StringIO()
    src = io.StringIO(stdin)
    def _input(prompt=''):
        if echo and prompt:
            out.write(str(prompt))
        line = src.readline()
        if line == '':
            raise EOFError('EOF when reading a line')
        line = line.rstrip('\n').rstrip('\r')
        if echo:
            out.write(line + '\n')
        return line
    bi = dict(vars(builtins)); bi['input'] = _input
    ns = {'__name__': '__main__', '__builtins__': bi}
    old_in, old_out = sys.stdin, sys.stdout
    sys.stdin, sys.stdout = src, out
    err = ''
    try:
        exec(compile(code, 'main.py', 'exec'), ns)
    except SystemExit:
        pass
    except BaseException:
        lines = traceback.format_exc().splitlines()
        idx = next((i for i, l in enumerate(lines) if 'File "main.py"' in l), 0)
        err = '\n'.join(['Traceback (most recent call last):'] + lines[idx:]) if idx else '\n'.join(lines)
    finally:
        sys.stdin, sys.stdout = old_in, old_out
    return json.dumps({'stdout': out.getvalue()[:10000], 'stderr': '', 'error': err[:3500]})
`;
async function setup(){
  if (!runtimePromise) runtimePromise=(async()=>{
    importScripts(BASE+'pyodide.js');
    const py=await loadPyodide({indexURL:BASE});
    py.runPython(HARNESS);
    return py;
  })();
  return runtimePromise;
}
self.onmessage=async({data})=>{
  try{
    const py=await setup();
    const run=py.globals.get('_se_run');
    self.postMessage({type:'ready'});
    for(let i=0;i<data.tests.length;i++){
      let result;
      try{result=JSON.parse(run(String(data.code||''),String(data.tests[i].stdin||''),!!data.echo));}
      catch(e){result={stdout:'',stderr:'',error:String(e).slice(0,3500)};}
      self.postMessage({type:'result',index:i,result});
    }
    self.postMessage({type:'done'});
  }catch(e){self.postMessage({type:'fatal',error:String(e)});}
};
