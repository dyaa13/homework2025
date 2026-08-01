'use strict';

let STUDENT_NAME = '';

const LAST_STUDENT_NAME_KEY = 'dyaaLastStudentName';
const MAX_PRACTICE_RECORDS = 500;

const CLOUD_RECORD_URL =
  'https://script.google.com/macros/s/AKfycbzmwxvMt73TGqnPOHw9jVYxFKlWNpPJUSfuAWKU9BAhGRo-p5aXnd9gP6a7fjpHDsWeSQ/exec';

const CLASS_TOKEN = 'dyaa-shared-class-2026';

const HEROES = {
  fox: { emoji: '🦊', name: 'Number Fox' },
  robot: { emoji: '🤖', name: 'Maths Robot' },
  dragon: { emoji: '🐉', name: 'Number Dragon' },
  ranger: { emoji: '🚀', name: 'Space Ranger' }
};

const YEAR_CONFIGS = {};
const BASE_STORAGE_BY_YEAR = {};
const YEAR_BANKS = {};

function normaliseStudentName(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ');
}

function getStudentStorageId() {
  return encodeURIComponent(
    normaliseStudentName(STUDENT_NAME).toLowerCase()
  );
}

function getPracticeRecordsKey() {
  return `dyaaPracticeRecords_${getStudentStorageId()}`;
}

function getPendingCloudRecordsKey() {
  return `dyaaPendingCloudRecords_${getStudentStorageId()}`;
}

function getStudentStorageKeys(year) {
  const base = BASE_STORAGE_BY_YEAR[year];
  const suffix = getStudentStorageId();

  return {
    stars: `${base.stars}_${suffix}`,
    hero: `${base.hero}_${suffix}`,
    best: `${base.best}_${suffix}`,
    mistakes: `${base.mistakes}_${suffix}`
  };
}

const state = {
  year: 4,
  running: false,
  paused: false,
  locked: false,
  reviewMode: false,
  reviewQueue: [],
  reviewIndex: 0,
  reviewSource: 'saved',
  mode: 'mixed',
  selectedSkills: [],
  level: 'core',
  duration: 300,
  remaining: 300,
  score: 0,
  correct: 0,
  answered: 0,
  streak: 0,
  bestStreak: 0,
  totalStars: 0,
  bestScore: 0,
  heroKey: 'fox',
  current: null,
  questionStartedAt: 0,
  timerId: null,
  soundOn: true,
  mission: null,
  missionRewarded: false,
  roundMistakes: [],
  mistakeBank: [],
  skillStats: {},
  recentQuestionKeys: [],
  recentQuestionLimit: 12
};

const progressByYear = {};

