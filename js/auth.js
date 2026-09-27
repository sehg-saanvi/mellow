const AuthManager = {
  currentUser: null,
  isSignUpMode: false,

  KIVI_ACCOUNT: {
    name: 'Kivi',
    email: 'kivi@gmail.com',
    password: '15082009',
    avatarKey: 'avatar1',
    photoUrl: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    tourCompleted: true
  },

  init() {
    this.enforceSingleKiviAccount();
    this.loadSession();
    this.renderAuthUI();

    if (!this.currentUser) {
      this.showAuthScreen();
      if (typeof App !== 'undefined' && App.onUserSignOut) {
        App.onUserSignOut();
      }
    } else {
      this.hideAuthScreen();
      if (typeof App !== 'undefined' && App.initAccountData) {
        App.initAccountData(this.currentUser, false);
      }
    }
  },

  enforceSingleKiviAccount() {
    try {
      const kivi = { ...this.KIVI_ACCOUNT };
      localStorage.setItem('mellow_accounts', JSON.stringify([kivi]));

      // Clean old accounts and legacy keys
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('mellow_profile_') || key.startsWith('mellow_settings_') || key.startsWith('mellow_tasks_') || key.startsWith('mellow_energy_') || key.startsWith('mellow_tour_') || key.startsWith('mellow_parked_') || key.startsWith('mellow_collectibles_'))) {
          if (!key.toLowerCase().endsWith('_kivi@gmail.com')) {
            keysToRemove.push(key);
          }
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));

      // Ensure currentUser session points to Kivi
      const sessionData = localStorage.getItem('mellow_current_user');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (!session || !session.email || session.email.toLowerCase() !== 'kivi@gmail.com') {
          localStorage.setItem('mellow_current_user', JSON.stringify({ name: 'Kivi', email: 'kivi@gmail.com', tourCompleted: true }));
        }
      } else {
        localStorage.setItem('mellow_current_user', JSON.stringify({ name: 'Kivi', email: 'kivi@gmail.com', tourCompleted: true }));
      }
    } catch (e) {}
  },

  getUserStorageKey(baseKey, email) {
    const targetEmail = (email || (this.currentUser ? this.currentUser.email : '') || 'kivi@gmail.com').toLowerCase().trim();
    if (!targetEmail) return baseKey;
    return `${baseKey}_${targetEmail}`;
  },

  updateAccountProfile(email, profileData) {
    if (!email) return;
    const targetEmail = email.toLowerCase().trim();
    const accounts = this.getAccounts();
    const account = accounts.find(a => a.email && a.email.toLowerCase() === targetEmail);
    if (account) {
      if (profileData.name) account.name = profileData.name;
      if (profileData.avatarKey !== undefined) account.avatarKey = profileData.avatarKey;
      if (profileData.photoUrl !== undefined) account.photoUrl = profileData.photoUrl;
      this.saveAccounts(accounts);
    }
    if (this.currentUser && this.currentUser.email && this.currentUser.email.toLowerCase() === targetEmail) {
      if (profileData.name) this.currentUser.name = profileData.name;
      if (profileData.avatarKey !== undefined) this.currentUser.avatarKey = profileData.avatarKey;
      if (profileData.photoUrl !== undefined) this.currentUser.photoUrl = profileData.photoUrl;
      this.saveSession(this.currentUser);
    }
  },

  getAccounts() {
    try {
      const data = localStorage.getItem('mellow_accounts');
      if (data) {
        const list = JSON.parse(data);
        if (Array.isArray(list) && list.length > 0) {
          const kiviAcc = list.find(a => a.email && a.email.toLowerCase() === 'kivi@gmail.com');
          if (kiviAcc) return [kiviAcc];
        }
      }
    } catch (e) {}
    return [{ ...this.KIVI_ACCOUNT }];
  },

  saveAccounts(accounts) {
    try {
      localStorage.setItem('mellow_accounts', JSON.stringify(accounts));
    } catch (e) {}
  },

  loadSession() {
    try {
      const data = localStorage.getItem('mellow_current_user');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && parsed.email && parsed.email.toLowerCase() === 'kivi@gmail.com') {
          this.currentUser = parsed;
          return;
        }
      }
      this.currentUser = { name: 'Kivi', email: 'kivi@gmail.com', tourCompleted: true };
      localStorage.setItem('mellow_current_user', JSON.stringify(this.currentUser));
    } catch (e) {
      this.currentUser = { name: 'Kivi', email: 'kivi@gmail.com', tourCompleted: true };
    }
  },

  saveSession(user) {
    this.currentUser = user;
    try {
      if (user) {
        localStorage.setItem('mellow_current_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('mellow_current_user');
      }
    } catch (e) {}
  },

  showAuthScreen() {
    const authElem = document.getElementById('auth-screen-overlay');
    if (authElem) {
      authElem.classList.remove('hidden');
      authElem.classList.add('active');
    }
  },

  hideAuthScreen() {
    const authElem = document.getElementById('auth-screen-overlay');
    if (authElem) {
      authElem.classList.remove('active');
      authElem.classList.add('hidden');
    }
  },

  switchMode(isSignUp) {
    this.isSignUpMode = isSignUp;
    this.renderAuthUI();
  },

  renderAuthUI() {
    const container = document.getElementById('auth-form-container');
    if (!container) return;

    if (this.isSignUpMode) {
      container.innerHTML = `
        <div class="auth-header-block">
          <h2 class="auth-title">Create your space</h2>
          <p class="auth-subtitle">A calm, pressure-free sanctuary for your daily rhythm.</p>
        </div>

        <div class="auth-tabs-toggle">
          <button type="button" class="auth-tab-btn" onclick="AuthManager.switchMode(false)">Sign In</button>
          <button type="button" class="auth-tab-btn active">Sign Up</button>
        </div>

        <form id="auth-form" class="auth-form-body" onsubmit="AuthManager.handleSubmit(event)">
          <div id="auth-error-banner" class="auth-feedback-banner hidden" role="alert"></div>

          <div class="auth-input-group">
            <label for="auth-name-input" class="auth-label">Your Name</label>
            <input type="text" id="auth-name-input" class="auth-text-input" placeholder="What should Mellow call you?" required autocomplete="name">
          </div>

          <div class="auth-input-group">
            <label for="auth-email-input" class="auth-label">Email Address</label>
            <input type="email" id="auth-email-input" class="auth-text-input" placeholder="name@example.com" required autocomplete="email">
          </div>

          <div class="auth-input-group">
            <label for="auth-password-input" class="auth-label">Password</label>
            <div class="auth-password-wrapper">
              <input type="password" id="auth-password-input" class="auth-text-input" placeholder="At least 6 characters" required autocomplete="new-password">
              <button type="button" class="auth-pwd-toggle" onclick="AuthManager.togglePasswordVisibility('auth-password-input', this)" aria-label="Toggle password visibility">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </div>

          <button type="submit" class="primary-pill-btn auth-submit-btn">
            <span>Create Account</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>

          <p class="auth-switch-prompt">
            Already have an account?
            <button type="button" class="auth-text-link" onclick="AuthManager.switchMode(false)">Sign In</button>
          </p>
        </form>
      `;
    } else {
      container.innerHTML = `
        <div class="auth-header-block">
          <h2 class="auth-title">Welcome back</h2>
          <p class="auth-subtitle">Mellow is quietly resting and ready when you are.</p>
        </div>

        <div class="auth-tabs-toggle">
          <button type="button" class="auth-tab-btn active">Sign In</button>
          <button type="button" class="auth-tab-btn" onclick="AuthManager.switchMode(true)">Sign Up</button>
        </div>

        <form id="auth-form" class="auth-form-body" onsubmit="AuthManager.handleSubmit(event)">
          <div id="auth-error-banner" class="auth-feedback-banner hidden" role="alert"></div>

          <div class="auth-input-group">
            <label for="auth-email-input" class="auth-label">Email Address</label>
            <input type="email" id="auth-email-input" class="auth-text-input" placeholder="name@example.com" required autocomplete="email">
          </div>

          <div class="auth-input-group">
            <label for="auth-password-input" class="auth-label">Password</label>
            <div class="auth-password-wrapper">
              <input type="password" id="auth-password-input" class="auth-text-input" placeholder="Your account password" required autocomplete="current-password">
              <button type="button" class="auth-pwd-toggle" onclick="AuthManager.togglePasswordVisibility('auth-password-input', this)" aria-label="Toggle password visibility">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </div>

          <button type="submit" class="primary-pill-btn auth-submit-btn">
            <span>Sign In</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>

          <p class="auth-switch-prompt">
            Don't have an account yet?
            <button type="button" class="auth-text-link" onclick="AuthManager.switchMode(true)">Create one</button>
          </p>
        </form>
      `;
    }
  },

  togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.innerHTML = isPassword
      ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
      : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  },

  showError(message) {
    const banner = document.getElementById('auth-error-banner');
    if (!banner) return;
    banner.textContent = message;
    banner.classList.remove('hidden');
  },

  clearError() {
    const banner = document.getElementById('auth-error-banner');
    if (banner) {
      banner.textContent = '';
      banner.classList.add('hidden');
    }
  },

  handleSubmit(event) {
    event.preventDefault();
    this.clearError();

    const emailInput = document.getElementById('auth-email-input');
    const pwdInput = document.getElementById('auth-password-input');

    if (!emailInput || !pwdInput) return;

    const email = emailInput.value.trim().toLowerCase();
    const password = pwdInput.value;

    if (!email || !email.includes('@')) {
      this.showError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      this.showError('Password must be at least 6 characters.');
      return;
    }

    if (this.isSignUpMode) {
      const nameInput = document.getElementById('auth-name-input');
      const name = nameInput ? nameInput.value.trim() : '';

      if (!name) {
        this.showError('Please enter your name so Mellow can greet you.');
        return;
      }

      this.executeSignUp(name, email, password);
    } else {
      this.executeSignIn(email, password);
    }
  },

  executeSignUp(name, email, password) {
    const accounts = this.getAccounts();
    const existing = accounts.find(a => a.email === email);

    if (existing) {
      this.showError('An account with this email already exists. Please sign in instead.');
      return;
    }

    const newUser = {
      name,
      email,
      password,
      avatarKey: 'avatar1',
      photoUrl: null,
      createdAt: new Date().toISOString(),
      tourCompleted: false
    };

    accounts.push(newUser);
    this.saveAccounts(accounts);
    this.saveSession({ name: newUser.name, email: newUser.email, tourCompleted: false });

   
    this.hideAuthScreen();
    if (typeof App !== 'undefined' && App.initAccountData) {
      App.initAccountData(newUser, true);
      App.switchScreen('home');
      App.setNotificationMessage(`Welcome to Mellow, ${newUser.name}. Let's take a quick tour.`);
    }

 
    const tourEngine = window.AppTour || (typeof AppTour !== 'undefined' ? AppTour : null);
    if (tourEngine) {
      setTimeout(() => {
        tourEngine.start(newUser.email);
      }, 250);
    }
  },

  executeSignIn(email, password) {
    const accounts = this.getAccounts();
    const account = accounts.find(a => a.email === email && a.password === password);

    if (!account) {
      this.showError('Incorrect email or password. Please try again.');
      return;
    }

 
    if (account.tourCompleted === undefined) {
      account.tourCompleted = true;
      this.saveAccounts(accounts);
    }

    this.saveSession({ name: account.name, email: account.email, tourCompleted: account.tourCompleted });


    this.hideAuthScreen();
    if (typeof App !== 'undefined' && App.initAccountData) {
      App.initAccountData(account, false);
      App.switchScreen('home');
      App.setNotificationMessage(`Welcome back, ${account.name}.`);
    }

 
    const tourEngine = window.AppTour || (typeof AppTour !== 'undefined' ? AppTour : null);
    if (tourEngine && tourEngine.isActive) {
      tourEngine.stop();
    }
  },

  markTourCompleted(email) {
    const targetEmail = (email || (this.currentUser ? this.currentUser.email : '')).toLowerCase().trim();
    if (!targetEmail) return;

    const accounts = this.getAccounts();
    const account = accounts.find(a => a.email && a.email.toLowerCase() === targetEmail);
    if (account) {
      account.tourCompleted = true;
      this.saveAccounts(accounts);
    }

    if (this.currentUser && this.currentUser.email && this.currentUser.email.toLowerCase() === targetEmail) {
      this.currentUser.tourCompleted = true;
      this.saveSession(this.currentUser);
    }
  },

  isTourCompleted(email) {
    const targetEmail = (email || (this.currentUser ? this.currentUser.email : '')).toLowerCase().trim();
    if (!targetEmail) return true;

    const accounts = this.getAccounts();
    const account = accounts.find(a => a.email && a.email.toLowerCase() === targetEmail);
    return account ? !!account.tourCompleted : true;
  },

  signOut() {
    this.saveSession(null);
    const tourEngine = window.AppTour || (typeof AppTour !== 'undefined' ? AppTour : null);
    if (tourEngine) {
      tourEngine.stop();
    }
    if (typeof App !== 'undefined' && App.onUserSignOut) {
      App.onUserSignOut();
    }
    this.isSignUpMode = false;
    this.renderAuthUI();
    this.showAuthScreen();
  }
};


window.AuthManager = AuthManager;

