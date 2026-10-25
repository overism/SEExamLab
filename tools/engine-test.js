// Engine regression tests (node). Run: node engine-test.js
const {boot}=require('./lib');
let pass=0,fail=0;const t=(name,cond,extra='')=>{if(cond){pass++;console.log('  ok  '+name)}else{fail++;console.log('  FAIL '+name+' '+extra)}};
(async()=>{
 const w=await boot(),E=w.SE_ENGINE;
 console.log('Python marking');
 const p2=w.SE_PAPERS[1].questions[18].parts[0];       // Paper 02 Q19 (ticket validation)
 const attack='print("Invalid")';
 let res=await E.workerExecute(attack,p2.tests,{echo:false});
 t('always-"Invalid" program no longer earns 3/3 (legacy substring marking gave 3/3)',E.codeGrade(p2,attack,{output:res}).score===1,JSON.stringify(E.codeGrade(p2,attack,{output:res})));
 const legacyScore=p2.tests.filter((x,i)=>res[i].stdout.toLowerCase().includes(x.expect.toLowerCase())).length;
 t('  (for the record: legacy contains-rule would have passed '+legacyScore+'/3)',legacyScore===3);
 const p5=w.SE_PAPERS[4].questions[25].parts[0];
 res=await E.workerExecute('print(len(set(input().split())))\nprint("extra")',p5.tests,{echo:false});
 t('extra output now fails exact test',E.codeGrade(p5,'x',{output:res}).score===0);
 res=await E.workerExecute('while True:\n    pass',p5.tests,{echo:false,testMs:1500});
 t('infinite loop is bounded and marked 0 without crashing',E.codeGrade(p5,'x',{output:res}).score===0&&res.every(r=>r.timeout));
 t('testPasses: no assertion never passes',E.testPasses({stdin:''},{stdout:'x'})===false);
 t('testPasses: notContains / regex',E.testPasses({expect:'a b',notContains:'c'},{stdout:'a b\n\n'})&&E.testPasses({regex:'^\\d+$'},{stdout:'42'}));

 t('one failing test can never round up to full marks (8/9 tests on a 3-mark question = 2)',E.codeGrade({marks:3,tests:Array(9).fill({expect:'x'})},'c',{output:[...Array(8).fill({stdout:'x'}),{stdout:'y'}]}).score===2);
 console.log('SQL validation and v2 grader');
 t('string literal "Create" allowed',(()=>{try{E.validateSQL("SELECT * FROM T WHERE A = 'Create'");return true}catch{return false}})());
 t('REPLACE() function allowed',(()=>{try{E.validateSQL("SELECT REPLACE(A,'x','y') FROM T");return true}catch{return false}})());
 t('leading comment allowed',(()=>{try{E.validateSQL("-- hi\nSELECT 1");return true}catch{return false}})());
 for(const bad of ['DROP TABLE T','SELECT 1; DELETE FROM T','WITH x AS (SELECT 1) DELETE FROM T','SELECT 1; SELECT 2'])t('blocked: '+bad,(()=>{try{E.validateSQL(bad);return false}catch{return true}})());
 const issues={name:'Issues',columns:['JobID','Issue','Response','FixTime','Category','Status'],rows:[['0001','Cannot connect','Clear cache',22,'Software','Pending'],['0002','Install failure','Reinstall',76,'Hardware','Pending'],['0004','Forgot password','Reset',97,'Software','Resolved'],['0005','Install failure','Guide',110,'Hardware','Escalated'],['0009','Blue screen','Diagnostic',120,'Software','Pending'],['0011','Install failure','Email',45,'Software','Escalated']]};
 const q21={type:'sql',marks:4,tables:[issues],hidden:[{Issues:[['1','a','b',5,'Hardware','Pending'],['2','a','b',6,'Hardware','Pending'],['3','a','b',7,'Hardware','Pending'],['4','a','b',9,'Software','Escalated'],['5','a','b',9,'Software','Escalated'],['6','a','b',9,'Hardware','Resolved'],['7','a','b',9,'Software','Resolved']]}],
  sample:"SELECT Status, Category, COUNT(*) AS Number FROM Issues WHERE Status IN ('Pending','Escalated') GROUP BY Status, Category ORDER BY COUNT(*) DESC",orderKeys:[2],weights:[0,2,1,1]};
 const g=async q=>E.gradeSQLNew(q21,q);
 t('NESA Sample 1 shape → 4/4',(await g(q21.sample)).score===4);
 t('NESA Sample 2 (swapped columns, double-quoted literals, different alias, tie order differs) → 4/4',(await g(`SELECT Category, Status, COUNT(*) AS "Count" FROM Issues WHERE Status = "Pending" OR Status = "Escalated" GROUP BY Status, Category ORDER BY Count Desc`)).score===4);
 t('tie rows in any order accepted',(await g(`SELECT Category, Status, COUNT(*) c FROM Issues WHERE Status<>'Resolved' GROUP BY Category, Status ORDER BY c DESC, Category DESC, Status DESC`)).score===4);
 t('missing WHERE (includes Resolved) loses rows marks',(await g(`SELECT Status, Category, COUNT(*) FROM Issues GROUP BY Status, Category ORDER BY COUNT(*) DESC`)).score===0);
 const noOrder=await g(`SELECT Status, Category, COUNT(*) FROM Issues WHERE Status IN ('Pending','Escalated') GROUP BY Status, Category ORDER BY COUNT(*)`);
 t('ascending order loses only the ordering mark',noOrder.score===3,JSON.stringify(noOrder));
 t('hard-coded answer fails hidden dataset',(await g(`SELECT 'Pending','Software',2 UNION ALL SELECT 'Pending','Hardware',1 UNION ALL SELECT 'Escalated','Hardware',1 UNION ALL SELECT 'Escalated','Software',1 ORDER BY 3 DESC`)).score<4);
 t('syntax error → 0',(await g('SELEC *')).score===0);
 t('empty query → 0',(await g('')).score===0);
 // multi-table, NULL in first row, HAVING
 const wards={name:'Wards',columns:['WardID','WardName','Capacity'],rows:[['W1','Emergency',20],['W2','General',35]]};
 const pats={name:'Patients',columns:['PatientID','WardID','Priority','Status','Age'],rows:[[101,'W1','High','Waiting',null],[102,'W2','Medium','Admitted',44],[103,'W1','High','Waiting',70],[104,'W1','High','Waiting',31],[105,'W2','High','Waiting',null]]};
 const q2={type:'sql',marks:4,tables:[wards,pats],sample:"SELECT w.WardName, COUNT(*) AS n FROM Patients p JOIN Wards w ON p.WardID=w.WardID WHERE p.Priority='High' AND p.Status='Waiting' GROUP BY w.WardID HAVING COUNT(*)>1 ORDER BY n DESC",ordered:true};
 t('multi-table JOIN + HAVING reference runs and equals itself',(await E.gradeSQLNew(q2,q2.sample)).score===4);
 t('subquery alternative accepted',(await E.gradeSQLNew(q2,"SELECT WardName, (SELECT COUNT(*) FROM Patients p WHERE p.WardID=w.WardID AND Priority='High' AND Status='Waiting') AS c FROM Wards w WHERE c>1 ORDER BY c DESC")).score===4);
 const nulls=await E.executeSQL(q2,"SELECT SUM(Age), AVG(Age), COUNT(Age), COUNT(*) FROM Patients");
 t('NULL ages stay NULL and numeric (SUM=145, COUNT(Age)=3)',nulls[0].values[0][0]===145&&nulls[0].values[0][2]===3&&nulls[0].values[0][3]===5,JSON.stringify(nulls[0].values));
 t('compareSQL: numeric tolerance 4dp',E.compareSQL({columns:['a'],values:[[2.50001]]},{columns:['b'],values:[[2.5]]},{}).rows===true);

 console.log('Diagram spec grader (NESA 2025 Q22 animal classification)');
 const spec={classes:[{name:'Animal',attrs:['colour','size'],parent:null},{name:'Mammal',attrs:['birthType','teethNumber|numberOfTeeth'],parent:'Animal'},{name:'Reptile',attrs:['scaleType','tongueType'],parent:'Animal'},{name:'Whale',attrs:['blowholeType','migrationLocation'],parent:'Mammal'},{name:'Dog',attrs:['breed','fur'],parent:'Mammal'}],types:{colour:'str',size:'int',fur:'bool'}};
 const dp={type:'diagram',marks:3,spec};
 const N=(id,name,attributes,parent='')=>({id,name,attributes,parent,x:0,y:0});
 const good=[N('a','Animal','colour: str; size: int'),N('m','Mammal','birthType: str; teethNumber: int','a'),N('r','Reptile','scaleType: str; tongueType: str','a'),N('w','Whale','blowholeType: str; migrationLocation: str','m'),N('d','Dog','breed: str; fur: boolean','m')];
 t('NESA sample structure → 3/3',E.diagramGradeSpec(dp,{nodes:good}).score===3);
 const loose=good.map(n=>n.id==='m'?{...n,attributes:'Birth type; Number of teeth'}:n);
 t('attribute naming style ("Birth type", "Number of teeth") accepted',E.diagramGradeSpec(dp,{nodes:loose}).checks[1].hit);
 const redundant=good.map(n=>n.id==='m'?{...n,attributes:'colour: str; birthType: str; teethNumber: int'}:n);
 t('duplicated attribute (colour in Animal and Mammal) fails redundancy check',!E.diagramGradeSpec(dp,{nodes:redundant}).checks[1].hit);
 const flat=good.map(n=>['w','d'].includes(n.id)?{...n,parent:'a'}:n);
 t('Whale/Dog attached to Animal instead of Mammal fails inheritance check',!E.diagramGradeSpec(dp,{nodes:flat}).checks[2].hit);
 const extra=[...good,N('x','Pet','owner: str','')];
 t('extra classes are allowed',E.diagramGradeSpec(dp,{nodes:extra}).score===3);
 const wrongType=good.map(n=>n.id==='a'?{...n,attributes:'colour: int; size: int'}:n);
 t('wrong attribute type detected (types check is 4th check, 3 marks scaled)',!E.diagramGradeSpec(dp,{nodes:wrongType}).checks[3].hit);
 t('blank diagram → 0',E.diagramGradeSpec(dp,E.diagramInitial(dp)?{nodes:E.diagramInitial(dp).nodes}:null).score===0);
 t('spec diagram starts with no pre-drawn inheritance links',E.diagramInitial(dp).nodes.every(n=>!n.parent));


 console.log('Diagram spec: student-named superclass (byAttrs)');
 const vs={classes:[{name:'EmergencyVehicle',byAttrs:true,attrs:['id','callSign'],parent:null},{name:'RoadVehicle',byAttrs:true,attrs:['registration'],parent:'EmergencyVehicle'},{name:'FireTruck',attrs:['tankLitres'],parent:'RoadVehicle'},{name:'Boat',alt:['RescueBoat'],attrs:['hullNumber'],parent:'EmergencyVehicle'}]};
 const vp={type:'diagram',marks:3,spec:vs};
 const vgood=[N('a','Unit','id: int; callSign: str'),N('b','Land','registration: str','a'),N('c','FireTruck','tankLitres: float','b'),N('d','RescueBoat','hullNumber: str','a')];
 t('superclasses with invented names are recognised by attributes',E.diagramGradeSpec(vp,{nodes:vgood}).score===3,JSON.stringify(E.diagramGradeSpec(vp,{nodes:vgood}).checks));
 t('FireTruck wrongly under root fails inheritance',!E.diagramGradeSpec(vp,{nodes:vgood.map(n=>n.id==='c'?{...n,parent:'a'}:n)}).checks[2].hit);
 console.log('Written marking: forbidden patterns');
 const wp={marks:3,criteria:[{label:'Mentions hashing correctly',all:['hash'],none:['hash(es|ing)? (is|are) (the same as|a type of) encrypt']},{label:'b',all:['salt']},{label:'c',all:['rainbow']}]};
 t('criterion with none[] fails when misconception present',E.markWritten(wp,'Hashing is the same as encryption and passwords get a salt for rainbow tables, which are fast.').checks[0].hit===false);
 t('criterion passes without misconception',E.markWritten(wp,'A salted hash stops rainbow table lookups because every user hash differs.').score===3);
 console.log(`\n${pass} passed, ${fail} failed`);process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(2)});
