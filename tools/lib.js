const fs=require('fs'),path=require('path');
const {JSDOM}=require('jsdom');
const {Worker:NodeWorker}=require('worker_threads');
const root=path.join(__dirname,'..');
class FakeWorker{constructor(){this.w=new NodeWorker(path.join(__dirname,'node-worker-wrapper.js'));this.w.on('message',m=>this.onmessage&&this.onmessage({data:m}));this.w.on('error',e=>this.onerror&&this.onerror(e))}
 postMessage(m){this.w.postMessage(m)} terminate(){this.w.terminate()}}
async function boot(dataFile='data.js',mutate){
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/<script[^>]*><\/script>/g,'');
 const dom=new JSDOM(html,{url:'http://localhost:8000/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;w.Worker=FakeWorker;
 const initSqlJs=require('sql.js');w.initSqlJs=()=>initSqlJs();
 w.eval(fs.readFileSync(path.join(root,dataFile),'utf8'));
 w.scrollTo=()=>{};if(mutate)mutate(w);
 w.eval(fs.readFileSync(path.join(root,'app.js'),'utf8'));
 return w;
}
module.exports={boot,root};
