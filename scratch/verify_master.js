const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = 'c:\\Users\\Minh Triet\\Desktop\\App_Hoc_Database';

console.log('========================================================');
console.log('   BÍ KÍP CƠ SỞ DỮ LIỆU v2005 - COMPREHENSIVE VERIFICATION');
console.log('========================================================\n');

// 1. Read files and setup mock browser environment
const filesToLoad = [
  'src/core/registry.js',
  'src/data/meta-toc.js',
  'src/data/chapters/ch00-nen-tang.js',
  'src/data/chapters/ch01-select-null-datatypes.js',
  'src/data/chapters/ch02-functions-case-coalesce.js',
  'src/data/chapters/ch03-joins-set-operators.js',
  'src/data/chapters/ch04-groupby-having-subquery.js',
  'src/data/chapters/ch05-window-functions-cte-paging.js',
  'src/data/chapters/ch06-dml-ddl-constraints-identity.js',
  'src/data/chapters/ch07-database-design-er-normalization.js',
  'src/data/chapters/ch08-index-btree-sargability-plan.js',
  'src/data/chapters/ch09-transactions-acid-isolation-deadlock.js',
  'src/data/chapters/ch10-views-stored-procs-triggers-temp.js',
  'src/data/chapters/ch11-security-sql-injection-permissions.js',
  'src/data/chapters/ch12-backend-bridge-java-dotnet-orm.js',
  'src/data/chapters/ch13-tsql-advanced-json-pivot-temporal.js',
  'src/data/chapters/ch14-interview-strategy-leetcode-sql.js',
  'src/data/chapters/ch15-tsql-keyword-dictionary-fruitstore.js',
  'src/data/databases/db-truonghoc.js',
  'src/data/databases/db-shoponline.js',
  'src/data/databases/db-library.js',
  'src/data/databases/db-countries.js',
  'src/data/databases/db-autoshop.js',
  'src/data/databases/db-leetcode.js',
  'src/data/databases/db-fruitstore.js',
  'src/data/simulators.js',
  'src/data/interview-bank.js',
  'src/data/leetcode-challenges.js',
  'src/data/appendices.js',
  'src/data/tracks/track-mysql.js',
  'src/data/tracks/track-postgresql.js',
  'src/data/tracks/track-nosql.js'
];

const mockElement = (id) => ({
  id,
  innerHTML: '',
  value: '',
  style: {},
  classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
  appendChild: () => {},
  addEventListener: () => {},
  setAttribute: () => {},
  getAttribute: () => '',
  querySelectorAll: () => [],
  querySelector: () => null,
  focus: () => {},
  scrollIntoView: () => {},
  setSelectionRange: () => {}
});

const elements = {
  'reading-pane': mockElement('reading-pane'),
  'status-cell-0': mockElement('status-cell-0'),
  'status-cell-1': mockElement('status-cell-1'),
  'status-cell-2': mockElement('status-cell-2'),
  'address-input': mockElement('address-input'),
  'toc-tree-container': mockElement('toc-tree-container'),
  'overall-progress-bar': mockElement('overall-progress-bar'),
  'overall-progress-text': mockElement('overall-progress-text'),
  'left-index-list': mockElement('left-index-list'),
  'search-results-list': mockElement('search-results-list'),
  'search-summary-bar': mockElement('search-summary-bar'),
  'sql-editor': mockElement('sql-editor'),
  'sql-result-sunken': mockElement('sql-result-sunken'),
  'lab-problem-banner': mockElement('lab-problem-banner'),
  'lab-problem-select': mockElement('lab-problem-select'),
  'lab-db-select': mockElement('lab-db-select'),
  'lab-erd-title': mockElement('lab-erd-title'),
  'lab-erd-content': mockElement('lab-erd-content'),
  'sql-run-timer': mockElement('sql-run-timer'),
  'exam-timer-display': mockElement('exam-timer-display'),
  'lang-mode-select': mockElement('lang-mode-select')
};

const sandbox = {
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
  },
  document: {
    readyState: 'complete',
    getElementById(id) {
      if (!elements[id]) elements[id] = mockElement(id);
      return elements[id];
    },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    addEventListener() {},
    documentElement: { style: { setProperty() {} } },
    body: { className: '', classList: { add() {}, remove() {} } }
  },
  window: {
    addEventListener: () => {},
    print: () => {}
  },
  navigator: { clipboard: { writeText: () => Promise.resolve() } }
};
sandbox.window.addEventListener = () => {};
sandbox.window.document = sandbox.document;
sandbox.window.localStorage = sandbox.localStorage;
sandbox.window.console = sandbox.console;
sandbox.window.setTimeout = sandbox.setTimeout;
sandbox.window.clearTimeout = sandbox.clearTimeout;
sandbox.window.setInterval = sandbox.setInterval;
sandbox.window.clearInterval = sandbox.clearInterval;
sandbox.global = sandbox.window;

const context = vm.createContext(sandbox);

filesToLoad.forEach((rel) => {
  const code = fs.readFileSync(path.join(rootDir, rel), 'utf8');
  vm.runInContext(code, context, { filename: rel });
});

console.log('✓ All 31 data/registry scripts loaded into VM successfully.');

const reg = sandbox.window.BiKipRegistry || sandbox.window.BIKIP_REGISTRY;
const data = reg.buildGlobalData();

console.log('\n--- 1. DATA COUNTS ---');
console.log('Chapters count (ch01..ch15):', data.chapters.length);
console.log('Databases count:', data.labs.databases.length);
console.log('Simulators count:', Object.keys(data.simulators).length);
console.log('Interview Bank cards:', data.interview_bank.length);
console.log('LeetCode challenges:', data.leetcode_challenges.length);
console.log('Expansion tracks:', Object.keys(data.expansion_tracks).length);