const $ = id => document.getElementById(id);
const yearSelect = $('yearSelect');
const skillPicker = $('skillPicker');
const skillPickerSummary = $('skillPickerSummary');
const skillCheckboxes = $('skillCheckboxes');
const selectAllSkillsBtn = $('selectAllSkillsBtn');
const clearSkillsBtn = $('clearSkillsBtn');
const doneSkillsBtn = $('doneSkillsBtn');
const skillSelectionHelp = $('skillSelectionHelp');
const levelSelect = $('levelSelect');
const timeSelect = $('timeSelect');
const heroSelect = $('heroSelect');
const startBtn = $('startBtn');
const pauseBtn = $('pauseBtn');
const finishBtn = $('finishBtn');
const reviewSavedBtn = $('reviewSavedBtn');
const testQuestionsBtn = $('testQuestionsBtn');
const viewRecordsBtn = $('viewRecordsBtn');
const practiceRecords = $('practiceRecords');
const practiceRecordTable = $('practiceRecordTable');
const practiceRecordCount = $('practiceRecordCount');
const clearPracticeRecordsBtn = $('clearPracticeRecordsBtn');
const closePracticeRecordsBtn = $('closePracticeRecordsBtn');
const reviewRoundBtn = $('reviewRoundBtn');
const reviewBankBtn = $('reviewBankBtn');
const showMistakesBtn = $('showMistakesBtn');
const playAgainBtn = $('playAgainBtn');
const clearMistakesBtn = $('clearMistakesBtn');
const closeMistakesBtn = $('closeMistakesBtn');
const soundBtn = $('soundBtn');
const studentIdentityOverlay = $('studentIdentityOverlay');
const studentNameInput = $('studentNameInput');
const studentNameError = $('studentNameError');
const continueStudentBtn = $('continueStudentBtn');
const changeStudentBtn = $('changeStudentBtn');
const studentNameDisplay = $('studentNameDisplay');
const practiceRecordStudentName = $('practiceRecordStudentName');
const answerInput = $('answerInput');
const submitBtn = $('submitBtn');
const questionText = $('questionText');
const modeBadge = $('modeBadge');
const feedback = $('feedback');
const hint = $('hint');
const streakBanner = $('streakBanner');
const timerValue = $('timerValue');
const scoreValue = $('scoreValue');
const correctValue = $('correctValue');
const answeredValue = $('answeredValue');
const streakValue = $('streakValue');
const accuracyValue = $('accuracyValue');
const timerCard = $('timerCard');
const streakCard = $('streakCard');
const totalStars = $('totalStars');
const heroAvatar = $('heroAvatar');
const heroName = $('heroName');
const heroLevel = $('heroLevel');
const heroBar = $('heroBar');
const missionText = $('missionText');
const missionStatus = $('missionStatus');
const savedCountTop = $('savedCountTop');
const savedCountPanel = $('savedCountPanel');
const bestScoreValue = $('bestScoreValue');
const progressTitle = $('progressTitle');
const raceProgress = $('raceProgress');
const rocket = $('rocket');
const playArea = $('playArea');
const summary = $('summary');
const summaryTitle = $('summaryTitle');
const summaryHero = $('summaryHero');
const summaryStars = $('summaryStars');
const summaryScore = $('summaryScore');
const endCorrect = $('endCorrect');
const endAnswered = $('endAnswered');
const endAccuracy = $('endAccuracy');
const endStreak = $('endStreak');
const summaryFocus = $('summaryFocus');
const summaryMessage = $('summaryMessage');
const badges = $('badges');
const rewardToast = $('rewardToast');
const reviewList = $('reviewList');
const reviewTable = $('reviewTable');
const confettiLayer = $('confettiLayer');
const gameTitle = $('gameTitle');
const skillLabel = $('skillLabel');
const teacherNote = $('teacherNote');
const testPanel = $('testPanel');
const testScope = $('testScope');
const testValidValue = $('testValidValue');
const testUniqueValue = $('testUniqueValue');
const testRepeatValue = $('testRepeatValue');
const testIssueValue = $('testIssueValue');
const testMessage = $('testMessage');
const testBreakdown = $('testBreakdown');
const testIssues = $('testIssues');
const closeTestBtn = $('closeTestBtn');
const keypadButtons = [...document.querySelectorAll('.key-btn')];

let audioContext = null;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function chance(p) {
  return Math.random() < p;
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function roundTo(n, d = 6) {
  const m = 10 ** d;
  return Math.round((n + Number.EPSILON) * m) / m;
}

function round2(n) {
  return roundTo(n, 2);
}

function fmt(n) {
  const value = roundTo(Number(n), 8);
  return Number.isInteger(value)
    ? String(value)
    : String(value).replace(/0+$/, '').replace(/\.$/, '');
}

function cleanDisplayNumbers(value) {
  return String(value).replace(
    /-?\d+\.\d{7,}/g,
    token => {
      const number = Number(token);

      if (!Number.isFinite(number)) {
        return token;
      }

      const cleaned = roundTo(number, 8);

      return Math.abs(cleaned - Math.round(cleaned)) < 1e-8
        ? String(Math.round(cleaned))
        : fmt(cleaned);
    }
  );
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function nextPrime(n) {
  let x = n + 1;
  while (!isPrime(x)) x++;
  return x;
}

function countFactors(n) {
  let count = 0;
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) count++;
  }
  return count;
}

function smallestPrimeFactor(n) {
  for (let i = 2; i <= n; i++) {
    if (n % i === 0 && isPrime(i)) return i;
  }
  return n;
}

function primeFactors(n) {
  const out = [];
  let p = 2;
  while (n > 1) {
    while (n % p === 0) {
      out.push(p);
      n /= p;
    }
    p++;
  }
  return out;
}

function squareMultiplier(n) {
  const factors = primeFactors(n);
  const counts = {};
  factors.forEach(p => {
    counts[p] = (counts[p] || 0) + 1;
  });
  return Object.entries(counts).reduce(
    (product, [p, count]) => product * (count % 2 ? Number(p) : 1),
    1
  );
}

