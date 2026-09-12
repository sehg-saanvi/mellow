// Task Management, "Right Now", "Break It Down", and "Park It" Engine
// STRICTLY ZERO EMOJIS - Clean vectors, calm language, and compassionate neurodivergent UX.

const TaskManager = {
  tasks: [],
  parkedThoughts: [],
  selectedTaskIdForBreakdown: null,

  defaultTasks: [
    {
      id: 'task-1',
      title: 'Finish Physics Question 1',
      date: new Date().toISOString().split('T')[0],
      bucket: 'must', // 'must', 'nice', 'energy'
      completed: false,
      isRightNow: true,
      subtasks: [
        { id: 'sub-1', text: 'Open notebook to page 42', completed: false, isNext: true },
        { id: 'sub-2', text: 'Write down known variables', completed: false, isNext: false },
        { id: 'sub-3', text: 'Draw free body diagram', completed: false, isNext: false }
      ]
    },
    {
      id: 'task-2',
      title: 'Water the kitchen mint plant',
      date: new Date().toISOString().split('T')[0],
      bucket: 'nice',
      completed: false,
      isRightNow: false,
      subtasks: []
    },
    {
      id: 'task-3',
      title: 'Read three pages of essay source',
      date: new Date().toISOString().split('T')[0],
      bucket: 'energy',
      completed: false,
      isRightNow: false,
      subtasks: []
    }
  ],

  defaultParked: [
    { id: 'park-1', text: 'Check if library book is due this Friday', createdAt: '10 mins ago' },
    { id: 'park-2', text: 'Pick up herbal tea bags on the walk home', createdAt: '1 hour ago' }
  ],

  init() {
    try {
      const savedTasks = localStorage.getItem('mellow_tasks');
      this.tasks = savedTasks ? JSON.parse(savedTasks) : this.defaultTasks;

      const savedParked = localStorage.getItem('mellow_parked');
      this.parkedThoughts = savedParked ? JSON.parse(savedParked) : this.defaultParked;
    } catch (e) {
      this.tasks = this.defaultTasks;
      this.parkedThoughts = this.defaultParked;
    }
  },

  save() {
    try {
      localStorage.setItem('mellow_tasks', JSON.stringify(this.tasks));
      localStorage.setItem('mellow_parked', JSON.stringify(this.parkedThoughts));
    } catch (e) {}
  },

  getRightNowTask() {
    // 1. Explicitly set as Right Now
    let rightNow = this.tasks.find(t => t.isRightNow && !t.completed);
    if (!rightNow) {
      // 2. Or first incomplete 'must' task
      rightNow = this.tasks.find(t => t.bucket === 'must' && !t.completed);
    }
    if (!rightNow) {
      // 3. Any incomplete task
      rightNow = this.tasks.find(t => !t.completed);
    }
    return rightNow || null;
  },

  getNextSubtask(task) {
    if (!task || !task.subtasks || task.subtasks.length === 0) return null;
    return task.subtasks.find(s => !s.completed) || null;
  },

  addTask(title, bucket = 'must', date = null) {
    if (!title || !title.trim()) return;
    const newTask = {
      id: 'task-' + Date.now(),
      title: title.trim(),
      date: date || new Date().toISOString().split('T')[0],
      bucket: bucket, // 'must', 'nice', 'energy'
      completed: false,
      isRightNow: this.tasks.filter(t => !t.completed).length === 0,
      subtasks: []
    };
    this.tasks.unshift(newTask);
    this.save();
    MellowCat.render('happy');
    this.renderHome();
    this.renderPlan();
  },

  toggleComplete(taskId, subtaskId = null) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (subtaskId) {
      const sub = task.subtasks.find(s => s.id === subtaskId);
      if (sub) {
        sub.completed = !sub.completed;
      }
      // Check if all subtasks completed
      if (task.subtasks.length > 0 && task.subtasks.every(s => s.completed)) {
        task.completed = true;
      } else {
        task.completed = false;
      }
    } else {
      task.completed = !task.completed;
      if (task.completed && task.subtasks) {
        task.subtasks.forEach(s => s.completed = true);
      }
    }

    this.save();

    if (task.completed) {
      MellowCat.currentMood = 'happy';
      App.setNotificationMessage(MellowCat.dialogues.taskCompleted);
      // Small chance to unlock a collectible naturally without scores
      MellowCat.maybeUnlockCollectible('task_completed');
    }

    this.renderHome();
    this.renderPlan();
  },

  deleteTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.save();
    this.renderHome();
    this.renderPlan();
  },

  rescheduleTask(taskId, newDate = 'tomorrow') {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (newDate === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      task.date = tomorrow.toISOString().split('T')[0];
    } else if (newDate === 'later') {
      task.bucket = 'energy';
      task.date = '';
    } else {
      task.date = newDate;
    }

    this.save();
    App.setNotificationMessage("Task gently rescheduled. No pressure.");
    this.renderHome();
    this.renderPlan();
  },

  // Break It Down workflow
  openBreakdownModal(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;
    this.selectedTaskIdForBreakdown = taskId;

    const modal = document.getElementById('breakdown-modal');
    if (!modal) return;

    const body = modal.querySelector('.breakdown-body');
    const existingSteps = task.subtasks || [];

    // Starter suggestions based on task title keywords
    const isStudy = /study|read|book|exam|math|physics|chemistry/i.test(task.title);
    const isWrite = /write|essay|email|doc|draft/i.test(task.title);
    const isClean = /clean|tidy|room|wash|laundry/i.test(task.title);

    let starters = [
      'Open the document or notebook',
      'Look at just the first line',
      'Work for 5 quiet minutes',
      'Take a comfortable sip of water'
    ];

    if (isStudy) {
      starters = [
        'Open notebook or book to the right page',
        'Read just the first paragraph',
        'Write down one key word or formula',
        'Solve or outline question 1'
      ];
    } else if (isWrite) {
      starters = [
        'Open a blank page',
        'Write one messy starter sentence',
        'Type three bullet points',
        'Step away for a breath'
      ];
    } else if (isClean) {
      starters = [
        'Pick up one single item from the floor',
        'Clear one small corner of desk',
        'Put one glass in the sink',
        'Pause and acknowledge the space'
      ];
    }

    body.innerHTML = `
      <div class="breakdown-header-box">
        <div class="breakdown-cat-bubble">
          <span class="bubble-mellow">${MellowCat.render('calm', 50)}</span>
          <div class="bubble-text">
            <strong>That sounds like a lot.</strong>
            <p>Let's make it smaller. Pick or add tiny steps.</p>
          </div>
        </div>
        <div class="parent-task-preview">
          <span class="parent-task-chip">${task.title}</span>
        </div>
      </div>

      <div class="breakdown-starters">
        <span class="subtle-label">Tap to add a tiny starter step:</span>
        <div class="starter-chips-wrap">
          ${starters.map(s => `
            <button class="starter-chip" onclick="TaskManager.addStarterStep('${encodeURIComponent(s)}')">
              ${Icons.plus} <span>${s}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="subtasks-current-list">
        <span class="subtle-label">Current tiny steps:</span>
        <div id="subtasks-items" class="subtasks-items">
          ${existingSteps.length === 0 ? `
            <p class="empty-subtasks-note">No steps yet. Add one above or type below.</p>
          ` : existingSteps.map((s, idx) => `
            <div class="subtask-row">
              <span class="step-num">${idx + 1}</span>
              <span class="step-text ${s.completed ? 'completed' : ''}">${s.text}</span>
              <button class="icon-tiny-btn" onclick="TaskManager.removeSubtask('${s.id}')" aria-label="Delete step">
                ${Icons.trash}
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="add-custom-step-row">
        <input type="text" id="custom-step-input" placeholder="Add custom tiny step..." class="mellow-input" onkeydown="if(event.key==='Enter') TaskManager.addCustomStep()">
        <button class="soft-btn-icon" onclick="TaskManager.addCustomStep()">${Icons.plus}</button>
      </div>

      <div class="breakdown-actions">
        <button class="primary-pill-btn" onclick="TaskManager.saveAndFocusOnNextStep()">
          Focus on next step ${Icons.arrowRight}
        </button>
        <button class="subtle-text-btn" onclick="TaskManager.closeBreakdownModal()">Keep all for later</button>
      </div>
    `;

    modal.classList.add('active');
  },

  addStarterStep(encodedText) {
    const text = decodeURIComponent(encodedText);
    const task = this.tasks.find(t => t.id === this.selectedTaskIdForBreakdown);
    if (!task) return;
    if (!task.subtasks) task.subtasks = [];
    task.subtasks.push({
      id: 'sub-' + Date.now() + Math.random().toString(36).substr(2, 4),
      text: text,
      completed: false
    });
    this.save();
    this.openBreakdownModal(this.selectedTaskIdForBreakdown);
  },

  addCustomStep() {
    const input = document.getElementById('custom-step-input');
    if (!input || !input.value.trim()) return;
    const task = this.tasks.find(t => t.id === this.selectedTaskIdForBreakdown);
    if (!task) return;
    if (!task.subtasks) task.subtasks = [];
    task.subtasks.push({
      id: 'sub-' + Date.now() + Math.random().toString(36).substr(2, 4),
      text: input.value.trim(),
      completed: false
    });
    this.save();
    this.openBreakdownModal(this.selectedTaskIdForBreakdown);
  },

  removeSubtask(subId) {
    const task = this.tasks.find(t => t.id === this.selectedTaskIdForBreakdown);
    if (!task || !task.subtasks) return;
    task.subtasks = task.subtasks.filter(s => s.id !== subId);
    this.save();
    this.openBreakdownModal(this.selectedTaskIdForBreakdown);
  },

  closeBreakdownModal() {
    const modal = document.getElementById('breakdown-modal');
    if (modal) modal.classList.remove('active');
    this.renderHome();
    this.renderPlan();
  },

  saveAndFocusOnNextStep() {
    this.closeBreakdownModal();
    const task = this.tasks.find(t => t.id === this.selectedTaskIdForBreakdown);
    if (task) {
      task.isRightNow = true;
      this.tasks.forEach(t => { if (t.id !== task.id) t.isRightNow = false; });
      this.save();
      App.switchScreen('focus');
      FocusSession.loadTask(task);
    }
  },

  // Park It Feature
  openParkModal() {
    const modal = document.getElementById('park-modal');
    if (!modal) return;
    const input = document.getElementById('park-input');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 150);
    }
    this.renderParkedList();
    modal.classList.add('active');
  },

  closeParkModal() {
    const modal = document.getElementById('park-modal');
    if (modal) modal.classList.remove('active');
  },

  saveParkedThought() {
    const input = document.getElementById('park-input');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    this.parkedThoughts.unshift({
      id: 'park-' + Date.now(),
      text: text,
      createdAt: 'Just now'
    });
    this.save();
    input.value = '';

    // Gentle instant response from Mellow
    const feedback = document.getElementById('park-mellow-feedback');
    if (feedback) {
      feedback.classList.add('visible');
      setTimeout(() => {
        feedback.classList.remove('visible');
        this.closeParkModal();
      }, 1400);
    } else {
      this.closeParkModal();
    }
  },

  removeParked(id) {
    this.parkedThoughts = this.parkedThoughts.filter(p => p.id !== id);
    this.save();
    this.renderParkedList();
  },

  convertParkedToTask(id) {
    const thought = this.parkedThoughts.find(p => p.id === id);
    if (!thought) return;
    this.addTask(thought.text, 'nice');
    this.removeParked(id);
    App.setNotificationMessage("Thought added to Plan as an optional task.");
  },

  renderParkedList() {
    const container = document.getElementById('parked-items-list');
    if (!container) return;
    if (this.parkedThoughts.length === 0) {
      container.innerHTML = `
        <div class="empty-park-state">
          <p class="subtle-note">No parked thoughts right now. Your mind is quiet.</p>
        </div>
      `;
      return;
    }
    container.innerHTML = this.parkedThoughts.map(p => `
      <div class="parked-card">
        <div class="parked-card-content">
          <span class="thought-glyph">${Icons.thought}</span>
          <span class="thought-text">${p.text}</span>
        </div>
        <div class="parked-card-actions">
          <button class="pill-chip-btn" onclick="TaskManager.convertParkedToTask('${p.id}')">
            ${Icons.calendar} <span>Plan</span>
          </button>
          <button class="icon-tiny-btn" onclick="TaskManager.removeParked('${p.id}')" aria-label="Clear thought">
            ${Icons.trash}
          </button>
        </div>
      </div>
    `).join('');
  },

  // Render the Home Screen Tasks & Right Now
  renderHome() {
    const rightNowContainer = document.getElementById('home-right-now-container');
    const todayListContainer = document.getElementById('home-today-list');
    const rightNowTask = this.getRightNowTask();

    if (rightNowContainer) {
      if (!rightNowTask) {
        rightNowContainer.innerHTML = `
          <div class="right-now-card peaceful-empty">
            <div class="right-now-status">
              <span class="badge-pill">${Icons.sprout} All clear</span>
            </div>
            <h3 class="right-now-title">Nothing pressing right now</h3>
            <p class="right-now-sub">You can rest, relax, or pick something when you feel ready.</p>
            <div class="right-now-actions">
              <button class="primary-pill-btn" onclick="App.openNewTaskModal()">
                ${Icons.plus} Add a gentle task
              </button>
            </div>
          </div>
        `;
      } else {
        const nextSub = this.getNextSubtask(rightNowTask);
        rightNowContainer.innerHTML = `
          <div class="right-now-card">
            <div class="right-now-badge-row">
              <span class="badge-pill">${Icons.sparkle} Right now</span>
              <span class="bucket-pill ${rightNowTask.bucket}">
                ${rightNowTask.bucket === 'must' ? 'Must do' : rightNowTask.bucket === 'nice' ? 'Would be nice' : 'If energy allows'}
              </span>
            </div>
            <div class="right-now-content">
              <label class="custom-checkbox-wrap">
                <input type="checkbox" onchange="TaskManager.toggleComplete('${rightNowTask.id}')">
                <span class="checkbox-visual">${Icons.check}</span>
              </label>
              <div class="right-now-text-col">
                <h3 class="right-now-title">${rightNowTask.title}</h3>
                ${nextSub ? `
                  <div class="next-step-hint">
                    <span class="hint-label">Next tiny step:</span>
                    <span class="hint-text">${nextSub.text}</span>
                  </div>
                ` : ''}
              </div>
            </div>
            <div class="right-now-actions">
              <button class="primary-pill-btn" onclick="FocusSession.startWithTask('${rightNowTask.id}')">
                ${Icons.play} Start
              </button>
              <button class="secondary-pill-btn" onclick="TaskManager.openBreakdownModal('${rightNowTask.id}')">
                ${Icons.sprout} Break it down
              </button>
            </div>
          </div>
        `;
      }
    }

    if (todayListContainer) {
      const todayTasks = this.tasks.filter(t => !t.isRightNow);
      if (todayTasks.length === 0) {
        todayListContainer.innerHTML = `
          <p class="subtle-note text-center">No other tasks scheduled for today.</p>
        `;
      } else {
        todayListContainer.innerHTML = todayTasks.map(t => `
          <div class="task-list-row ${t.completed ? 'is-completed' : ''}">
            <label class="custom-checkbox-wrap">
              <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="TaskManager.toggleComplete('${t.id}')">
              <span class="checkbox-visual">${Icons.check}</span>
            </label>
            <div class="task-row-main" onclick="TaskManager.toggleComplete('${t.id}')">
              <span class="task-title-text">${t.title}</span>
              ${t.subtasks && t.subtasks.length > 0 ? `
                <span class="task-subtasks-count">${Icons.sprout} ${t.subtasks.filter(s => s.completed).length} of ${t.subtasks.length} tiny steps</span>
              ` : ''}
            </div>
            <div class="task-row-actions">
              <button class="icon-tiny-btn" onclick="TaskManager.openBreakdownModal('${t.id}')" title="Break down">
                ${Icons.sprout}
              </button>
              <button class="icon-tiny-btn" onclick="TaskManager.openReschedulePrompt('${t.id}')" title="Move">
                ${Icons.calendar}
              </button>
            </div>
          </div>
        `).join('');
      }
    }
  },

  // Reschedule dialog (Non-punitive)
  openReschedulePrompt(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    const modal = document.getElementById('reschedule-modal');
    if (!modal) return;
    const body = modal.querySelector('.reschedule-body');
    body.innerHTML = `
      <div class="reschedule-cat-msg">
        <span class="mellow-mini">${MellowCat.render('cozy', 48)}</span>
        <div class="reschedule-text">
          <p><strong>Didn't happen today. That is okay.</strong></p>
          <p class="subtle-note">Rest and capacity fluctuate. Want to move "${task.title}"?</p>
        </div>
      </div>
      <div class="reschedule-options">
        <button class="primary-pill-btn" onclick="TaskManager.rescheduleTask('${task.id}', 'tomorrow'); TaskManager.closeRescheduleModal()">
          Move to tomorrow
        </button>
        <button class="secondary-pill-btn" onclick="TaskManager.rescheduleTask('${task.id}', 'later'); TaskManager.closeRescheduleModal()">
          Keep for later (no date)
        </button>
        <button class="subtle-text-btn" onclick="TaskManager.closeRescheduleModal()">
          Keep as is
        </button>
      </div>
    `;
    modal.classList.add('active');
  },

  closeRescheduleModal() {
    const modal = document.getElementById('reschedule-modal');
    if (modal) modal.classList.remove('active');
  },

  // Render Plan Screen
  renderPlan() {
    const mustContainer = document.getElementById('plan-bucket-must');
    const niceContainer = document.getElementById('plan-bucket-nice');
    const energyContainer = document.getElementById('plan-bucket-energy');

    const renderBucketItems = (bucket) => {
      const items = this.tasks.filter(t => t.bucket === bucket);
      if (items.length === 0) {
        return `<p class="empty-bucket-note">Nothing here. Completely clear.</p>`;
      }
      return items.map(t => `
        <div class="plan-task-card ${t.completed ? 'completed' : ''}">
          <label class="custom-checkbox-wrap">
            <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="TaskManager.toggleComplete('${t.id}')">
            <span class="checkbox-visual">${Icons.check}</span>
          </label>
          <div class="plan-task-info">
            <span class="plan-task-title">${t.title}</span>
            ${t.subtasks && t.subtasks.length > 0 ? `
              <span class="subtask-indicator">${Icons.sprout} ${t.subtasks.length} small steps</span>
            ` : ''}
          </div>
          <div class="plan-card-actions">
            <button class="icon-tiny-btn" onclick="TaskManager.openBreakdownModal('${t.id}')" title="Break down">
              ${Icons.sprout}
            </button>
            <button class="icon-tiny-btn" onclick="TaskManager.openReschedulePrompt('${t.id}')" title="Reschedule">
              ${Icons.calendar}
            </button>
            <button class="icon-tiny-btn" onclick="TaskManager.deleteTask('${t.id}')" title="Delete">
              ${Icons.trash}
            </button>
          </div>
        </div>
      `).join('');
    };

    if (mustContainer) mustContainer.innerHTML = renderBucketItems('must');
    if (niceContainer) niceContainer.innerHTML = renderBucketItems('nice');
    if (energyContainer) energyContainer.innerHTML = renderBucketItems('energy');
  }
};
