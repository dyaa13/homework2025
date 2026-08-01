'use strict';

function currentConfig() {
  return YEAR_CONFIGS[state.year];
}

function currentLabels() {
  return currentConfig().labels;
}

function normaliseQuestion(raw, fallbackSkill) {
  const skill = raw.skill || raw.operation || fallbackSkill;
  const answerType = raw.answerType || 'number';
  const answer = answerType === 'number'
    ? roundTo(Number(raw.answer))
    : String(raw.answer);

  return {
    ...raw,
    skill,
    text: cleanDisplayNumbers(raw.text),
    answer,
    displayAnswer: raw.displayAnswer != null
      ? cleanDisplayNumbers(raw.displayAnswer)
      : answerType === 'number'
        ? fmt(answer)
        : String(answer),
    answerType,
    hint: cleanDisplayNumbers(raw.hint || '')
  };
}

function questionIdentityKey(question) {
  return `${state.year}|${question.skill}|${question.text}|${question.answerType}|${question.answer}`;
}

function generatedQuestionIssues(question) {
  const issues = [];

  if (!question || typeof question !== 'object') {
    return ['Question generator did not return an object.'];
  }

  if (typeof question.text !== 'string' || !question.text.trim()) {
    issues.push('Question text is empty.');
  }

  if (/NaN|undefined|Infinity/.test(String(question.text))) {
    issues.push('Question text contains an invalid value.');
  }

  if (!question.skill || !currentConfig().skills.includes(question.skill)) {
    issues.push(`Unknown skill: ${question.skill || 'missing'}.`);
  }

  if (question.answerType === 'ratio') {
    const match = String(question.answer).match(/^(-?\d+):(-?\d+)$/);

    if (!match || Number(match[2]) === 0) {
      issues.push('Ratio answer is invalid.');
    }
  } else if (!Number.isFinite(Number(question.answer))) {
    issues.push('Numeric answer is not finite.');
  }

  const shownAnswer = displayCorrect(question);

  if (!shownAnswer || /NaN|undefined|Infinity/.test(shownAnswer)) {
    issues.push('Displayed answer is invalid.');
  }

  return issues;
}

function clearRecentQuestions() {
  state.recentQuestionKeys = [];
}

function rememberRecentQuestion(question) {
  const key = questionIdentityKey(question);
  state.recentQuestionKeys.push(key);

  if (state.recentQuestionKeys.length > state.recentQuestionLimit) {
    state.recentQuestionKeys.splice(
      0,
      state.recentQuestionKeys.length - state.recentQuestionLimit
    );
  }
}

function getActiveSkills() {
  const config = currentConfig();
  const valid = state.selectedSkills.filter(skill => config.skills.includes(skill));
  return valid.length > 0 ? valid : [];
}

function updateSelectionMode() {
  const config = currentConfig();
  const activeSkills = getActiveSkills();

  state.mode = activeSkills.length === config.skills.length
    ? 'mixed'
    : activeSkills.length === 1
      ? activeSkills[0]
      : 'custom';
}

function selectedSkillsDescription(maxNames = 3) {
  const config = currentConfig();
  const activeSkills = getActiveSkills();

  if (activeSkills.length === 0) {
    return 'Select at least one skill';
  }

  if (activeSkills.length === config.skills.length) {
    return `All ${config.skills.length} skills selected`;
  }

  if (activeSkills.length <= maxNames) {
    return activeSkills
      .map(skill => config.labels[skill] || skill)
      .join(', ');
  }

  return `${activeSkills.length} skills selected`;
}

function syncSelectedSkillsFromUI() {
  state.selectedSkills = [...skillCheckboxes.querySelectorAll('input[type="checkbox"]:checked')]
    .map(input => input.value)
    .filter(skill => currentConfig().skills.includes(skill));

  updateSelectionMode();
  updateSkillSelectionUI();
}

function updateSkillSelectionUI() {
  const config = currentConfig();
  const activeSkills = getActiveSkills();
  const hasSelection = activeSkills.length > 0;

  skillPickerSummary.textContent = selectedSkillsDescription();
  skillPicker.classList.toggle('invalid', !hasSelection);
  skillSelectionHelp.classList.toggle('error', !hasSelection);
  skillSelectionHelp.textContent = hasSelection
    ? `Selected ${activeSkills.length} of ${config.skills.length}. Questions will be mixed only from these skills.`
    : 'Select at least one skill before starting or testing.';

  if (!state.running) {
    startBtn.disabled = !hasSelection;
    testQuestionsBtn.disabled = !hasSelection;
  }
}

function setSelectedSkills(skills) {
  const config = currentConfig();
  const validSkills = skills.filter(skill => config.skills.includes(skill));
  state.selectedSkills = [...new Set(validSkills)];

  skillCheckboxes.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.checked = state.selectedSkills.includes(input.value);
  });

  updateSelectionMode();
  clearRecentQuestions();
  testPanel.classList.remove('show');
  updateSkillSelectionUI();
}

function generateQuestion(options = {}) {
  const config = currentConfig();
  const avoidRecent = options.avoidRecent !== false;
  let validFallback = null;

  for (let attempt = 0; attempt < 80; attempt++) {
    const activeSkills = getActiveSkills();

    if (activeSkills.length === 0) {
      throw new Error('Select at least one skill before generating questions.');
    }

    const skill = pick(activeSkills);
    const generator = YEAR_BANKS[state.year][skill];

    if (!generator) {
      throw new Error(`No question generator for Year ${state.year}: ${skill}`);
    }

    const question = normaliseQuestion(generator(), skill);
    const issues = generatedQuestionIssues(question);

    if (issues.length > 0) {
      continue;
    }

    validFallback = question;

    if (
      !avoidRecent
      || !state.recentQuestionKeys.includes(questionIdentityKey(question))
    ) {
      return question;
    }
  }

  if (validFallback) {
    return validFallback;
  }

  throw new Error(`Unable to generate a valid Year ${state.year} question.`);
}

function questionKey(question) {
  return questionIdentityKey(question);
}

