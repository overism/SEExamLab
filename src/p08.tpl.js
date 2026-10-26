/* ---------- Paper 08 — AeroLink Baggage Systems (generated from p08.tpl.js by gen/p08.py) ---------- */
{
const {mc, multi, rows, cr, written, python, sql, diagram, twoOf, Q, paper} = H;
const flights = {name:'Flights', columns:['FlightNo','Destination'], rows:[['AL101','Auckland'],['AL102','Auckland'],['AL205','Bali'],['AL330','Cairns'],['AL410','Doha']]};
const bags = {name:'Bags', columns:['BagID','FlightNo','Weight','Status'], rows:[
  [1,'AL101',18.5,'Delayed'],[2,'AL101',22.0,'Loaded'],[3,'AL101',25.5,'Delayed'],
  [4,'AL102',19.0,'Loaded'],[5,'AL102',30.0,'Delayed'],
  [6,'AL205',21.0,'Loaded'],[7,'AL205',17.5,'Loaded'],[8,'AL205',24.0,'Delayed'],
  [9,'AL330',20.0,'Delayed'],[10,'AL330',20.5,'Delayed'],[11,'AL330',19.5,'Delayed'],[12,'AL330',18.0,'Loaded'],
  [13,'AL410',23.0,'Loaded']]};
const bagsHidden = [[1,'AL101',20.0,'Delayed'],[2,'AL102',21.0,'Delayed'],[3,'AL102',22.0,'Loaded'],[4,'AL205',18.0,'Delayed'],[5,'AL205',19.0,'Delayed'],[6,'AL205',25.0,'Delayed'],[7,'AL330',16.0,'Loaded'],[8,'AL330',17.0,'Loaded'],[9,'AL410',30.0,'Delayed']];

NEW.push(paper(8, 'AeroLink Baggage Systems', 'Airport baggage automation, secure APIs and machine intelligence', [
Q(1, 'Agile practices', `At the end of every two-week iteration, the AeroLink team demonstrates the working baggage-tracking increment to airline staff and records their feedback. Separately, the team meets without stakeholders to discuss how to improve the way they work.`, [
  mc('Which pair of agile practices is described?', ['Iteration planning and the daily stand-up', 'Backlog refinement and the release', 'The daily stand-up and the iteration review', 'The iteration review and the retrospective'], 3, 'a demonstration to stakeholders is the iteration (sprint) review; the team-only process-improvement meeting is the retrospective.')]),
Q(2, 'Code tracing', `bags = [12, 25, 7, 31, 18]\ntotal = 0\nfor i in range(1, len(bags), 2):\n    if bags[i] > 20:\n        total += bags[i] - 20\n    else:\n        total -= 1\nprint(total, bags[-2:])`, [
  mc('What does this program display?', ['16 [31, 18]', '5 [31, 18]', '16 [18]', '15 [7, 31]'], 0, 'i takes the values 1 and 3: 25 adds 5 and 31 adds 11, giving 16; bags[-2:] is the last two items.')]),
Q(3, 'Cross-site request forgery', `Baggage-handler supervisors change a flight's bag limit using POST /flights/QF12/limit. The server authenticates the request using only the session cookie. A supervisor visits a malicious web page that silently submits a form to this address, and the limit is changed.`, [
  mc('Which defence most directly prevents this attack?', ['Store only a hash of the session cookie on the server', 'Check that the cap value is a number', 'Require an unpredictable per-session anti-CSRF token in the request, and have the server verify it', 'Serve the supervisor portal over HTTPS'], 2, 'the browser automatically attaches the cookie to the forged request; a secret token the attacker cannot read or guess proves the request came from the real page. HTTPS does not stop forged requests.')]),
Q(4, 'Evaluating a classifier', `A model flags bags that are likely to miss their connection. Of 1,000 bags, 40 actually missed their connection. The model flagged 50 bags, and 30 of the flagged bags actually missed their connection.`, [
  mc('Which statement is correct?', ['Accuracy is 75% because 30 of the 40 bags that missed were found', 'Of the bags flagged, 60% actually missed their connection, and the model found 75% of all the bags that missed', 'Precision is 75% and recall is 60%', 'The model is unusable because 10 bags that missed were not flagged'], 1, 'precision = 30/50 = 60%; recall = 30/40 = 75%; overall accuracy is (30 + 940)/1000 = 97%.')]),
Q(5, 'HTTP status codes', `A staff mobile app calls GET /bags/7781 with a valid login token. The bag exists, but the token belongs to a catering employee who has no permission to view baggage records.`, [
  mc('Which response is the most appropriate?', ['401 — the request did not include valid credentials', '404 — the bag must be hidden from this user', '500 — the server could not complete the request', '403 — the user is authenticated but not permitted to access this resource'], 3, '401 means authentication failed or is missing; 403 means the identity is known but lacks permission.')]),
Q(6, 'Algorithm efficiency', `Algorithm A finds duplicate bag tags by comparing every tag with every other tag. Algorithm B adds each tag to a set, checking whether it is already present first.`, [
  mc('The number of tags doubles from 10,000 to 20,000. Approximately how does the work change for each algorithm?', ['A grows about four times; B grows about two times', 'A grows about two times; B grows about two times', 'A grows about four times; B grows about four times', 'A grows about two times; B stays about the same'], 0, 'comparing every pair grows with the square of n; one set lookup per tag grows in proportion to n.')]),
Q(7, 'Preventing SQL injection', `Statement 1: cur.execute("SELECT * FROM bags WHERE tag = '" + tag + "'")\nStatement 2: cur.execute("SELECT * FROM bags WHERE tag = '%s'" % tag)\nStatement 3: cur.execute("SELECT * FROM bags WHERE tag = ?", (tag,))\nStatement 4: cur.execute(f"SELECT * FROM bags WHERE tag = '{tag}'")`, [
  mc('Which statement resists SQL injection?', ['Statement 1', 'Statement 2', 'Statement 3', 'Statement 4'], 2, 'only statement 3 sends the value separately from the SQL text; the % operator and the f-string simply build one string like statement 1 does.')]),
Q(8, 'Progressive web apps', `A passenger's baggage-status PWA must show the last known status instantly even with no signal, but must also fetch newer data when a connection is available and update what is displayed.`, [
  mc('Which service-worker caching strategy best meets this requirement?', ['Network only, so data is always fresh', 'Stale-while-revalidate: return the cached response immediately while fetching a fresh copy to update the cache', 'Cache only, so the app never needs the network', 'Cache first, with no update until the app is reinstalled'], 1, 'it gives an instant response from the cache and refreshes in the background when online.')]),
Q(9, 'Feasibility', '', [
  rows('Which type of feasibility does each question investigate?', [
    ['Do the existing scanners support the new tag protocol?', 'Technical'],
    ['Will savings in lost-bag compensation exceed the system\'s cost within three years?', 'Economic'],
    ['Will handlers accept and be able to use the new handheld devices?', 'Operational'],
    ['Can the system be live before the new terminal opens in March?', 'Schedule']],
    ['Technical', 'Economic', 'Operational', 'Schedule'], 1, [4])]),
Q(10, 'Password storage', '', [
  multi('Which statements correctly explain the use of a salted, deliberately slow password hash? Select all that apply.', ['A unique salt defeats precomputed hash tables', 'A deliberately slow hash makes bulk guessing more expensive for an attacker', 'The hashes can be reversed with a key when a user needs password recovery', 'Salting makes two identical passwords produce different stored values', 'A slow hash lets the server verify a million logins per second'], [0, 1, 3], 'hashes are one-way, so recovery must use a reset process; slow hashing deliberately limits verification speed.')]),
Q(11, 'Testing and quality assurance', '', [
  multi('Which statements about automated testing are correct? Select all that apply.', ['Unit tests should run quickly and independently of each other', 'A passing test suite proves the software contains no faults', 'Regression tests are re-run after changes to detect newly introduced faults', 'Tests that only pass when run in a particular order are more reliable', 'Continuous integration can run the test suite automatically on every commit'], [0, 2, 4], 'tests can only show the presence of faults, and order-dependent tests are fragile.')]),
Q(12, 'HTTP status codes', '', [
  rows('Select the most appropriate status code for each response.', [
    ['A POST request successfully creates a new bag record', '201 Created'],
    ['A JSON body is missing the required "flight" field', '400 Bad Request'],
    ['The login token has expired', '401 Unauthorized'],
    ['An authenticated catering employee requests the security-screening log', '403 Forbidden'],
    ['GET /bags/99999999 refers to a bag that does not exist', '404 Not Found'],
    ['GET /bags/7781 returns the bag record', '200 OK']],
    ['200 OK', '201 Created', '400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found'], 2, [6, 4])]),
Q(13, 'Relational database concepts', '', [
  rows('Select the term that matches each description.', [
    ['BagID uniquely identifies every row in the Bags table', 'Primary key'],
    ['Bags.FlightNo must match an existing Flights.FlightNo', 'Foreign key'],
    ['A structure that speeds up searches on Bags.Tag at the cost of extra storage and slower writes', 'Index'],
    ['A key built from FlightNo and SeatNo because neither is unique on its own', 'Composite key']],
    ['Primary key', 'Foreign key', 'Index', 'Composite key'], 2, [4, 2])]),
Q(14, 'Classifier outcomes', '', [
  rows('Classify each outcome for a model that flags bags likely to miss their connection.', [['A bag that did miss its connection is flagged', 'True positive'], ['A bag that connected normally is flagged', 'False positive'], ['A bag that missed its connection is not flagged', 'False negative']], ['True positive', 'False positive', 'False negative', 'True negative'], 1, [3])]),
Q(15, 'Data structures, algorithms and code review', `The AeroLink team uses code review before any change is merged, and also maintains an automated unit-test suite.`, [
  rows('Match each description to a data structure or algorithm.', [
    ['Find a bag by its tag in roughly constant time', 'Dictionary'],
    ['Remove duplicate tags', 'Set'],
    ['Locate a tag in a sorted list by repeatedly halving the range', 'Binary search'],
    ['Repeatedly swap neighbouring items that are out of order until none remain', 'Bubble sort'],
    ['Check every item from the start until a match is found', 'Linear search'],
    ['Hold ordered handling steps where duplicates are allowed and positions matter', 'List']],
    ['Dictionary', 'Set', 'Binary search', 'Bubble sort', 'Linear search', 'List'], 3, [6, 5, 3]),
  written('Explain how code review and automated unit tests complement each other in improving software quality.', 3, 90,
    'Code review lets another developer examine a change for logic errors, security weaknesses, readability and design problems that an automated test may not have been written to catch. Automated unit tests, in contrast, check the expected behaviour of each function the same way every time and can be re-run after every change to detect regressions, which a reviewer cannot do reliably by reading. Used together, review catches problems of judgement and clarity while tests prove that behaviour has not broken.',
    [cr('Explains what code review can detect', ['code review|peer review|reviewer|another developer|reviewed', 'logic|security|readab|design|maintain|standard']),
     cr('Explains what automated unit tests do repeatedly', ['unit test|automated test', 'automat|re-?run|repeat|regress|every change|same way|behaviour|expected']),
     cr('Explains how the two compensate for each other', 'together|complement|whereas|in contrast|each other|both')])]),
Q(16, 'Progressive web app and API design', `The AeroLink passenger app is a progressive web app. Passengers see the real-time status of their bags and receive push notifications. A REST API returns JSON status for a bag tag. Passengers often use the app in the terminal's lower levels where mobile reception is poor.`, [
  written('Explain how a service worker allows the app to show the last known bag status when the passenger has no reception.', 3, 90,
    'A service worker is a script that runs in the background and sits between the app and the network, intercepting each request. When the app loads the bag status while online, the service worker stores the response in a cache. If the passenger later has no reception, the service worker answers the request from the cache, so the last known status still appears, and it can fetch the latest status and update the cache when a connection returns.',
    [cr('Explains that a service worker intercepts requests', ['service worker', 'intercept|between|background|proxy|request|script']),
     cr('Explains storing responses in a cache while online', 'cach|stor|save'),
     cr('Explains serving from the cache offline and updating later', ['offline|no reception|no signal|no connection|without', 'update|refresh|fetch|latest|return|reconnect|when online'])]),
  written('Describe TWO ways to reduce the amount of data transferred to passengers on slow mobile connections.', 3, 90,
    'The API can compress responses and static files, for example with gzip, so fewer bytes travel over the network. It can also return only the fields the app displays, such as the status and location, instead of the whole bag record, and the app can request only the changes since the last update. Both reduce load time for users with weak reception.',
    [cr('Describes one valid data-reduction technique', 'compress|gzip|minif|webp|image|lazy|only the fields|subset|delta|changes since|paginat|cach'),
     cr('Describes a second, different technique', twoOf('compress|gzip|minif', 'image|webp|lazy', 'only the fields|subset|fewer fields|partial|select(ed)? fields', 'delta|changes since|incremental|only (what|the) changed', 'paginat|batch', 'cach')),
     cr('Links to weak reception or load time', 'reception|slow|mobile|load time|bandwidth|faster|data usage|network')]),
  written('Explain how authentication and rate limiting together help protect the bag-status API.', 3, 100,
    'Bag tags are short and similar, so without controls an attacker could script requests that try thousands of tag numbers to see other passengers\' travel details. Requiring authentication, such as a token tied to the passenger\'s booking, means the API only answers requests from someone entitled to that bag. Rate limiting caps how many requests each client or address can make per minute, so even a stolen or shared token cannot be used to enumerate tags quickly.',
    [cr('Explains the threat of guessing or enumerating tags', 'guess|enumerat|try (thousands|many)|brute|script|scrap|harvest|iterate'),
     cr('Explains how authentication restricts who can see a bag', ['authenticat|token|login|credential|booking', 'entitled|only|restrict|verify|identity|their own']),
     cr('Explains how rate limiting limits automated abuse', ['rate.limit|cap|throttl|limit(s|ing)? (the )?(number|requests)', 'minute|per|each client|address|quickly|slow'])])]),
Q(17, 'Algorithm design', `The array Weights[1..n] holds the weight in kilograms of each bag checked in for a flight. A bag is overweight if its weight is more than 23.0 kg. The value of n may be 0.`, [
  written('Construct pseudocode that displays the number of overweight bags and the weight of the heaviest overweight bag. If no bag is overweight, display "None overweight" instead.', 3, 120,
    'count ← 0\nheaviest ← 0\nFOR i ← 1 TO n\n    IF Weights[i] > 23.0 THEN\n        count ← count + 1\n        IF Weights[i] > heaviest THEN\n            heaviest ← Weights[i]\n        ENDIF\n    ENDIF\nENDFOR\nIF count = 0 THEN\n    DISPLAY "None overweight"\nELSE\n    DISPLAY count, heaviest\nENDIF',
    [cr('Uses a loop and counts only bags above 23.0', ['for|while|loop|repeat', '>\\s*23'], '[a-z_\\]]+\\s*>=\\s*23'),
     cr('Tracks the heaviest overweight bag with a comparison', ['heaviest|max|largest|biggest', '[<>]']),
     cr('Selects between the no-overweight message and the results', ['none overweight', 'if', 'count|number|total'])])]),
Q(18, 'Metadata and data mining', `Every time a bag passes a scanner, the system records a scan event: the tag, the scanner's identifier and location, and the time. Passengers regularly miss connections because bags arrive late at the transfer area.`, [
  written('Explain how the scan-event metadata and data mining could be used to find where bags are being delayed.', 3, 90,
    'The metadata records which scanner saw each bag and when, so the time between consecutive scans for the same tag shows how long a bag spent in each stage. Data mining many days of these events can reveal patterns, such as one transfer belt where the gap is much longer at certain times of day. The airport can then add staff or repair the equipment at that point, reducing late arrivals.',
    [cr('Identifies relevant metadata such as scanner, location and time', 'metadata|scanner|scan event|timestamp|time between|time of each'),
     cr('Explains that mining reveals patterns or bottlenecks', ['mining|mined|analys', 'pattern|bottleneck|trend|gap|delay|longer|slow']),
     cr('Links the finding to an improvement', 'staff|repair|fix|add (staff|capacity)|redesign|reroute|reschedul|equipment|maintenance')])]),
Q(19, 'Python programming: validation', `A bag tag has exactly nine characters: two capital letters followed by seven digits. The seventh digit is a check digit equal to the remainder when the sum of the first six digits is divided by 10.\n\nA tag is checked in this order and the first problem found is reported:\n1. if it is not nine characters long, display Rejected: length\n2. if the first two characters are not capital letters A–Z, or the last seven are not all digits, display Rejected: format\n3. if the check digit is wrong, display Rejected: check digit\n4. otherwise display Accepted\n\nExample: QF1234561 is accepted because 1 + 2 + 3 + 4 + 5 + 6 = 21 and 21 mod 10 = 1.`, [
  python('Write a Python program that reads one tag and displays the result.', 3, '# Read one tag\n',
    'tag = input().strip()\nif len(tag) != 9:\n    print("Rejected: length")\nelif not (tag[:2].isalpha() and tag[:2].isupper() and tag[:2].isascii() and tag[2:].isdigit()):\n    print("Rejected: format")\nelif int(tag[8]) != sum(int(c) for c in tag[2:8]) % 10:\n    print("Rejected: check digit")\nelse:\n    print("Accepted")',
    [{name:'Worked example', stdin:'QF1234561', expect:'Accepted'},
     {name:'Wrong check digit', stdin:'QF1234563', expect:'Rejected: check digit'},
     {name:'Too short', stdin:'QF123456', expect:'Rejected: length'},
     {name:'Too long', stdin:'QF12345610', expect:'Rejected: length'},
     {name:'Lower-case letters', stdin:'qf1234561', expect:'Rejected: format'},
     {name:'Letter among the digits', stdin:'QF12A4561', expect:'Rejected: format'},
     {name:'Digit in the letter positions', stdin:'1F1234561', expect:'Rejected: format'},
     {name:'Length is checked before format', stdin:'qf12', expect:'Rejected: length'},
     {name:'Check digit 4 for sum 54', stdin:'ZZ9999994', expect:'Accepted'},
     {name:'Check digit of a zero remainder', stdin:'AB2800000', expect:'Accepted'}], {mutants:@MUT19@})]),
Q(20, 'Insecure direct object references', `Passengers track a bag at https://aerolink.example/track/00417. The number is the bag's sequential record number. The server returns the record for any number without checking who is asking.`, [
  written('Explain the vulnerability in this design and describe TWO controls that would reduce the risk.', 3, 100,
    'Because the numbers are sequential and the server does not check who is asking, anyone can change 00417 to 00418 and view another passenger\'s bag and travel details, an insecure direct object reference that breaches their privacy. The server should check on every request that the logged-in passenger owns the bag being requested, and the identifiers should be long and random so they cannot be guessed, optionally with rate limiting to slow scanning attempts.',
    [cr('Explains that sequential identifiers can be altered or guessed to reach other records', 'sequential|change|altering|guess|enumerat|increment|other passengers|another passenger|someone else'),
     cr('Identifies an authorisation check as a control', ['check|verif|authoris|authoriz|owner|owns|permission', 'server|request|logged']),
     cr('Identifies a second, different control', 'random|unpredictable|uuid|long identifier|rate.limit|throttl|log(ging)?\\b|monitor')])]),
Q(21, 'SQL: joins, CASE and grouped conditions', `Tables: Flights and Bags. Several flights may go to the same destination. Bags.FlightNo refers to Flights.FlightNo. Status is Loaded or Delayed.`, [
  sql('Construct a SQL query that displays, for each destination that has at least two Delayed bags, the Destination, the total number of bags and the number of Delayed bags. Order the results by the number of Delayed bags from highest to lowest, then by Destination alphabetically.', 4, [flights, bags],
    "SELECT f.Destination, COUNT(*) AS TotalBags, SUM(CASE WHEN b.Status = 'Delayed' THEN 1 ELSE 0 END) AS DelayedBags FROM Flights f JOIN Bags b ON b.FlightNo = f.FlightNo GROUP BY f.Destination HAVING DelayedBags >= 2 ORDER BY DelayedBags DESC, f.Destination ASC",
    {ordered:true, hidden:[{Bags:bagsHidden}], weights:[0,2,1,1], expectedRows:[['Auckland',5,3],['Cairns',4,3]]})]),
Q(22, 'Object-oriented class modelling', `A baggage system holds the following classes. Each box lists the attributes of one class.\n\nCheckedBag: tagId, weightKg, ownerName, flightNo, conveyorZone\nCabinBag: tagId, weightKg, ownerName, flightNo, sizeCode\nOversizeItem: tagId, weightKg, ownerName, flightNo, handlingTeam, dimensions\nFragileItem: tagId, weightKg, ownerName, flightNo, handlingTeam, fragilityNote`, [
  diagram('Construct a class diagram that uses inheritance to remove all redundant attributes. Add any additional classes you need, and show a suitable data type (for example str, int or float) for each attribute.', 3,
    {classes:[
      {name:'Baggage', alt:['Bag','Item','Luggage','BaggageItem'], byAttrs:true, attrs:['tagId','weightKg','ownerName','flightNo'], parent:null},
      {name:'CheckedBag', attrs:['conveyorZone'], parent:'Baggage'},
      {name:'CabinBag', attrs:['sizeCode'], parent:'Baggage'},
      {name:'SpecialItem', alt:['SpecialHandling','HandledItem','SpecialBaggage','Special'], byAttrs:true, attrs:['handlingTeam'], parent:'Baggage'},
      {name:'OversizeItem', attrs:['dimensions'], parent:'SpecialItem'},
      {name:'FragileItem', attrs:['fragilityNote'], parent:'SpecialItem'}],
     types:{tagId:'str', weightKg:'float', ownerName:'str', flightNo:'str', conveyorZone:'int', sizeCode:'str', handlingTeam:'str', dimensions:'str', fragilityNote:'str'}},
    'Baggage (tagId: str, weightKg: float, ownerName: str, flightNo: str)\n  ↑ CheckedBag (conveyorZone: int)\n  ↑ CabinBag (sizeCode: str)\n  ↑ SpecialItem (handlingTeam: str)\n      ↑ OversizeItem (dimensions: str)\n      ↑ FragileItem (fragilityNote: str)')]),
Q(23, 'Automation: ethics, threat modelling and defences', `AeroLink is replacing manual bag sorting with robotic sorters. Cameras read each tag, a control server assigns every bag to a flight, and contractors maintain the robots remotely. Handler productivity data is shown on a dashboard.`, [
  written('Outline potential social and ethical issues associated with the camera-based tag reading and the contractors\' remote access.', 3, 90,
    'Cameras photograph every bag and the people standing near the belts, so the airport collects personal images that could be misused, and it must limit how long they are kept and who can view them. Remote access by contractors means passenger names and travel details could be exposed to third parties, so access should be limited, logged and covered by agreements. When a bag is misrouted it must also be clear who is accountable: the airport, the contractor or the software.',
    [cr('Identifies privacy concerns with images of people or bags', ['camera|image|photograph|footage', 'personal|people|privacy|bystander|identif']),
     cr('Identifies the risk of third-party or remote access to data', ['contractor|third.party|remote|outside', 'access|expos|share|passenger|data|details']),
     cr('Explains a consequence or safeguard such as accountability, retention or consent', 'accountab|responsib|retention|kept|consent|limit|logged|agreement|policy|liab')]),
  written('Explain how threat modelling could be applied to the robotic sorting system before it is built.', 3, 100,
    'Threat modelling identifies what needs protecting, such as the control server that assigns bags and the passenger data it holds, and then maps the entry points an attacker could use, such as the remote maintenance connection, the tag scanners and the dashboard. For each entry point the team asks what could go wrong, for example a forged tag or a stolen contractor password, and decides on controls such as input validation, multi-factor authentication and least privilege. Doing this at design time is cheaper than fixing weaknesses after deployment.',
    [cr('Identifies assets or what needs protecting', 'asset|what (needs|must) (to be )?protect|valuable|critical|control server'),
     cr('Identifies entry points and the threats at each', ['entry point|attack surface|attack vector|trust boundar', 'forged|stolen|spoof|tamper|inject|malicious|what could go wrong|compromise']),
     cr('Links threats to controls and to timing in the design', ['control|mitigat|multi.factor|least privilege|validation', 'design|before|early|cheaper|plan|built'])]),
  rows('Select the control that best addresses each need.', [
    ['A maintenance contractor\'s account can reconfigure sorting rules for every airport', 'Least privilege'],
    ['A tag scanner sends malformed barcodes that crash the sorter service', 'Input validation'],
    ['Investigators need to learn which account changed a bag\'s destination', 'Audit logging'],
    ['The sorter controller must keep operating if its primary server fails', 'Redundancy / failover']],
    ['Input validation', 'Least privilege', 'Audit logging', 'Encryption at rest', 'Redundancy / failover', 'Rate limiting'], 3, [4, 3, 2])]),
Q(24, 'Automation: impact on workers', `AeroLink replaces about 60% of manual bag handlers with robotic sorters. The remaining staff monitor the robots through dashboards. The software records each worker's response time to alerts and supervisors use it in performance reviews.`, [
  written('Discuss the possible impacts of this change on baggage handlers.', 5, 170,
    'Robotic sorters take over heavy repetitive lifting, which should reduce injuries and let remaining staff do safer supervisory work. However, about 60% of handlers are no longer needed, so many may lose their jobs unless they are retrained for monitoring and maintenance roles. Staff who stay are watched through response-time data used in performance reviews, which could create stress, a sense of surveillance and pressure to act quickly rather than carefully. Handlers may also lose manual sorting skills, which makes it harder to run the airport when the robots fail. Overall the change improves safety but its fairness depends on retraining, transparent use of the data and a manual fallback.',
    [cr('Explains a safety or work-quality benefit', ['injur|safer|safety|heavy|repetitive|lifting|supervis', 'robot|reduce|less|fewer|remaining|staff']),
     cr('Explains job loss and retraining', 'job|redundan|lose|retrain|reskill|income|employ|displace'),
     cr('Explains the impact of performance monitoring', 'monitor|surveill|stress|pressure|response.time|performance review|privacy|watched'),
     cr('Explains loss of skills or dependence on automation', 'skill|depend|rely|fail|fallback|manual|contingen'),
     cr('Reaches a balanced judgement', 'overall|however|on balance|depends|provided|unless|fair')])]),
Q(25, 'Software agents', `AeroLink wants a software agent to manage the movement of bags between belts. The agent receives live scan events and belt sensor readings, and can divert bags to a different belt.`, [
  written('Explain how the software agent could manage the routing of bags. Include ONE positive and ONE negative impact of using the agent.', 5, 170,
    'A software agent works autonomously towards a goal, here getting every bag to its flight on time. It perceives its environment through the scan events and belt sensors, for example a belt that is full or a bag running late. It then decides on an action using rules or a trained model, such as diverting a bag to a quieter belt, and carries out that action through the sorter controls. It repeats this cycle continuously, adapting as conditions change. A positive impact is that it reacts within seconds to blockages, reducing missed connections. A negative impact is that if its model is wrong or its sensor data is faulty it may divert many bags incorrectly and, because it acts automatically, the error could spread before a human notices.',
    [cr('Explains that an agent works autonomously towards a goal', ['agent', 'autonom|goal|objective|on its own|without|independent']),
     cr('Explains perception of the environment using the inputs', 'perceiv|sense|sensor|scan event|readings|observe|input|detect'),
     cr('Explains deciding and acting on the environment', ['decid|rules|model|choose|logic', 'divert|action|act|reroute|control|carries out']),
     cr('Explains a positive impact', 'faster|reduc|react|quick|missed connection|efficien|continuous|on time'),
     cr('Explains a negative impact', 'wrong|faulty|error|spread|incorrect|unnoticed|fail|bias|oversight|human')])]),
Q(26, 'Python programming: baggage manifests', `Check-in records for several flights are summarised.\n\nINPUT\nLine 1: n, the number of records (0 or more).\nNext n lines: flight,bag_id,weight_kg,priority — fields may have spaces around them.\n\nRULES\n• A record is invalid if it does not have exactly four fields, if flight or bag_id is empty, if the weight is not a number greater than 0 and at most 60, or if priority is not Y or N. Invalid records are counted and otherwise ignored.\n• If a valid record has a bag_id that has already been used by an earlier valid record (on any flight), it is ignored and is not counted as invalid.\n• A bag is overweight if its weight is more than 23.0. Weights have at most one decimal place.\n• A flight is marked CHECK if it has at least two overweight bags whose priority is Y.\n\nOUTPUT\nOne line per flight: "FLIGHT bags=B total=W over=O" where W is the total weight with one decimal place, followed by a space and CHECK if the flight is marked. Order flights by total weight (as displayed) from highest to lowest, then by flight name alphabetically. If there are no valid records display No valid bags. Finally, if any records were invalid, display Invalid records: followed by a space and the count.\n\nEXAMPLE INPUT\n6\nQF1,B1,25.0,Y\nQF1,B2,24.5,Y\nQF1,B3,12.0,N\nQF2,B4,30.0,N\nQF2,B4,15.0,Y\nQF2,B5,abc,N\n\nEXAMPLE OUTPUT\nQF1 bags=3 total=61.5 over=2 CHECK\nQF2 bags=1 total=30.0 over=1\nInvalid records: 1`, [
  python('Write a Python program that reads the input and produces the required output.', 5, '# Read n, then n records\n',
    '@SAMPLE26@',
    [{name:'Worked example', stdin:'6\nQF1,B1,25.0,Y\nQF1,B2,24.5,Y\nQF1,B3,12.0,N\nQF2,B4,30.0,N\nQF2,B4,15.0,Y\nQF2,B5,abc,N', expect:'QF1 bags=3 total=61.5 over=2 CHECK\nQF2 bags=1 total=30.0 over=1\nInvalid records: 1'},
     {name:'One priority overweight bag is not enough for CHECK', stdin:'3\nA,x1,24,Y\nA,x2,24,N\nA,x3,10,N', expect:'A bags=3 total=58.0 over=2'},
     {name:'Overweight boundary at 23.0', stdin:'2\nB,b1,23.0,Y\nB,b2,23.1,Y', expect:'B bags=2 total=46.1 over=1'},
     {name:'Weight limits: 60 valid; 60.1, 0 and -5 invalid', stdin:'4\nC,c1,60,N\nC,c2,60.1,N\nC,c3,0,N\nC,c4,-5,N', expect:'C bags=1 total=60.0 over=1\nInvalid records: 3'},
     {name:'Field count, empty id and priority checked', stdin:'4\nD,d1,10,N\nD,d2,10\nD,,10,N\nD,d3,10,Maybe', expect:'D bags=1 total=10.0 over=0\nInvalid records: 3'},
     {name:'Equal totals ordered by flight name', stdin:'3\nZ9,a,10,N\nA1,b,10,N\nM5,c,12.5,N', expect:'M5 bags=1 total=12.5 over=0\nA1 bags=1 total=10.0 over=0\nZ9 bags=1 total=10.0 over=0'},
     {name:'Only invalid records', stdin:'2\nX,x1,abc,N\nbad', expect:'No valid bags\nInvalid records: 2'},
     {name:'No records', stdin:'0', expect:'No valid bags'},
     {name:'Duplicate bag id on another flight ignored', stdin:'3\nP,t1,10,N\nQ,t1,40,Y\nQ,t2,5,N', expect:'P bags=1 total=10.0 over=0\nQ bags=1 total=5.0 over=0'},
     {name:'Spaces trimmed and decimals added exactly', stdin:'3\n E , e1 , 20.1 , Y \nE,e2,20.2,N\nE,e3,0.1,N', expect:'E bags=3 total=40.4 over=0'},
     {name:'Larger input (400 records)', stdin:'@LARGEIN@', expect:'@LARGEOUT@'}], {mutants:@MUT26@})]),
Q(27, 'Assessing automation risk', `After AeroLink introduced automated bag sorting, mis-sorted bags fell by 70%. However:\n• a firmware update was pushed to every sorting robot at once and failed, stopping all sorting for three hours\n• the camera system cannot read tags that are torn or dirty, and those bags are ignored without any alert\n• in a security test, a tester used an unpatched tag scanner to inject false tag data and divert bags to the wrong flight\n• handler productivity data is used in performance reviews.`, [
  written('Assess the extent to which the automated sorting system reduces risk for the airport and its passengers.', 6, 220,
    'The system clearly reduces one risk: mis-sorted bags fell by 70%, so fewer passengers are separated from their luggage. However, it also introduces new risks that reduce this gain. Pushing the firmware update to every robot at once created a single point of failure and stopped all sorting for three hours; updates should be tested and rolled out in stages with a way to roll back. The camera system ignores torn or dirty tags without an alert, so those bags need an automatic exception queue and manual handling fallback. The injection of false tag data through an unpatched scanner shows a security weakness that needs patch management, input validation and monitoring. Using handler productivity data in reviews raises privacy and fairness concerns for staff. Overall the system reduces everyday errors substantially but its net benefit is only partial until update, fallback and security controls are improved.',
    [cr('Uses the evidence of reduced mis-sorting as a benefit', ['70|fell|reduc|fewer|mis.sort', 'benefit|gain|improv|passenger|luggage|bags']),
     cr('Assesses the update failure and a mitigation', ['firmware|update|rollout|all at once|single point', 'stage|rollback|roll back|test|gradual|pilot|redundan|fail.?over']),
     cr('Assesses the unreadable-tag limitation and a fallback', ['torn|dirty|unreadable|cannot read|ignored', 'alert|manual|fallback|exception|queue|human']),
     cr('Assesses the security weakness and a control', ['unpatched|inject|false (tag )?data|security|divert', 'patch|validat|monitor|authenticat|update|control']),
     cr('Considers the effect on staff or privacy', 'privacy|monitor|performance review|productivity|staff|worker|fair'),
     cr('Reaches a reasoned judgement about the extent', 'overall|partial|net|on balance|extent|largely|only until|substantial')])])
]));
}
