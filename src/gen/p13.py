import json,random,subprocess,os
here=os.path.dirname(os.path.abspath(__file__))
tpl=open(os.path.join(here,'..','p13.tpl.js')).read()
def rep(s,a,b):
    assert a in s,a
    return s.replace(a,b)
REF19='''base = int(input())
pct = int(input())
breaks = input().strip().upper()
if not 30 <= base <= 240:
    print("Invalid duration")
elif not 0 <= pct <= 100:
    print("Invalid percentage")
else:
    extra = -(-base * pct // 100)
    total = base + extra
    if breaks == "Y":
        total += base // 60 * 10
    print(f"Total: {total} minutes")'''
M19=[rep(REF19,'-(-base * pct // 100)','base * pct // 100'),
     rep(REF19,'-(-base * pct // 100)','round(base * pct / 100)'),
     rep(REF19,'base // 60 * 10','total // 60 * 10'),
     rep(REF19,'base // 60 * 10','-(-base // 60) * 10'),
     rep(REF19,'.strip().upper()','.strip()'),
     rep(REF19,'30 <= base <= 240','30 <= base < 240'),
     rep(REF19,'if not 30 <= base <= 240:\n    print("Invalid duration")\nelif not 0 <= pct <= 100:\n    print("Invalid percentage")','if not 0 <= pct <= 100:\n    print("Invalid percentage")\nelif not 30 <= base <= 240:\n    print("Invalid duration")'),
     rep(REF19,'0 <= pct <= 100','0 <= pct < 100')]
REF26='''n = int(input())
best = {}
invalid = 0
dup = 0
for _ in range(n):
    parts = [p.strip() for p in input().split(",")]
    if len(parts) != 2 or not parts[0]:
        invalid += 1
        continue
    name, sc = parts
    try:
        score = int(sc)
    except ValueError:
        invalid += 1
        continue
    if not 0 <= score <= 100:
        invalid += 1
        continue
    key = name.lower()
    if key in best:
        dup += 1
        if score > best[key][1]:
            best[key] = (name, score)
    else:
        best[key] = (name, score)
results = sorted(best.values(), key=lambda r: (-r[1], r[0].lower()))
if not results:
    print("No results")
else:
    rank = 0
    prev = None
    for i, (name, score) in enumerate(results, start=1):
        if score != prev:
            rank = i
            prev = score
        print(f"{rank}. {name} ({score})")
    scores = sorted(r[1] for r in results)
    m = len(scores)
    med = scores[m // 2] if m % 2 else (scores[m // 2 - 1] + scores[m // 2]) / 2
    print(f"Median: {med:.1f}")
if invalid:
    print(f"Invalid: {invalid}")
if dup:
    print(f"Duplicates merged: {dup}")'''
M26=[rep(REF26,'rank = i','rank += 1'),
     rep(REF26,'key = name.lower()','key = name'),
     rep(REF26,'if score > best[key][1]:','if False:'),
     rep(REF26,'(scores[m // 2 - 1] + scores[m // 2]) / 2','scores[m // 2]'),
     rep(REF26,'        dup += 1\n','        invalid += 1\n'),
     rep(REF26,'(-r[1], r[0].lower())','(-r[1], r[0])'),
     rep(REF26,'score > best[key][1]','score >= best[key][1]'),
     rep(REF26,'0 <= score <= 100','0 < score <= 100'),
     rep(REF26,'{med:.1f}','{med}'),
     rep(REF26,'[p.strip() for p in input().split(",")]','input().split(",")')]
random.seed(8)
pool=['Ana','Ben','Chloe','Dev','Eli','Fia','Gus','Hana','Ivy','Jon','Kai','Lia','Max','Nia','Omar','Pia','Quin','Rae','Sol','Tia']
lines=[]
for i in range(300):
    nm=random.choice(pool); nm=random.choice([nm,nm.lower(),nm.upper()])
    sc=random.choice([random.randint(40,100)]*8+[random.choice([-4,105,'x'])])
    rec=f"{nm},{sc}"
    if i%43==0: rec=nm
    elif i%59==0: rec=f"{nm},{sc},9"
    lines.append(rec)
big="300\n"+"\n".join(lines)
out=subprocess.run(['python3','-c',REF26],input=big,capture_output=True,text=True)
assert out.returncode==0,out.stderr
exp=out.stdout.rstrip('\n'); print(exp.splitlines()[-4:])
t=tpl.replace("'@SAMPLE19@'",json.dumps(REF19)).replace("'@SAMPLE26@'",json.dumps(REF26)).replace("'@LARGEIN@'",json.dumps(big)).replace("'@LARGEOUT@'",json.dumps(exp)).replace('@MUT19@',json.dumps(M19)).replace('@MUT26@',json.dumps(M26))
open(os.path.join(here,'..','p13.js'),'w').write(t)