function runQuestionTest() {
  if (state.running) return;

  syncSelectedSkillsFromUI();
  state.level = levelSelect.value;

  if (getActiveSkills().length === 0) {
    testPanel.classList.add('show');
    testMessage.className = 'test-message fail';
    testMessage.textContent = 'Select at least one skill before running the 100-question check.';
    return;
  }

  const savedRecentKeys = [...state.recentQuestionKeys];
  const savedCurrent = state.current;
  const seen = new Set();
  const skillCounts = {};
  const issues = [];
  let validCount = 0;
  let recentRepeatCount = 0;

  testQuestionsBtn.disabled = true;
  testQuestionsBtn.textContent = 'Testing 100 Questions…';
  testPanel.classList.add('show');
  testMessage.className = 'test-message';
  testMessage.textContent = 'Generating and checking 100 questions…';
  testBreakdown.innerHTML = '';
  testIssues.innerHTML = '';

  clearRecentQuestions();

  for (let index = 1; index <= 100; index++) {
    try {
      const question = generateQuestion();
      const key = questionIdentityKey(question);
      const questionIssues = generatedQuestionIssues(question);

      if (state.recentQuestionKeys.includes(key)) {
        recentRepeatCount++;
        questionIssues.push(
          `Repeated within the last ${state.recentQuestionLimit} questions.`
        );
      }

      if (questionIssues.length === 0) {
        validCount++;
      } else {
        questionIssues.forEach(issue => {
          issues.push(`Question ${index}: ${issue}`);
        });
      }

      seen.add(key);
      skillCounts[question.skill] = (skillCounts[question.skill] || 0) + 1;
      rememberRecentQuestion(question);
    } catch (error) {
      issues.push(`Question ${index}: ${error.message || String(error)}`);
    }
  }

  state.recentQuestionKeys = savedRecentKeys;
  state.current = savedCurrent;

  const labels = currentLabels();
  const activeSkills = getActiveSkills();
  const selectedSkill = activeSkills.length === currentConfig().skills.length
    ? currentConfig().mixed
    : activeSkills.length === 1
      ? labels[activeSkills[0]] || activeSkills[0]
      : `${activeSkills.length} selected skills`;
  const selectedLevel = levelSelect.options[levelSelect.selectedIndex]
    ? levelSelect.options[levelSelect.selectedIndex].textContent
    : state.level;

  testScope.textContent =
    `Year ${state.year} · ${selectedSkill} · ${selectedLevel}`;
  testValidValue.textContent = `${validCount}/100`;
  testUniqueValue.textContent = `${seen.size}/100`;
  testRepeatValue.textContent = String(recentRepeatCount);
  testIssueValue.textContent = String(issues.length);

  const passed = validCount === 100
    && recentRepeatCount === 0
    && issues.length === 0;

  testMessage.className = `test-message ${passed ? 'pass' : 'fail'}`;
  testMessage.textContent = passed
    ? `Check passed. All 100 questions were valid, and none repeated within the most recent ${state.recentQuestionLimit} questions.`
    : 'The check found one or more issues. Review the details below.';

  testBreakdown.innerHTML = Object.entries(skillCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([skill, count]) => (
      `<span class="test-chip">${escapeHtml(labels[skill] || skill)}: ${count}</span>`
    ))
    .join('');

  testIssues.innerHTML = issues
    .slice(0, 12)
    .map(issue => `<li>${escapeHtml(issue)}</li>`)
    .join('');

  if (issues.length > 12) {
    testIssues.innerHTML +=
      `<li>…and ${issues.length - 12} more issue(s).</li>`;
  }

  testQuestionsBtn.disabled = false;
  testQuestionsBtn.textContent = 'Test 100 Questions';
  testPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function migrateMistake(item, year) {
  if (!item || !item.q || !item.q.text) return null;

  const question = normaliseQuestion(
    item.q,
    item.q.skill || item.q.operation || 'mixed'
  );

  return {
    key: item.key || `${year}|${question.skill}|${question.text}|${question.answerType}|${question.answer}`,
    year,
    q: question,
    lastAnswer: item.lastAnswer != null ? String(item.lastAnswer) : '',
    wrongCount: Number(item.wrongCount) || 1,
    mastery: Number(item.mastery) || 0,
    updated: Number(item.updated) || Date.now()
  };
}

function readYearProgress(year) {
  const keys = getStudentStorageKeys(year);
  const result = {
    stars: 0,
    best: 0,
    hero: 'fox',
    mistakes: []
  };

  try {
    const stars = Number(localStorage.getItem(keys.stars));
    const best = Number(localStorage.getItem(keys.best));
    const hero = localStorage.getItem(keys.hero);
    const rawBank = JSON.parse(localStorage.getItem(keys.mistakes) || '[]');

    if (Number.isFinite(stars) && stars >= 0) result.stars = stars;
    if (Number.isFinite(best) && best >= 0) result.best = best;
    if (hero && HEROES[hero]) result.hero = hero;

    if (Array.isArray(rawBank)) {
      result.mistakes = rawBank
        .map(item => migrateMistake(item, year))
        .filter(Boolean);
    }
  } catch (error) {
    console.warn(`Could not load Year ${year} progress.`, error);
  }

  return result;
}

function loadProgress() {
  for (const year of Object.keys(YEAR_CONFIGS).map(Number)) {
    progressByYear[year] = readYearProgress(year);
  }

  applyYearProgress(state.year);
}

function applyYearProgress(year) {
  const profile = progressByYear[year] || {
    stars: 0,
    best: 0,
    hero: 'fox',
    mistakes: []
  };

  state.totalStars = profile.stars;
  state.bestScore = profile.best;
  state.heroKey = profile.hero;
  state.mistakeBank = profile.mistakes;
  state.roundMistakes = [];

  heroSelect.value = state.heroKey;
}

function saveProgress() {
  const keys = getStudentStorageKeys(state.year);

  progressByYear[state.year] = {
    stars: state.totalStars,
    best: state.bestScore,
    hero: state.heroKey,
    mistakes: state.mistakeBank
  };

  try {
    localStorage.setItem(keys.stars, String(state.totalStars));
    localStorage.setItem(keys.best, String(state.bestScore));
    localStorage.setItem(keys.hero, state.heroKey);
    localStorage.setItem(
      keys.mistakes,
      JSON.stringify(state.mistakeBank.slice(0, 120))
    );
  } catch (error) {
    console.warn(`Could not save Year ${state.year} progress.`, error);
  }
}

function ensureAudio() {
  if (!state.soundOn) return null;

  if (!audioContext) {
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) return null;
    audioContext = new AudioClass();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  return audioContext;
}

function tone(frequency, duration = 0.12, delay = 0, volume = 0.07) {
  const context = ensureAudio();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(0.0001, context.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(
    volume,
    context.currentTime + delay + 0.015
  );
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime + delay + duration
  );

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(context.currentTime + delay);
  oscillator.stop(context.currentTime + delay + duration + 0.03);
}

function playSound(type) {
  if (type === 'correct') {
    tone(523, 0.12);
    tone(659, 0.15, 0.1);
  } else if (type === 'wrong') {
    tone(220, 0.2);
  } else if (type === 'finish') {
    tone(523, 0.12);
    tone(659, 0.12, 0.12);
    tone(784, 0.2, 0.24);
  }
}

function launchConfetti(number = 26) {
  const colors = [
    '#1f78d1',
    '#ff9f1c',
    '#f5b700',
    '#16803a',
    '#6b46c1'
  ];

  for (let i = 0; i < number; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.left = `${randInt(2, 97)}%`;
    piece.style.background = pick(colors);
    piece.style.animationDelay = `${Math.random() * 0.35}s`;
    piece.style.animationDuration = `${1.05 + Math.random() * 0.7}s`;
    confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 2200);
  }
}