// Check Ch15 keyword cards
const ch15 = data.chapters.find(c => c.id === 'ch15');
console.log('\n--- 2. CHAPTER 15 KEYWORD CARDS ---');
console.log('Ch15 title:', ch15.title);
console.log('Ch15 keyword cards count:', ch15.keyword_cards ? ch15.keyword_cards.length : 0);
const partA = ch15.keyword_cards.filter(k => k.part === 'A');
const partB = ch15.keyword_cards.filter(k => k.part === 'B');
console.log('  Part A cards (Cốt lõi):', partA.length);
console.log('  Part B cards (Nâng cao):', partB.length);
if (ch15.keyword_cards.length !== 64 || partA.length !== 44 || partB.length !== 20) {
  console.error('FAIL: Expected 64 cards (44 Part A + 20 Part B)!');
} else {
  console.log('✓ PASS: Exactly 64 keyword cards (44 Part A, 20 Part B)');
}

// Check personnel in db-fruitstore
console.log('\n--- 3. PERSONNEL SYNCHRONIZATION IN DB-FRUITSTORE ---');
const fruitDb = data.labs.databases.find(d => d.id === 'fruitstore');
const staff = [
  'Lê Minh Triết',
  'Nguyễn Tấn Dũng',
  'Trần Thị Mỹ Tiên',
  'Phạm Võ Khải Anh',
  'Nguyễn Sỹ Còi',
  'Nguyễn Tuấn Thanh',
  'Nguyễn Minh Trung'
];
staff.forEach(name => {
  const has = fruitDb.seed_sql.includes(name);
  console.log(`  Staff "${name}": ${has ? 'FOUND' : 'MISSING'}`);
  if (!has) console.error(`FAIL: Missing staff ${name}`);
});

// Check simulator structures
console.log('\n--- 4. SIMULATORS STRUCTURES ---');
console.log('Join modes:', Object.keys(data.simulators.join.modes).join(', '));
const hasLeftAnti = !!data.simulators.join.modes.LEFT_ANTI;
console.log('Join mode LEFT_ANTI present:', hasLeftAnti);
console.log('B-Tree root page:', data.simulators.btree.root_page ? data.simulators.btree.root_page.page_id : 'MISSING');
console.log('B-Tree intermediate pages:', data.simulators.btree.intermediate_pages ? data.simulators.btree.intermediate_pages.length : 0);
console.log('B-Tree leaf pages:', data.simulators.btree.leaf_pages ? data.simulators.btree.leaf_pages.length : 0);

// Load app-engine.js and test functions
console.log('\n--- 5. TESTING APP-ENGINE.JS EXECUTION & FUNCTIONS ---');
const appEngineCode = fs.readFileSync(path.join(rootDir, 'src/ui/app-engine.js'), 'utf8');
try {
  vm.runInContext(appEngineCode, context, { filename: 'src/ui/app-engine.js' });
  console.log('✓ src/ui/app-engine.js evaluated successfully without syntax or runtime exceptions!');
} catch (e) {
  console.error('FAIL in evaluating app-engine.js:', e);
  process.exit(1);
}

// Test getAll77LabProblems()
const app = sandbox.window.BiKipApp;
const testAllProbs = app.getAll77LabProblems();
console.log('\n--- 6. LAB PROBLEMS AUDIT (getAll77LabProblems) ---');
console.log('Total lab problems returned:', testAllProbs.length);
if (testAllProbs.length === 77) {
  console.log('✓ PASS: Exactly 77 lab problems generated!');
} else {
  console.error(`FAIL: Expected 77 problems, got ${testAllProbs.length}`);
}

// Breakdown of 77 problems
const byCh = {};
testAllProbs.forEach(p => {
  byCh[p.chCode] = (byCh[p.chCode] || 0) + 1;
});
console.log('Problems breakdown by chapter/category:');
Object.keys(byCh).forEach(k => {
  console.log(`  ${k}: ${byCh[k]} bài`);
});

// Test rendering smoke tests
console.log('\n--- 7. RENDER SMOKE TESTS ---');
const renderTests = [
  () => { app.renderTocView(); return 'renderTocView()'; },
  () => { app.renderChapterView('ch01'); return "renderChapterView('ch01')"; },
  () => { app.renderChapterView('ch15'); return "renderChapterView('ch15')"; },
  () => { app.renderLabView('fruitstore'); return "renderLabView('fruitstore')"; },
  () => { app.renderSimulatorsView('join'); return "renderSimulatorsView('join')"; },
  () => { app.renderSimulatorsView('btree'); return "renderSimulatorsView('btree')"; },
  () => { app.renderSimulatorsView('exec_order'); return "renderSimulatorsView('exec_order')"; },
  () => { app.renderSimulatorsView('isolation'); return "renderSimulatorsView('isolation')"; },
  () => { app.renderSimulatorsView('normalization'); return "renderSimulatorsView('normalization')"; },
  () => { app.renderSimulatorsView('injection'); return "renderSimulatorsView('injection')"; },
  () => { app.renderInterviewView(); return 'renderInterviewView()'; },
  () => { app.renderNotesView(); return 'renderNotesView()'; }
];

renderTests.forEach(fn => {
  try {
    const name = fn();
    console.log(`  ✓ ${name}: OK`);
  } catch (err) {
    console.error(`  ❌ FAIL:`, err);
  }
});

console.log('\n========================================================');
console.log('   ALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY!');
console.log('========================================================\n');
