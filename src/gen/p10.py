import json,random,subprocess,os
here=os.path.dirname(os.path.abspath(__file__))
tpl=open(os.path.join(here,'..','p10.tpl.js')).read()
def rep(s,a,b):
    assert a in s,a
    return s.replace(a,b)
REF19='''pw = input()
problems = []
if len(pw) < 10:
    problems.append("Too short")
if not any(c.isdigit() for c in pw):
    problems.append("No digit")
if not (any(c.isupper() for c in pw) and any(c.islower() for c in pw)):
    problems.append("Needs upper and lower case")
if "password" in pw.lower():
    problems.append("Contains password")
print("\\n".join(problems) if problems else "Strong")'''
M19=[rep(REF19,'len(pw) < 10','len(pw) <= 10'),
     rep(REF19,'not (any(c.isupper() for c in pw) and any(c.islower() for c in pw))','not (any(c.isupper() for c in pw) or any(c.islower() for c in pw))'),
     rep(REF19,'"password" in pw.lower()','"password" in pw'),
     rep(REF19,'not any(c.isdigit() for c in pw)','False'),
     rep(REF19,'pw = input()','pw = input().strip()'),
     rep(REF19,'problems.append("Too short")\nif not any(c.isdigit() for c in pw):\n    problems.append("No digit")','problems.append("No digit")\nif not any(c.isdigit() for c in pw):\n    problems.append("Too short")')]
REF26='''class Account:
    def __init__(self, balance):
        self.balance = balance
        self.out = 0

n = int(input())
accts = {}

def run(parts):
    cmd = parts[0]
    if cmd == "OPEN":
        aid, amt = parts[1], int(parts[2])
        if aid in accts:
            return "REJECTED: exists"
        if amt < 0:
            return "REJECTED: invalid amount"
        accts[aid] = Account(amt)
        return "OK"
    if cmd == "DEPOSIT":
        aid, amt = parts[1], int(parts[2])
        if aid not in accts:
            return "REJECTED: no account"
        if amt <= 0:
            return "REJECTED: invalid amount"
        accts[aid].balance += amt
        return "OK"
    if cmd == "WITHDRAW":
        aid, amt = parts[1], int(parts[2])
        if aid not in accts:
            return "REJECTED: no account"
        if amt <= 0:
            return "REJECTED: invalid amount"
        a = accts[aid]
        if a.out + amt > 1000:
            return "REJECTED: limit"
        if a.balance < amt:
            return "REJECTED: insufficient"
        a.balance -= amt
        a.out += amt
        return "OK"
    src, dst, amt = parts[1], parts[2], int(parts[3])
    if src not in accts or dst not in accts:
        return "REJECTED: no account"
    if amt <= 0:
        return "REJECTED: invalid amount"
    if src == dst:
        return "REJECTED: same account"
    a = accts[src]
    if a.out + amt > 1000:
        return "REJECTED: limit"
    if a.balance < amt:
        return "REJECTED: insufficient"
    a.balance -= amt
    a.out += amt
    accts[dst].balance += amt
    return "OK"

for _ in range(n):
    print(run(input().split()))
for aid in sorted(accts):
    print(f"{aid}: {accts[aid].balance}")'''
M26=[rep(REF26,'    a = accts[src]\n    if a.out + amt > 1000:\n        return "REJECTED: limit"\n','    a = accts[src]\n'),
     rep(REF26,'> 1000','>= 1000'),
     rep(REF26,'        a = accts[aid]\n        if a.out + amt > 1000:','        a = accts[aid]\n        a.out += amt\n        if a.out > 1000:'),
     rep(REF26,'        if a.out + amt > 1000:\n            return "REJECTED: limit"\n        if a.balance < amt:\n            return "REJECTED: insufficient"\n        a.balance -= amt','        if a.balance < amt:\n            return "REJECTED: insufficient"\n        if a.out + amt > 1000:\n            return "REJECTED: limit"\n        a.balance -= amt'),
     rep(REF26,'    if src == dst:\n        return "REJECTED: same account"\n',''),
     rep(REF26,'for aid in sorted(accts):','for aid in accts:'),
     rep(REF26,'        if aid in accts:\n            return "REJECTED: exists"\n',''),
     rep(REF26,'        if amt <= 0:\n            return "REJECTED: invalid amount"\n        accts[aid].balance += amt','        if amt < 0:\n            return "REJECTED: invalid amount"\n        accts[aid].balance += amt'),
     rep(REF26,'    accts[dst].balance += amt\n','')]
random.seed(9)
ids=['a','b','c','d','e','a10','a2']
cmds=[f"OPEN {i} {random.randint(80,900)}" for i in ids[:5]]
while len(cmds)<400:
    r=random.random()
    x=random.choice(ids*6+['zz']); y=random.choice(ids*6+['zz'])
    amt=random.choice([random.randint(1,300)]*8+[random.randint(300,1500),0,-7][random.randint(0,2):][:1])
    if r<0.03: cmds.append(f"OPEN {random.choice(ids)} {random.randint(0,500)}")
    elif r<0.30: cmds.append(f"DEPOSIT {x} {amt}")
    elif r<0.65: cmds.append(f"WITHDRAW {x} {amt}")
    else: cmds.append(f"TRANSFER {x} {y} {amt}")
big="400\n"+"\n".join(cmds)
out=subprocess.run(['python3','-c',REF26],input=big,capture_output=True,text=True)
assert out.returncode==0,out.stderr
exp=out.stdout.rstrip('\n'); lines=exp.splitlines()
from collections import Counter
print(Counter(l.split(':')[1].strip() if l.startswith('REJ') else l for l in lines[:400] if l.startswith(('OK','REJ'))))
t=tpl.replace("'@SAMPLE19@'",json.dumps(REF19)).replace("'@SAMPLE26@'",json.dumps(REF26)).replace("'@LARGEIN@'",json.dumps(big)).replace("'@LARGEOUT@'",json.dumps(exp)).replace('@MUT19@',json.dumps(M19)).replace('@MUT26@',json.dumps(M26))
open(os.path.join(here,'..','p10.js'),'w').write(t)