function showReward(message) {
  rewardToast.textContent = message;
  rewardToast.classList.remove('show');
  void rewardToast.offsetWidth;
  rewardToast.classList.add('show');
}

function updateStartButton() {
  const minutes = Math.round(Number(timeSelect.value) / 60);
  startBtn.textContent = `Start ${minutes}-Minute Year ${state.year} Warm-up`;
}

function updateYearUI(resetMode = true) {
  const config = currentConfig();

  gameTitle.textContent = config.title;
  document.title = `DYAA ${config.title}`;
  skillLabel.textContent = `Year ${state.year} Skills`;
  teacherNote.innerHTML = `<b>Year ${state.year} classroom use:</b> ${config.teacher}`;

  const previousSkills = state.selectedSkills.filter(skill => config.skills.includes(skill));
  const defaultSkills = state.year === 5
    ? config.skills.filter(skill => skill !== 'twoDigitMultiplication')
    : [...config.skills];

  state.selectedSkills = resetMode || previousSkills.length === 0
    ? defaultSkills
    : previousSkills;

  skillCheckboxes.innerHTML = '';

  config.skills.forEach(skill => {
    const label = document.createElement('label');
    label.className = 'skill-option';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = skill;
    input.checked = state.selectedSkills.includes(skill);

    const text = document.createElement('span');
    text.textContent = config.labels[skill];

    label.appendChild(input);
    label.appendChild(text);
    skillCheckboxes.appendChild(label);
  });

  updateSelectionMode();
  updateSkillSelectionUI();
  skillPicker.open = false;

  levelSelect.innerHTML = '';

  config.levels.forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    levelSelect.appendChild(option);
  });

  if (!['starter', 'core', 'challenge'].includes(state.level)) {
    state.level = 'core';
  }

  levelSelect.value = state.level;
  summaryTitle.textContent = `Year ${state.year} Warm-up Complete!`;
  questionText.textContent = `Press “Start 5-Minute Year ${state.year} Warm-up”`;

  const robotOption = heroSelect.querySelector('option[value="robot"]');
  if (robotOption) {
    robotOption.textContent = state.year >= 7
      ? '🤖 Algebra Robot'
      : '🤖 Maths Robot';
  }

  updateStartButton();
  updateHero();
  updateMistakeCounts();
}

function createMission() {
  const correctTarget = state.duration === 60
    ? 5
    : state.duration === 180
      ? 12
      : 20;

  const streakTarget = state.level === 'starter' ? 4 : 6;

  return pick([
    {
      type: 'correct',
      target: correctTarget,
      text: `Answer ${correctTarget} questions correctly.`
    },
    {
      type: 'streak',
      target: streakTarget,
      text: `Build a streak of ${streakTarget} correct answers.`
    },
    {
      type: 'accuracy',
      target: 80,
      text: 'Finish with at least 80% accuracy.'
    }
  ]);
}

function missionComplete() {
  if (!state.mission) return false;

  if (state.mission.type === 'correct') {
    return state.correct >= state.mission.target;
  }

  if (state.mission.type === 'streak') {
    return state.bestStreak >= state.mission.target;
  }

  return state.answered >= 5
    && getAccuracy() >= state.mission.target;
}

function missionProgress() {
  if (!state.mission) return 'Mission reward: +5 stars';

  if (state.mission.type === 'correct') {
    return `Progress: ${state.correct}/${state.mission.target} · Reward: +5 stars`;
  }

  if (state.mission.type === 'streak') {
    return `Best streak: ${state.bestStreak}/${state.mission.target} · Reward: +5 stars`;
  }

  return `Accuracy: ${getAccuracy()}%/${state.mission.target}% · Reward: +5 stars`;
}

function resetSkillStats() {
  state.skillStats = {};

  currentConfig().skills.forEach(skill => {
    state.skillStats[skill] = {
      correct: 0,
      total: 0
    };
  });
}

function addMistake(question, userAnswer) {
  const item = {
    key: questionKey(question),
    year: state.year,
    q: { ...question },
    lastAnswer: String(userAnswer),
    wrongCount: 1,
    mastery: 0,
    updated: Date.now()
  };

  const bankIndex = state.mistakeBank.findIndex(
    existing => existing.key === item.key
  );

  if (bankIndex >= 0) {
    state.mistakeBank[bankIndex].lastAnswer = item.lastAnswer;
    state.mistakeBank[bankIndex].wrongCount =
      (state.mistakeBank[bankIndex].wrongCount || 0) + 1;
    state.mistakeBank[bankIndex].mastery = 0;
    state.mistakeBank[bankIndex].updated = Date.now();
  } else {
    state.mistakeBank.unshift(item);
  }

  const roundIndex = state.roundMistakes.findIndex(
    existing => existing.key === item.key
  );

  if (roundIndex < 0) {
    state.roundMistakes.push(item);
  } else {
    state.roundMistakes[roundIndex] = item;
  }

  saveProgress();
  updateMistakeCounts();
}

function markReviewCorrect(item) {
  const index = state.mistakeBank.findIndex(
    existing => existing.key === item.key
  );

  if (index < 0) return;

  state.mistakeBank[index].mastery =
    (state.mistakeBank[index].mastery || 0) + 1;

  if (state.mistakeBank[index].mastery >= 2) {
    state.mistakeBank.splice(index, 1);
    showReward('✅ Mastered twice — removed from the mistake bank!');
  } else {
    showReward('✅ Correct once. Solve it correctly one more time to master it.');
  }

  saveProgress();
  updateMistakeCounts();
}

