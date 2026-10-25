# Generates src/p08.js from src/p08.tpl.js: reference solutions, mutants and large test data come from ONE source here.
import json,random,subprocess,os
here=os.path.dirname(os.path.abspath(__file__))
tpl=open(os.path.join(here,'..','p08.tpl.js')).read()
def rep(s,a,b):
    assert a in s,a
    return s.replace(a,b)
REF19='''tag = input().strip()
if len(tag) != 9:
    print("Rejected: length")
elif not (tag[:2].isalpha() and tag[:2].isupper() and tag[:2].isascii() and tag[2:].isdigit()):
    print("Rejected: format")
elif int(tag[8]) != sum(int(c) for c in tag[2:8]) % 10:
    print("Rejected: check digit")
else:
    print("Accepted")'''
M19=[rep(REF19,'if len(tag) != 9:','if False:'),
     rep(REF19,' and tag[:2].isupper()',''),
     rep(REF19,'tag[2:8]','tag[2:9]'),
     rep(REF19,'% 10','% 9'),
     rep(REF19,'tag[:2].isalpha() and ','')]
REF26='''n = int(input())
seen = set()
flights = {}
invalid = 0
for _ in range(n):
    parts = [p.strip() for p in input().split(",")]
    if len(parts) != 4:
        invalid += 1
        continue
    flight, bag, w, pr = parts
    try:
        weight = float(w)
    except ValueError:
        invalid += 1
        continue
    if not flight or not bag or not (0 < weight <= 60) or pr not in ("Y", "N"):
        invalid += 1
        continue
    if bag in seen:
        continue
    seen.add(bag)
    f = flights.setdefault(flight, [0, 0.0, 0, 0])
    f[0] += 1
    f[1] += weight
    if weight > 23.0:
        f[2] += 1
        if pr == "Y":
            f[3] += 1
if not flights:
    print("No valid bags")
for flight, (cnt, tot, over, pri) in sorted(flights.items(), key=lambda kv: (-round(kv[1][1] * 10), kv[0])):
    line = f"{flight} bags={cnt} total={tot:.1f} over={over}"
    if pri >= 2:
        line += " CHECK"
    print(line)
if invalid:
    print(f"Invalid records: {invalid}")'''
M26=[rep(REF26,'    if bag in seen:\n        continue\n',''),
     rep(REF26,'0 < weight <= 60','0 < weight < 60'),
     rep(REF26,'weight > 23.0','weight >= 23.0'),
     rep(REF26,'pri >= 2','pri >= 1'),
     rep(REF26,'(-round(kv[1][1] * 10), kv[0])','(-round(kv[1][1] * 10),)'),
     rep(REF26,'    if bag in seen:\n        continue','    if bag in seen:\n        invalid += 1\n        continue'),
     rep(REF26,'total={tot:.1f}','total={tot}'),
     rep(REF26,'[p.strip() for p in input().split(",")]','input().split(",")')]
random.seed(11)
fl=[f"AL{n}" for n in (101,102,205,330,410,512,600,718,820,905,911,999)]
lines=[]
for i in range(400):
    f=random.choice(fl); b=f"B{random.randint(1,330)}"; w=round(random.uniform(5,32),1); p=random.choice("YYNN")
    if i%17==0: w="abc"
    elif i%29==0: w=61.5
    rec=f"{f},{b},{w},{p}"
    if i%23==0: rec=f"{f},{b},{w}"
    if i%31==0: p='Q'; rec=f"{f},{b},{w},{p}"
    lines.append(rec)
big="400\n"+"\n".join(lines)
out=subprocess.run(['python3','-c',REF26],input=big,capture_output=True,text=True)
assert out.returncode==0,out.stderr
exp=out.stdout.rstrip('\n')
print('large output lines:',len(exp.splitlines()),'CHECK flags:',exp.count('CHECK'))
t=tpl.replace("'@SAMPLE26@'",json.dumps(REF26)).replace("'@LARGEIN@'",json.dumps(big)).replace("'@LARGEOUT@'",json.dumps(exp)).replace('@MUT19@',json.dumps(M19)).replace('@MUT26@',json.dumps(M26))
open(os.path.join(here,'..','p08.js'),'w').write(t)
