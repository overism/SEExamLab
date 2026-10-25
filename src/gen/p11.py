import json,random,subprocess,os
here=os.path.dirname(os.path.abspath(__file__))
tpl=open(os.path.join(here,'..','p11.tpl.js')).read()
def rep(s,a,b):
    assert a in s,a
    return s.replace(a,b)
REF19='''f = input().strip()
if len(f) != 8:
    print("Invalid length")
elif any(c not in "0123456789abcdefABCDEF" for c in f):
    print("Invalid characters")
else:
    s = sum(int(c, 16) for c in f[:6]) * 7 % 256
    exp = f"{s:02x}"
    print("Valid" if f[6:].lower() == exp else f"Checksum mismatch: expected {exp}")'''
M19=[rep(REF19,' * 7 % 256',' * 7'),
     rep(REF19,' * 7 % 256',' % 256'),
     rep(REF19,'f[6:].lower()','f[6:]'),
     rep(REF19,'{s:02x}','{s:x}'),
     rep(REF19,'if len(f) != 8:\n    print("Invalid length")\nelif any(c not in "0123456789abcdefABCDEF" for c in f):\n    print("Invalid characters")','if any(c not in "0123456789abcdefABCDEF" for c in f):\n    print("Invalid characters")\nelif len(f) != 8:\n    print("Invalid length")'),
     rep(REF19,'for c in f):','for c in f[:6]):')]
REF26='''n = int(input())
iv = []
bad = 0
for _ in range(n):
    parts = [p.strip() for p in input().split(",")]
    if len(parts) != 3 or not parts[0]:
        bad += 1
        continue
    try:
        s, e = int(parts[1]), int(parts[2])
    except ValueError:
        bad += 1
        continue
    if s < 0 or e > 1440 or s >= e:
        bad += 1
        continue
    iv.append((s, e))
iv.sort()
merged = []
for s, e in iv:
    if merged and s <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], e)
    else:
        merged.append([s, e])
if not merged:
    print("No coverage")
else:
    for s, e in merged:
        print(f"{s}-{e}")
    print(f"Covered: {sum(e - s for s, e in merged)} minutes")
    gaps = []
    prev = 0
    for s, e in merged:
        gaps.append((s - prev, prev, s))
        prev = e
    gaps.append((1440 - prev, prev, 1440))
    best = max(gaps, key=lambda g: (g[0], -g[1]))
    if best[0] == 0:
        print("No gaps")
    else:
        print(f"Longest gap: {best[0]} minutes ({best[1]}-{best[2]})")
if bad:
    print(f"Invalid records: {bad}")'''
M26=[rep(REF26,'s <= merged[-1][1]','s < merged[-1][1]'),
     rep(REF26,'iv.sort()\n',''),
     rep(REF26,'merged[-1][1] = max(merged[-1][1], e)','merged[-1][1] = e'),
     rep(REF26,'    prev = 0\n','    prev = merged[0][0]\n'),
     rep(REF26,'    gaps.append((1440 - prev, prev, 1440))\n',''),
     rep(REF26,'key=lambda g: (g[0], -g[1])','key=lambda g: (g[0], g[1])'),
     rep(REF26,'s >= e','s > e'),
     rep(REF26,'    if best[0] == 0:\n        print("No gaps")\n    else:\n        print(f"Longest gap','    if False:\n        print("No gaps")\n    else:\n        print(f"Longest gap'),
     rep(REF26,'e > 1440','e > 1441'),
     rep(REF26,'[p.strip() for p in input().split(",")]','input().split(",")')]
random.seed(21)
lines=[]
for i in range(300):
    st=random.choice(['GS1','GS2','GS3','GS4'])
    s=random.randint(0,1440); L=random.choice([random.randint(1,12)]*6+[random.randint(20,90)])
    rec=f"{st},{s},{s+L}"
    if i%37==0: rec=f"{st},{s},{s-3}"
    elif i%41==0: rec=f"{st},{s}"
    elif i%53==0: rec=f"{st},abc,{s}"
    lines.append(rec)
big="300\n"+"\n".join(lines)
out=subprocess.run(['python3','-c',REF26],input=big,capture_output=True,text=True)
assert out.returncode==0,out.stderr
exp=out.stdout.rstrip('\n'); ls=exp.splitlines(); print(len(ls),'lines;',ls[-3:])
t=tpl.replace("'@SAMPLE19@'",json.dumps(REF19)).replace("'@SAMPLE26@'",json.dumps(REF26)).replace("'@LARGEIN@'",json.dumps(big)).replace("'@LARGEOUT@'",json.dumps(exp)).replace('@MUT19@',json.dumps(M19)).replace('@MUT26@',json.dumps(M26))
open(os.path.join(here,'..','p11.js'),'w').write(t)
