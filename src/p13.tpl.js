/* ---------- Paper 13 — ExamGuard (generated from p13.tpl.js by gen/p13.py) ---------- */
{
const {mc, multi, rows, cr, written, python, sql, diagram, twoOf, Q, paper} = H;
const students = {name:'Students', columns:['StudentID','Name','Cohort'], rows:[[1,'Ana','Y12A'],[2,'Bo','Y12A'],[3,'Cy','Y12A'],[4,'Di','Y12B'],[5,'Eve','Y12B'],[6,'Fay','Y12C']]};
const attempts = {name:'Attempts', columns:['AttemptID','StudentID','ExamCode','Score','Flagged'], rows:[
  [1,1,'ENG',82,1],[2,1,'MAT',90,1],[3,2,'ENG',75,1],[4,3,'ENG',60,0],[5,4,'SEN',88,1],[6,5,'SEN',70,0],[7,5,'ENG',65,1],[8,6,'ENG',99,1]]};
const attemptsHidden = [[1,1,'ENG',50,1],[2,2,'ENG',55,1],[3,3,'ENG',60,1],[4,4,'SEN',70,1],[5,4,'ENG',71,1],[6,5,'SEN',65,1],[7,6,'ENG',99,1],[8,6,'MAT',10,0]];

NEW.push(paper(13, 'ExamGuard Online Examinations', 'Secure online assessment, proctoring ethics, data integrity and automation', [
Q(1, 'Verification and validation', `After release, students complain that ExamGuard's "looking away" flag is far too aggressive for people who think while looking at the ceiling. The feature meets every line of its written specification.`, [
  mc('This is mainly a failure of which process?', ['Verification, because the code does not match the specification', 'Validation, because the specification did not meet the real needs of the users', 'Regression testing, because an old feature stopped working', 'Load testing, because the system was too slow'], 1, 'verification checks the product against its specification; validation checks that the specification itself solves the real problem.')]),
Q(2, 'Code tracing', `def grade(m):\n    if m >= 85:\n        return "HD"\n    elif m >= 75:\n        return "D"\n    elif m >= 65:\n        return "C"\n    return "F"\n\nmarks = [64, 65, 74, 75, 84, 85]\nprint("".join(grade(m)[0] for m in marks))`, [
  mc('What does this program display?', ['FCDDHH', 'FCCCDH', 'FCCDDH', 'FFCDDH'], 2, 'grades are F, C, C, D, D, HD; the first letter of each is joined: FCCDDH.')]),
Q(3, 'Account lockout', `ExamGuard permanently locks a student account after five failed logins, until an administrator unlocks it.`, [
  mc('What is the main weakness of this design?', ['It makes password-guessing attacks easier', 'It does not limit password guessing at all', 'It stores passwords in plain text', 'An attacker can deliberately fail logins to lock genuine students out, for example during an exam'], 3, 'permanent lockout is itself an attack: it turns guessing into a denial of service against chosen accounts.')]),
Q(4, 'Sorting', `Submissions are sorted by score from highest to lowest. Students who have equal scores must stay in the order in which they submitted.`, [
  mc('Which property of the sorting algorithm is required?', ['It must be stable', 'It must sort in place', 'It must use the fewest comparisons', 'It must be recursive'], 0, 'a stable sort keeps items with equal keys in their original relative order.')]),
Q(5, 'Caching personalised pages', `A student's results page is sent with the header Cache-Control: public, max-age=86400 and is delivered through a shared content delivery network.`, [
  mc('What is the risk, and what is the best fix?', ['There is no risk because pages are always safe to cache', 'Another student could be served the first student\'s cached results; use Cache-Control: private, no-store for personalised responses', 'The network will compress the page too much; remove max-age', 'Browsers cannot display the page; switch to HTTPS'], 1, 'public caching lets a shared cache store and re-serve a response meant for one person.')]),
Q(6, 'Data retention', `ExamGuard keeps webcam recordings of every exam for seven years "in case of disputes". Disputes must be raised within 30 days of the results.`, [
  mc('Which change best applies the principles of data minimisation and limited retention?', ['Encrypt the recordings but keep them for seven years', 'Store the recordings only on the examiner\'s laptop', 'Delete recordings after a fixed period that covers the dispute window, such as 90 days, unless an investigation is open', 'Keep recordings indefinitely but restrict access to administrators'], 2, 'data should be kept only as long as needed for its purpose; encryption or access limits do not remove the risk of keeping it for too long.')]),
Q(7, 'Detecting bias', `A face-detection step that checks a student is present fails to find a face for 8% of students with darker skin tones, and for 1% of other students. Affected students are locked out of the exam.`, [
  mc('Which measure most directly reveals this problem?', ['Overall accuracy on the whole test set', 'The training loss', 'The number of images in the training set', 'Error rates calculated separately for each group of students'], 3, 'an overall figure hides large differences between groups; disaggregated error rates expose them.')]),
Q(8, 'Concurrent updates', `Two requests to save the same student's draft arrive at the same moment. Each reads the saved draft, appends its own change and writes it back. Afterwards one of the changes is missing.`, [
  mc('Which problem has occurred, and what prevents it?', ['A race condition; perform the read-modify-write inside a transaction or use optimistic locking with a version number', 'SQL injection; use parameterised queries', 'Deadlock; add more servers', 'Cross-site scripting; encode the output'], 0, 'overlapping read-modify-write operations overwrite each other unless they are made atomic or conflicts are detected.')]),
Q(9, 'Cryptography', '', [
  rows('Classify each use of cryptography.', [
    ['The same secret key encrypts and decrypts an exam paper file', 'Symmetric encryption'],
    ['The server proves a message came from it using a private key that only it holds', 'Asymmetric encryption'],
    ['A one-way function produces a fingerprint of each submitted file so that changes can be detected', 'Hashing'],
    ['A public key encrypts a session key that only the server\'s private key can decrypt', 'Asymmetric encryption']],
    ['Symmetric encryption', 'Asymmetric encryption', 'Hashing'], 1, [4])]),
Q(10, 'Logging', '', [
  multi('Which are appropriate uses of logging in ExamGuard? Select all that apply.', ['Record who opened each exam paper, and when', 'Record students\' full passwords so support staff can help them', 'Store log entries so that they cannot be altered after they are written', 'Include students\' answers in error logs to help developers debug', 'Analyse logs to detect unusual patterns of access'], [0, 2, 4], 'logs support accountability and detection but must not themselves expose secrets or be editable.')]),
Q(11, 'Hashing', '', [
  multi('Which statements about cryptographic hash functions are correct? Select all that apply.', ['The same input always produces the same hash', 'Two different inputs can never produce the same hash', 'A small change to the input should produce a very different hash', 'A hash can be reversed using the salt', 'Hashes can be used to check that a file has not been altered'], [0, 2, 4], 'collisions are possible in principle but are made practically hard to find; salts do not reverse hashes.')]),
Q(12, 'Python data types', '', [
  rows('Select the type returned by each expression.', [
    ['type(3 / 2)', 'float'], ['type("3" + "2")', 'str'], ['type([3, 2])', 'list'], ['type({"a": 3})', 'dict'], ['type(3 > 2)', 'bool'], ['type(3 // 2)', 'int']],
    ['int', 'float', 'str', 'list', 'dict', 'bool'], 2, [6, 4])]),
Q(13, 'Accessible design principles', '', [
  rows('Select the accessibility principle that each feature supports.', [
    ['Captions are provided for the instruction video', 'Perceivable'],
    ['Every exam control can be used with a keyboard alone', 'Operable'],
    ['Error messages explain how to correct a form field', 'Understandable'],
    ['The markup works with different browsers and assistive technologies', 'Robust']],
    ['Perceivable', 'Operable', 'Understandable', 'Robust'], 2, [4, 2])]),
Q(14, 'Python exceptions', '', [
  rows('Select the exception that each statement raises.', [['int("abc")', 'ValueError'], ['[1, 2][5]', 'IndexError'], ['{"a": 1}["b"]', 'KeyError']], ['ValueError', 'IndexError', 'KeyError', 'TypeError'], 1, [3])]),
Q(15, 'Quality assurance and audit', `A student disputes the result of an exam, saying that they pressed Submit before the deadline but the system shows the submission as late.`, [
  rows('Match each quality-assurance activity to its description.', [
    ['A colleague reads proposed code changes and comments before they are merged', 'Code review'],
    ['A tool examines source code without running it to find likely defects', 'Static analysis'],
    ['Automated checks of one function in isolation', 'Unit test'],
    ['Checks that the exam module and the marking module work correctly together', 'Integration test'],
    ['An authorised tester tries to break into the system', 'Penetration test'],
    ['Teachers confirm that the platform supports their real assessment process', 'User acceptance test']],
    ['Code review', 'Static analysis', 'Unit test', 'Integration test', 'Penetration test', 'User acceptance test'], 3, [6, 5, 3]),
  written('Explain how a secure audit log could be used to resolve the dispute about the late submission.', 3, 100,
    'The audit log records each event with a timestamp taken from the server, such as the time the student clicked Submit, the request that reached the server, and the student\'s identifier. Investigators can compare the logged submission time with the exam deadline to see whether the submission was actually late, and look at network errors that might have delayed the request. The log must be protected from modification, for example by being append-only or signed, so that it is reliable evidence for both the student and the school.',
    [cr('Explains that the log records events with timestamps and identifiers', ['log', 'timestamp|time|identifier|record']),
     cr('Explains comparing the logged time with the deadline', ['deadline|late|submission time|compare', 'compare|check|whether|see']),
     cr('Explains that the log must be tamper-resistant to be trusted', 'append.only|signed|cannot be (altered|modified)|tamper|protected from (modification|alteration)|integrity|reliable evidence')])]),
Q(16, 'Web architecture for online examinations', `ExamGuard runs in the student's browser. A JavaScript timer saves the student's answers to the server every 30 seconds. The paper is released at the start time to about 5,000 students at once. Some students have unreliable home internet.`, [
  written('Explain how client-side JavaScript and server-side storage together protect a student\'s work if their connection drops.', 3, 100,
    'The JavaScript in the browser sends the current answers to the server on a timer, and the server stores them in a database. If the connection drops, the script can keep a copy in the browser\'s local storage and retry sending it until the connection returns, so nothing typed is lost. When the student reloads or reconnects, the server returns the last saved version so they can continue from where they stopped.',
    [cr('Explains that the script sends answers to the server on a timer', ['javascript|script|client|browser', 'timer|every 30 seconds|regular|autosave|send']),
     cr('Explains keeping a local copy and retrying', 'local storage|local copy|retry|queue|keep a copy|buffer|resend'),
     cr('Explains restoring the saved work on reconnection', ['server', 'last saved|restore|returns|continue|reload|reconnect|stored'])]),
  written('Explain how load balancing helps ExamGuard cope when 5,000 students start at the same moment.', 3, 100,
    'A load balancer receives all the incoming requests and distributes them across several identical application servers, so no single server is overwhelmed by the simultaneous logins. If one server fails it stops sending requests to it and the others continue, which improves availability. More servers can be added before the exam start time, and the load balancer can send each student\'s requests to a server that already holds their session, or sessions can be held in shared storage.',
    [cr('Explains distributing requests across several servers', ['load balanc', 'distribut|spread|several|multiple|across|share']),
     cr('Explains avoiding overload or a single point of failure', 'overload|overwhelm|single point|fail|available|availability|continue|simultaneous'),
     cr('Explains adding capacity or sharing sessions', 'add (more )?servers|scale|capacity|session|shared storage|before the exam')]),
  written('Describe how ExamGuard could keep the exam paper confidential until the start time.', 3, 100,
    'The exam paper should be stored encrypted on the server and the key released only at the start time, so that nothing readable is sent to browsers earlier. The server should also check the current server time and the student\'s authorisation before returning the paper, so changing the clock on the student\'s computer does not help. Access to the paper before the start should be limited to named staff and logged.',
    [cr('Describes keeping the paper encrypted until a key is released at the start time', ['encrypt', 'key|decrypt']),
     cr('Describes a server-side time check that ignores the student\'s own clock', ['server', 'clock|computer\'s (clock|time)|server time|current server time']),
     cr('Describes limited access for named staff before release', 'named staff|limited to named|only (named|authori[sz]ed) staff')])]),
Q(17, 'Algorithm design', `The array Scores[1..n] holds the scores of the students in a class and PassMark is the lowest score that counts as a pass. The value of n may be 0.`, [
  written('Construct pseudocode that displays the number of students who passed and the percentage of the class who passed. If n is 0, display "No students" instead.', 3, 120,
    'IF n = 0 THEN\n    DISPLAY "No students"\nELSE\n    passed ← 0\n    FOR i ← 1 TO n\n        IF Scores[i] >= PassMark THEN\n            passed ← passed + 1\n        ENDIF\n    ENDFOR\n    DISPLAY passed, (passed / n) * 100\nENDIF',
    [cr('Handles n = 0 before dividing', ['n\\s*(=|==)\\s*0|no students|empty', 'no students']),
     cr('Counts scores that are at least the pass mark', ['for|while|loop|repeat', '>=\\s*passmark|passmark\\s*<='], '[a-z_\\]]+\\s*>\\s*passmark'),
     cr('Calculates and displays the percentage', ['/\\s*n', '100|percent', 'display|output|print'])])]),
Q(18, 'Metadata and data mining', `ExamGuard records metadata for every exam session: the time each answer was saved, how often the browser lost focus, the network address, and the time taken per question.`, [
  written('Explain how data mining of this metadata could help to identify possible cheating, while reducing the risk of wrongly accusing a student.', 3, 100,
    'Data mining can find patterns in the metadata, for example several students in different places whose answers were saved at almost identical times, or a session in which the browser lost focus dozens of times. These patterns are flagged as unusual so that a teacher can look more closely. Because the same patterns can have innocent causes, such as a shared household network or a poor connection, the flag should only prompt a human review and should not be treated as proof.',
    [cr('Identifies relevant metadata', 'metadata|time (each )?answer|lost focus|network address|time taken|saved at'),
     cr('Explains that mining detects unusual patterns', ['mining|mine', 'pattern|unusual|anomal|identical|similar|cluster']),
     cr('Explains the need for human review because flags can be wrong', 'human|review|teacher|innocent|not .*proof|false|wrongly|investigat')])]),
Q(19, 'Python programming: extra time', `Students who have approved adjustments receive extra time. The program reads three lines: the exam length in minutes, the extra-time percentage, and whether rest breaks apply (Y or N, in capital or lower-case).\n\nRULES\n• The exam length must be from 30 to 240 minutes inclusive; otherwise display Invalid duration.\n• Otherwise, the percentage must be from 0 to 100 inclusive; otherwise display Invalid percentage.\n• Extra time is the exam length multiplied by the percentage and divided by 100, rounded UP to a whole number of minutes.\n• If rest breaks apply, 10 minutes are added for every complete 60 minutes of the original exam length.\n• Display Total: followed by a space, the total minutes and the word minutes.\n\nExample: length 95, 10% and N gives extra time of 9.5, rounded up to 10, so the display is Total: 105 minutes`, [
  python('Write a Python program that reads the three values and displays the result.', 3, '# Read the length, the percentage and the breaks flag\n',
    '@SAMPLE19@',
    [{name:'Worked example (rounding up)', stdin:'95\n10\nN', expect:'Total: 105 minutes'},
     {name:'Exact percentage', stdin:'120\n25\nN', expect:'Total: 150 minutes'},
     {name:'Whole-minute result needs no rounding', stdin:'90\n10\nN', expect:'Total: 99 minutes'},
     {name:'Rounds up even a small fraction', stdin:'61\n1\nN', expect:'Total: 62 minutes'},
     {name:'A half minute rounds up, not to the nearest even number', stdin:'65\n10\nN', expect:'Total: 72 minutes'},
     {name:'Rest breaks: two complete hours', stdin:'150\n0\nY', expect:'Total: 170 minutes'},
     {name:'Rest breaks: no complete hour', stdin:'59\n0\nY', expect:'Total: 59 minutes'},
     {name:'Lower-case y is accepted', stdin:'60\n0\ny', expect:'Total: 70 minutes'},
     {name:'Both boundaries: 30 minutes, 100%', stdin:'30\n100\nN', expect:'Total: 60 minutes'},
     {name:'Both boundaries: 240 minutes, 100%, breaks', stdin:'240\n100\nY', expect:'Total: 520 minutes'},
     {name:'Duration below 30', stdin:'29\n10\nN', expect:'Invalid duration'},
     {name:'Duration above 240', stdin:'241\n10\nN', expect:'Invalid duration'},
     {name:'Percentage above 100', stdin:'120\n101\nN', expect:'Invalid percentage'},
     {name:'Negative percentage', stdin:'120\n-1\nN', expect:'Invalid percentage'},
     {name:'Duration is checked before percentage', stdin:'20\n200\nN', expect:'Invalid duration'}], {mutants:@MUT19@})]),
Q(20, 'Trusting the client', `The exam countdown timer runs only in the student's browser. When it reaches zero, the browser submits the answers. The server accepts any submission it receives.`, [
  written('Explain how a student could gain extra time in this design, and how the design should be changed to prevent it.', 3, 100,
    'Because the timer runs only in the browser, which the student controls, a student could change their computer\'s clock, pause or modify the script, or block the final submission, and so keep working beyond the official end. The server should hold the authoritative start and end time for each student, check the time at which each submission arrives and reject or flag any that are late. The browser timer can remain only as a convenience for display, and it can be re-synchronised with the server\'s time so that it stays accurate.',
    [cr('Explains that the client-side timer can be altered or bypassed', ['browser|client|script|clock', 'change|modif|pause|control|alter|bypass|block']),
     cr('Explains that the server must hold the authoritative time and check submissions', ['server', 'authoritative|end time|check|reject|flag|late']),
     cr('Explains the role of the browser timer as display only or synchronised', 'display|convenience|synchronis|re-?sync|only for')])]),
Q(21, 'SQL: DISTINCT counts and grouped maximums', `Tables: Students and Attempts. Attempts.StudentID refers to Students.StudentID. Flagged is 1 when an attempt has been flagged for review and 0 otherwise. A student may have several attempts.`, [
  sql('Construct a SQL query that considers only flagged attempts and displays, for each Cohort in which at least two different students have a flagged attempt, the Cohort, the number of different students with a flagged attempt, and the highest Score of those flagged attempts. List the cohorts from the highest to the lowest number of students, then alphabetically by Cohort.', 4, [students, attempts],
    "SELECT s.Cohort, COUNT(DISTINCT s.StudentID) AS StudentsFlagged, MAX(a.Score) AS TopFlaggedScore FROM Students s JOIN Attempts a ON a.StudentID = s.StudentID WHERE a.Flagged = 1 GROUP BY s.Cohort HAVING COUNT(DISTINCT s.StudentID) >= 2 ORDER BY StudentsFlagged DESC, s.Cohort ASC",
    {ordered:true, hidden:[{Attempts:attemptsHidden}], weights:[0,2,1,1], expectedRows:[['Y12A',2,90],['Y12B',2,88]]})]),
Q(22, 'Object-oriented class modelling', `An exam-authoring system holds the following classes. Each box lists the attributes of one class.\n\nMultipleChoice: id, text, marks, options, correctIndex\nShortAnswer: id, text, marks, wordLimit, modelAnswer, answerLines\nExtendedResponse: id, text, marks, wordLimit, modelAnswer, rubric\nCoding: id, text, marks, language, testCases`, [
  diagram('Construct a class diagram that uses inheritance to remove all redundant attributes. Add any additional classes you need, and show a suitable data type (for example str, int or float) for the attributes whose type is clear.', 3,
    {classes:[
      {name:'Question', alt:['ExamQuestion','Item','QuestionBase','BaseQuestion'], byAttrs:true, attrs:['id','text','marks'], parent:null},
      {name:'MultipleChoice', alt:['MultipleChoiceQuestion','MCQ'], attrs:['options','correctIndex'], parent:'Question'},
      {name:'WrittenQuestion', alt:['Written','WrittenResponse','TextQuestion','WrittenAnswer'], byAttrs:true, attrs:['wordLimit','modelAnswer'], parent:'Question'},
      {name:'ShortAnswer', alt:['Short'], attrs:['answerLines'], parent:'WrittenQuestion'},
      {name:'ExtendedResponse', alt:['Extended'], attrs:['rubric'], parent:'WrittenQuestion'},
      {name:'Coding', alt:['CodingQuestion'], attrs:['language','testCases'], parent:'Question'}],
     types:{id:'int', text:'str', marks:'int', correctIndex:'int', wordLimit:'int', modelAnswer:'str', answerLines:'int', rubric:'str', language:'str'}},
    'Question (id: int, text: str, marks: int)\n  ↑ MultipleChoice (options: str, correctIndex: int)\n  ↑ WrittenQuestion (wordLimit: int, modelAnswer: str)\n      ↑ ShortAnswer (answerLines: int)\n      ↑ ExtendedResponse (rubric: str)\n  ↑ Coding (language: str, testCases: str)')]),
Q(23, 'Proctoring: ethics, access control and quality', `ExamGuard\'s proctoring mode uses the webcam and microphone in the student\'s home, records the screen, and uses AI to flag "suspicious behaviour". Recordings are stored in the cloud and teachers can open them.`, [
  written('Outline potential social and ethical issues associated with proctoring students in their homes.', 3, 90,
    'Recording students in their homes captures private spaces, family members and personal belongings, raising privacy concerns, particularly when the recordings are stored and viewable by many staff. Students without a quiet room, a good camera or reliable internet may be disadvantaged or flagged unfairly, which creates inequity in assessment. Being watched continuously can also increase anxiety and harm performance, and the AI may wrongly flag normal behaviour, so students need a way to challenge a flag.',
    [cr('Identifies privacy concerns about recording in the home', ['home|family|household|bedroom|living', 'privacy|private|personal|belongings|recorded']),
     cr('Identifies inequity linked to students\' home equipment or space', ['inequit|disadvantag|unfair', 'reliable internet|quiet (room|space)|camera|device|afford|bandwidth']),
     cr('Identifies anxiety or a need for challenge or appeal', 'anxiety|stress|appeal|challenge|human review|perform')]),
  written('Explain why access to the recordings should be controlled using the principle of least privilege.', 3, 100,
    'Least privilege means each person is given only the access they need for their role. Only the small number of staff who investigate flagged exams should be able to open recordings, and only for the flagged students, instead of every teacher being able to open every recording. This limits the damage if an account is compromised or a staff member misuses access out of curiosity, and it reduces the number of people who see private footage. Access can also be time-limited and logged so any misuse can be traced.',
    [cr('Explains giving only the access needed for a role', ['least privilege|only (the )?access|need', 'role|investigat|flagged|staff']),
     cr('Explains the reduced risk of misuse or compromise', 'misuse|compromis|curiosity|damage|breach|fewer people|reduce'),
     cr('Explains time limits or logging', 'time.limited|logged|log|traced|audit|expire')]),
  rows('Select the quality attribute that each requirement addresses.', [
    ['Exam pages must load in under two seconds for 95% of students', 'Performance'],
    ['The system must still hold every saved answer after a server restart', 'Reliability'],
    ['A student using only a keyboard and screen reader can start an exam', 'Usability'],
    ['The platform can exchange marks with the school\'s learning management system', 'Interoperability']],
    ['Reliability', 'Performance', 'Usability', 'Security', 'Maintainability', 'Interoperability'], 3, [4, 3, 2])]),
Q(24, 'AI proctoring: impacts', `A school introduces AI proctoring for all online assessments. The software analyses eye movement, head position, background noise and typing patterns, and gives each student a "suspicion score". Teachers are told to investigate every student whose score is above a threshold.`, [
  written('Discuss the possible impacts of this system on students and on the school.', 5, 170,
    'The system could deter cheating and let the school run assessments from home with fewer staff, which supports the integrity of results and reduces cost. However, the model may treat normal differences as suspicious, such as a student with a disability who moves differently or a student in a noisy household, so some students would be wrongly accused and suffer stress and reputational harm. Constant monitoring of eye movement and typing is also intrusive and may increase anxiety, reducing performance. Teachers who investigate every flag may spend a great deal of time on false positives, and may place too much trust in the score. Overall the system is beneficial only if flags prompt human review rather than automatic penalties, students can appeal and its accuracy is checked for different groups.',
    [cr('Explains the benefit of deterring cheating or maintaining integrity', ['cheat|integrity|deter|fair', 'assess|result|exam|school']),
     cr('Explains false flags for some students and the harm to them', 'false|wrongly|disabilit|noisy|differen|accus|reputation|bias|unfair'),
     cr('Explains intrusive monitoring, stress or reduced performance', 'intrusive|monitor|anxiety|stress|privacy|perform|watched'),
     cr('Explains the workload or over-trust risk for teachers', 'workload|time|over.?trust|rely|trust|investigat'),
     cr('Reaches a balanced judgement or suggests safeguards', 'overall|however|on balance|appeal|human review|only if|safeguard')])]),
Q(25, 'Supervised learning: text similarity', `ExamGuard wants a supervised model to flag written answers that may have been copied. Teachers have labelled 30,000 past answers as "original" or "copied", and for each answer the system has measures such as the highest similarity to any other answer and the proportion of the answer that matches published web pages.`, [
  written('Explain how the model could be trained and evaluated. Include ONE positive and ONE negative impact of using the model.', 5, 170,
    'The measures of similarity and web matching are the input features and the teachers\' "original" or "copied" labels are the correct outputs. During training the algorithm adjusts its parameters to reduce the number of answers it classifies incorrectly. It is then evaluated on answers it has not seen, using measures such as precision, to show how many flagged answers really were copied, and recall, to show how many copied answers it found. A positive impact is that teachers can check hundreds of answers quickly and focus on those most likely to be copied. A negative impact is that false positives, for example a student who legitimately quoted a source or whose answer is similar because a model answer was taught in class, could be wrongly accused of cheating.',
    [cr('Identifies the features and the labels', ['feature|input|measure|similarity', 'label|original|copied']),
     cr('Explains training as adjusting to reduce errors', ['train', 'adjust|parameter|reduce|error|incorrect|learn']),
     cr('Explains evaluation on unseen data using precision or recall', ['unseen|not seen|held.out|test|evaluat', 'precision|recall|accuracy']),
     cr('Explains a positive impact', 'quickly|hundreds|focus|save time|efficien|faster'),
     cr('Explains a negative impact', 'false positive|wrongly|accused|legitimate|quoted|unfair|bias')])]),
Q(26, 'Python programming: ranking results', `A teacher ranks student results.\n\nINPUT\nLine 1: n, the number of lines (0 or more).\nNext n lines: name,score — fields may have spaces around them.\n\nRULES\n• A line is invalid if it does not have exactly two fields, if the name is empty, if the score is not a whole number, or if the score is not from 0 to 100 inclusive. Invalid lines are counted and ignored.\n• Names are the same student if they match when capital and lower-case letters are ignored. A student with several valid lines keeps only the highest score (if equal, the first one that appeared, with its spelling of the name). Each extra valid line is counted as a merged duplicate.\n• Students are ranked from the highest to the lowest score. Students with equal scores share a rank, and the next rank skips accordingly (for example 1, 2, 2, 4). Students with equal scores are listed alphabetically, ignoring capital and lower-case letters.\n\nOUTPUT\nIf there are no valid students display No results. Otherwise one line per student, "rank. name (score)", then Median: followed by a space and the median score to one decimal place (the average of the two middle scores if the number of students is even). Finally, if any lines were invalid display Invalid: followed by a space and the count, and then, if any duplicates were merged, Duplicates merged: followed by a space and the count.\n\nEXAMPLE INPUT\n8\nMia,88\nRavi,92\nAna,88\nana,95\nLi,abc\nTom,101\nZoe,71\nRavi,80\n\nEXAMPLE OUTPUT\n1. ana (95)\n2. Ravi (92)\n3. Mia (88)\n4. Zoe (71)\nMedian: 90.0\nInvalid: 2\nDuplicates merged: 2`, [
  python('Write a Python program that reads the input and produces the required output.', 5, '# Read n, then n lines\n',
    '@SAMPLE26@',
    [{name:'Worked example', stdin:'8\nMia,88\nRavi,92\nAna,88\nana,95\nLi,abc\nTom,101\nZoe,71\nRavi,80', expect:'1. ana (95)\n2. Ravi (92)\n3. Mia (88)\n4. Zoe (71)\nMedian: 90.0\nInvalid: 2\nDuplicates merged: 2'},
     {name:'Shared ranks skip (1, 1, 1, 4, 5)', stdin:'5\nd,80\nb,90\na,90\nc,90\ne,70', expect:'1. a (90)\n1. b (90)\n1. c (90)\n4. d (80)\n5. e (70)\nMedian: 90.0'},
     {name:'Median of an odd number of students', stdin:'3\nx,10\ny,20\nz,40', expect:'1. z (40)\n2. y (20)\n3. x (10)\nMedian: 20.0'},
     {name:'Equal duplicate keeps the first spelling', stdin:'2\nBob,50\nbob,50', expect:'1. Bob (50)\nMedian: 50.0\nDuplicates merged: 1'},
     {name:'A lower later duplicate is ignored', stdin:'2\nCat,60\nCAT,40', expect:'1. Cat (60)\nMedian: 60.0\nDuplicates merged: 1'},
     {name:'Scores 0 and 100 are valid; -1 and 101 are not', stdin:'4\na,0\nb,100\nc,-1\nd,101', expect:'1. b (100)\n2. a (0)\nMedian: 50.0\nInvalid: 2'},
     {name:'Spaces trimmed; wrong field counts and empty names are invalid', stdin:'4\nDee , 55 \nEve\n,70\nFay,60,extra', expect:'1. Dee (55)\nMedian: 55.0\nInvalid: 3'},
     {name:'Alphabetical order ignores case', stdin:'3\nbeta,70\nZed,70\nalpha,70', expect:'1. alpha (70)\n1. beta (70)\n1. Zed (70)\nMedian: 70.0'},
     {name:'No valid students', stdin:'2\nx,abc\ny', expect:'No results\nInvalid: 2'},
     {name:'No lines', stdin:'0', expect:'No results'},
     {name:'Larger input (300 lines)', stdin:'@LARGEIN@', expect:'@LARGEOUT@'}], {mutants:@MUT26@})]),
Q(27, 'Evaluating an online examination launch', `The first statewide online exam on ExamGuard produced these findings:\n• the platform slowed to a crawl for 40 minutes when 5,000 students logged in at the start time\n• autosave failed for 300 students whose home connections were unstable, and some lost 20 minutes of work\n• the AI flagged 6% of students as suspicious; on review, 70% of those flags were false\n• two students' recordings were opened by a teacher who had no reason to see them\n• a link to the exam paper was posted on social media ten minutes before the start time.`, [
  written('Evaluate how ready ExamGuard was for the statewide exam and recommend improvements.', 6, 220,
    'ExamGuard was not ready for a high-stakes statewide exam, although the findings are fixable. The slowdown at the start shows the system was not load tested for 5,000 simultaneous logins; it needs load testing, extra servers or autoscaling, and staggered start times. The loss of work for 300 students shows autosave was not resilient, so the browser should keep a local copy and retry sending it. With 70% of flags false, the AI cannot be used to penalise students; flags should only trigger human review, with a right of appeal, and the model should be retested for accuracy. The unnecessary access to recordings shows weak access control, so least privilege and logged access are needed. The link to the paper being posted before the start means it was not kept confidential, so it should be encrypted and only released by the server at the start time. Overall the platform has real benefits in flexibility, but until these weaknesses are fixed the exam results and student privacy are at risk.',
    [cr('Evaluates the performance problem and a remedy', ['40 minutes|slow|5,000|simultaneous|logins', 'load test|autoscal|more servers|stagger|scal|capacity']),
     cr('Evaluates the autosave failure and a remedy', ['autosave|lost|300 students|unstable|connection', 'local copy|retry|resilien|local storage|offline']),
     cr('Evaluates the false AI flags and recommends human review', ['70%|false|AI|flag', 'human review|appeal|retest|penalis|accuracy']),
     cr('Evaluates the improper access to recordings and recommends controls', ['access|recording', 'least privilege|logged|log|control|restrict']),
     cr('Evaluates the exam-paper leak and recommends confidentiality controls', ['link|posted|paper|social media', 'encrypt|released|confidential|start time|server']),
     cr('Reaches a reasoned overall judgement', 'overall|not ready|until|on balance|fixable|at risk')])])
]));
}
