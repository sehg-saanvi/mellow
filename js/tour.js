// Interactive Onboarding Tour Engine for Mellow
// Featuring Little Mellow as the personal, gentle guide.
// STRICTLY ZERO EMOJIS in code logic, keeping soft pastel typography and clean vectors.

const AppTour = {
  isActive: false,
  currentStepIndex: 0,
  currentAccountEmail: null,
  _boundHandleResize: null,
  _boundHandleScroll: null,

  steps: [
    {
      screen: 'home',
      targetId: 'home-mellow-illustration',
      fallbackSelector: '.home-hero-card',
      title: "Hi! I'm Mellow 🌱",
      description: "Let's take a tiny tour of your new space.",
      catMood: 'calm',
      placement: 'bottom'
    },
    {
      screen: 'home',
      targetId: 'energy-checkin-section',
      fallbackSelector: '.home-hero-card',
      title: "Home",
      description: "Home is your starting point. Check in with how your brain feels, see what matters right now, and gently organize your tasks.",
      catMood: 'calm',
      placement: 'bottom'
    },
    {
      screen: 'plan',
      targetId: 'plan-bucket-must',
      fallbackSelector: '.plan-header-card',
      title: "Plan",
      description: "Plan helps you organize tasks and your calendar. Big task? We can break it into tiny steps.",
      catMood: 'calm',
      placement: 'bottom'
    },
    {
      screen: 'focus',
      targetId: 'focus-play-btn',
      fallbackSelector: '.focus-timer-numeric',
      title: "Focus",
      description: "When you're ready, Focus gives you one task at a time, a flexible timer, and calming sounds.",
      catMood: 'calm',
      placement: 'bottom'
    },
    {
      screen: 'home',
      targetId: 'top-park-fab',
      fallbackSelector: '.top-park-fab',
      title: "Park It",
      description: "Got a distracting thought? Park it here so you don't have to keep holding it in your head.",
      catMood: 'calm',
      placement: 'bottom'
    },
    {
      screen: 'community',
      targetId: 'community-feed-container',
      fallbackSelector: '.community-header-card',
      title: "Community",
      description: "Community is a low-pressure space to share thoughts, tips, and tiny wins with people who understand.",
      catMood: 'happy',
      placement: 'top'
    },
    {
      screen: 'reset',
      targetId: 'reset-panel-breathe',
      fallbackSelector: '.reset-tabs-nav',
      title: "Reset",
      description: "Feeling overwhelmed? Reset gives you space to breathe, rest, move, or clear your thoughts.",
      catMood: 'calm',
      placement: 'bottom'
    },
    {
      screen: 'room',
      targetId: 'full-room-container',
      fallbackSelector: '.room-screen-header',
      title: "Mellow's Cozy Room",
      description: "Every completed Must Do task helps our little room grow and unlocks something cozy along the way.",
      catMood: 'happy',
      placement: 'top'
    },
    {
      screen: 'account',
      targetId: 'account-settings-container',
      fallbackSelector: '.room-screen-header',
      title: "Settings & Profile",
      description: "Make Mellow yours — change your profile, appearance, text size, contrast, motion, and other accessibility settings.",
      catMood: 'calm',
      placement: 'bottom'
    },
    {
      screen: 'home',
      targetId: 'home-mellow-illustration',
      fallbackSelector: '.home-hero-card',
      title: "And that's Mellow!",
      description: "No pressure. No streaks. No scores.\nJust productivity that works for you. 🌱",
      catMood: 'proud',
      placement: 'bottom'
    }
  ],

  start(accountEmail) {
    this.isActive = true;
    this.currentStepIndex = 0;
    this.currentAccountEmail = accountEmail || (window.AuthManager && AuthManager.currentUser ? AuthManager.currentUser.email : null);

    // Ensure overlay exists
    this.ensureOverlayExists();

    // Attach resize and scroll listeners
    this.detachListeners();
    this._boundHandleResize = () => {
      if (this.isActive) this.updatePosition();
    };
    this._boundHandleScroll = () => {
      if (this.isActive) this.updatePosition();
    };

    window.addEventListener('resize', this._boundHandleResize);
    const viewport = document.querySelector('.app-screen-viewport');
    if (viewport) {
      viewport.addEventListener('scroll', this._boundHandleScroll, { passive: true });
    }

    // Render step 1
    this.renderCurrentStep();
  },

  detachListeners() {
    if (this._boundHandleResize) {
      window.removeEventListener('resize', this._boundHandleResize);
      this._boundHandleResize = null;
    }
    const viewport = document.querySelector('.app-screen-viewport');
    if (viewport && this._boundHandleScroll) {
      viewport.removeEventListener('scroll', this._boundHandleScroll);
      this._boundHandleScroll = null;
    }
  },

  ensureOverlayExists() {
    let overlay = document.getElementById('app-tour-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'app-tour-overlay';
      overlay.className = 'app-tour-overlay active';

      const shell = document.querySelector('.mobile-device-shell') || document.body;
      shell.appendChild(overlay);
    }
    overlay.classList.add('active');
  },

  renderCurrentStep() {
    const overlay = document.getElementById('app-tour-overlay');
    if (!overlay) return;

    const step = this.steps[this.currentStepIndex];
    if (!step) {
      this.finish();
      return;
    }

    // Switch screen to show the corresponding feature
    if (step.screen && typeof App !== 'undefined' && App.switchScreen) {
      if (App.currentScreen !== step.screen) {
        App.switchScreen(step.screen);
      }
      if (App.closeSidebar) {
        App.closeSidebar();
      }
    }

    const isFirstStep = this.currentStepIndex === 0;
    const isLastStep = this.currentStepIndex === this.steps.length - 1;
    const stepNum = this.currentStepIndex + 1;
    const totalSteps = this.steps.length;

    // Render Little Mellow companion visual for the tour card
    const catHtml = (typeof MellowCat !== 'undefined' && MellowCat.render)
      ? MellowCat.render(step.catMood || 'calm', 44)
      : `<img src="public/mellow-logo-cat.png" alt="Mellow" style="width:36px;height:36px;object-fit:contain;">`;

    overlay.innerHTML = `
      <div id="tour-spotlight" class="tour-spotlight-box"></div>
      <div id="tour-tooltip" class="tour-tooltip-card">
        <div class="tour-tooltip-pointer" id="tour-pointer"></div>

        <div class="tour-header">
          <span class="tour-step-badge">Step ${stepNum} of ${totalSteps}</span>
          <button type="button" class="tour-skip-btn" onclick="AppTour.skip()" aria-label="Skip tour">Skip tour</button>
        </div>

        <div class="tour-body-row">
          <div class="tour-cat-avatar" aria-hidden="true">
            ${catHtml}
          </div>
          <div class="tour-text-content">
            <h3 class="tour-title">${step.title}</h3>
            <p class="tour-description">${step.description.replace(/\n/g, '<br>')}</p>
          </div>
        </div>

        <div class="tour-footer">
          <div class="tour-controls-left">
            ${!isFirstStep ? `
              <button type="button" class="secondary-pill-btn tour-back-btn" onclick="AppTour.prev()" aria-label="Previous step">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                <span>Back</span>
              </button>
            ` : `<div></div>`}
          </div>

          <div class="tour-dots-indicator" aria-label="Tour progress">
            ${this.steps.map((_, i) => `
              <span class="tour-dot ${i === this.currentStepIndex ? 'active' : ''}"></span>
            `).join('')}
          </div>

          <button type="button" class="primary-pill-btn tour-next-btn" onclick="AppTour.next()">
            <span>${isLastStep ? "Let's go!" : "Next"}</span>
            ${!isLastStep ? `
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            ` : `
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            `}
          </button>
        </div>
      </div>
    `;

    // Position spotlight & tooltip
    this.updatePosition();
    requestAnimationFrame(() => {
      this.updatePosition();
    });
    setTimeout(() => {
      this.updatePosition();
    }, 60);
  },

  updatePosition() {
    const step = this.steps[this.currentStepIndex];
    if (!step) return;

    let targetEl = document.getElementById(step.targetId);
    if (!targetEl && step.fallbackSelector) {
      targetEl = document.querySelector(step.fallbackSelector);
    }

    const spotlight = document.getElementById('tour-spotlight');
    const tooltip = document.getElementById('tour-tooltip');
    const pointer = document.getElementById('tour-pointer');
    const shell = document.querySelector('.mobile-device-shell');

    if (!targetEl || !spotlight || !tooltip || !shell) return;

    const shellRect = shell.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    // If target element is scrollable inside the app viewport, align smoothly
    const viewport = document.querySelector('.app-screen-viewport');
    if (viewport && targetEl.closest('.app-screen-viewport')) {
      const vpRect = viewport.getBoundingClientRect();
      if (targetRect.top < vpRect.top + 10 || targetRect.bottom > vpRect.bottom - 10) {
        targetEl.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      }
    }

    const updatedTargetRect = targetEl.getBoundingClientRect();

    // Spotlight coordinates relative to mobile shell
    const spotLeft = Math.max(0, updatedTargetRect.left - shellRect.left);
    const spotTop = Math.max(0, updatedTargetRect.top - shellRect.top);
    const spotWidth = updatedTargetRect.width;
    const spotHeight = updatedTargetRect.height;

    // Apply spotlight box positioning
    const padding = 6;
    spotlight.style.left = `${spotLeft - padding}px`;
    spotlight.style.top = `${spotTop - padding}px`;
    spotlight.style.width = `${spotWidth + (padding * 2)}px`;
    spotlight.style.height = `${spotHeight + (padding * 2)}px`;

    const targetRadius = window.getComputedStyle(targetEl).borderRadius;
    spotlight.style.borderRadius = (targetRadius && targetRadius !== '0px') ? targetRadius : '16px';

    // Tooltip positioning
    const tooltipWidth = Math.min(shellRect.width - 24, 345);
    tooltip.style.width = `${tooltipWidth}px`;
    const tooltipHeight = tooltip.offsetHeight || 205;

    let leftPos = Math.max(12, (shellRect.width - tooltipWidth) / 2);
    let topPos;

    const fitsBelow = (spotTop + spotHeight + tooltipHeight + 16) <= shellRect.height;
    const preferTop = step.placement === 'top' || !fitsBelow;

    if (preferTop && (spotTop - tooltipHeight - 14) >= 10) {
      // Place above target
      topPos = spotTop - tooltipHeight - 14;
      if (pointer) {
        pointer.className = 'tour-tooltip-pointer pointer-down';
        const targetCenterX = spotLeft + (spotWidth / 2);
        const pointerLeft = Math.max(20, Math.min(tooltipWidth - 20, targetCenterX - leftPos));
        pointer.style.left = `${pointerLeft}px`;
      }
    } else {
      // Place below target
      topPos = spotTop + spotHeight + 14;
      if (pointer) {
        pointer.className = 'tour-tooltip-pointer pointer-up';
        const targetCenterX = spotLeft + (spotWidth / 2);
        const pointerLeft = Math.max(20, Math.min(tooltipWidth - 20, targetCenterX - leftPos));
        pointer.style.left = `${pointerLeft}px`;
      }
    }

    // Keep tooltip strictly inside phone shell boundary
    topPos = Math.max(14, Math.min(shellRect.height - tooltipHeight - 14, topPos));

    tooltip.style.left = `${leftPos}px`;
    tooltip.style.top = `${topPos}px`;
  },

  next() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.renderCurrentStep();
    } else {
      this.finish();
    }
  },

  prev() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.renderCurrentStep();
    }
  },

  skip() {
    this.finish();
  },

  finish() {
    this.isActive = false;

    // Remove overlay element
    const overlay = document.getElementById('app-tour-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 250);
    }

    this.detachListeners();

    // Mark persistent tour completion for this individual account
    if (typeof AuthManager !== 'undefined' && AuthManager.markTourCompleted) {
      AuthManager.markTourCompleted(this.currentAccountEmail);
    }

    // Always return user cleanly to the Home screen
    if (typeof App !== 'undefined') {
      if (App.switchScreen) App.switchScreen('home');
      if (App.setNotificationMessage) {
        App.setNotificationMessage("Welcome home. You are all set to explore at your own pace.");
      }
    }
  },

  stop() {
    this.isActive = false;
    const overlay = document.getElementById('app-tour-overlay');
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    this.detachListeners();
  }
};

// Global export for inline event handlers and multi-module access
window.AppTour = AppTour;

