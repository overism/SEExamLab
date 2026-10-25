// Runs the real python-worker.js inside a node worker_thread, shimming importScripts/loadPyodide/self.
const {parentPort}=require('worker_threads');
const fs=require('fs'),path=require('path'),vm=require('vm');
const self={postMessage:m=>parentPort.postMessage(m)};
parentPort.on('message',data=>{if(self.onmessage)self.onmessage({data})});
const ctx={self,importScripts:()=>{},loadPyodide:async()=>{const {loadPyodide}=require('pyodide');return loadPyodide()},console,String,JSON,Promise,setTimeout};
ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'..','python-worker.js'),'utf8'),ctx);
// python-worker.js assigns self.onmessage; `self` inside the context is our shim
