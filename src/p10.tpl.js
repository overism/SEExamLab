/* ---------- Paper 10 — Northern Star Bank (generated from p10.tpl.js by gen/p10.py) ---------- */
{
const {mc, multi, rows, cr, written, python, sql, diagram, twoOf, Q, paper} = H;
const customers = {name:'Customers', columns:['CustomerID','Name','Tier'], rows:[[1,'Aroha','Gold'],[2,'Ben','Standard'],[3,'Chen','Gold'],[4,'Dana','Standard'],[5,'Eli','Standard'],[6,'Faye','Gold']]};
const txns = {name:'Transactions', columns:['TxnID','CustomerID','Amount','Month','Status'], rows:[
  [1,1,200,'March','Completed'],[2,1,50,'April','Completed'],[3,2,75,'March','Failed'],[4,2,30,'February','Completed'],
  [5,3,500,'March','Completed'],[6,3,20,'March','Completed'],[7,4,60,'April','Completed'],[8,5,10,'March','Failed'],[9,5,15,'March','Failed']]};
const txnsHidden = [[1,1,40,'March','Failed'],[2,1,90,'March','Completed'],[3,3,25,'February','Completed'],[4,4,15,'March','Completed'],[5,6,70,'March','Failed']];

NEW.push(paper(10, 'Northern Star Bank', 'Digital banking, fraud detection, secure APIs and object-oriented design', [
Q(1, 'Version control', `Two developers edit the same line of interest.py on separate branches. When the second branch is merged into main, Git reports a merge conflict in that file.`, [
  mc('What is the correct next step?', ['Force-push the second branch over main so that its version wins', 'Delete the first developer\'s branch so the conflict disappears', 'Edit the conflicted file to combine the intended changes, mark it resolved and commit the merge', 'Revert main to the previous release and abandon both changes'], 2, 'a conflict needs a human decision; resolving it keeps both developers\' intent and preserves history.')]),
Q(2, 'Object-oriented code tracing', `class Account:\n    def __init__(self, bal):\n        self.bal = bal\n    def fee(self):\n        return 2\n\nclass Premium(Account):\n    def fee(self):\n        return super().fee() - 2 if self.bal > 5000 else super().fee() * 2\n\naccts = [Account(100), Premium(6000), Premium(300)]\nprint(sum(a.fee() for a in accts))`, [
  mc('What does this program display?', ['4', '8', '2', '6'], 3, 'Account(100) gives 2; Premium(6000) gives 2 − 2 = 0; Premium(300) gives 2 × 2 = 4; the total is 6.')]),
Q(3, 'Session fixation', `Before login, the application issues the visitor a session identifier. After the user authenticates, it keeps using the same identifier. An attacker sends a victim a link that sets a known identifier in the victim's browser, waits for them to log in, and then uses the same identifier.`, [
  mc('Which change most directly prevents this attack?', ['Issue a new session identifier when the user authenticates', 'Store only a hash of the identifier in the cookie', 'Make the identifier longer', 'Encrypt the login form fields'], 0, 'the attacker\'s known identifier becomes worthless once a new one is issued at login.')]),
Q(4, 'Dictionary code tracing', `txns = ["A:50", "B:20", "A:-30", "C:10", "B:5"]\nbal = {}\nfor t in txns:\n    name, amt = t.split(":")\n    bal[name] = bal.get(name, 0) + int(amt)\nbest = max(bal, key=bal.get)\nprint(best, bal[best], len(bal))`, [
  mc('What does this program display?', ['A 20 3', 'B 25 3', 'B 25 5', 'A 50 3'], 1, 'the totals are A = 20, B = 25 and C = 10; max by value gives B; the dictionary has 3 keys.')]),
Q(5, 'Defensive programming', `def withdraw(balance, amount):\n    return balance - amount`, [
  mc('Which change best applies defensive programming?', ['Shorten the variable names', 'Add a comment saying that amount must be positive', 'Catch every exception and return 0', 'Check that amount is a positive number that does not exceed balance, and reject the request otherwise'], 3, 'defensive programming validates assumptions at run time instead of trusting callers.')]),
Q(6, 'Reinforcement learning', `A bank trains a reinforcement-learning agent to respond to suspicious card transactions. The agent receives +1 for every transaction it blocks. After training it blocks almost every transaction, including those of genuine customers.`, [
  mc('What is the most likely cause?', ['The reward does not penalise blocking genuine transactions, so blocking almost everything maximises the reward', 'The agent was not given enough labelled examples', 'Rewards must only be given after one year', 'Reinforcement learning cannot be applied to transactions'], 0, 'the agent optimises exactly the reward it is given; a poorly designed reward produces unintended behaviour.')]),
Q(7, 'Privacy techniques', `A bank replaces customer names in an analytics database with random identifiers. It keeps a separate lookup table, held securely elsewhere, that links each identifier back to the customer.`, [
  mc('Which description is most accurate?', ['Anonymisation, because the names have been removed', 'Encryption, because the identifiers are random', 'Pseudonymisation, because the records can be re-linked to customers using the lookup table', 'Hashing, because the identifiers cannot be reversed'], 2, 'anonymised data cannot be linked back to individuals; pseudonymised data can, given the extra information.')]),
Q(8, 'Project scheduling', `Task | Duration | Starts after\nA | 3 days | —\nB | 5 days | A\nC | 2 days | A\nD | 6 days | C\nE | 1 day | B and D\n\nThe longest path through the tasks is A, C, D, E.`, [
  mc('Task B is delayed by 2 days. What is the effect on the overall project duration?', ['It increases by 2 days', 'It does not change, because B has 3 days of slack', 'It increases by 3 days', 'It decreases because B now finishes later than C'], 1, 'path A-C-D-E takes 12 days and path A-B-E takes 9, so B has 3 days of slack; a 2-day delay is absorbed.')]),
Q(9, 'Secure design principles', '', [
  rows('Match each situation to the design principle it applies.', [
    ['The person who approves a payment must be different from the person who creates it', 'Separation of duties'],
    ['Teller accounts can view balances but cannot edit interest rates', 'Least privilege'],
    ['If the fraud service cannot be reached, payments above $10,000 are held instead of approved', 'Fail-safe defaults'],
    ['A firewall, input validation and database permissions all protect the same data', 'Defence in depth']],
    ['Separation of duties', 'Least privilege', 'Fail-safe defaults', 'Defence in depth'], 1, [4])]),
Q(10, 'Secure error handling', '', [
  multi('Which are good practices for error handling in a banking API? Select all that apply.', ['Return a generic message to the user and log the details on the server', 'Return the full stack trace so that users can report bugs accurately', 'Use appropriate HTTP status codes for different kinds of failure', 'Include the failing SQL text in the response to help developers', 'Give the same message whether the username or the password was wrong'], [0, 2, 4], 'detailed internal errors help attackers, and distinct login messages reveal which usernames exist.')]),
Q(11, 'Object-oriented programming', '', [
  multi('Which statements about object-oriented programming are correct? Select all that apply.', ['A subclass inherits the attributes and methods of its superclass', 'Encapsulation means making every attribute public', 'Overriding lets a subclass provide its own version of an inherited method', 'Polymorphism allows the same method call to behave differently depending on the object\'s class', 'A class is a specific instance of an object'], [0, 2, 3], 'encapsulation hides internal state, and an object is an instance of a class — not the reverse.')]),
Q(12, 'Software development phases', '', [
  rows('Select the development phase in which each activity mainly occurs.', [
    ['Interviewing tellers to find out what the payment screen must do', 'Requirements'],
    ['Drawing a data flow diagram and a class diagram for the transfer module', 'Design'],
    ['Writing the Python code for the interest calculation', 'Implementation'],
    ['Running boundary tests on the withdrawal limit', 'Testing'],
    ['Installing the release on production servers and migrating data', 'Deployment'],
    ['Fixing a rounding fault reported by customers after release', 'Maintenance']],
    ['Requirements', 'Design', 'Implementation', 'Testing', 'Deployment', 'Maintenance'], 2, [6, 4])]),
Q(13, 'Authentication factors', '', [
  rows('Classify each item as an authentication factor.', [['A four-digit PIN', 'Something you know'], ['A one-time code generated by an authenticator app on a phone', 'Something you have'], ['A fingerprint scan', 'Something you are'], ['A hardware security key', 'Something you have']], ['Something you know', 'Something you have', 'Something you are'], 2, [4, 2])]),
Q(14, 'SQL clauses', '', [
  rows('Select the clause that performs each task.', [['Keeps only transactions over $1,000 before they are grouped', 'WHERE'], ['Keeps only accounts whose total is over $50,000 after grouping', 'HAVING'], ['Lists accounts from the largest total to the smallest', 'ORDER BY']], ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], 1, [3])]),
Q(15, 'Machine-learning vocabulary and deployment risk', `Northern Star Bank is about to release an update to its payments service on Friday evening.`, [
  rows('Match each term to its description.', [
    ['The known outcome the model is trying to predict for each example', 'Label'],
    ['An input variable such as the transaction amount or the time of day', 'Feature'],
    ['Data used to adjust the model\'s parameters', 'Training data'],
    ['Data used to tune choices made while building the model', 'Validation data'],
    ['Held-back data used to estimate performance on unseen cases', 'Test data'],
    ['The model learns noise in the training data and performs poorly on new data', 'Overfitting']],
    ['Label', 'Feature', 'Training data', 'Validation data', 'Test data', 'Overfitting'], 3, [6, 5, 3]),
  written('Explain how a rollback plan reduces the risk of the payments-service update.', 3, 90,
    'A rollback plan sets out how to restore the previous working version of the payments service if the update fails. After the update, automated checks monitor errors and response times, and if they exceed agreed limits the team switches back to the previous version within minutes instead of trying to fix the fault live. This limits the time customers cannot make payments and prevents failed or duplicated transactions from building up, so the risk of a faulty release causing serious financial harm is reduced.',
    [cr('Explains that the previous version is restored', 'rollback|roll back|restore|revert|previous (working )?version|switch(es)? back'),
     cr('Explains that failure is detected using monitoring or agreed limits', 'monitor|check|detect|errors?|response times?|limits|threshold|health'),
     cr('Explains the reduced impact on customers or transactions', ['customer|payment|transaction|downtime|financial|outage', 'limit|reduce|prevent|minimi[sz]e|quick|minutes'])])]),
Q(16, 'Secure web architecture', `Northern Star Bank's customer web app calls a REST API. Customers log in with a password, and the API must serve many thousands of simultaneous customers on payday.`, [
  written('Compare the use of server-side sessions with signed tokens for authenticating requests to the API.', 3, 100,
    'With server-side sessions the server stores the user\'s state and gives the browser an identifier in a cookie, so it can end a session immediately at logout or if fraud is suspected, but every server must be able to look up the session. With signed tokens, such as a JSON Web Token, the user\'s identity is inside the token, which the server verifies using its signature, so no state is stored and it scales easily across many servers. However, a stolen token remains valid until it expires, so tokens need short lifetimes, whereas sessions are easier to revoke.',
    [cr('Explains server-side sessions', ['session|cookie', 'server (stores|side)|identifier|lookup|stores? the|state']),
     cr('Explains signed tokens as self-contained or stateless', ['token|jwt', 'stateless|self.contained|signed|signature|no (state|server)|scale|verif']),
     cr('Contrasts revocation, expiry or scalability', 'revoke|revocation|logout|invalidate|expire|expiry|stolen|whereas|however|trade')]),
  written('Explain how multi-factor authentication reduces the risk of account takeover when a customer\'s password has been leaked.', 3, 100,
    'If a password is leaked in a data breach or stolen by phishing, an attacker who only knows the password could normally log in. Multi-factor authentication also requires something the customer has, such as a one-time code from an authenticator app, or something they are, such as a fingerprint, which the attacker does not possess. The attacker is therefore stopped at the second step, and the bank can also detect the failed second-factor attempt and warn the customer.',
    [cr('Explains the risk of a leaked or stolen password alone', ['leak|breach|stolen|phish|reuse|compromised', 'password']),
     cr('Explains that a second, different factor is required', ['second|another|additional|extra|multi', 'factor|authenticator|fingerprint|biometric|something (you|the customer) (have|are)|one-time code']),
     cr('Explains the result: the attacker is stopped or detected', 'stopped|cannot (log|access|complete)|blocked|fails|detect|warn|alert|prevent')]),
  written('Explain how a load balancer and database replication together help the service stay available during payday peaks.', 3, 100,
    'A load balancer spreads incoming requests across several application servers, so no single server is overloaded and if one server fails the others continue to serve customers. Database replication keeps copies of the data on additional database servers, so read requests such as balance enquiries can be spread across the copies and, if the primary database fails, a replica can take over. Together they remove single points of failure at both the application and data layers during heavy traffic.',
    [cr('Explains that a load balancer distributes requests across servers', ['load balanc', 'distribut|spread|several|multiple|across|share']),
     cr('Explains database replication using copies', ['replicat', 'cop(y|ies)|replica|additional database|duplicate']),
     cr('Explains the effect on availability or failure', 'fail|single point|available|availability|take over|overload|continue|peak')])]),
Q(17, 'Algorithm design', `Open holds the opening balance of an account. The array Amounts[1..n] holds the transactions in order: positive numbers are deposits and negative numbers are withdrawals. The value of n may be 0.`, [
  written('Construct pseudocode that displays the final balance, and also displays "Overdrawn" if the balance was below zero at any point while the transactions were applied.', 3, 120,
    'balance ← Open\noverdrawn ← FALSE\nFOR i ← 1 TO n\n    balance ← balance + Amounts[i]\n    IF balance < 0 THEN\n        overdrawn ← TRUE\n    ENDIF\nENDFOR\nDISPLAY balance\nIF overdrawn = TRUE THEN\n    DISPLAY "Overdrawn"\nENDIF',
    [cr('Uses a loop to apply each transaction to a running balance', ['for|while|loop|repeat', 'balance']),
     cr('Tests the balance inside the loop, strictly below zero', ['<\\s*0', 'if'], '[a-z_\\]]+\\s*<=\\s*0'),
     cr('Records that it happened with a flag and displays the results', ['true|flag|overdrawn\\s*(←|=|<-)', 'display|output|print', 'overdrawn'])])]),
Q(18, 'Metadata and data mining', `The bank holds metadata about every card transaction: the time, the merchant and its location, the amount, and the device or terminal used. Genuine customers usually shop in a few predictable places.`, [
  written('Explain how data mining of this metadata could help the bank identify possible card fraud.', 3, 90,
    'Data mining can build a profile of each customer\'s normal behaviour, such as usual merchants, locations, amounts and times, from the metadata. A transaction that falls outside the pattern, for example a card used in two countries within an hour or an unusually large purchase at a new merchant, is flagged as an anomaly. The bank can then hold the transaction and alert the customer to confirm it before the money is lost.',
    [cr('Identifies the metadata used', 'metadata|time|merchant|location|amount|device|terminal'),
     cr('Explains that mining detects normal patterns and anomalies', ['mining|mine|analys|profile', 'pattern|normal|anomal|unusual|outside|deviat|differ']),
     cr('Explains the action taken on a flagged transaction', 'hold|alert|confirm|block|notify|contact|freeze|flag')])]),
Q(19, 'Python programming: password policy', `A password policy has four rules. A password is checked against all four rules, and each rule it breaks is reported on its own line in this order:\n1. fewer than 10 characters: Too short\n2. contains no digit: No digit\n3. does not contain at least one capital letter and at least one lower-case letter: Needs upper and lower case\n4. contains the word password in any mix of capital and lower-case letters: Contains password\n\nIf no rule is broken, display Strong. Spaces count as characters.\n\nExample: for the password abc the output is\nToo short\nNo digit\nNeeds upper and lower case`, [
  python('Write a Python program that reads a password and displays the result.', 3, '# Read one password\n',
    '@SAMPLE19@',
    [{name:'Worked example', stdin:'abc', expect:'Too short\nNo digit\nNeeds upper and lower case'},
     {name:'A strong password', stdin:'Harbour2Light', expect:'Strong'},
     {name:'Exactly ten characters is long enough', stdin:'Abcdefgh1j', expect:'Strong'},
     {name:'Nine characters is too short', stdin:'Abcdefg1j', expect:'Too short'},
     {name:'No capital letter', stdin:'abcdefghij1', expect:'Needs upper and lower case'},
     {name:'No lower-case letter', stdin:'ABCDEFGHIJ1', expect:'Needs upper and lower case'},
     {name:'No digit', stdin:'Abcdefghijk', expect:'No digit'},
     {name:'The word password in mixed case', stdin:'xxPaSsWoRdxx9X', expect:'Contains password'},
     {name:'Contains the word with a similar spelling only', stdin:'Passw0rd123456', expect:'Strong'},
     {name:'Spaces count as characters', stdin:'Aa1       ', expect:'Strong'},
     {name:'Several rules broken in order', stdin:'password', expect:'Too short\nNo digit\nNeeds upper and lower case\nContains password'}], {mutants:@MUT19@})]),
Q(20, 'Replay attacks', `A customer's app sends this request to make a transfer: POST /transfer {"to": "123456", "amount": 500} with a valid token in the header. The request is encrypted with TLS. The server processes every valid request it receives.`, [
  written('Explain how a replay attack on this API could succeed, and how it could be prevented.', 3, 100,
    'An attacker who obtains a copy of a valid transfer request, for example from a compromised device or proxy that can see the traffic after decryption, can send the identical request again. Because the token is still valid and the server processes every valid request, the same $500 would be sent a second time, and again each time it is replayed. The server can prevent this by requiring a unique one-time value (a nonce) or an idempotency key in each request and rejecting any value it has already seen, and by making requests expire after a short time.',
    [cr('Explains that a captured valid request is sent again', 'replay|resend|send(s)? (it|the (same|identical) request) again|re-?submit|captured|copy of a valid'),
     cr('Explains the consequence of the server accepting duplicates', ['duplicate|again|twice|each time|every time|repeated', 'transfer|money|\\$500|payment|funds']),
     cr('Describes a prevention such as a nonce or expiry', 'nonce|one-time|unique (value|identifier|id)|idempotency|already seen|expire|expiry|timestamp')])]),
Q(21, 'SQL: customers with no matching rows', `Tables: Customers and Transactions. Transactions.CustomerID refers to Customers.CustomerID. Month is the name of a month and Status is Completed or Failed. Some customers have no transactions at all.`, [
  sql('Construct a SQL query that displays the Name and Tier of every customer who has no Completed transaction in March, including customers who have no transactions at all. Order the results alphabetically by Name.', 4, [customers, txns],
    "SELECT c.Name, c.Tier FROM Customers c WHERE NOT EXISTS (SELECT 1 FROM Transactions t WHERE t.CustomerID = c.CustomerID AND t.Month = 'March' AND t.Status = 'Completed') ORDER BY c.Name",
    {ordered:true, hidden:[{Transactions:txnsHidden}], weights:[0,2,1,1], expectedRows:[['Ben','Standard'],['Dana','Standard'],['Eli','Standard'],['Faye','Gold']]})]),
Q(22, 'Object-oriented class modelling', `A banking system holds the following classes. Each box lists the attributes of one class.\n\nSavingsAccount: accountNo, ownerName, balance, interestRate, withdrawalsPerMonth\nTermDeposit: accountNo, ownerName, balance, interestRate, termMonths\nChequeAccount: accountNo, ownerName, balance, overdraftLimit\nBusinessAccount: accountNo, ownerName, balance, overdraftLimit, abn`, [
  diagram('Construct a class diagram that uses inheritance to remove all redundant attributes. You may add classes and may use any of the four classes above as a superclass. Show a suitable data type (for example str, int or float) for each attribute.', 3,
    {classes:[
      {name:'Account', alt:['BankAccount','BaseAccount','AccountBase'], byAttrs:true, attrs:['accountNo','ownerName','balance'], parent:null},
      {name:'InterestAccount', alt:['InterestBearingAccount','InterestBearing','InterestBearingAcct','Interest'], byAttrs:true, attrs:['interestRate'], parent:'Account'},
      {name:'SavingsAccount', alt:['Savings'], attrs:['withdrawalsPerMonth'], parent:'InterestAccount'},
      {name:'TermDeposit', alt:['Term'], attrs:['termMonths'], parent:'InterestAccount'},
      {name:'ChequeAccount', alt:['Cheque'], attrs:['overdraftLimit'], parent:'Account'},
      {name:'BusinessAccount', alt:['Business'], attrs:['abn'], parent:'ChequeAccount'}],
     types:{accountNo:'str', ownerName:'str', balance:'float', interestRate:'float', withdrawalsPerMonth:'int', termMonths:'int', overdraftLimit:'float', abn:'str'}},
    'Account (accountNo: str, ownerName: str, balance: float)\n  ↑ InterestAccount (interestRate: float)\n      ↑ SavingsAccount (withdrawalsPerMonth: int)\n      ↑ TermDeposit (termMonths: int)\n  ↑ ChequeAccount (overdraftLimit: float)\n      ↑ BusinessAccount (abn: str)')]),
Q(23, 'Open banking: ethics, access and testing', `Northern Star Bank lets customers share their transaction history with third-party budgeting apps through an open API. A machine-learning system also reviews every card transaction and automatically freezes a card when it scores a transaction as likely fraud.`, [
  written('Outline potential social and ethical issues associated with the open API and the automatic card freezing.', 3, 90,
    'Sharing transaction history with third-party apps raises privacy concerns, because the data reveals where customers shop and their health, religion or finances, so customers need clear, informed consent about what is shared and the ability to withdraw it. Automatic freezing can wrongly block genuine customers, who may be left unable to buy food or fuel, and if the model is less accurate for some groups of customers it could treat them unfairly. The bank should provide fast human review and a way to appeal.',
    [cr('Identifies a privacy or consent issue with third-party data sharing', 'privacy|consent|third.party|share|reveal|sensitive|personal'),
     cr('Identifies the harm of wrongly freezing a card or of unfair treatment', ['freez|block', 'wrong|genuine|unable|unfair|bias|accuracy|stranded|false']),
     cr('Explains a safeguard such as human review or appeal', 'human|review|appeal|withdraw|consent|safeguard|oversight|transparen')]),
  written('Explain how delegated authorisation with a limited scope and a customer-controlled consent protects a customer who uses a third-party budgeting app.', 3, 100,
    'With delegated authorisation, the customer approves the budgeting app on the bank\'s own login page and the bank issues the app an access token, so the app never sees the customer\'s password. The token is limited in scope, for example read-only access to transaction history, so even if the app is hacked it cannot make payments or change settings. The customer can also see the consent and revoke it at any time, which invalidates the token.',
    [cr('Explains that the app does not receive the customer\'s password', ['password|credentials', 'never|not|without|does not|no']),
     cr('Explains limited scope or permissions', 'scope|limited|read.only|permission|only (the|what)|cannot make payments|restricted'),
     cr('Explains customer consent and revocation', 'revoke|revocation|withdraw|consent|approve|remove|invalidat')]),
  rows('Select the most appropriate type of testing for each situation.', [
    ['After interest rules are changed, the whole previous test suite is re-run to check nothing else has broken', 'Regression testing'],
    ['Customers\' representatives confirm that the new statement screen meets the agreed needs', 'User acceptance testing'],
    ['Check that the payments module correctly calls the fraud-scoring service and uses its reply', 'Integration testing'],
    ['Simulate 20,000 customers logging in at the same moment on payday', 'Load testing']],
    ['Unit testing', 'Integration testing', 'Regression testing', 'User acceptance testing', 'Load testing', 'Security testing'], 3, [4, 3, 2])]),
Q(24, 'Automated credit decisions: impacts', `The bank introduces software that automatically approves or declines small personal loans within seconds. It was trained on ten years of the bank's lending decisions and uses inputs such as income, employment history, postcode and past repayments. Customers who are declined receive a brief automated message.`, [
  written('Discuss the possible impacts of this system on customers.', 5, 170,
    'The system gives customers an answer in seconds instead of days and applies the same rules to everyone, which should make decisions faster and more consistent. However, because it learned from past human decisions, it may copy their biases: using postcode as an input can disadvantage people from certain areas, and people with short credit histories, such as young adults or recent migrants, may be declined unfairly. A brief automated message makes it hard for a declined customer to understand why or to challenge the decision, which reduces transparency and accountability. If declines are wrong, customers may turn to more expensive lenders. Overall the system is beneficial if decisions can be explained, are checked for bias, and a human can review appeals.',
    [cr('Explains speed or consistency benefits', ['seconds|fast|quick|speed|instant|convenien|consisten', 'decision|answer|loan|same rules|everyone']),
     cr('Explains bias copied from past decisions or training data', 'bias|past (human )?decisions|trained on|training|copy|disadvantag|discriminat|unfair'),
     cr('Explains the effect of input choices such as postcode or short histories', 'postcode|short (credit )?histor|young|migrant|proxy|area|thin'),
     cr('Explains the lack of transparency or ability to appeal', 'transparen|explain|appeal|challenge|accountab|understand why|reason'),
     cr('Reaches a balanced judgement or suggests safeguards', 'overall|however|on balance|provided|human|review|safeguard|if decisions')])]),
Q(25, 'Supervised learning for fraud detection', `Northern Star Bank has labelled five years of card transactions as "genuine" or "fraud". Only about 0.1% of the transactions are fraud. The bank wants a supervised model to flag new fraudulent transactions.`, [
  written('Explain how the model could be trained and evaluated, including why accuracy alone is a misleading measure here. Include ONE positive and ONE negative impact of using the model.', 5, 170,
    'The labelled transactions are the training data: features such as the amount, merchant and location are the inputs and "genuine" or "fraud" is the label, and the algorithm adjusts its parameters to reduce its prediction errors. It is then tested on transactions it has not seen. Because only 0.1% of transactions are fraud, a model that labelled everything genuine would be 99.9% accurate while catching no fraud, so accuracy is misleading; precision (how many flags are really fraud) and recall (how much fraud is found) must be measured. A positive impact is that fraudulent card use can be stopped within seconds, protecting customers\' money. A negative impact is that false positives block genuine purchases, inconveniencing customers and potentially treating some groups unfairly if the model is less accurate for them.',
    [cr('Explains labelled data used to train the model', ['label', 'train|fraud|genuine|feature|input|adjust']),
     cr('Explains testing on unseen data', 'unseen|test (data|set)|held.out|evaluat|not seen|validat'),
     cr('Explains why accuracy is misleading with rare fraud and what to measure instead', ['accura|99', 'rare|0\\.1|imbalanc|everything genuine|misleading|precision|recall']),
     cr('Explains a positive impact', 'stop|protect|prevent|within seconds|real.time|save|reduce (losses|fraud)'),
     cr('Explains a negative impact', 'false positive|block(s|ed)? genuine|inconvenien|unfair|bias|wrongly')])]),
Q(26, 'Python programming: account transactions', `A bank processes a list of commands.\n\nINPUT\nLine 1: n, the number of commands (0 or more).\nNext n lines, each one of:\n• OPEN id amount — opens an account with an opening balance\n• DEPOSIT id amount\n• WITHDRAW id amount\n• TRANSFER from to amount\nAmounts are whole numbers. Account ids contain no spaces.\n\nRULES — a command is rejected for the first reason that applies, in this order:\n1. OPEN: the id already exists (exists). Any other command: an account named in it is not open (no account).\n2. The amount is negative or, except for OPEN, zero (invalid amount).\n3. TRANSFER only: from and to are the same account (same account).\n4. WITHDRAW or TRANSFER only: the account's total of successful outgoing amounts so far plus this amount would be more than 1000 (limit). Outgoing amounts are successful withdrawals and the amounts transferred out.\n5. WITHDRAW or TRANSFER only: the balance is less than the amount (insufficient).\nA rejected command changes nothing.\n\nOUTPUT\nFor each command, one line: OK or REJECTED: followed by a space and the reason. Then one line per account, in alphabetical order of id (compared as text): "id: balance".\n\nEXAMPLE INPUT\n7\nOPEN a1 500\nOPEN b2 100\nDEPOSIT a1 200\nWITHDRAW a1 800\nTRANSFER a1 b2 300\nWITHDRAW b2 450\nTRANSFER a1 c3 10\n\nEXAMPLE OUTPUT\nOK\nOK\nOK\nREJECTED: insufficient\nOK\nREJECTED: insufficient\nREJECTED: no account\na1: 400\nb2: 400`, [
  python('Write a Python program that reads the input and produces the required output.', 5, '# Read n, then n commands\n',
    '@SAMPLE26@',
    [{name:'Worked example', stdin:'7\nOPEN a1 500\nOPEN b2 100\nDEPOSIT a1 200\nWITHDRAW a1 800\nTRANSFER a1 b2 300\nWITHDRAW b2 450\nTRANSFER a1 c3 10', expect:'OK\nOK\nOK\nREJECTED: insufficient\nOK\nREJECTED: insufficient\nREJECTED: no account\na1: 400\nb2: 400'},
     {name:'Outgoing total of exactly 1000 is allowed', stdin:'4\nOPEN x 5000\nWITHDRAW x 600\nWITHDRAW x 400\nWITHDRAW x 1', expect:'OK\nOK\nOK\nREJECTED: limit\nx: 4000'},
     {name:'Transfers out count towards the limit', stdin:'5\nOPEN y 3000\nOPEN z 0\nTRANSFER y z 900\nWITHDRAW y 200\nTRANSFER y z 100', expect:'OK\nOK\nOK\nREJECTED: limit\nOK\ny: 2000\nz: 1000'},
     {name:'The limit is checked before the balance', stdin:'2\nOPEN p 50\nWITHDRAW p 1200', expect:'OK\nREJECTED: limit\np: 50'},
     {name:'Invalid amounts and duplicate accounts', stdin:'5\nOPEN q -5\nOPEN q 0\nOPEN q 10\nDEPOSIT q 0\nDEPOSIT q -3', expect:'REJECTED: invalid amount\nOK\nREJECTED: exists\nREJECTED: invalid amount\nREJECTED: invalid amount\nq: 0'},
     {name:'Reason order: no account, invalid amount, same account', stdin:'5\nOPEN m 100\nTRANSFER m m 10\nTRANSFER m n 10\nTRANSFER n m 5\nTRANSFER m m -4', expect:'OK\nREJECTED: same account\nREJECTED: no account\nREJECTED: no account\nREJECTED: invalid amount\nm: 100'},
     {name:'Rejected commands do not use up the limit', stdin:'4\nOPEN r 100\nWITHDRAW r 500\nDEPOSIT r 2000\nWITHDRAW r 1000', expect:'OK\nREJECTED: insufficient\nOK\nOK\nr: 1100'},
     {name:'Ids are listed in text order', stdin:'5\nOPEN b 1\nOPEN a2 2\nOPEN a10 1\nOPEN c 3\nOPEN a 4', expect:'OK\nOK\nOK\nOK\nOK\na: 4\na10: 1\na2: 2\nb: 1\nc: 3'},
     {name:'No commands', stdin:'0', expect:''},
     {name:'Larger input (400 commands)', stdin:'@LARGEIN@', expect:'@LARGEOUT@'}], {mutants:@MUT26@})]),
Q(27, 'Analysing a security incident', `Extract from a post-incident report.\n• An attacker found a developer's database access token in a public code repository.\n• The token belonged to an account with read and write access to every table, including customer details and transaction history.\n• The attacker ran about 40,000 "SELECT *" queries from one address over nine days. No alert was raised.\n• Backups were encrypted, but the live database was not encrypted at rest.\n• Customers were told about the breach three weeks after it was discovered.`, [
  written('Analyse the report to identify how the bank\'s design and processes increased the harm caused by this incident, and justify improvements the bank should make.', 6, 220,
    'The token was exposed because secrets were stored in a public repository; secret scanning before commit and rotating tokens regularly would have prevented or limited this. The token had read and write access to every table, which violates least privilege: an account used for development should only reach the tables it needs, which would have limited what could be taken. Nine days of 40,000 repeated queries from one address went unnoticed, so the bank needs monitoring that raises an alert for unusual query volumes, with rate limits. Encrypting the live database at rest would reduce the value of any copied storage, as would encrypting sensitive columns. Notifying customers only after three weeks left them exposed to fraud, so an incident response plan with clear notification timelines is needed. Together these controls create defence in depth, so that a single mistake such as a leaked token does not expose all customer data.',
    [cr('Identifies the exposed secret and a preventative improvement', ['repositor|token|secret|credential', 'scan|rotat|vault|never commit|environment variable|expire|revoke']),
     cr('Identifies excessive privileges and justifies least privilege', ['read and write|every table|all tables|privilege|access to every', 'least privilege|only (the|what)|limit|restrict|need']),
     cr('Identifies the lack of detection and recommends monitoring or alerting', ['40,000|nine days|no alert|unnoticed|undetected', 'monitor|alert|rate.limit|anomal|log']),
     cr('Identifies the lack of encryption at rest and recommends it', ['encrypt', 'at rest|live database|columns|stored']),
     cr('Identifies the delayed notification and recommends an incident response plan', ['three weeks|notif|told|delay', 'incident response|plan|timeline|promptly|within|72|quickly']),
     cr('Justifies the combination of controls', 'defence in depth|layer|together|single mistake|multiple controls|each control')])])
]));
}