function markReviewWrong(item, userAnswer) {
  const index = state.mistakeBank.findIndex(
    existing => existing.key === item.key
  );

  if (index >= 0) {
    state.mistakeBank[index].mastery = 0;
    state.mistakeBank[index].lastAnswer = String(userAnswer);
    state.mistakeBank[index].wrongCount =
      (state.mistakeBank[index].wrongCount || 0) + 1;
    state.mistakeBank[index].updated = Date.now();
  }

  saveProgress();
  updateMistakeCounts();
}

function currentHero() {
  const base = HEROES[state.heroKey];

  if (state.heroKey === 'robot') {
    return {
      emoji: base.emoji,
      name: state.year >= 7 ? 'Algebra Robot' : 'Maths Robot'
    };
  }

  return base;
}

function updateHero() {
  const hero = currentHero();
  const level = Math.floor(state.totalStars / 15) + 1;
  const progress = state.totalStars % 15;

  heroAvatar.textContent = hero.emoji;
  heroName.textContent = hero.name;
  heroLevel.textContent =
    `Year ${state.year} Level ${level} · ${progress}/15 stars`;
  heroBar.style.width = `${(progress / 15) * 100}%`;
  summaryHero.textContent = hero.emoji;
}

function updateRace() {
  const progress = Math.min(100, state.correct * 4);
  raceProgress.style.width = `${progress}%`;
  rocket.style.left =
    `calc(16px + (100% - 84px) * ${progress / 100})`;
}

function updateMistakeCounts() {
  savedCountTop.textContent = state.mistakeBank.length;
  savedCountPanel.textContent = state.mistakeBank.length;
  bestScoreValue.textContent = state.bestScore;
  progressTitle.textContent = `Year ${state.year} Progress`;
  reviewSavedBtn.disabled = state.mistakeBank.length === 0;
  reviewBankBtn.disabled = state.mistakeBank.length === 0;
  renderMistakeListIfOpen();
}

function updateStatus() {
  timerValue.textContent = state.reviewMode
    ? 'Review'
    : formatTime(state.remaining);
  scoreValue.textContent = state.score;
  correctValue.textContent = state.correct;
  answeredValue.textContent = state.answered;
  streakValue.textContent = state.streak;
  accuracyValue.textContent = state.answered
    ? `${getAccuracy()}%`
    : '—';
  totalStars.textContent = state.totalStars;

  missionStatus.textContent = state.reviewMode
    ? `Question ${Math.min(state.reviewIndex + 1, state.reviewQueue.length)} of ${state.reviewQueue.length}`
    : missionProgress();

  timerCard.classList.toggle(
    'warning',
    !state.reviewMode && state.remaining <= 30 && state.running
  );
  streakCard.classList.toggle('hot', state.streak >= 3);

  updateHero();
  updateRace();
  updateMistakeCounts();
}

function setControlsForGame(active) {
  yearSelect.disabled = active;
  skillPicker.classList.toggle('locked', active);
  skillCheckboxes.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.disabled = active;
  });
  selectAllSkillsBtn.disabled = active;
  clearSkillsBtn.disabled = active;
  doneSkillsBtn.disabled = active;
  if (active) skillPicker.open = false;
  levelSelect.disabled = active;
  timeSelect.disabled = active;
  heroSelect.disabled = active;

  startBtn.classList.toggle('hidden', active);
  reviewSavedBtn.classList.toggle('hidden', active);
  testQuestionsBtn.classList.toggle('hidden', active);
  pauseBtn.classList.toggle('hidden', !active || state.reviewMode);
  finishBtn.classList.toggle('hidden', !active);

  answerInput.disabled = !active || state.paused;
  submitBtn.disabled = !active || state.paused;

  keypadButtons.forEach(button => {
    button.disabled = !active || state.paused;
  });
}

function showQuestion() {
  if (!state.running || state.paused) return;

  state.locked = false;

  if (state.reviewMode) {
    const item = state.reviewQueue[state.reviewIndex];

    if (!item) {
      finishReview();
      return;
    }

    state.current = {
      ...item.q,
      _reviewItem: item
    };

    modeBadge.textContent =
      `Review: ${currentLabels()[state.current.skill] || state.current.skill}`;
    playArea.classList.add('review-mode');
  } else {
    state.current = generateQuestion();
    rememberRecentQuestion(state.current);
    modeBadge.textContent =
      currentLabels()[state.current.skill] || state.current.skill;
    playArea.classList.remove('review-mode');
  }

  state.questionStartedAt = performance.now();

  const hasChoiceLayout =
    Array.isArray(state.current.choiceOptions)
    && state.current.choiceOptions.length === 4;

  playArea.classList.toggle('choice-mode', hasChoiceLayout);
  questionText.classList.toggle('choice-layout', hasChoiceLayout);

  if (hasChoiceLayout) {
    questionText.innerHTML = `
      <div class="choice-prompt">
        ${formatMathHtml(state.current.choicePrompt || state.current.text)}
      </div>
      <div class="choice-grid">
        ${state.current.choiceOptions.map((option, index) => `
          <button
            class="choice-option"
            type="button"
            data-choice="${index + 1}"
          >
            <span class="choice-number">${index + 1}</span>
            <span class="choice-text">${formatMathHtml(option)}</span>
          </button>
        `).join('')}
      </div>
    `;

    questionText.querySelectorAll('.choice-option').forEach(button => {
      button.addEventListener('click', () => {
        if (state.locked || !state.running || state.paused) return;

        const selectedChoice = Number(button.dataset.choice);
        const correctChoice = Number(state.current.answer);

        questionText.querySelectorAll('.choice-option').forEach(optionButton => {
          const optionNumber = Number(optionButton.dataset.choice);
          optionButton.disabled = true;

          if (optionNumber === correctChoice) {
            optionButton.classList.add('correct-choice');
          } else if (optionNumber === selectedChoice) {
            optionButton.classList.add('wrong-choice');
          }
        });

        answerInput.value = String(selectedChoice);
        submitAnswer();
      });
    });
  } else {
    setMathDisplay(questionText, state.current.text);
  }

  questionText.classList.toggle(
    'small',
    !hasChoiceLayout && state.current.text.length > 34
  );
  questionText.classList.remove('pop');
  void questionText.offsetWidth;
  questionText.classList.add('pop');

  answerInput.value = '';
  answerInput.className = 'answer-input';
  feedback.textContent = '';
  feedback.className = 'feedback';

  hint.textContent = hasChoiceLayout
    ? 'Click the correct expression or equation. You can also press 1, 2, 3 or 4 on the keyboard.'
    : state.reviewMode
      ? 'Try the question again. It will be removed after two correct review attempts.'
      : state.current.requireImproperFraction
        ? 'Enter the answer as an improper fraction, for example 7/4. Do not enter a mixed number.'
        : state.current.answerType === 'time' || /\bHHMM\b/.test(state.current.text)
          ? 'Enter time as HHMM without a colon, for example 0730. 7:30 and 07:30 are also accepted.'
          : 'You may enter a whole number, negative number, decimal, fraction, or ratio.';

  streakBanner.textContent =
    !state.reviewMode && state.streak >= 3
      ? `🔥 ${state.streak}-answer streak!`
      : '';

  if (!hasChoiceLayout) {
    answerInput.focus();
  }

  updateStatus();
}

