// Authentication & Account Management for Mellow
// STRICTLY ZERO EMOJIS - Clean vectors, soft typography, and secure local persistence.

const AuthManager = {
  currentUser: null,
  isSignUpMode: false,

  init() {
    this.loadSession();
    this.renderAuthUI();

    if (!this.currentUser) {
      this.showAuthScreen();
    } else {
      this.hideAuthScreen();
      App.setAuthenticatedUser(this.currentUser);
    }
  },

  getAccounts() {
    try {
      const data = localStorage.getItem('mellow_accounts');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveAccounts(accounts) {
    try {
      localStorage.setItem('mellow_accounts', JSON.stringify(accounts));
    } catch (e) {}
  },

  loadSession() {
    try {
      const data = localStorage.getItem('mellow_current_user');
      this.currentUser = data ? JSON.parse(data) : null;
    } catch (e) {
      this.currentUser = null;
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
      createdAt: new Date().toISOString()
    };

    accounts.push(newUser);
    this.saveAccounts(accounts);
    this.saveSession({ name: newUser.name, email: newUser.email });

    // Transition to main app
    this.hideAuthScreen();
    App.setAuthenticatedUser(newUser);
    App.setNotificationMessage(`Welcome to Mellow, ${newUser.name}. Let's take a quick tour.`);

    // STRICT REQUIREMENT: ONLY FOR SIGN UP -> Launch interactive tour
    if (window.AppTour) {
      setTimeout(() => {
        AppTour.start();
      }, 400);
    }
  },

  executeSignIn(email, password) {
    const accounts = this.getAccounts();
    const account = accounts.find(a => a.email === email && a.password === password);

    if (!account) {
      this.showError('Incorrect email or password. Please try again.');
      return;
    }

    this.saveSession({ name: account.name, email: account.email });

    // Transition to main app
    this.hideAuthScreen();
    App.setAuthenticatedUser(account);
    App.setNotificationMessage(`Welcome back, ${account.name}.`);

    // STRICT REQUIREMENT: NO tour after regular Sign In!
  },

  signOut() {
    this.saveSession(null);
    if (window.AppTour) {
      AppTour.stop();
    }
    this.isSignUpMode = false;
    this.renderAuthUI();
    this.showAuthScreen();
  }
};
