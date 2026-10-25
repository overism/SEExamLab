// Builds data.js = legacy papers 01-05 + new papers listed in src/ (p06.js, p07.js, ...). Usage: node build.js
const fs=require('fs'),path=require('path');
const src=path.join(__dirname,'..','src');
const files=fs.readdirSync(src).filter(f=>/^p\d+\.js$/.test(f)).sort();
const out=[fs.readFileSync(path.join(src,'legacy.js'),'utf8').trimEnd(),'',fs.readFileSync(path.join(src,'common.js'),'utf8').trimEnd(),...files.map(f=>fs.readFileSync(path.join(src,f),'utf8').trimEnd()),'  window.SE_PAPERS.push(...NEW);\n})();',''];
fs.writeFileSync(path.join(__dirname,'..','data.js'),out.join('\n'));
console.log('built data.js with',files.length,'new paper module(s):',files.join(', '));