function submitAnswer() {
  if (
    !state.running
    || state.paused
    || state.locked
    || !state.current
  ) {
    return;
  }

  const raw = answerInput.value.trim();

  if (!raw) {
    feedback.textContent = 'Enter an answer first.';
    feedback.className = 'feedback bad';
    return;
  }

  state.locked = true;

  const correct = validateAnswer(raw, state.current);

  state.answered++;

  if (!state.reviewMode) {
    state.skillStats[state.current.skill].total++;
  }

  if (correct) {
    state.correct++;
    state.streak++;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.totalStars++;

    if (!state.reviewMode) {
      state.skillStats[state.current.skill].correct++;
    }

    const elapsed =
      (performance.now() - state.questionStartedAt) / 1000;
    const speedBonus = elapsed <= 5 ? 3 : 0;
    const streakBonus = state.streak >= 3 ? 3 : 0;

    state.score += 10 + speedBonus + streakBonus;

    answerInput.classList.add('correct');
    feedback.textContent = state.reviewMode
      ? 'Correct review!'
      : `Correct! Great Year ${state.year} thinking!`;
    feedback.className = 'feedback good';
    setMathDisplay(hint, state.current.hint);

    playSound('correct');

    if (state.reviewMode) {
      markReviewCorrect(state.current._reviewItem);
    }

    if ([3, 5, 8].includes(state.streak)) {
      launchConfetti(18);
    }
  } else {
    state.streak = 0;
    answerInput.classList.add('wrong');
    feedback.textContent =
      `Correct answer: ${displayCorrect(state.current)}`;
    feedback.className = 'feedback bad';
    setMathDisplay(hint, state.current.hint);

    playSound('wrong');

    if (state.reviewMode) {
      markReviewWrong(state.current._reviewItem, raw);
    } else {
      addMistake(state.current, raw);
    }
  }

  saveProgress();
  updateStatus();

  setTimeout(() => {
    if (!state.running || state.paused) return;

    if (state.reviewMode) {
      state.reviewIndex++;

      if (state.reviewIndex >= state.reviewQueue.length) {
        finishReview();
      } else {
        showQuestion();
      }
    } else {
      showQuestion();
    }
  }, correct ? 800 : 1250);
}

function timerTick() {
  if (!state.running || state.paused || state.reviewMode) return;

  state.remaining--;
  updateStatus();

  if (state.remaining <= 0) {
    finishGame();
  }
}

function clearProgressProfiles() {
  Object.keys(progressByYear).forEach(year => {
    delete progressByYear[year];
  });
}

function updateStudentIdentityUI() {
  studentNameDisplay.textContent = STUDENT_NAME || 'Student';
  practiceRecordStudentName.textContent = STUDENT_NAME || 'Student';
}

function showStudentIdentityOverlay() {
  studentNameInput.value = STUDENT_NAME
    || localStorage.getItem(LAST_STUDENT_NAME_KEY)
    || '';

  studentNameError.textContent = '';
  studentIdentityOverlay.classList.remove('hidden');

  window.setTimeout(() => {
    studentNameInput.focus();
    studentNameInput.select();
  }, 50);
}

function initialiseStudentSession(name) {
  const cleanedName = normaliseStudentName(name);

  if (cleanedName.length < 2) {
    studentNameError.textContent =
      'Please enter your real name using at least 2 characters.';
    studentNameInput.focus();
    return;
  }

  if (cleanedName.length > 40) {
    studentNameError.textContent =
      'Please use a name with no more than 40 characters.';
    studentNameInput.focus();
    return;
  }

  clearInterval(state.timerId);

  STUDENT_NAME = cleanedName;
  localStorage.setItem(LAST_STUDENT_NAME_KEY, STUDENT_NAME);
  updateStudentIdentityUI();

  state.running = false;
  state.paused = false;
  state.locked = false;
  state.reviewMode = false;
  state.current = null;
  state.year = Number(yearSelect.value);
  state.mode = 'mixed';
  state.level = levelSelect.value || 'core';
  state.roundMistakes = [];

  clearProgressProfiles();
  loadProgress();
  updateYearUI(true);
  resetSkillStats();

  state.remaining = Number(timeSelect.value);
  summary.style.display = 'none';
  reviewList.style.display = 'none';
  practiceRecords.style.display = 'none';
  testPanel.classList.remove('show');
  playArea.classList.remove('hidden');

  pauseBtn.classList.add('hidden');
  finishBtn.classList.add('hidden');
  answerInput.disabled = true;
  submitBtn.disabled = true;

  updatePracticeRecordCount();
  retryPendingPracticeUploads();
  updateStatus();

  studentIdentityOverlay.classList.add('hidden');
}

function loadPracticeRecords() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(getPracticeRecordsKey()) || '[]'
    );

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Could not load practice records.', error);
    return [];
  }
}

function createPracticeSessionId() {
  if (
    typeof crypto !== 'undefined'
    && typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadPendingCloudRecords() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(getPendingCloudRecordsKey()) || '[]'
    );

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Could not load pending cloud records.', error);
    return [];
  }
}

function savePendingCloudRecords(records) {
  try {
    localStorage.setItem(
      getPendingCloudRecordsKey(),
      JSON.stringify(records)
    );
    return true;
  } catch (error) {
    console.warn('Could not save the cloud upload queue.', error);
    return false;
  }
}

function buildCloudRecordPayload(record) {
  return {
    classToken: CLASS_TOKEN,
    student: record.student,
    completedAt: record.completedAt,
    year: record.year,
    skills: Array.isArray(record.skills)
      ? record.skills.join(', ')
      : String(record.skills || ''),
    difficulty: record.difficulty,
    durationMinutes: Math.round(
      Number(record.durationSeconds || 0) / 60
    ),
    answered: record.answered,
    correct: record.correct,
    accuracy: record.accuracy,
    score: record.score,
    bestStreak: record.bestStreak,
    sessionId: record.sessionId
  };
}

