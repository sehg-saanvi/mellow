// Reset Screen Controller for Mellow
// Somatic regulation, breathing, gentle mental offloading, and comfort cards.
// STRICTLY ZERO EMOJIS - Clean vectors, calm pacing.

const ResetTools = {
  currentTab: 'breathe', // 'breathe', 'dump', 'move', 'comfort', 'timer'
  breathPhase: 'inhale',
  breathTimer: null,
  twoMinInterval: null,
  twoMinSeconds: 120,

  comfortCards: [
    {
      title: "Allowed to go slowly",
      text: "You don't have to finish everything today. A slow, steady step is still movement forward.",
      author: "Mellow"
    },
    {
      title: "Rest isn't falling behind",
      text: "Rest is maintenance for your brain. You don't have to earn the right to pause.",
      author: "Mellow"
    },
    {
      title: "Starting badly counts",
      text: "A messy draft, an incomplete sketch, or opening a single page is infinitely better than zero.",
      author: "Mellow"
    },
    {
      title: "One tiny thing",
      text: "When everything feels overwhelming, shrink your world down to just the very next action.",
      author: "Mellow"
    },
    {
      title: "Drop your shoulders",
      text: "Notice your jaw, your forehead, and your shoulders right now. Let them soften.",
      author: "Mellow"
    }
  ],
  comfortCardIndex: 0,

  movePrompts: [
    {
      title: "Shoulder Release",
      duration: "30 seconds",
      instructions: "Inhale and lift your shoulders up toward your ears. Hold for 3 seconds. Exhale deeply and drop them down completely."
    },
    {
      title: "Neck Rolls",
      duration: "45 seconds",
      instructions: "Gently lower your right ear toward your right shoulder. Hold for three breaths, then roll slowly over to the left."
    },
    {
      title: "Wrist & Finger Waves",
      duration: "30 seconds",
      instructions: "Interlace your fingers and make gentle figure-eight waves with your wrists. Shake out your hands softly."
    },
    {
      title: "Window Gaze",
      duration: "60 seconds",
      instructions: "Look away from the screen. Find the farthest point outside or across the room and let your eyes relax their focus."
    }
  ],

  init() {
    this.setupTabs();
    this.renderComfortCard();
    this.renderMovePrompts();
    this.loadBrainDump();
  },

  setupTabs() {
    document.querySelectorAll('.reset-tool-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tool = tab.getAttribute('data-tool');
        this.selectTool(tool);
      });
    });
  },

  selectTool(toolName) {
    this.currentTab = toolName;
    document.querySelectorAll('.reset-tool-tab').forEach(t => {
      if (t.getAttribute('data-tool') === toolName) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    document.querySelectorAll('.reset-tool-panel').forEach(panel => {
      if (panel.id === `reset-panel-${toolName}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    if (toolName === 'breathe') {
      this.startBreathing();
    } else {
      this.stopBreathing();
    }
  },

  // Box Breathing cycle (4s Inhale, 4s Hold, 4s Exhale, 4s Rest)
  startBreathing() {
    const circle = document.getElementById('breathing-visual-circle');
    const label = document.getElementById('breathing-phase-label');
    if (!circle || !label) return;

    if (this.breathTimer) clearInterval(this.breathTimer);

    const phases = [
      { name: 'Inhale gently', cls: 'inhale', duration: 4000 },
      { name: 'Hold soft', cls: 'hold-in', duration: 4000 },
      { name: 'Exhale slowly', cls: 'exhale', duration: 4000 },
      { name: 'Rest quiet', cls: 'hold-out', duration: 4000 }
    ];

    let currentPhaseIdx = 0;
    const updatePhase = () => {
      const phase = phases[currentPhaseIdx];
      label.textContent = phase.name;
      circle.className = `breathing-circle ${phase.cls}`;
      currentPhaseIdx = (currentPhaseIdx + 1) % phases.length;
    };

    updatePhase();
    this.breathTimer = setInterval(updatePhase, 4000);
  },

  stopBreathing() {
    if (this.breathTimer) {
      clearInterval(this.breathTimer);
      this.breathTimer = null;
    }
  },

  // 2-Minute Reset
  startTwoMinReset() {
    const timerElem = document.getElementById('two-min-countdown');
    const promptElem = document.getElementById('two-min-prompt-text');
    const btn = document.getElementById('two-min-start-btn');
    if (!timerElem) return;

    if (this.twoMinInterval) {
      clearInterval(this.twoMinInterval);
      this.twoMinInterval = null;
      btn.textContent = 'Start 2-min reset';
      return;
    }

    this.twoMinSeconds = 120;
    btn.textContent = 'Pause reset';

    const prompts = [
      "Let your hands rest comfortably in your lap.",
      "Unclench your jaw and release your tongue from the roof of your mouth.",
      "Feel the physical surface supporting your body.",
      "You are safe in this quiet moment. There is nowhere else you need to be.",
      "Inhale peace, exhale tension."
    ];

    this.twoMinInterval = setInterval(() => {
      if (this.twoMinSeconds > 0) {
        this.twoMinSeconds--;
        const m = Math.floor(this.twoMinSeconds / 60);
        const s = this.twoMinSeconds % 60;
        timerElem.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

        // Change prompt every 24s
        const promptIdx = Math.floor((120 - this.twoMinSeconds) / 24);
        if (promptElem && prompts[promptIdx]) {
          promptElem.textContent = prompts[promptIdx];
        }
      } else {
        clearInterval(this.twoMinInterval);
        this.twoMinInterval = null;
        timerElem.textContent = '02:00';
        btn.textContent = 'Reset again';
        if (promptElem) promptElem.textContent = "Welcome back. Move as slowly as you like.";
        FocusSession.playGentleChime();
      }
    }, 1000);
  },

  // Brain Dump (Scoped per account)
  getStorageKey(email) {
    if (typeof AuthManager !== 'undefined' && AuthManager.getUserStorageKey) {
      return AuthManager.getUserStorageKey('mellow_braindump', email);
    }
    return 'mellow_braindump';
  },

  loadForAccount(email, isNewSignUp) {
    const textarea = document.getElementById('braindump-textarea');
    if (!textarea) return;
    const key = this.getStorageKey(email);
    if (isNewSignUp) {
      textarea.value = '';
      this.saveBrainDump(email);
    } else {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        textarea.value = saved;
      } else {
        const legacy = localStorage.getItem('mellow_braindump');
        textarea.value = legacy || '';
        this.saveBrainDump(email);
      }
    }
  },

  resetToEmpty() {
    const textarea = document.getElementById('braindump-textarea');
    if (textarea) textarea.value = '';
  },

  loadBrainDump() {
    const email = typeof AuthManager !== 'undefined' && AuthManager.currentUser ? AuthManager.currentUser.email : null;
    this.loadForAccount(email, false);
  },

  saveBrainDump(optionalEmail) {
    const textarea = document.getElementById('braindump-textarea');
    if (!textarea) return;
    const email = optionalEmail || (typeof AuthManager !== 'undefined' && AuthManager.currentUser ? AuthManager.currentUser.email : null);
    const key = this.getStorageKey(email);
    try {
      localStorage.setItem(key, textarea.value);
    } catch (e) {}
  },

  clearBrainDump() {
    const textarea = document.getElementById('braindump-textarea');
    if (!textarea) return;
    textarea.value = '';
    this.saveBrainDump();
    App.setNotificationMessage("Mental space cleared.");
  },

  turnBrainDumpIntoTask() {
    const textarea = document.getElementById('braindump-textarea');
    if (!textarea || !textarea.value.trim()) return;
    const lines = textarea.value.trim().split('\n').filter(l => l.trim().length > 0);
    if (lines.length > 0) {
      const firstTask = lines[0].replace(/^[-*•\d.]+\s*/, '');
      TaskManager.addTask(firstTask, 'nice');
      App.setNotificationMessage(`Added "${firstTask}" to your Plan.`);
    }
  },

  // Comfort Cards Deck
  renderComfortCard() {
    const container = document.getElementById('comfort-card-display');
    if (!container) return;
    const card = this.comfortCards[this.comfortCardIndex];

    container.innerHTML = `
      <div class="comfort-card-inner">
        <div class="comfort-card-header">
          <span class="comfort-glyph">${Icons.heart}</span>
          <span class="comfort-author-badge">Gentle reminder</span>
        </div>
        <h3 class="comfort-title">${card.title}</h3>
        <p class="comfort-body">${card.text}</p>
        <div class="comfort-cat-tag">
          <span class="cat-tag-avatar">${MellowCat.render('cozy', 38)}</span>
          <span class="cat-tag-name">From Mellow</span>
        </div>
      </div>
    `;
  },

  nextComfortCard() {
    this.comfortCardIndex = (this.comfortCardIndex + 1) % this.comfortCards.length;
    this.renderComfortCard();
  },

  prevComfortCard() {
    this.comfortCardIndex = (this.comfortCardIndex - 1 + this.comfortCards.length) % this.comfortCards.length;
    this.renderComfortCard();
  },

  renderMovePrompts() {
    const container = document.getElementById('move-prompts-list');
    if (!container) return;
    container.innerHTML = this.movePrompts.map(p => `
      <div class="move-prompt-card">
        <div class="move-card-top">
          <span class="move-title">${p.title}</span>
          <span class="move-duration">${p.duration}</span>
        </div>
        <p class="move-desc">${p.instructions}</p>
      </div>
    `).join('');
  }
};
