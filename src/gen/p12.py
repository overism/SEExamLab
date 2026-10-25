import json,random,subprocess,os
here=os.path.dirname(os.path.abspath(__file__))
tpl=open(os.path.join(here,'..','p12.tpl.js')).read()
def rep(s,a,b):
    assert a in s,a
    return s.replace(a,b)
REF19='''import re
label = input().strip()
m = re.fullmatch(r"([A-Z]\\d{1,2})-B(\\d{2})-(10|20|30|60)", label)
if m and 1 <= int(m.group(2)) <= 20:
    print(f"Field {m.group(1)}, block {int(m.group(2))}, depth {m.group(3)} cm")
else:
    print("Invalid label")'''
M19=[rep(REF19,'1 <= int','0 <= int'),
     rep(REF19,'<= 20','<= 99'),
     rep(REF19,'(10|20|30|60)','(\\d+)'),
     rep(REF19,'\\d{1,2})-B','\\d{1,3})-B'),
     rep(REF19,'[A-Z]','[A-Za-z]'),
     rep(REF19,'{int(m.group(2))}','{m.group(2)}'),
     rep(REF19,'re.fullmatch','re.match'),
     rep(REF19,'B(\\d{2})','B(\\d{1,2})')]
REF26='''n = int(input())
data = {}
seen = set()
for _ in range(n):
    parts = [p.strip() for p in input().split(",")]
    if len(parts) != 3 or not parts[1]:
        continue
    t, s, v = parts
    seen.add(s)
    try:
        t = int(t)
        v = int(v)
    except ValueError:
        continue
    if not 0 <= v <= 100:
        continue
    data.setdefault(s, {})[t] = v
dry = []
for s in data:
    vals = [data[s][t] for t in sorted(data[s])][-3:]
    avg = sum(vals) / len(vals)
    if avg < 30:
        dry.append((avg, s))
dry.sort()
if dry:
    for avg, s in dry:
        print(f"{s}: {avg:.1f}")
else:
    print("All sensors OK")
nodata = sorted(s for s in seen if s not in data)
if nodata:
    print("No data: " + ", ".join(nodata))'''
M26=[rep(REF26,'data.setdefault(s, {})[t] = v','data.setdefault(s, {}).setdefault(t, v)'),
     rep(REF26,'][-3:]',']'),
     rep(REF26,'sorted(data[s])','list(data[s])'),
     rep(REF26,'avg < 30','avg <= 30'),
     rep(REF26,'0 <= v <= 100','1 <= v <= 100'),
     rep(REF26,'0 <= v <= 100','0 <= v < 100'),
     rep(REF26,'dry.sort()','dry.sort(key=lambda x: x[1])'),
     rep(REF26,'if nodata:','if False:'),
     rep(rep(REF26,'    seen.add(s)\n',''),'    data.setdefault(s, {})[t] = v','    data.setdefault(s, {})[t] = v\n    seen.add(s)'),
     rep(REF26,'[p.strip() for p in input().split(",")]','input().split(",")'),
     rep(REF26,'/ len(vals)','/ 3')]
random.seed(4)
sens=[f"s{i}" for i in range(1,16)]
lines=[]
for i in range(400):
    s=random.choice(sens); t=random.randint(1,40); v=random.choice([random.randint(0,60)]*5+[random.randint(40,100)]*4+[random.choice([-3,101,'x'])])
    rec=f"{t},{s},{v}"
    if i%47==0: rec=f"{t},{s}"
    elif i%61==0: rec=f"{t},,{v}"
    elif i%53==0: rec=f"{t},s{random.randint(16,18)},{v}"
    lines.append(rec)
big="400\n"+"\n".join(lines)
out=subprocess.run(['python3','-c',REF26],input=big,capture_output=True,text=True)
assert out.returncode==0,out.stderr
exp=out.stdout.rstrip('\n'); print(exp.replace('\n',' | '))
t=tpl.replace("'@SAMPLE19@'",json.dumps(REF19)).replace("'@SAMPLE26@'",json.dumps(REF26)).replace("'@LARGEIN@'",json.dumps(big)).replace("'@LARGEOUT@'",json.dumps(exp)).replace('@MUT19@',json.dumps(M19)).replace('@MUT26@',json.dumps(M26))
open(os.path.join(here,'..','p12.js'),'w').write(t)
