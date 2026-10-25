/* ---------- Paper 12 — Verdant FarmLink (generated from p12.tpl.js by gen/p12.py) ---------- */
{
const {mc, multi, rows, cr, written, python, sql, diagram, twoOf, Q, paper} = H;
const species = {name:'Species', columns:['SpeciesID','CommonName','Status'], rows:[[1,'Quoll','Endangered'],[2,'Bilby','Vulnerable'],[3,'Parrot','Endangered'],[4,'Frog','Endangered'],[5,'Wallaby','Least Concern']]};
const sightings = {name:'Sightings', columns:['SightingID','SpeciesID','Zone','Count'], rows:[
  [1,1,'North',3],[2,1,'North',2],[3,3,'North',1],[4,2,'North',9],[5,3,'South',2],[6,4,'South',2],[7,4,'South',1],[8,5,'South',8],
  [9,1,'East',4],[10,2,'East',6],[11,3,'West',5],[12,3,'West',0]]};
const sightingsHidden = [[1,1,'A',2],[2,1,'A',3],[3,2,'A',10],[4,3,'B',2],[5,4,'B',2],[6,1,'B',1],[7,5,'C',20],[8,1,'C',4],[9,3,'D',5],[10,3,'D',5]];
const ABUSE = ['validat|range check|plausib|reject', 'authenticat|per.device|device (key|certificate|credential)|certificate|signed', 'rate.limit|throttl', 'anomal|compare|neighbouring|cross.check|outlier'];

NEW.push(paper(12, 'Verdant FarmLink', 'Agricultural sensor networks, wildlife data, secure IoT and applied machine learning', [
Q(1, 'Technical debt', `To meet a harvest-season deadline, the Verdant team skips writing tests and copies the same irrigation calculation into five modules. Six months later a rule change takes weeks, because it must be edited and re-checked in all five places.`, [
  mc('Which concept best describes this situation?', ['Scope creep', 'Regression', 'Feature freeze', 'Technical debt'], 3, 'shortcuts that save time now create extra work later, like interest on a loan.')]),
Q(2, 'Sorting with a key', `plots = [("B2", 31), ("A7", 28), ("C1", 31), ("A3", 28)]\nplots.sort(key=lambda p: (-p[1], p[0]))\nprint([p[0] for p in plots[:3]])`, [
  mc('What does this program display?', ['[\'B2\', \'C1\', \'A3\']', '[\'B2\', \'C1\', \'A7\']', '[\'A3\', \'A7\', \'B2\']', '[\'C1\', \'B2\', \'A3\']'], 0, 'plots are sorted by moisture from highest to lowest, then by name; the first three are B2, C1 and A3.')]),
Q(3, 'Reading JSON', `data = {"farm": "Ridge", "sensors": [\n    {"id": "s1", "readings": [12, 14, 15]},\n    {"id": "s2", "readings": [30, 28, 29, 35]}\n]}\n\nprint(data["sensors"][1]["readings"][-2])`, [
  mc('What does this program display?', ['28', '35', '29', '14'], 2, 'sensors[1] is s2; its readings list is [30, 28, 29, 35]; index -2 is the second last item.')]),
Q(4, 'Scaling data for machine learning', `Soil-moisture values of 20, 35 and 50 are scaled to the range 0 to 1 using min–max scaling, (value − minimum) ÷ (maximum − minimum), before they are used to train a neural network.`, [
  mc('What is the scaled value of 35, and why is scaling used?', ['0.35, so that the values add up to 1', '0.5, so that inputs with large numeric ranges do not dominate the training', '0.7, so that outliers are removed', '0.5, so that the values take less storage space'], 1, '(35 − 20) ÷ (50 − 20) = 0.5; scaling puts different inputs on comparable ranges.')]),
Q(5, 'Securing IoT devices', `Thousands of Verdant soil sensors ship with the same default administrator password and an open remote-management service. Attackers have started scanning the internet for them.`, [
  mc('Which approach most effectively addresses this weakness?', ['Move the management page to a non-standard port number', 'Encrypt the firmware using one key shared by all devices', 'Print a recommendation in the manual that customers should change the password', 'Give each sensor a unique credential, require it to be changed on first use, and disable services that are not needed'], 3, 'the weakness is shared, predictable credentials and unnecessary exposure; the other options leave the default in place or depend on users.')]),
Q(6, 'Database design', `The Sightings table has the columns SightingID, Species, SpeciesDiet and Observer. Every time a species is recorded, its diet is typed in again. Some rows for the same species now show different diets.`, [
  mc('Which change best removes this problem?', ['Add a column for each observer\'s phone number', 'Create a Species table holding each species and its diet once, and keep only the species key in Sightings', 'Merge all the columns into a single text field', 'Copy the diet into every row so queries are faster'], 1, 'a fact that depends on the species belongs in a table keyed by species, which removes update anomalies.')]),
Q(7, 'Choosing a learning approach', `There are no labelled examples of crop-disease outbreaks, but the team wants to be warned when the combination of humidity, temperature and leaf-wetness readings is unusual.`, [
  mc('Which approach is most appropriate?', ['Supervised classification using outbreak labels', 'Supervised regression to predict yield', 'Unsupervised anomaly detection that learns what normal readings look like and flags those that deviate', 'Reinforcement learning with yield as the reward'], 2, 'without labels, the model can only learn the normal pattern and flag departures from it.')]),
Q(8, 'Cross-origin requests', `The dashboard at https://dash.verdant.example calls the API at https://api.verdant.example. The browser blocks the dashboard from reading the response, although the API returns data normally when called directly with a command-line tool.`, [
  mc('Which change fixes this correctly?', ['Have the API respond with an Access-Control-Allow-Origin header naming https://dash.verdant.example', 'Ask every user to disable cross-origin checks in their browser', 'Move the API onto each user\'s device', 'Change the dashboard to use HTTP instead of HTTPS'], 0, 'the browser\'s same-origin policy is relaxed by the server explicitly allowing the dashboard\'s origin (CORS).')]),
Q(9, 'Validation, encoding and authorisation', '', [
  rows('Classify each control.', [['Rejecting a soil-moisture value of 400% sent by a sensor', 'Input validation'], ['Converting < to &lt; before showing a farmer\'s note in a web page', 'Output encoding'], ['Checking that a farm manager may only view their own farm\'s data', 'Authorisation'], ['Rejecting a species name longer than 60 characters', 'Input validation']], ['Input validation', 'Output encoding', 'Authorisation'], 1, [4])]),
Q(10, 'Firmware updates', '', [
  multi('Which measures help secure firmware updates for field sensors? Select all that apply.', ['Digitally sign updates and verify the signature before installing', 'Download updates over plain HTTP so that any mirror can serve them', 'Store one shared update password in the firmware of every device', 'Refuse to install a version older than the current one unless explicitly authorised', 'Download updates over TLS'], [0, 3, 4], 'a shared secret is extracted from one device and used against all; plain HTTP can be tampered with.')]),
Q(11, 'Field gateways', '', [
  multi('Which are valid reasons for a field gateway to store data locally? Select all that apply.', ['Readings can be held and uploaded when the connection returns', 'Locally stored data is always more accurate than live data', 'The gateway can keep applying local irrigation rules while offline', 'Local storage removes the need to secure the gateway', 'Uploading in batches can reduce mobile data use'], [0, 2, 4], 'local storage supports offline operation and efficient uploads, but it must still be secured.')]),
Q(12, 'Data processing operations', '', [
  rows('Select the operation that each Python expression performs.', [
    ['[r for r in readings if r > 30]', 'Filtering'],
    ['[r * 1.8 + 32 for r in readings]', 'Mapping (transforming each item)'],
    ['sum(readings) / len(readings)', 'Aggregation'],
    ['sorted(readings, reverse=True)', 'Sorting'],
    ['7 in readings', 'Searching'],
    ['if not 0 <= r <= 100: raise ValueError', 'Validation']],
    ['Filtering', 'Mapping (transforming each item)', 'Aggregation', 'Sorting', 'Searching', 'Validation'], 2, [6, 4])]),
Q(13, 'Database anomalies', '', [
  rows('Select the problem that each situation describes.', [
    ['A new species cannot be recorded until someone has sighted it', 'Insertion anomaly'],
    ['The diet of one species is changed in some rows but not in others', 'Update anomaly'],
    ['Deleting the last sighting of a species also deletes the only record of its diet', 'Deletion anomaly'],
    ['A sighting refers to a species ID that does not exist in the Species table', 'Referential integrity violation']],
    ['Insertion anomaly', 'Update anomaly', 'Deletion anomaly', 'Referential integrity violation'], 2, [4, 2])]),
Q(14, 'JSON data types', '', [
  rows('Select the JSON type of each value.', [['"s1"', 'String'], ['[12, 14, 15]', 'Array'], ['{"id": "s1", "depth": 30}', 'Object']], ['String', 'Array', 'Object', 'Number'], 1, [3])]),
Q(15, 'Test data and boundary testing', `A soil-moisture reading is valid if it is a whole number from 0 to 100 inclusive. The irrigation rule in the specification is: irrigate when the moisture is 30 or below. The code contains: if moisture < 30: irrigate()`, [
  rows('Classify each test input.', [
    ['45', 'Normal'], ['0', 'Boundary'], ['100', 'Boundary'], ['101', 'Erroneous'], ['"wet"', 'Erroneous'], ['72', 'Normal']],
    ['Normal', 'Boundary', 'Erroneous'], 3, [6, 5, 3]),
  written('Explain how a unit test using boundary values would detect the fault in the irrigation rule.', 3, 90,
    'Boundary testing uses values at and either side of the limit, here 29, 30 and 31. The specification says to irrigate at 30 or below, so a test with a moisture of 30 should expect irrigation. The code uses < instead of <=, so for 30 it does not irrigate, the test fails, and this reveals the fault, which tests with only typical values like 10 or 60 would miss.',
    [cr('Identifies boundary test values around 30', ['boundary', '29|30|31']),
     cr('Explains the expected result at the boundary from the specification', ['30', 'irrigat|expect|should']),
     cr('Explains that the < comparison causes a failing test that reveals the fault', ['<|less than|operator|comparison', 'fail|reveal|detect|miss|wrong|fault'])])]),
Q(16, 'IoT web architecture', `FarmLink sensors send moisture readings to a field gateway, which uploads them to a cloud REST API. Farmers use a web app. Some farms have unreliable mobile coverage, and a farm may have hundreds of sensors that report every five minutes.`, [
  written('Explain how a field gateway that stores readings locally supports farms with unreliable mobile coverage.', 3, 90,
    'The gateway collects readings from the sensors over the farm\'s local network and stores them in its own memory, so no readings are lost when the mobile connection drops. When coverage returns it uploads the stored readings in a batch, and it can keep applying simple irrigation rules locally in the meantime. The cloud then holds a complete record, and the farm continues to operate even while it is offline.',
    [cr('Explains local collection and storage', ['gateway', 'store|stores|storing|saves|local|memory|buffer']),
     cr('Explains uploading later when the connection returns', 'upload|when (coverage|the connection|connectivity) returns|reconnect|batch|sync'),
     cr('Explains continued operation or no data loss while offline', 'no readings are lost|not lost|keep applying|continues? to operate|local (irrigation )?rules|offline|without')]),
  written('Describe how the REST API could return only the readings a farmer needs so that responses stay small when a farm has hundreds of sensors.', 3, 100,
    'The API can accept query parameters that filter the data, for example a sensor identifier and a start and end time, so only those readings are returned. It can also use pagination, returning a fixed number of readings per request with a link to the next page, and it can return summary values such as hourly averages for long periods. This reduces the data sent, so the web app loads faster and uses less mobile data.',
    [cr('Describes filtering with query parameters', ['filter|query parameter|parameter|time range|start and end|sensor identifier|sensor id', 'sensor|time|date|range']),
     cr('Describes pagination or summaries', 'paginat|page|summar|average|aggregate|limit'),
     cr('Links the design to smaller responses or faster loading', 'smaller|reduce|faster|less (data|mobile)|loads')]),
  written('Describe how a progressive web app could help a farmer who opens the dashboard in a paddock with no mobile signal.', 3, 100,
    'A progressive web app installs a service worker that caches the app\'s pages and the most recent readings, so the farmer can open the dashboard in a paddock with no signal and still see the last known values. The app should show when the data was last updated so the farmer knows it may be out of date. Changes the farmer makes offline, such as logging a task, can be queued and sent automatically by background sync when coverage returns.',
    [cr('Explains caching by a service worker', ['service worker|pwa|progressive', 'cach|stor']),
     cr('Explains showing last known data and its age while offline', ['last (known|updated)|offline|no signal|out of date|stale', 'reading|value|dashboard|show']),
     cr('Explains queuing changes and syncing when coverage returns', 'queue|background sync|sync(ed|hronis)|when coverage returns|when (online|connected)')])]),
Q(17, 'Algorithm design', `The array Readings[1..n] holds soil-moisture readings in time order, with the newest reading at index n. The value of n may be less than 3.`, [
  written('Construct pseudocode that displays "Irrigate" if the average of the last three readings is below 30, and "No irrigation" otherwise. If there are fewer than three readings, display "Insufficient data" instead.', 3, 120,
    'IF n < 3 THEN\n    DISPLAY "Insufficient data"\nELSE\n    total ← Readings[n] + Readings[n - 1] + Readings[n - 2]\n    IF total / 3 < 30 THEN\n        DISPLAY "Irrigate"\n    ELSE\n        DISPLAY "No irrigation"\n    ENDIF\nENDIF',
    [cr('Checks for fewer than three readings first', ['n\\s*<\\s*3|fewer than (3|three)|less than (3|three)', 'insufficient data']),
     cr('Uses the last three readings (n, n - 1, n - 2)', ['n\\s*-\\s*1', 'n\\s*-\\s*2']),
     cr('Compares the average strictly with 30 and displays both messages', ['/\\s*3|average', '<\\s*30', 'irrigate', 'no irrigation'], '[a-z_\\]\\)]+\\s*<=\\s*30')])]),
Q(18, 'Metadata and data mining', `Wildlife cameras across a conservation area save each photo with metadata: the camera identifier, the time and the temperature. Software labels the species in each photo.`, [
  written('Explain how data mining of the photo metadata and species labels could help rangers protect endangered species.', 3, 90,
    'The metadata gives each sighting a camera location and time, so data mining many thousands of labelled photos can reveal patterns such as an endangered quoll being most active at night near one creek. Rangers can use this to place patrols or protective measures, such as fencing or predator control, where and when the animals are most at risk. Mining can also show whether sightings in an area are declining over the years, which is an early warning that the habitat needs protection.',
    [cr('Identifies metadata used to locate and time sightings', 'metadata|camera|timestamp|time of (day|each)|labelled|labels'),
     cr('Explains that mining reveals patterns of activity or trends', ['mining|mine', 'pattern|trend|most active|decline|activity|hotspot']),
     cr('Links the findings to a protective action', 'patrol|fenc|predator control|habitat|ranger|early warning|conservation')])]),
Q(19, 'Python programming: soil-sample labels', `Soil samples are labelled in the form FIELD-BLOCK-DEPTH, for example N12-B04-30. A label is valid if:\n• FIELD is one capital letter followed by one or two digits\n• BLOCK is the capital letter B followed by exactly two digits that represent a number from 1 to 20\n• DEPTH is exactly one of 10, 20, 30 or 60 (centimetres).\n\nFor a valid label, display Field, then the field, then block with the number written without leading zeros, then depth, in the format shown. Otherwise display Invalid label.\n\nExample: N12-B04-30 displays Field N12, block 4, depth 30 cm`, [
  python('Write a Python program that reads one label and displays the result.', 3, '# Read one label\n',
    '@SAMPLE19@',
    [{name:'Worked example', stdin:'N12-B04-30', expect:'Field N12, block 4, depth 30 cm'},
     {name:'Single-digit field and the first block', stdin:'A1-B01-10', expect:'Field A1, block 1, depth 10 cm'},
     {name:'Highest block', stdin:'Z99-B20-60', expect:'Field Z99, block 20, depth 60 cm'},
     {name:'Block 0 is not allowed', stdin:'N12-B00-30', expect:'Invalid label'},
     {name:'Block 21 is not allowed', stdin:'N12-B21-30', expect:'Invalid label'},
     {name:'Depth must be one of the four values', stdin:'N12-B04-45', expect:'Invalid label'},
     {name:'Field with three digits', stdin:'N123-B04-30', expect:'Invalid label'},
     {name:'Field without digits', stdin:'N-B04-30', expect:'Invalid label'},
     {name:'Lower-case field letter', stdin:'n12-B04-30', expect:'Invalid label'},
     {name:'Block needs exactly two digits', stdin:'N12-B4-30', expect:'Invalid label'},
     {name:'Too many parts', stdin:'N12-B04-30-10', expect:'Invalid label'},
     {name:'Missing part', stdin:'N12-B04', expect:'Invalid label'}], {mutants:@MUT19@})]),
Q(20, 'Integrity of sensor data', `The irrigation controller opens a valve automatically when the average moisture reported by the sensors in a zone falls below a threshold.`, [
  written('Explain how an attacker who takes control of one sensor could affect the irrigation of the zone, and describe ONE control that would reduce the risk.', 3, 100,
    'The attacker could make the sensor report a false value, for example a very low moisture, which lowers the zone average and causes the controller to open the valve and over-irrigate, wasting water and possibly damaging the crop; a falsely high value could stop irrigation and cause crop loss. A control is to compare each sensor\'s reading with its neighbours and ignore or flag a value that is far outside the usual range, and to authenticate each sensor so a compromised one can be revoked.',
    [cr('Explains that a false reading is reported', 'false|fake|forged|incorrect|manipulat|spoof'),
     cr('Explains the effect on the average and the irrigation', ['average|threshold|controller|valve', 'over.?irrigat|waste|crop|stop irrigation|under.?irrigat|damag|loss']),
     cr('Describes a control', 'compare|neighbour|ignore|flag|outlier|anomal|authenticat|revok|validat|range')])]),
Q(21, 'SQL: DISTINCT, joins and grouped totals', `Tables: Species and Sightings. Sightings.SpeciesID refers to Species.SpeciesID. Count is the number of animals seen in a sighting. Status can be Endangered, Vulnerable or Least Concern.`, [
  sql('Construct a SQL query that considers only Endangered species and displays, for each Zone in which at least 5 endangered animals have been counted in total, the Zone, the total Count, and the number of different endangered species seen. List the zones from the highest total to the lowest, then alphabetically by Zone.', 4, [species, sightings],
    "SELECT s.Zone, SUM(s.Count) AS TotalSeen, COUNT(DISTINCT s.SpeciesID) AS SpeciesSeen FROM Sightings s JOIN Species sp ON sp.SpeciesID = s.SpeciesID WHERE sp.Status = 'Endangered' GROUP BY s.Zone HAVING SUM(s.Count) >= 5 ORDER BY TotalSeen DESC, s.Zone ASC",
    {ordered:true, hidden:[{Sightings:sightingsHidden}], weights:[0,2,1,1], expectedRows:[['North',6,2],['South',5,2],['West',5,1]]})]),
Q(22, 'Object-oriented class modelling', `A farm-management system holds the following classes. Each box lists the attributes of one class.\n\nTractor: id, make, engineHours\nDrone: id, make, flightHours\nSoilSensor: id, location, batteryPct, depthCm\nWeatherStation: id, location, batteryPct, mastHeightM`, [
  diagram('Construct a class diagram that uses inheritance to remove all redundant attributes. Add any additional classes you need, and show a suitable data type (for example str, int or float) for each attribute.', 3,
    {classes:[
      {name:'Asset', alt:['FarmAsset','Equipment','Item','Thing'], byAttrs:true, attrs:['id'], parent:null},
      {name:'Machine', alt:['Vehicle','Machinery','PoweredMachine','FarmMachine'], byAttrs:true, attrs:['make'], parent:'Asset'},
      {name:'Tractor', attrs:['engineHours'], parent:'Machine'},
      {name:'Drone', attrs:['flightHours'], parent:'Machine'},
      {name:'Device', alt:['FieldDevice','Sensor','SensorDevice','Station','IoTDevice'], byAttrs:true, attrs:['location','batteryPct'], parent:'Asset'},
      {name:'SoilSensor', alt:['Soil Sensor'], attrs:['depthCm'], parent:'Device'},
      {name:'WeatherStation', alt:['Weather Station'], attrs:['mastHeightM'], parent:'Device'}],
     types:{id:'int', make:'str', engineHours:'float', flightHours:'float', location:'str', batteryPct:'int', depthCm:'int', mastHeightM:'float'}},
    'Asset (id: int)\n  ↑ Machine (make: str)\n      ↑ Tractor (engineHours: float)\n      ↑ Drone (flightHours: float)\n  ↑ Device (location: str, batteryPct: int)\n      ↑ SoilSensor (depthCm: int)\n      ↑ WeatherStation (mastHeightM: float)')]),
Q(23, 'Farm data: ethics, privacy and monitoring', `FarmLink stores each farm\'s sensor data in the cloud. It shares data with a farmers\' cooperative and has been asked by an insurance company to buy yield and weather-exposure records. FarmLink\'s AI also recommends when to plant and irrigate.`, [
  written('Outline potential social and ethical issues associated with FarmLink\'s handling and use of farm data.', 3, 90,
    'Farm data belongs commercially to the farmer, so selling it to an insurer without clear consent could lead to higher premiums or refused cover if records show poor yields, which would harm the farmer. Farmers also need to know who the data is shared with and be able to stop sharing. Because the AI\'s planting advice may be followed closely, farmers who cannot afford the system or have poor connectivity may be disadvantaged compared with those who can, widening inequality between farms.',
    [cr('Identifies issues of ownership or consent over farm data', 'own|consent|sold|selling|sharing|permission|data (belongs|rights)'),
     cr('Identifies a harm such as insurance outcomes or loss of control', 'insur|premium|refus|disadvantag|control|harm|exploit'),
     cr('Identifies an equity or access issue', 'afford|connectiv|inequal|disadvantag|access|digital divide|small farm')]),
  written('Explain how the "privacy by design" approach could be applied when FarmLink shares data with the cooperative.', 3, 100,
    'Privacy by design means building privacy into the system from the start. FarmLink should share only the data the cooperative needs, such as regional averages rather than each farm\'s records, so less personal and commercial information is exposed. Sharing should be off by default and switched on only when a farmer gives clear, specific consent, which they can withdraw at any time. Data sent to the cooperative should also be anonymised or aggregated and sent securely.',
    [cr('Explains data minimisation', 'minimi[sz]|only (the data|what)|aggregate|averages|less|needed'),
     cr('Explains privacy by default and consent', ['default|opt.in|off by default', 'consent|permission|withdraw|agree']),
     cr('Explains anonymising, aggregating or securing the shared data', 'anonymi[sz]|aggregat|secure|encrypt|de.identif')]),
  rows('Match each log entry to the security event it suggests.', [
    ['GET /report?id=7 OR 1=1', 'SQL injection attempt'],
    ['GET /files/../../etc/passwd', 'Path traversal attempt'],
    ['400 failed logins for the username admin in one minute from one address', 'Brute-force attempt'],
    ['30,000 requests per second to /api/readings from thousands of addresses', 'Denial of service']],
    ['SQL injection attempt', 'Path traversal attempt', 'Brute-force attempt', 'Credential stuffing', 'Denial of service', 'Privilege escalation'], 3, [4, 3, 2])]),
Q(24, 'AI crop advice: impacts', `FarmLink introduces an AI service that tells farmers exactly when to plant, irrigate and harvest each paddock. It was trained mainly on data from large farms in one region. Farmers who follow its advice receive a discount on their insurance.`, [
  written('Discuss the possible impacts of this service on farmers and on the environment.', 5, 170,
    'Following precise advice could reduce water and fertiliser use and improve yields, which saves farmers money and reduces runoff into waterways. However, because the model was trained mainly on large farms in one region, its advice may be wrong for small farms, other soils or climates, and a farmer who follows bad advice could lose a crop. The insurance discount pressures farmers to follow the advice even when their experience says otherwise, which could erode traditional knowledge and shift accountability to the company. If many farms plant and irrigate at the same time on the same advice, they could also strain local water supplies. Overall the service is beneficial if farmers can override it, the model is tested on local conditions and the data is used fairly.',
    [cr('Explains benefits such as less water use or better yield', ['water|fertili[sz]er|yield|runoff|cost', 'reduce|improv|save|less|lower']),
     cr('Explains that training data from one type of farm or region may give wrong advice', 'trained (mainly|on)|training data|large farms|one region|small farms|other soils|climate|wrong|unrepresentative'),
     cr('Explains the pressure from incentives and loss of farmer judgement or accountability', 'discount|pressure|incentive|experience|knowledge|accountab|responsib|override'),
     cr('Explains an environmental risk of everyone acting on the same advice', 'same time|many farms|strain|water supplies|environment|runoff|ecosystem|synchron'),
     cr('Reaches a balanced judgement or suggests safeguards', 'overall|however|on balance|provided|override|tested|if')])]),
Q(25, 'Image-recognition neural networks', `FarmLink wants a neural network to identify the species in photos from wildlife cameras. Rangers have labelled 200,000 past photos with the species shown. Many photos are taken at night using infrared.`, [
  written('Explain how the neural network could learn to identify species from the photos. Include ONE positive and ONE negative impact of using it.', 5, 170,
    'The labelled photos are the training data: each photo\'s pixel values are the input and the ranger\'s species label is the correct output. The network has an input layer, hidden layers and an output layer in which each node gives the probability of one species. During training it compares its output with the label and adjusts the weights between nodes to reduce its error, and the hidden layers gradually learn to detect features such as shapes and markings. A positive impact is that thousands of photos can be sorted automatically, freeing rangers for fieldwork. A negative impact is that if most training photos were taken in daylight, the network may misidentify infrared night images, and similar species may be confused, giving wrong population counts.',
    [cr('Explains that labelled photos are the training data', ['label', 'photo|image|pixel|train']),
     cr('Explains the layers and an output node for each species', 'input layer|hidden layer|output layer|layers|probabilit|output node|node'),
     cr('Explains that weights are adjusted to reduce error', ['weight', 'adjust|error|reduce|learn|compare']),
     cr('Explains a positive impact', 'automatic|thousands|save time|free|faster|sort|rangers'),
     cr('Explains a negative impact', 'misidentif|night|infrared|daylight|confus|wrong|bias|unrepresentative|population')])]),
Q(26, 'Python programming: sensor log summary', `Soil sensors upload readings to a log. For each sensor the program decides whether the soil is dry.\n\nINPUT\nLine 1: n, the number of log lines (0 or more).\nNext n lines: timestamp,sensor,value — fields may have spaces around them.\n\nRULES\n• A line that does not have exactly three fields, or whose sensor name is empty, is ignored completely.\n• Otherwise the sensor is known. The reading is valid only if the timestamp and value are whole numbers and the value is from 0 to 100 inclusive. Invalid readings are ignored.\n• If a sensor has two valid readings with the same timestamp, the one that appears later in the input replaces the earlier one.\n• For each sensor with valid readings, find the average of its last three readings by timestamp (or of all its readings if it has fewer than three). The sensor is dry if this average is less than 30.\n\nOUTPUT\nOne line for each dry sensor, "sensor: average" with the average to one decimal place, ordered from the lowest average to the highest and then by sensor name. If no sensor is dry display All sensors OK. Then, if any known sensor has no valid readings, display No data: followed by a space and those sensor names in alphabetical order separated by a comma and a space.\n\nEXAMPLE INPUT\n8\n3,s1,25\n1,s1,40\n2,s1,20\n5,s2,50\n6,s2,10\n6,s2,12\n4,s3,abc\n7,s1,101\n\nEXAMPLE OUTPUT\ns1: 28.3\nNo data: s3`, [
  python('Write a Python program that reads the log and produces the required output.', 5, '# Read n, then n log lines\n',
    '@SAMPLE26@',
    [{name:'Worked example', stdin:'8\n3,s1,25\n1,s1,40\n2,s1,20\n5,s2,50\n6,s2,10\n6,s2,12\n4,s3,abc\n7,s1,101', expect:'s1: 28.3\nNo data: s3'},
     {name:'Last three readings by timestamp, not by input order', stdin:'4\n4,s1,20\n1,s1,90\n2,s1,90\n3,s1,90', expect:'All sensors OK'},
     {name:'Fewer than three readings', stdin:'2\n1,x,10\n2,x,21', expect:'x: 15.5'},
     {name:'A later duplicate replaces an earlier one; an invalid duplicate does not', stdin:'4\n1,a,10\n1,a,50\n2,a,20\n2,a,200', expect:'All sensors OK'},
     {name:'An average of exactly 30 is not dry', stdin:'5\n1,b,30\n2,b,30\n3,b,30\n1,c,29\n2,c,30', expect:'c: 29.5'},
     {name:'Ordered by average then name', stdin:'3\n1,q,10\n1,p,10\n1,r,5', expect:'r: 5.0\np: 10.0\nq: 10.0'},
     {name:'Values 0 and 100 are valid, -1 and 101 are not; a known sensor may have no valid data', stdin:'5\n1,d,0\n2,d,-1\n3,d,101\n1,e,-5\n1,k,100', expect:'d: 0.0\nNo data: e'},
     {name:'Malformed lines are ignored completely', stdin:'5\n1,f\nabc\n1,g,5,6\n1,,5\nz,h,5', expect:'All sensors OK\nNo data: h'},
     {name:'No lines', stdin:'0', expect:'All sensors OK'},
     {name:'Spaces around fields', stdin:'1\n 1 , s , 12 ', expect:'s: 12.0'},
     {name:'Larger input (400 lines)', stdin:'@LARGEIN@', expect:'@LARGEOUT@'}], {mutants:@MUT26@})]),
Q(27, 'Evaluating a precision-agriculture pilot', `Results of a one-season FarmLink pilot on 60 farms:\n• water use fell by 18% and yield rose by 4% on average\n• 12% of the soil sensors failed during the season, mostly through flat batteries\n• the gateway lost its mobile connection for about 20% of the time on remote farms\n• the planting recommendations were trained on data from a different country; on 9 farms the advice was clearly unsuitable\n• the insurer has asked to buy the farm data, and farmers are unsure who owns it.`, [
  written('Evaluate the success of the pilot and recommend what FarmLink should do before a full launch.', 6, 220,
    'The pilot was successful in its main aims: an 18% fall in water use and a 4% rise in yield show real economic and environmental benefits. However, problems must be fixed before launch. A 12% sensor failure rate, mostly flat batteries, means the system loses coverage, so FarmLink should improve battery life, monitor battery levels and send alerts before sensors fail. The gateways were offline for about 20% of the time on remote farms, so they need local storage and local irrigation rules so the farm keeps working without a connection. Advice that was unsuitable on nine farms shows that the model trained on another country\'s data is not representative; it should be retrained with local data and tested before farmers rely on it. Finally, the unresolved question of who owns the data, with an insurer requesting it, needs a clear consent policy that lets farmers control sharing. Overall the pilot justifies proceeding, but only after these risks are addressed.',
    [cr('Evaluates the evidence of benefit (water use and yield)', ['18%|4%|water|yield', 'benefit|success|saving|economic|environmental|improv']),
     cr('Evaluates the sensor failure rate and recommends a remedy', ['12%|flat batteries|sensor(s)? failed|failure', 'battery|monitor|alert|replace|redundan|maintenance']),
     cr('Evaluates the connectivity problem and recommends a remedy', ['20%|offline|connection|connectivity|remote', 'local (storage|rules)|store|buffer|keep working|without a connection|gateway']),
     cr('Evaluates the unsuitable advice and the training data', ['nine farms|9 farms|different country|trained|unsuitable|not representative', 'local data|retrain|test|representative']),
     cr('Evaluates data ownership and consent', 'own|consent|insur|sharing|policy|control'),
     cr('Reaches a reasoned judgement or recommendation', 'overall|justifies proceeding|only after|on balance|provided|recommend')])])
]));
}