function roundSig(n, sig) {
  if (n === 0) return 0;
  const p = sig - 1 - Math.floor(Math.log10(Math.abs(n)));
  const m = 10 ** p;
  return Math.round((n + Number.EPSILON) * m) / m;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

function getAccuracy() {
  return state.answered
    ? Math.round((state.correct / state.answered) * 100)
    : 0;
}

function normaliseMinus(value) {
  return String(value)
    .trim()
    .replace(/[−–—]/g, '-')
    .replace(/\s+/g, '');
}

function parseNumeric(raw) {
  const compact = normaliseMinus(raw);

  if (!compact) return NaN;

  if (/^[-+]?\d*\.?\d+$/.test(compact)) {
    return Number(compact);
  }

  if (/^[-+]?\d+\/[-+]?\d+$/.test(compact)) {
    const [numerator, denominator] = compact.split('/').map(Number);
    return denominator !== 0 ? numerator / denominator : NaN;
  }

  const original = String(raw).trim();

  if (/^[-+]?\d+\s+\d+\/\d+$/.test(original)) {
    const parts = original.split(/\s+/);
    const whole = Number(parts[0]);
    const [numerator, denominator] = parts[1].split('/').map(Number);
    return whole >= 0
      ? whole + numerator / denominator
      : whole - numerator / denominator;
  }

  return NaN;
}

function parseTimeValue(raw) {
  const compact = String(raw)
    .trim()
    .replace(/：/g, ':')
    .replace(/\s+/g, '');

  let hours;
  let minutes;

  if (/^\d{1,2}:\d{2}$/.test(compact)) {
    [hours, minutes] = compact.split(':').map(Number);
  } else if (/^\d{3,4}$/.test(compact)) {
    const padded = compact.padStart(4, '0');
    hours = Number(padded.slice(0, 2));
    minutes = Number(padded.slice(2));
  } else {
    return NaN;
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return NaN;
  }

  return hours * 100 + minutes;
}

function simplifyRatio(a, b) {
  const divisor = gcd(a, b);
  return `${a / divisor}:${b / divisor}`;
}

function validateAnswer(raw, question) {
  const compact = normaliseMinus(raw);

  if (question.answerType === 'ratio') {
    const match = compact.match(/^(-?\d+):(-?\d+)$/);
    if (!match) return false;

    return simplifyRatio(Number(match[1]), Number(match[2])) === question.answer;
  }

  if (question.answerType === 'time' || /\bHHMM\b/.test(question.text)) {
    const value = parseTimeValue(raw);
    return Number.isFinite(value)
      && value === Number(question.answer);
  }

  if (question.requireImproperFraction) {
    const fractionMatch = compact.match(/^([-+]?\d+)\/([-+]?\d+)$/);
    if (!fractionMatch) return false;

    const numerator = Number(fractionMatch[1]);
    const denominator = Number(fractionMatch[2]);

    if (denominator === 0 || Math.abs(numerator) <= Math.abs(denominator)) {
      return false;
    }

    return Math.abs(numerator / denominator - Number(question.answer)) < 1e-6;
  }

  const value = parseNumeric(raw);

  return Number.isFinite(value)
    && Math.abs(value - Number(question.answer)) < 1e-6;
}

function q(skill, text, answer, hint) {
  const rounded = roundTo(answer);

  return {
    skill,
    text,
    answer: rounded,
    displayAnswer: fmt(rounded),
    answerType: 'number',
    hint
  };
}

function qFrac(skill, text, value, hint) {
  const rounded = roundTo(value);
  const isWholeNumber = Math.abs(value - Math.round(value)) < 1e-8;
  const requireImproperFraction =
    Math.abs(value) > 1 + 1e-8 && !isWholeNumber;

  return {
    skill,
    text: requireImproperFraction
      ? `${text} Enter your answer as an improper fraction.`
      : text,
    answer: rounded,
    displayAnswer: toFraction(value),
    answerType: 'number',
    requireImproperFraction,
    hint: requireImproperFraction
      ? `${hint} Enter the final answer as an improper fraction, for example 7/4.`
      : hint
  };
}

function qRatio(skill, text, ratio, hint) {
  return {
    skill,
    text,
    answer: ratio,
    displayAnswer: ratio,
    answerType: 'ratio',
    hint
  };
}

function toFraction(value) {
  const sign = value < 0 ? '-' : '';
  const x = Math.abs(value);

  for (let denominator = 1; denominator <= 120; denominator++) {
    const numerator = Math.round(x * denominator);

    if (Math.abs(numerator / denominator - x) < 1e-8) {
      const divisor = gcd(numerator, denominator);
      const simpleNumerator = numerator / divisor;
      const simpleDenominator = denominator / divisor;
      return simpleDenominator === 1
        ? `${sign}${simpleNumerator}`
        : `${sign}${simpleNumerator}/${simpleDenominator}`;
    }
  }

  return fmt(value);
}

function displayCorrect(question) {
  return question.displayAnswer != null
    ? String(question.displayAnswer)
    : fmt(Number(question.answer));
}

/* ===== SHARED YEAR 7–9 FRACTION, DECIMAL & PERCENTAGE BANKS ===== */

function shuffleCopy(values) {
  const out = [...values];

  for (let i = out.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
}

function sharedFdpPool() {
  const year = Number(state.year);
  const level = state.level;
  const pairs = [
    [1, 2], [1, 4], [3, 4],
    [1, 5], [2, 5], [3, 5], [4, 5],
    [1, 8], [3, 8], [5, 8], [7, 8]
  ];

  if (year >= 8 || level !== 'starter') {
    pairs.push(
      [1, 10], [3, 10], [7, 10], [9, 10],
      [3, 20], [7, 20], [9, 20], [11, 20], [13, 20], [17, 20], [19, 20],
      [3, 25], [7, 25], [9, 25], [11, 25], [13, 25], [17, 25], [19, 25]
    );
  }

  if (year >= 9 || level === 'challenge') {
    pairs.push(
      [1, 16], [3, 16], [5, 16], [7, 16], [9, 16], [11, 16], [13, 16], [15, 16],
      [3, 40], [7, 40], [11, 40], [13, 40], [17, 40], [19, 40], [23, 40], [27, 40], [31, 40], [37, 40]
    );
  }

  return pairs.map(([n, d]) => ({
    n,
    d,
    value: n / d
  }));
}

function sharedFdpDisplay(item, kind) {
  if (kind === 'fraction') {
    return `${item.n}/${item.d}`;
  }

  if (kind === 'percent') {
    return `${fmt(item.value * 100)}%`;
  }

  return fmt(item.value);
}

function sharedGenFDPConversions() {
  const year = Number(state.year);
  const L = state.level;
  const pool = sharedFdpPool();
  const maxType = L === 'starter'
    ? 4
    : L === 'core'
      ? 6
      : 8;
  const t = randInt(1, maxType);
  const item = pick(pool);

  if (t === 1) {
    return q(
      'fdpConversions',
      `${item.n}/${item.d} as a decimal = ?`,
      item.value,
      'Divide the numerator by the denominator.'
    );
  }

  if (t === 2) {
    return q(
      'fdpConversions',
      `${item.n}/${item.d} as a percentage = ?%`,
      item.value * 100,
      'Convert to a decimal, then multiply by 100.'
    );
  }

  if (t === 3) {
    return qFrac(
      'fdpConversions',
      `${fmt(item.value)} as a simplest fraction = ?`,
      item.value,
      'Write the decimal over 10, 100, 1000 or 10000, then simplify.'
    );
  }

  if (t === 4) {
    return q(
      'fdpConversions',
      `${fmt(item.value * 100)}% as a decimal = ?`,
      item.value,
      'Divide the percentage by 100.'
    );
  }

  if (t === 5) {
    return qFrac(
      'fdpConversions',
      `${fmt(item.value * 100)}% as a simplest fraction = ?`,
      item.value,
      'Write the percentage over 100 and simplify.'
    );
  }

  if (t === 6) {
    return q(
      'fdpConversions',
      `${fmt(item.value)} as a percentage = ?%`,
      item.value * 100,
      'Multiply the decimal by 100.'
    );
  }

  if (t === 7) {
    const targetDenominator = pick([20, 40, 50, 100]);
    const numerator = item.value * targetDenominator;

    if (Math.abs(numerator - Math.round(numerator)) < 1e-8) {
      return q(
        'fdpConversions',
        `${item.n}/${item.d} = ?/${targetDenominator}`,
        Math.round(numerator),
        'Use an equivalent fraction.'
      );
    }

    return q(
      'fdpConversions',
      `${item.n}/${item.d} as a percentage = ?%`,
      item.value * 100,
      'Convert to a decimal, then multiply by 100.'
    );
  }

  const base = pick(pool);
  const multiplier = randInt(2, year >= 9 ? 8 : 5);
  const targetNumerator = base.n * multiplier;
  const targetDenominator = base.d * multiplier;

  return q(
    'fdpConversions',
    `${base.n}/${base.d} = ?/${targetDenominator}`,
    targetNumerator,
    'Multiply the numerator and denominator by the same number.'
  );
}

function sharedGenFDPComparison() {
  const year = Number(state.year);
  const L = state.level;
  const pool = shuffleCopy(sharedFdpPool());
  const count = L === 'starter' && year === 7 ? 2 : 3;
  const items = pool.slice(0, count);
  const kinds = shuffleCopy(['fraction', 'decimal', 'percent']).slice(0, count);
  const entries = items.map((item, index) => ({
    item,
    value: item.value,
    display: sharedFdpDisplay(item, kinds[index])
  }));
  const mode = count === 2
    ? pick(['largest', 'smallest'])
    : pick(['largest', 'smallest', 'middle']);
  const values = entries.map(entry => entry.value);
  let targetValue;

  if (mode === 'largest') {
    targetValue = Math.max(...values);
  } else if (mode === 'smallest') {
    targetValue = Math.min(...values);
  } else {
    targetValue = [...values].sort((a, b) => a - b)[1];
  }

  const answer = values.findIndex(value => Math.abs(value - targetValue) < 1e-10) + 1;
  const list = entries
    .map((entry, index) => `${index + 1}) ${entry.display}`)
    .join('   ');

  return q(
    'fdpComparison',
    `Which is ${mode}? Enter the item number. ${list}`,
    answer,
    'Convert every value to the same form before comparing.'
  );
}

function sharedGenFDPOperations() {
  const year = Number(state.year);
  const L = state.level;
  const easyTemplates = [
    () => {
      const [n, d, decimal] = pick([
        [1, 4, 0.5], [3, 8, 0.25], [2, 5, 0.3], [5, 8, 0.125],
        [3, 4, 0.2], [1, 5, 0.65], [7, 10, 0.15], [3, 5, 0.4]
      ]);
      return q(
        'fdpOperations',
        `${n}/${d} + ${fmt(decimal)} = ?`,
        n / d + decimal,
        'Convert the fraction or decimal so both are in the same form.'
      );
    },
    () => {
      const [decimal, percent] = pick([
        [0.8, 25], [0.75, 20], [1.2, 50], [0.625, 12.5],
        [0.9, 40], [1.5, 75], [0.55, 20], [1.25, 25]
      ]);
      return q(
        'fdpOperations',
        `${fmt(decimal)} − ${fmt(percent)}% = ?`,
        decimal - percent / 100,
        'Convert the percentage to a decimal before subtracting.'
      );
    },
    () => {
      const [percent, n, d] = pick([
        [50, 3, 4], [25, 4, 5], [20, 3, 5], [75, 4, 5],
        [50, 7, 8], [40, 3, 4], [25, 3, 5], [10, 4, 5]
      ]);
      return qFrac(
        'fdpOperations',
        `${percent}% of ${n}/${d} = ?`,
        percent / 100 * n / d,
        'Convert the percentage to a fraction or decimal, then multiply.'
      );
    },
    () => {
      const [decimal, n, d] = pick([
        [0.8, 3, 4], [0.5, 3, 5], [1.2, 5, 6], [0.75, 2, 3],
        [0.4, 5, 8], [1.5, 2, 5], [0.25, 7, 8], [0.6, 5, 6]
      ]);
      return qFrac(
        'fdpOperations',
        `${fmt(decimal)} × ${n}/${d} = ?`,
        decimal * n / d,
        'Write the decimal as a fraction, then multiply.'
      );
    }
  ];

  const coreTemplates = [
    () => {
      const [n, d, decimal] = pick([
        [3, 4, 0.25], [3, 5, 0.2], [7, 8, 0.5], [9, 10, 0.3],
        [5, 8, 0.125], [4, 5, 0.4], [7, 10, 0.2], [3, 8, 0.125]
      ]);
      return qFrac(
        'fdpOperations',
        `${n}/${d} ÷ ${fmt(decimal)} = ?`,
        (n / d) / decimal,
        'Convert the decimal to a fraction, then divide by multiplying by the reciprocal.'
      );
    },
    () => {
      const [percent, n, d] = pick([
        [25, 3, 8], [40, 3, 5], [62.5, 1, 4], [50, 7, 10],
        [12.5, 3, 4], [75, 1, 5], [20, 7, 10], [37.5, 1, 2]
      ]);
      return qFrac(
        'fdpOperations',
        `${fmt(percent)}% + ${n}/${d} = ?`,
        percent / 100 + n / d,
        'Convert the percentage and fraction to a common form before adding.'
      );
    },
    () => {
      const [n, d, decimal, percent] = pick([
        [1, 4, 0.5, 50], [3, 8, 0.125, 80], [2, 5, 0.6, 25], [3, 4, 0.25, 40],
        [1, 5, 0.3, 60], [5, 8, 0.375, 50], [7, 10, 0.3, 20], [3, 5, 0.4, 75]
      ]);
      return qFrac(
        'fdpOperations',
        `(${n}/${d} + ${fmt(decimal)}) × ${fmt(percent)}% = ?`,
        (n / d + decimal) * percent / 100,
        'Work inside the brackets first, then multiply by the percentage.'
      );
    },
    () => {
      const [decimal, n, d] = pick([
        [0.75, 3, 8], [0.8, 2, 5], [1.25, 5, 8], [0.6, 3, 10],
        [1.5, 3, 4], [0.875, 7, 16], [0.45, 9, 20], [1.2, 3, 5]
      ]);
      return qFrac(
        'fdpOperations',
        `${fmt(decimal)} ÷ ${n}/${d} = ?`,
        decimal / (n / d),
        'Divide by a fraction by multiplying by its reciprocal.'
      );
    }
  ];

  const challengeTemplates = [
    () => {
      const [n, d, percent] = pick([
        [3, 4, 25], [5, 8, 12.5], [7, 10, 20], [9, 16, 6.25],
        [3, 5, 15], [7, 8, 25], [11, 20, 5], [13, 20, 10]
      ]);
      return qFrac(
        'fdpOperations',
        `${n}/${d} ÷ ${fmt(percent)}% = ?`,
        (n / d) / (percent / 100),
        'Convert the percentage to a decimal or fraction before dividing.'
      );
    },
    () => {
      const [decimal, percent, n, d] = pick([
        [1.2, 35, 3, 4], [0.95, 25, 2, 5], [1.5, 40, 7, 10], [0.875, 37.5, 1, 4],
        [1.25, 20, 3, 5], [0.8, 12.5, 1, 8], [1.6, 50, 4, 5], [0.725, 25, 3, 8]
      ]);
      return qFrac(
        'fdpOperations',
        `${fmt(decimal)} + ${fmt(percent)}% − ${n}/${d} = ?`,
        decimal + percent / 100 - n / d,
        'Convert all three values to the same form before calculating.'
      );
    },
    () => {
      const [n, d, percent, decimal] = pick([
        [3, 4, 25, 0.5], [7, 8, 37.5, 0.25], [4, 5, 20, 0.3], [9, 10, 30, 0.2],
        [5, 8, 12.5, 0.25], [7, 10, 20, 0.5], [11, 20, 5, 0.25], [3, 5, 10, 0.2]
      ]);
      return qFrac(
        'fdpOperations',
        `(${n}/${d} − ${fmt(percent)}%) ÷ ${fmt(decimal)} = ?`,
        (n / d - percent / 100) / decimal,
        'Calculate inside the brackets, then divide.'
      );
    },
    () => {
      const [percent, n, d, decimal] = pick([
        [50, 3, 4, 0.25], [25, 7, 8, 0.125], [40, 3, 5, 0.4], [75, 1, 2, 0.3],
        [20, 4, 5, 0.2], [62.5, 3, 8, 0.425], [10, 7, 10, 0.3], [37.5, 5, 8, 0.375]
      ]);
      return qFrac(
        'fdpOperations',
        `${fmt(percent)}% of (${n}/${d} + ${fmt(decimal)}) = ?`,
        percent / 100 * (n / d + decimal),
        'Work inside the brackets first, then find the stated percentage.'
      );
    }
  ];

  let templates = [...easyTemplates];

  if (L !== 'starter' || year >= 8) {
    templates = templates.concat(coreTemplates);
  }

  if (L === 'challenge' || year >= 9) {
    templates = templates.concat(challengeTemplates);
  }

  if (year === 7 && L === 'starter') {
    templates = easyTemplates;
  } else if (year === 7 && L === 'core') {
    templates = easyTemplates.concat(coreTemplates.slice(0, 2));
  } else if (year === 8 && L === 'starter') {
    templates = easyTemplates.concat(coreTemplates.slice(0, 1));
  } else if (year === 8 && L === 'core') {
    templates = easyTemplates.concat(coreTemplates);
  }

  return pick(templates)();
}