async function uploadPracticeRecordToCloud(record) {
  if (!navigator.onLine) {
    throw new Error('The browser is offline.');
  }

  await fetch(CLOUD_RECORD_URL, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(buildCloudRecordPayload(record))
  });
}

function queuePracticeRecordUpload(record) {
  const pending = loadPendingCloudRecords();
  const alreadyQueued = pending.some(
    item => item.sessionId === record.sessionId
  );

  if (!alreadyQueued) {
    pending.push(record);
    savePendingCloudRecords(pending);
  }

  retryPendingPracticeUploads();
}

let cloudUploadInProgress = false;

async function retryPendingPracticeUploads() {
  if (cloudUploadInProgress || !navigator.onLine) {
    return;
  }

  const pending = loadPendingCloudRecords();

  if (!pending.length) {
    return;
  }

  cloudUploadInProgress = true;
  const remaining = [...pending];

  try {
    while (remaining.length) {
      const record = remaining[0];

      await uploadPracticeRecordToCloud(record);
      remaining.shift();
      savePendingCloudRecords(remaining);
    }
  } catch (error) {
    console.warn(
      'Cloud upload is pending and will be retried later.',
      error
    );
  } finally {
    cloudUploadInProgress = false;
  }
}

function updatePracticeRecordCount() {
  practiceRecordCount.textContent = loadPracticeRecords().length;
}

function savePracticeRecord() {
  if (state.answered === 0) return false;

  const labels = currentLabels();
  const selectedSkills = getActiveSkills();
  const record = {
    sessionId: createPracticeSessionId(),
    student: STUDENT_NAME,
    completedAt: new Date().toISOString(),
    year: state.year,
    skills: selectedSkills.map(skill => labels[skill] || skill),
    difficulty: state.level,
    durationSeconds: state.duration,
    answered: state.answered,
    correct: state.correct,
    accuracy: getAccuracy(),
    score: state.score,
    bestStreak: state.bestStreak
  };

  const records = loadPracticeRecords();
  records.unshift(record);

  try {
    localStorage.setItem(
      getPracticeRecordsKey(),
      JSON.stringify(records.slice(0, MAX_PRACTICE_RECORDS))
    );
    updatePracticeRecordCount();
    queuePracticeRecordUpload(record);
    return true;
  } catch (error) {
    console.warn('Could not save the practice record.', error);
    return false;
  }
}

function renderPracticeRecords() {
  const records = loadPracticeRecords();

  if (!records.length) {
    practiceRecordTable.innerHTML = `
      <div class="review-empty">
        No practice records have been saved for ${escapeHtml(STUDENT_NAME)} yet.
      </div>
    `;
    return;
  }

  practiceRecordTable.innerHTML = records.map((record, index) => {
    const completed = new Date(record.completedAt);
    const dateText = Number.isNaN(completed.getTime())
      ? 'Unknown date'
      : completed.toLocaleString('en-NZ', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });
    const skills = Array.isArray(record.skills) && record.skills.length
      ? record.skills.join(', ')
      : 'Mixed skills';
    const minutes = Math.round(Number(record.durationSeconds || 0) / 60);

    return `
      <div class="review-row practice-record-row">
        <div>
          <b>${escapeHtml(dateText)}</b><br>
          Year ${escapeHtml(record.year)} · ${escapeHtml(record.difficulty)}<br>
          ${escapeHtml(skills)} · ${minutes} min
        </div>
        <div>
          <b>${escapeHtml(record.correct)}/${escapeHtml(record.answered)}</b><br>
          ${escapeHtml(record.accuracy)}% accuracy
        </div>
        <div>
          <b>${escapeHtml(record.score)} pts</b><br>
          Best streak: ${escapeHtml(record.bestStreak)}
        </div>
        <button
          class="record-delete-btn"
          type="button"
          data-delete-record="${index}"
          aria-label="Delete practice record from ${escapeHtml(dateText)}"
        >
          Delete
        </button>
      </div>
    `;
  }).join('');
}

function deletePracticeRecord(index) {
  const records = loadPracticeRecords();

  if (!Number.isInteger(index) || index < 0 || index >= records.length) {
    return;
  }

  const record = records[index];
  const completed = new Date(record.completedAt);
  const dateText = Number.isNaN(completed.getTime())
    ? 'this practice record'
    : completed.toLocaleString('en-NZ', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });

  if (!confirm(`Delete ${STUDENT_NAME}'s practice record from ${dateText}?`)) {
    return;
  }

  records.splice(index, 1);

  try {
    localStorage.setItem(
      getPracticeRecordsKey(),
      JSON.stringify(records)
    );
    updatePracticeRecordCount();
    renderPracticeRecords();
  } catch (error) {
    console.warn('Could not delete the practice record.', error);
  }
}

