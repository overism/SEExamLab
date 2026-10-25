import json,random,subprocess,os
here=os.path.dirname(os.path.abspath(__file__))
tpl=open(os.path.join(here,'..','p09.tpl.js')).read()
def rep(s,a,b):
    assert a in s,a
    return s.replace(a,b)
REF19='''hour = int(input())
kwh = float(input())
if hour < 0 or hour > 23:
    print("Invalid hour")
elif kwh < 0:
    print("Invalid usage")
else:
    if 15 <= hour <= 20:
        band, rate = "Peak", 0.52
    elif 7 <= hour <= 14 or hour == 21:
        band, rate = "Shoulder", 0.31
    else:
        band, rate = "Off-peak", 0.18
    print(f"{band}: ${kwh * rate:.2f}")'''
M19=[rep(REF19,'15 <= hour <= 20','16 <= hour <= 20'),
     rep(REF19,' or hour == 21',''),
     rep(REF19,'hour < 0 or hour > 23','False'),
     rep(REF19,'if hour < 0 or hour > 23:\n    print("Invalid hour")\nelif kwh < 0:\n    print("Invalid usage")','if kwh < 0:\n    print("Invalid usage")\nelif hour < 0 or hour > 23:\n    print("Invalid hour")'),
     rep(REF19,'0.52','0.50'),
     rep(REF19,'7 <= hour <= 14','7 <= hour < 14'),
     rep(REF19,'{kwh * rate:.2f}','{kwh * rate}'),
     rep(REF19,'hour < 0 or hour > 23','hour > 23')]
REF26='''t = int(input())
n = int(input())
totals = [0] * 24
ignored = 0
for _ in range(n):
    h, k = input().split(",")
    h, k = int(h), int(k)
    if 0 <= h <= 23:
        totals[h] += k
    else:
        ignored += 1
above = [x > t for x in totals]
count = sum(above)
print(f"Hours above threshold: {count}")
if count == 0:
    print("No peak period")
else:
    best = (0, -1, 0)
    h = 0
    while h < 24:
        if above[h]:
            s = h
            while h < 24 and above[h]:
                h += 1
            length = h - s
            total = sum(totals[s:h])
            if length > best[0]:
                best = (length, s, total)
        else:
            h += 1
    length, s, total = best
    print(f"Longest peak: {s}-{s + length - 1} total={total}")
if ignored:
    print(f"Ignored records: {ignored}")'''
M26=[rep(REF26,'x > t','x >= t'),
     rep(REF26,'totals[h] += k','totals[h] = k'),
     rep(REF26,'length > best[0]','length >= best[0]'),
     rep(REF26,'if ignored:','if False:'),
     rep(REF26,'sum(totals[s:h])','sum(totals[s:h - 1])'),
     rep(REF26,'sum(totals[s:h])','sum(totals[s:h]) - totals[s]'),
     rep(REF26,'0 <= h <= 23','0 <= h < 23'),
     rep(REF26,'    print("No peak period")','    print("No peak")')]
random.seed(5)
recs=[]
for i in range(500):
    h=random.choice([random.randint(0,23)]*9+[random.randint(24,40)])
    recs.append(f"{h},{random.randint(0,9)}")
big="95\n500\n"+"\n".join(recs)
out=subprocess.run(['python3','-c',REF26],input=big,capture_output=True,text=True)
assert out.returncode==0,out.stderr
exp=out.stdout.rstrip('\n'); print(exp.replace('\n',' | '))
t=tpl.replace("'@SAMPLE19@'",json.dumps(REF19)).replace("'@SAMPLE26@'",json.dumps(REF26)).replace("'@LARGEIN@'",json.dumps(big)).replace("'@LARGEOUT@'",json.dumps(exp)).replace('@MUT19@',json.dumps(M19)).replace('@MUT26@',json.dumps(M26))
open(os.path.join(here,'..','p09.js'),'w').write(t)
