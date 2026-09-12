// Focus Screen & Pomodoro Controller for Mellow
// STRICTLY ZERO EMOJIS - Low sensory pressure, ambient sound integration.

const FocusSession = {
  activeTaskId: null,
  activeTaskTitle: 'Deep breathing & reading',
  durationMinutes: 25,
  secondsRemaining: 25 * 60,
  secondsElapsed: 0,
  timerInterval: null,
  isOpenEnded: false,
  isPaused: false,
  isRunning: false,
  isBreakMode: false,

  modes: {
    tiny: { label: 'Tiny', min: 10, open: false },
    short: { label: 'Short', min: 15, open: false },
    classic: { label: 'Classic', min: 25, open: false },
    deep: { label: 'Deep', min: 45, open: false },
    open: { label: 'Open', min: 0, open: true }
  },
  currentModeKey: 'classic',

  init() {
    this.updateDisplay();
    this.setupModesUI();
  },

  setupModesUI() {
    const chips = document.querySelectorAll('.focus-mode-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const mode = chip.getAttribute('data-mode');
        this.selectMode(mode);
      });
    });
  },

  selectMode(modeKey) {
    if (this.isRunning) return;
    this.currentModeKey = modeKey;
    const config = this.modes[modeKey];
    this.isOpenEnded = config.open;
    this.durationMinutes = config.min;
    this.secondsRemaining = config.min * 60;
    this.secondsElapsed = 0;

    document.querySelectorAll('.focus-mode-chip').forEach(c => {
      if (c.getAttribute('data-mode') === modeKey) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });

    this.updateDisplay();
  },

  loadTask(task) {
    this.activeTaskId = task.id;
    const nextSub = TaskManager.getNextSubtask(task);
    this.activeTaskTitle = nextSub ? `${task.title} — ${nextSub.text}` : task.title;
    this.updateDisplay();
  },

  startWithTask(taskId) {
    const task = TaskManager.tasks.find(t => t.id === taskId);
    if (task) {
      this.loadTask(task);
    }
    App.switchScreen('focus');
    this.startTimer();
  },

  startTimer() {
    if (this.isRunning && !this.isPaused) return;

    this.isRunning = true;
    this.isPaused = false;

    const focusViewCat = document.getElementById('focus-cat-display');
    if (focusViewCat) {
      focusViewCat.innerHTML = MellowCat.render('focused', 88);
    }

    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (!this.isOpenEnded) {
        if (this.secondsRemaining > 0) {
          this.secondsRemaining--;
          this.updateDisplay();
        } else {
          this.finishTimer();
        }
      } else {
        this.secondsElapsed++;
        this.updateDisplay();
      }
    }, 1000);

    this.updateControlsUI();
  },

  pauseTimer() {
    if (!this.isRunning) return;
    this.isPaused = true;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    const focusViewCat = document.getElementById('focus-cat-display');
    if (focusViewCat) {
      focusViewCat.innerHTML = MellowCat.render('calm', 88);
    }
    this.updateControlsUI();
  },

  resumeTimer() {
    this.startTimer();
  },

  stopTimer(promptUser = true) {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isRunning = false;
    this.isPaused = false;
    this.isBreakMode = false;
    this.selectMode(this.currentModeKey);

    const focusViewCat = document.getElementById('focus-cat-display');
    if (focusViewCat) {
      focusViewCat.innerHTML = MellowCat.render('calm', 88);
    }

    this.updateControlsUI();
    this.updateDisplay();
  },

  finishTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isRunning = false;

    // Gentle soft bell chime via Web Audio (no harsh buzzer!)
    this.playGentleChime();

    // Occasional Little Win / collectible
    MellowCat.maybeUnlockCollectible('focus_completed');

    this.showSessionCompleteModal();
  },

  playGentleChime() {
    try {
      FocusAudio.initContext();
      const ctx = FocusAudio.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // Solfeggio 528Hz calm tone
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.6);
    } catch (e) {}
  },

  showSessionCompleteModal() {
    const modal = document.getElementById('session-complete-modal');
    if (!modal) return;
    const body = modal.querySelector('.session-complete-body');
    body.innerHTML = `
      <div class="complete-cat-card">
        <span class="mellow-complete-avatar">${MellowCat.render('proud', 68)}</span>
        <h3 class="complete-title">Nice work.</h3>
        <p class="complete-sub">You gave gentle attention to what mattered.</p>
      </div>
      <div class="complete-options-list">
        <button class="primary-pill-btn" onclick="FocusSession.startBreak(5)">
          Take a 5-min break
        </button>
        <button class="secondary-pill-btn" onclick="FocusSession.resumeMoreFocus()">
          Keep going for 15 mins
        </button>
        <button class="subtle-text-btn" onclick="FocusSession.closeCompleteModal()">
          Done for now
        </button>
      </div>
    `;
    modal.classList.add('active');
  },

  closeCompleteModal() {
    const modal = document.getElementById('session-complete-modal');
    if (modal) modal.classList.remove('active');
    this.stopTimer(false);
  },

  startBreak(minutes = 5) {
    this.closeCompleteModal();
    this.isBreakMode = true;
    this.activeTaskTitle = 'Gentle Rest & Water Pause';
    this.secondsRemaining = minutes * 60;
    this.isOpenEnded = false;
    this.startTimer();
    App.setNotificationMessage("Taking a peaceful pause. No rush.");
  },

  resumeMoreFocus() {
    this.closeCompleteModal();
    this.secondsRemaining = 15 * 60;
    this.isOpenEnded = false;
    this.startTimer();
  },

  updateDisplay() {
    const timerElem = document.getElementById('focus-timer-text');
    const taskTitleElem = document.getElementById('focus-current-task-title');
    const timerSub = document.getElementById('focus-timer-sub');

    if (taskTitleElem) {
      taskTitleElem.textContent = this.activeTaskTitle || 'Choose or type a quiet task';
    }

    let timeString = '00:00';
    if (!this.isOpenEnded) {
      const mins = Math.floor(this.secondsRemaining / 60);
      const secs = this.secondsRemaining % 60;
      timeString = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      if (timerSub) timerSub.textContent = this.isBreakMode ? 'rest remaining' : 'remaining gently';
    } else {
      const mins = Math.floor(this.secondsElapsed / 60);
      const secs = this.secondsElapsed % 60;
      timeString = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      if (timerSub) timerSub.textContent = 'open focus time';
    }

    if (timerElem) {
      timerElem.textContent = timeString;
    }
  },

  updateControlsUI() {
    const playBtn = document.getElementById('focus-play-btn');
    const stopBtn = document.getElementById('focus-stop-btn');

    if (playBtn) {
      if (!this.isRunning || this.isPaused) {
        playBtn.innerHTML = `${Icons.play} <span>${this.isPaused ? 'Resume' : 'Start'}</span>`;
      } else {
        playBtn.innerHTML = `${Icons.pause} <span>Pause</span>`;
      }
    }
    if (stopBtn) {
      stopBtn.style.display = this.isRunning || this.isPaused ? 'inline-flex' : 'none';
    }
  },

  toggleTimerPlay() {
    if (!this.isRunning) {
      this.startTimer();
    } else if (this.isPaused) {
      this.resumeTimer();
    } else {
      this.pauseTimer();
    }
  },

  openTaskSelector() {
    const modal = document.getElementById('task-picker-modal');
    if (!modal) return;
    const body = modal.querySelector('.task-picker-body');
    const activeTasks = TaskManager.tasks.filter(t => !t.completed);

    body.innerHTML = `
      <div class="task-picker-list">
        <span class="subtle-label">Select a planned task:</span>
        ${activeTasks.length === 0 ? `
          <p class="subtle-note">No tasks in your plan. You can type one below.</p>
        ` : activeTasks.map(t => `
          <button class="task-picker-item" onclick="FocusSession.pickTask('${t.id}')">
            <span class="task-picker-name">${t.title}</span>
            <span class="task-picker-arrow">${Icons.arrowRight}</span>
          </button>
        `).join('')}
      </div>
      <div class="custom-focus-entry">
        <span class="subtle-label">Or work on something quick:</span>
        <div class="custom-focus-row">
          <input type="text" id="quick-focus-input" placeholder="e.g. Sketching on paper..." class="mellow-input" onkeydown="if(event.key==='Enter') FocusSession.pickCustom()">
          <button class="primary-pill-btn" onclick="FocusSession.pickCustom()">Set</button>
        </div>
      </div>
    `;
    modal.classList.add('active');
  },

  pickTask(taskId) {
    const task = TaskManager.tasks.find(t => t.id === taskId);
    if (task) {
      this.loadTask(task);
    }
    this.closeTaskSelector();
  },

  pickCustom() {
    const input = document.getElementById('quick-focus-input');
    if (input && input.value.trim()) {
      this.activeTaskId = null;
      this.activeTaskTitle = input.value.trim();
      this.updateDisplay();
    }
    this.closeTaskSelector();
  },

  closeTaskSelector() {
    const modal = document.getElementById('task-picker-modal');
    if (modal) modal.classList.remove('active');
  }
};