function togglePracticeRecords() {
  const willOpen = practiceRecords.style.display !== 'block';
  practiceRecords.style.display = willOpen ? 'block' : 'none';

  if (willOpen) {
    renderPracticeRecords();
    practiceRecords.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

function clearPracticeRecords() {
  const records = loadPracticeRecords();
  if (!records.length) return;

  if (confirm(`Clear all practice records for ${STUDENT_NAME}?`)) {
    localStorage.removeItem(getPracticeRecordsKey());
    updatePracticeRecordCount();
    renderPracticeRecords();
  }
}

function startGame() {
  clearInterval(state.timerId);

  syncSelectedSkillsFromUI();

  if (getActiveSkills().length === 0) {
    skillPicker.open = true;
    updateSkillSelectionUI();
    return;
  }

  state.level = levelSelect.value;
  state.duration = Number(timeSelect.value);
  state.remaining = state.duration;
  state.heroKey = heroSelect.value;
  state.running = true;
  state.paused = false;
  state.locked = false;
  state.reviewMode = false;
  state.score = 0;
  state.correct = 0;
  state.answered = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.missionRewarded = false;
  state.roundMistakes = [];
  clearRecentQuestions();
  testPanel.classList.remove('show');

  resetSkillStats();

  state.mission = createMission();
  missionText.textContent = state.mission.text;
  summary.style.display = 'none';
  reviewList.style.display = 'none';
  practiceRecords.style.display = 'none';
  playArea.classList.remove('hidden');
  summaryTitle.textContent = `Year ${state.year} Warm-up Complete!`;
  pauseBtn.textContent = 'Pause';

  setControlsForGame(true);
  updateStatus();
  showQuestion();

  state.timerId = setInterval(timerTick, 1000);
  saveProgress();
}

function togglePause() {
  if (!state.running || state.reviewMode) return;

  state.paused = !state.paused;
  pauseBtn.textContent = state.paused ? 'Resume' : 'Pause';
  setControlsForGame(true);

  if (state.paused) {
    questionText.textContent = 'Paused';
    modeBadge.textContent = 'Take a breath';
    feedback.textContent = '';
    hint.textContent = 'Press Resume when ready.';
  } else {
    showQuestion();
  }
}

function weakestArea() {
  const entries = Object.entries(state.skillStats)
    .filter(([, values]) => values.total > 0)
    .map(([skill, values]) => ({
      skill,
      accuracy: Math.round(
        (values.correct / values.total) * 100
      ),
      total: values.total
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  return entries[0] || null;
}

function getStarRating() {
  const accuracy = getAccuracy();

  if (state.year === 4) {
    if (state.correct >= 20 && accuracy >= 90) return 3;
    if (state.correct >= 12 && accuracy >= 75) return 2;
    return 1;
  }

  if (state.year === 5) {
    if (state.correct >= 16 && accuracy >= 85) return 3;
    if (state.correct >= 10 && accuracy >= 70) return 2;
    return 1;
  }

  if (state.year === 6) {
    const thresholds = state.duration === 60
      ? { three: 5, two: 3 }
      : state.duration === 180
        ? { three: 11, two: 7 }
        : { three: 18, two: 11 };

    if (state.correct >= thresholds.three && accuracy >= 85) return 3;
    if (state.correct >= thresholds.two && accuracy >= 70) return 2;
    return 1;
  }

  if (state.correct >= 18 && accuracy >= 90) return 3;
  if (state.correct >= 10 && accuracy >= 75) return 2;
  return 1;
}

function buildBadges() {
  const output = [];

  if (state.correct >= 10) output.push('⚡ Rapid Thinker');
  if (state.bestStreak >= 5) output.push('🔥 Hot Streak');

  if (getAccuracy() >= 90 && state.answered >= 8) {
    output.push('🎯 Accuracy Star');
  }

  if (state.roundMistakes.length === 0 && state.answered >= 5) {
    output.push('💎 Clean Round');
  }

  if (missionComplete()) {
    output.push('🏆 Mission Complete');
  }

  return output;
}

function finishGame() {
  if (!state.running || state.reviewMode) return;

  clearInterval(state.timerId);
  state.running = false;
  state.paused = false;
  state.remaining = Math.max(0, state.remaining);

  setControlsForGame(false);
  playArea.classList.add('hidden');
  summary.style.display = 'block';

  if (missionComplete() && !state.missionRewarded) {
    state.totalStars += 5;
    state.missionRewarded = true;
  }

  if (state.score > state.bestScore) {
    state.bestScore = state.score;
  }

  const stars = getStarRating();
  const weak = weakestArea();

  summaryTitle.textContent = `Year ${state.year} Warm-up Complete!`;
  summaryStars.textContent =
    '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  summaryScore.textContent = `${state.score} points`;
  endCorrect.textContent = state.correct;
  endAnswered.textContent = state.answered;
  endAccuracy.textContent = `${getAccuracy()}%`;
  endStreak.textContent = state.bestStreak;

  summaryFocus.textContent = weak
    ? `Next focus: ${currentLabels()[weak.skill]} — ${weak.accuracy}% accuracy in this session.`
    : 'Complete more questions to receive a focus recommendation.';

  const earnedBadges = buildBadges();

  badges.innerHTML = (
    earnedBadges.length
      ? earnedBadges
      : ['🌱 Keep Growing']
  )
    .map(text => `<span class="badge">${text}</span>`)
    .join('');

  summaryMessage.textContent =
    `${state.roundMistakes.length} mistake${state.roundMistakes.length === 1 ? '' : 's'} saved from this round. `
    + (
      missionComplete()
        ? 'Mission complete — 5 bonus stars earned!'
        : 'Try again to complete the mission.'
    );

  reviewRoundBtn.disabled = state.roundMistakes.length === 0;

  if (savePracticeRecord()) {
    summaryMessage.textContent +=
      " Result saved locally and sent to your teacher.";
  }

  saveProgress();
  updateStatus();
  launchConfetti(stars === 3 ? 48 : 28);
  playSound('finish');
}

function startReview(items, source) {
  if (!items.length) {
    showReward('No mistakes are available to review.');
    return;
  }

  clearInterval(state.timerId);

  state.reviewMode = true;
  state.reviewSource = source;
  state.reviewQueue = items.map(
    item => JSON.parse(JSON.stringify(item))
  );
  state.reviewIndex = 0;
  state.running = true;
  state.paused = false;
  state.locked = false;
  state.score = 0;
  state.correct = 0;
  state.answered = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.roundMistakes = [];

  summary.style.display = 'none';
  reviewList.style.display = 'none';
  practiceRecords.style.display = 'none';
  playArea.classList.remove('hidden');
  missionText.textContent =
    'Master each mistake twice to remove it from the bank.';

  setControlsForGame(true);
  showQuestion();
}

function finishReview() {
  state.running = false;
  state.reviewMode = false;

  setControlsForGame(false);
  playArea.classList.add('hidden');
  summary.style.display = 'block';

  summaryTitle.textContent =
    `Year ${state.year} Mistake Review Complete!`;
  summaryStars.textContent =
    state.correct === state.answered && state.answered
      ? '⭐⭐⭐'
      : '⭐⭐☆';
  summaryScore.textContent =
    `${state.correct}/${state.answered} reviewed correctly`;
  endCorrect.textContent = state.correct;
  endAnswered.textContent = state.answered;
  endAccuracy.textContent = `${getAccuracy()}%`;
  endStreak.textContent = state.bestStreak;
  summaryFocus.textContent =
    `${state.mistakeBank.length} Year ${state.year} saved mistake${state.mistakeBank.length === 1 ? ' remains' : 's remain'} to master.`;
  badges.innerHTML =
    '<span class="badge">🧠 Mistake Detective</span>';
  summaryMessage.textContent =
    'A saved question is removed after two correct review attempts.';
  reviewRoundBtn.disabled = true;

  saveProgress();
  updateStatus();
  launchConfetti(24);
  playSound('finish');
}

function renderMistakeListIfOpen() {
  if (reviewList.style.display !== 'block') return;
  renderMistakeList();
}

function renderMistakeList() {
  if (!state.mistakeBank.length) {
    reviewTable.innerHTML =
      `<div class="review-empty">No saved Year ${state.year} mistakes. Great work!</div>`;
    return;
  }

  reviewTable.innerHTML = state.mistakeBank
    .map((mistake, index) => {
      const label =
        currentLabels()[mistake.q.skill] || mistake.q.skill;

      return `
        <div class="review-row">
          <div>
            <b>${index + 1}. ${escapeHtml(label)}</b><br>
            ${formatMathHtml(mistake.q.text)}
          </div>
          <div>
            <b>Your last answer</b><br>
            ${escapeHtml(mistake.lastAnswer || '—')}
          </div>
          <div>
            <b>Correct / Mastery</b><br>
            ${escapeHtml(displayCorrect(mistake.q))}
            · ${mistake.mastery || 0}/2
          </div>
        </div>
      `;
    })
    .join('');
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[character]
  );
}

function formatMathHtml(value) {
  return escapeHtml(cleanDisplayNumbers(value)).replace(
    /\^(-?\d+|\?)/g,
    '<sup>$1</sup>'
  );
}

function setMathDisplay(element, value) {
  element.innerHTML = `<span class="math-expression">${formatMathHtml(value)}</span>`;
}

function toggleMistakeList() {
  reviewList.style.display =
    reviewList.style.display === 'block'
      ? 'none'
      : 'block';

  if (reviewList.style.display === 'block') {
    renderMistakeList();
    reviewList.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

function clearMistakes() {
  if (!state.mistakeBank.length) return;

  if (
    confirm(
      `Clear all saved Year ${state.year} mistakes?`
    )
  ) {
    state.mistakeBank = [];
    saveProgress();
    updateMistakeCounts();
    renderMistakeList();
  }
}

function appendKey(key) {
  if (!state.running || state.paused || state.locked) return;
  if (answerInput.value.length >= 18) return;

  answerInput.value += key;
  answerInput.focus();
}

keypadButtons.forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.key;
    const action = button.dataset.action;

    if (key !== undefined) {
      appendKey(key);
    } else if (action === 'clear') {
      answerInput.value = '';
      answerInput.focus();
    } else if (action === 'back') {
      answerInput.value = answerInput.value.slice(0, -1);
      answerInput.focus();
    } else if (action === 'enter') {
      submitAnswer();
    }
  });
});

answerInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitAnswer();
  }
});

