// Mellow Application Controller
// Orchestrates navigation, sliding drawer, profile state, and themes.
// STRICTLY ZERO EMOJIS - Clean vectors, calm neurodivergent-first architecture.

const App = {
  currentScreen: 'home',
  recentNotification: null,
  notificationTimeout: null,
  userProfile: {
    name: 'Saanvi',
    avatarKey: 'avatar1',
    photoUrl: null
  },
  settings: {
    darkMode: false,
    reducedMotion: false,
    largeText: false,
    highContrast: false,
    soundEffects: true
  },
  currentEnergy: 'okay', // 'low', 'okay', 'good', 'high'

  init() {
    this.loadState();
    this.applySettings();
    this.setupSidebar();
    this.setupEnergyCheckin();
    this.setupBottomMellowHome();

    // Initialize sub-modules
    MellowCat.initCollectibles();
    TaskManager.init();
    FocusSession.init();
    Community.init();
    ResetTools.init();

    // Initialize Auth state
    const auth = window.AuthManager || (typeof AuthManager !== 'undefined' ? AuthManager : null);
    if (auth) {
      auth.init();
    }

    // Initial renders
    TaskManager.renderHome();
    TaskManager.renderPlan();
    this.updateGreeting();
    this.renderSidebarProfile();

    // Render initial Mellow cat on home
    const homeCat = document.getElementById('home-mellow-illustration');
    if (homeCat) homeCat.innerHTML = MellowCat.render('calm', 100);

    // Render focus screen cat
    const focusCat = document.getElementById('focus-cat-display');
    if (focusCat) focusCat.innerHTML = MellowCat.render('calm', 88);

    // Apply energy on load (updates cat mood)
    this.applyEnergyUI();

    // Default gentle recent notification (fades after 9s)
    this.setNotificationMessage('Mellow is quietly resting beside you.');
  },

  loadState() {
    try {
      const savedProfile = localStorage.getItem('mellow_profile');
      if (savedProfile) this.userProfile = JSON.parse(savedProfile);

      const savedSettings = localStorage.getItem('mellow_settings');
      if (savedSettings) this.settings = Object.assign(this.settings, JSON.parse(savedSettings));

      const savedEnergy = localStorage.getItem('mellow_energy');
      if (savedEnergy) this.currentEnergy = savedEnergy;
    } catch (e) {}
  },

  saveState() {
    try {
      localStorage.setItem('mellow_profile', JSON.stringify(this.userProfile));
      localStorage.setItem('mellow_settings', JSON.stringify(this.settings));
      localStorage.setItem('mellow_energy', this.currentEnergy);
    } catch (e) {}
  },

  getUserProfile() {
    return this.userProfile;
  },

  setAuthenticatedUser(user) {
    if (!user) return;
    this.userProfile.name = user.name || 'Friend';
    if (user.email) this.userProfile.email = user.email;
    if (user.avatarKey) this.userProfile.avatarKey = user.avatarKey;
    if (user.photoUrl) this.userProfile.photoUrl = user.photoUrl;
    this.saveState();
    this.updateGreeting();
    this.renderSidebarProfile();
    this.renderAccountSettings();
  },

  updateUserProfile(name, avatarKey, photoUrl) {
    if (name && name.trim()) this.userProfile.name = name.trim();
    if (avatarKey !== undefined && avatarKey !== null) {
      this.userProfile.avatarKey = avatarKey;
      this.userProfile.photoUrl = null; // selecting preset vector clears custom photo
    }
    if (photoUrl !== undefined) {
      this.userProfile.photoUrl = photoUrl;
    }
    this.saveState();
    this.updateGreeting();
    this.renderSidebarProfile();
    Community.render();
    this.renderAccountSettings();
    this.setNotificationMessage("Profile updated.");
  },

  handleProfilePhotoUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.setNotificationMessage('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Compress & scale to square 200x200 canvas to safely fit in localStorage
        const canvas = document.createElement('canvas');
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Draw centered square crop
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        this.updateUserProfile(null, null, dataUrl);
        this.setNotificationMessage('Profile photo updated.');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  removeProfilePhoto() {
    this.userProfile.photoUrl = null;
    this.saveState();
    this.renderSidebarProfile();
    Community.render();
    this.renderAccountSettings();
    this.setNotificationMessage('Profile photo removed.');
  },

  // Sidebar Open / Close
  setupSidebar() {
    const sidebar = document.getElementById('slide-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const openBtn = document.getElementById('sidebar-toggle-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');

    if (openBtn) {
      openBtn.addEventListener('click', () => this.openSidebar());
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeSidebar());
    }
    if (overlay) {
      overlay.addEventListener('click', () => this.closeSidebar());
    }

    // Sidebar navigation links
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const target = item.getAttribute('data-screen');
        if (target) {
          this.switchScreen(target);
          this.closeSidebar();
        }
      });
    });
  },

  openSidebar() {
    const sidebar = document.getElementById('slide-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && overlay) {
      sidebar.classList.add('is-open');
      overlay.classList.add('is-visible');
    }
    this.renderSidebarProfile();
  },

  closeSidebar() {
    const sidebar = document.getElementById('slide-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && overlay) {
      sidebar.classList.remove('is-open');
      overlay.classList.remove('is-visible');
    }
  },

  renderSidebarProfile() {
    const avatarSlot = document.getElementById('sidebar-user-avatar');
    const nameSlot = document.getElementById('sidebar-user-name');
    if (avatarSlot) {
      if (this.userProfile.photoUrl) {
        avatarSlot.innerHTML = `<img src="${this.userProfile.photoUrl}" alt="${this.userProfile.name}" class="avatar-photo-circle">`;
      } else {
        avatarSlot.innerHTML = Icons[this.userProfile.avatarKey] || Icons.avatar1;
      }
    }
    if (nameSlot) nameSlot.textContent = this.userProfile.name;
  },

  // Screen Switching
  switchScreen(screenName) {
    this.currentScreen = screenName;

    // Update active screen DOM
    document.querySelectorAll('.app-screen').forEach(screen => {
      if (screen.id === `screen-${screenName}`) {
        screen.classList.add('active');
      } else {
        screen.classList.remove('active');
      }
    });

    // Update active link in sidebar
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      if (item.getAttribute('data-screen') === screenName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Keep the bottom kitten home bar always fresh and consistent
    this.setupBottomMellowHome();

    // Screen specific refreshes
    if (screenName === 'home') {
      TaskManager.renderHome();
      this.updateGreeting();
    } else if (screenName === 'plan') {
      TaskManager.renderPlan();
    } else if (screenName === 'focus') {
      const focusCat = document.getElementById('focus-cat-display');
      if (focusCat && (!focusCat.children.length || !FocusSession.isRunning)) {
        focusCat.innerHTML = MellowCat.render('calm', 88);
      }
      FocusSession.updateDisplay();
    } else if (screenName === 'community') {
      Community.render();
    } else if (screenName === 'reset') {
      ResetTools.selectTool(ResetTools.currentTab);
    } else if (screenName === 'room') {
      this.renderFullRoomScreen();
    } else if (screenName === 'account') {
      this.renderAccountSettings();
    }
  },

  // Top Bar Greeting and Recent Notification
  // Rule: On top just the greeting, and the very recent notification, otherwise empty just greeting
  updateGreeting() {
    const greetingText = document.getElementById('top-bar-greeting-text');
    if (!greetingText) return;

    const hour = new Date().getHours();
    let timeGreeting = "Good morning";
    if (hour >= 12 && hour < 17) {
      timeGreeting = "Good afternoon";
    } else if (hour >= 17) {
      timeGreeting = "Good evening";
    }

    greetingText.textContent = `${timeGreeting}, ${this.userProfile.name}`;
  },

  setNotificationMessage(msg) {
    this.recentNotification = msg;
    const pill = document.getElementById('top-recent-notification-pill');
    const pillText = document.getElementById('top-notification-text');

    if (pill && pillText) {
      if (msg) {
        pillText.textContent = msg;
        pill.classList.remove('hidden');
        pill.classList.add('visible');

        if (this.notificationTimeout) clearTimeout(this.notificationTimeout);
        // Gently hide after 9 seconds, leaving top bar clean with just the greeting
        this.notificationTimeout = setTimeout(() => {
          pill.classList.remove('visible');
          pill.classList.add('hidden');
          this.recentNotification = null;
        }, 9000);
      } else {
        pill.classList.remove('visible');
        pill.classList.add('hidden');
      }
    }
  },

  dismissNotification() {
    this.setNotificationMessage(null);
  },

  // Bottom Area: Visuals of Mellow Cat and Her Home
  setupBottomMellowHome() {
    const bottomContainer = document.getElementById('bottom-mellow-home-bar');
    if (!bottomContainer) return;

    bottomContainer.innerHTML = `
      <div class="bottom-home-shelf" onclick="App.switchScreen('room')">
        <div class="bottom-mellow-visual">
          <div class="mini-cat-visual">${MellowCat.render(MellowCat.currentMood, 54)}</div>
          <div class="bottom-mellow-info">
            <span class="mellow-status-title">Mellow's Cozy Room</span>
            <span class="mellow-status-sub">Resting peacefully • Tap to visit</span>
          </div>
        </div>
        <div class="bottom-home-decor">
          <span class="decor-glyph" title="Potted Plant">${Icons.sprout}</span>
          <span class="decor-glyph" title="Warm Mug">${Icons.tea}</span>
          <span class="decor-glyph" title="Star Light">${Icons.star}</span>
        </div>
      </div>
    `;
  },

  // Energy Check-in
  setupEnergyCheckin() {
    const options = document.querySelectorAll('.energy-chip');
    options.forEach(chip => {
      chip.addEventListener('click', () => {
        const energy = chip.getAttribute('data-energy');
        this.setEnergy(energy);
      });
    });
    this.applyEnergyUI();
  },

  setEnergy(energy) {
    this.currentEnergy = energy;
    this.saveState();
    this.applyEnergyUI();

    const catElem = document.getElementById('home-mellow-illustration');
    const msgElem = document.getElementById('home-mellow-supportive-text');

    if (energy === 'low') {
      MellowCat.currentMood = 'sleepy';
      if (msgElem) msgElem.textContent = MellowCat.dialogues.lowEnergy;
      this.setNotificationMessage("Low-energy mode active. Tasks kept tiny.");
    } else if (energy === 'okay') {
      MellowCat.currentMood = 'calm';
      if (msgElem) msgElem.textContent = MellowCat.dialogues.okayEnergy;
    } else if (energy === 'good') {
      MellowCat.currentMood = 'happy';
      if (msgElem) msgElem.textContent = MellowCat.dialogues.goodEnergy;
    } else if (energy === 'high') {
      MellowCat.currentMood = 'proud';
      if (msgElem) msgElem.textContent = MellowCat.dialogues.highEnergy;
    }

    if (catElem) {
      catElem.innerHTML = MellowCat.render(MellowCat.currentMood, 100);
    }
    this.setupBottomMellowHome();
  },

  applyEnergyUI() {
    document.querySelectorAll('.energy-chip').forEach(chip => {
      if (chip.getAttribute('data-energy') === this.currentEnergy) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  },

  // Settings & Theme
  toggleTheme() {
    this.settings.darkMode = !this.settings.darkMode;
    this.saveState();
    this.applySettings();
    this.renderAccountSettings();
  },

  applySettings() {
    const root = document.documentElement;

    // Dark Mode
    if (this.settings.darkMode) {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }

    // Reduced Motion
    if (this.settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Large Text
    if (this.settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // High Contrast
    if (this.settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Sidebar theme icon update
    const themeIcon = document.getElementById('sidebar-theme-icon');
    if (themeIcon) {
      themeIcon.innerHTML = this.settings.darkMode ? Icons.sun : Icons.moon;
    }
  },

  // Render Account & Settings Screen
  renderAccountSettings() {
    const container = document.getElementById('account-settings-container');
    if (!container) return;

    const avatars = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6'];

    container.innerHTML = `
      <div class="settings-card">
        <h3 class="settings-section-title">Your Profile</h3>
        <p class="subtle-note">Your photo, name, and icon appear on community posts and reflections.</p>

        <div class="profile-edit-box">
          <!-- Profile Photo Upload -->
          <div class="profile-photo-management">
            <div class="profile-photo-preview-box">
              ${this.userProfile.photoUrl 
                ? `<img src="${this.userProfile.photoUrl}" alt="${this.userProfile.name}" class="avatar-photo-circle">`
                : (Icons[this.userProfile.avatarKey] || Icons.avatar1)}
            </div>
            <div class="profile-photo-actions-group">
              <input type="file" id="profile-photo-file-input" accept="image/*" style="display:none;" onchange="App.handleProfilePhotoUpload(event)">
              <button class="photo-upload-trigger-btn" onclick="document.getElementById('profile-photo-file-input').click()">
                ${Icons.camera}
                <span>${this.userProfile.photoUrl ? 'Change photo' : 'Upload photo'}</span>
              </button>
              ${this.userProfile.photoUrl ? `
                <button class="photo-remove-trigger-btn" onclick="App.removeProfilePhoto()">
                  ${Icons.trash}
                  <span>Remove photo</span>
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Or choose vector avatar -->
          <div class="avatar-selection-row">
            <span class="subtle-label">Or choose an illustrated avatar:</span>
            <div class="avatar-grid">
              ${avatars.map(key => `
                <button class="avatar-choice-btn ${(!this.userProfile.photoUrl && this.userProfile.avatarKey === key) ? 'active' : ''}" onclick="App.updateUserProfile(null, '${key}', null)">
                  ${Icons[key]}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="name-edit-field">
            <label class="subtle-label" for="profile-name-input">Display Name:</label>
            <div class="name-input-row">
              <input type="text" id="profile-name-input" value="${this.userProfile.name}" class="mellow-input" onkeydown="if(event.key==='Enter') App.saveNameInput()">
              <button class="primary-pill-btn" onclick="App.saveNameInput()">Save</button>
            </div>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <h3 class="settings-section-title">Appearance</h3>
        <div class="setting-toggle-row">
          <div class="setting-info">
            <span class="setting-name">Dark Mode</span>
            <span class="setting-desc">Gentle nighttime charcoal palette</span>
          </div>
          <button class="pill-switch ${this.settings.darkMode ? 'active' : ''}" onclick="App.toggleTheme()">
            ${this.settings.darkMode ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      <div class="settings-card">
        <h3 class="settings-section-title">Accessibility & Sensory</h3>
        
        <div class="setting-toggle-row">
          <div class="setting-info">
            <span class="setting-name">Reduced Motion</span>
            <span class="setting-desc">Softens and stills interface transitions</span>
          </div>
          <button class="pill-switch ${this.settings.reducedMotion ? 'active' : ''}" onclick="App.toggleSetting('reducedMotion')">
            ${this.settings.reducedMotion ? 'On' : 'Off'}
          </button>
        </div>

        <div class="setting-toggle-row">
          <div class="setting-info">
            <span class="setting-name">Larger Text</span>
            <span class="setting-desc">Increases readability for comfort</span>
          </div>
          <button class="pill-switch ${this.settings.largeText ? 'active' : ''}" onclick="App.toggleSetting('largeText')">
            ${this.settings.largeText ? 'On' : 'Off'}
          </button>
        </div>

        <div class="setting-toggle-row">
          <div class="setting-info">
            <span class="setting-name">Higher Contrast</span>
            <span class="setting-desc">Enhances edge visibility for elements</span>
          </div>
          <button class="pill-switch ${this.settings.highContrast ? 'active' : ''}" onclick="App.toggleSetting('highContrast')">
            ${this.settings.highContrast ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      <div class="settings-card quiet-philosophy-card">
        <div class="philosophy-header">
          <span class="philosophy-icon">${Icons.sprout}</span>
          <h4>The Mellow Philosophy</h4>
        </div>
        <p>No scores, streaks, percentages, or pressure. Designed with kindness for neurodivergent brains.</p>
      </div>

      <div class="settings-card account-session-card">
        <h3 class="settings-section-title">App Walkthrough & Tour</h3>
        <p class="subtle-note">Want to revisit the guided walkthrough of Mellow's features?</p>
        <button type="button" class="secondary-pill-btn" style="margin-bottom: 16px;" onclick="AppTour.start()">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span>Replay App Tour</span>
        </button>

        <h3 class="settings-section-title">Account Session</h3>
        <p class="subtle-note">Signed in as <strong>${(window.AuthManager && AuthManager.currentUser) ? AuthManager.currentUser.email : (this.userProfile.email || 'Active session')}</strong></p>
        <button type="button" class="secondary-pill-btn signout-settings-btn" onclick="AuthManager.signOut()">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>Sign Out</span>
        </button>
      </div>
    `;
  },

  saveNameInput() {
    const input = document.getElementById('profile-name-input');
    if (input && input.value.trim()) {
      this.updateUserProfile(input.value.trim(), null);
    }
  },

  toggleSetting(key) {
    if (this.settings.hasOwnProperty(key)) {
      this.settings[key] = !this.settings[key];
      this.saveState();
      this.applySettings();
      this.renderAccountSettings();
    }
  },

  renderFullRoomScreen() {
    const container = document.getElementById('full-room-container');
    if (container) {
      container.innerHTML = MellowCat.renderRoomView();
    }
  },

  openNewTaskModal() {
    const modal = document.getElementById('new-task-modal');
    if (!modal) return;
    const input = document.getElementById('new-task-input');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 150);
    }
    modal.classList.add('active');
  },

  closeNewTaskModal() {
    const modal = document.getElementById('new-task-modal');
    if (modal) modal.classList.remove('active');
  },

  submitNewTask() {
    const input = document.getElementById('new-task-input');
    const bucketSelect = document.getElementById('new-task-bucket');
    if (!input || !input.value.trim()) return;

    const title = input.value.trim();
    const bucket = bucketSelect ? bucketSelect.value : 'must';

    TaskManager.addTask(title, bucket);
    this.closeNewTaskModal();
    this.setNotificationMessage(`Added "${title}"`);
  }
};

// Global export for window access and inline handlers
window.App = App;

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});