submitBtn.addEventListener('click', submitAnswer);
startBtn.addEventListener('click', startGame);
continueStudentBtn.addEventListener('click', () => {
  initialiseStudentSession(studentNameInput.value);
});

studentNameInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    initialiseStudentSession(studentNameInput.value);
  }
});

studentNameInput.addEventListener('input', () => {
  studentNameError.textContent = '';
});

changeStudentBtn.addEventListener('click', () => {
  if (state.running) {
    alert('Finish the current warm-up before changing student.');
    return;
  }

  showStudentIdentityOverlay();
});

pauseBtn.addEventListener('click', togglePause);

finishBtn.addEventListener('click', () => {
  if (state.reviewMode) {
    finishReview();
  } else {
    finishGame();
  }
});

playAgainBtn.addEventListener('click', startGame);

reviewSavedBtn.addEventListener('click', () => {
  startReview(state.mistakeBank, 'saved');
});

testQuestionsBtn.addEventListener('click', runQuestionTest);

closeTestBtn.addEventListener('click', () => {
  testPanel.classList.remove('show');
});

practiceRecordTable.addEventListener('click', event => {
  const deleteButton = event.target.closest('[data-delete-record]');
  if (!deleteButton) return;

  deletePracticeRecord(Number(deleteButton.dataset.deleteRecord));
});

viewRecordsBtn.addEventListener('click', togglePracticeRecords);
clearPracticeRecordsBtn.addEventListener('click', clearPracticeRecords);
closePracticeRecordsBtn.addEventListener('click', () => {
  practiceRecords.style.display = 'none';
});

reviewBankBtn.addEventListener('click', () => {
  startReview(state.mistakeBank, 'saved');
});

reviewRoundBtn.addEventListener('click', () => {
  startReview(state.roundMistakes, 'round');
});

showMistakesBtn.addEventListener('click', toggleMistakeList);

closeMistakesBtn.addEventListener('click', () => {
  reviewList.style.display = 'none';
});

clearMistakesBtn.addEventListener('click', clearMistakes);

timeSelect.addEventListener('change', () => {
  state.remaining = Number(timeSelect.value);
  timerValue.textContent = formatTime(state.remaining);
  updateStartButton();
});

heroSelect.addEventListener('change', () => {
  state.heroKey = heroSelect.value;
  saveProgress();
  updateHero();
});

yearSelect.addEventListener('change', () => {
  if (state.running) return;

  saveProgress();

  state.year = Number(yearSelect.value);
  state.mode = 'mixed';
  state.selectedSkills = [];
  state.level = 'core';
  clearRecentQuestions();
  testPanel.classList.remove('show');

  applyYearProgress(state.year);
  updateYearUI(true);
  resetSkillStats();

  summary.style.display = 'none';
  reviewList.style.display = 'none';
  practiceRecords.style.display = 'none';
  playArea.classList.remove('hidden');
  state.remaining = Number(timeSelect.value);

  updateStatus();
});

skillCheckboxes.addEventListener('change', event => {
  if (!event.target.matches('input[type="checkbox"]')) return;
  syncSelectedSkillsFromUI();
});

selectAllSkillsBtn.addEventListener('click', () => {
  setSelectedSkills([...currentConfig().skills]);
  skillPicker.open = false;
});

clearSkillsBtn.addEventListener('click', () => {
  setSelectedSkills([]);
});

doneSkillsBtn.addEventListener('click', () => {
  if (getActiveSkills().length > 0) {
    skillPicker.open = false;
  }
});

document.addEventListener('click', event => {
  if (skillPicker.open && !skillPicker.contains(event.target)) {
    skillPicker.open = false;
  }
});

levelSelect.addEventListener('change', () => {
  state.level = levelSelect.value;
  clearRecentQuestions();
  testPanel.classList.remove('show');
});

soundBtn.addEventListener('click', () => {
  state.soundOn = !state.soundOn;
  soundBtn.textContent = state.soundOn
    ? '🔊 Sound On'
    : '🔇 Sound Off';
  soundBtn.setAttribute(
    'aria-pressed',
    String(state.soundOn)
  );

  if (state.soundOn) {
    playSound('correct');
  }
});

state.year = Number(yearSelect.value);
state.remaining = Number(timeSelect.value);

studentNameInput.value =
  localStorage.getItem(LAST_STUDENT_NAME_KEY) || '';

window.addEventListener('online', retryPendingPracticeUploads);
showStudentIdentityOverlay();
