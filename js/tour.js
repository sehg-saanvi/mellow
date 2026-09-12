// Interactive Onboarding Tour Engine for Mellow
// STRICTLY ZERO EMOJIS - Clean vectors, soft typography, gentle spotlights.

const AppTour = {
  isActive: false,
  currentStepIndex: 0,

  steps: [
    {
      targetId: 'energy-checkin-section',
      fallbackSelector: '.energy-checkin-section',
      title: 'Energy Check-In',
      description: 'Tap how your brain feels today. Mellow gently adjusts your tasks and pacing to match your natural energy without any pressure.',
      placement: 'bottom'
    },
    {
      targetId: 'home-right-now-container',
      fallbackSelector: '.right-now-section',
      title: 'One Gentle Step',
      description: 'Avoid overwhelm. Mellow highlights only your single "Right Now" task, with easy micro-steps you can tackle one by one.',
      placement: 'bottom'
    },
    {
      targetId: 'top-park-fab',
      fallbackSelector: '.top-park-fab',
      title: 'Park Sudden Thoughts',
      description: 'When sudden tangents or worries pop into your mind, tap here to safely park them away so you can stay calm and centered.',
      placement: 'bottom'
    },
    {
      targetId: 'sidebar-toggle-btn',
      fallbackSelector: '#sidebar-toggle-btn',
      title: 'Calm Tools & Community',
      description: 'Open the sidebar anytime to explore peaceful focus timers, soothing ambient soundscapes, reset exercises, and supportive sharing.',
      placement: 'bottom'
    },
    {
      targetId: 'bottom-mellow-home-bar',
      fallbackSelector: '#bottom-mellow-home-bar',
      title: "Mellow's Cozy Sanctuary",
      description: 'Tap here to visit Mellow in her cozy room. As you progress gently through your day, comforting home treasures naturally unlock.',
      placement: 'top'
    }
  ],

  start() {
    this.isActive = true;
    this.currentStepIndex = 0;

    // Ensure we are on the home screen for the tour
    App.switchScreen('home');

    // Create tour overlay container if not present
    this.ensureOverlayExists();
    this.renderCurrentStep();

    window.addEventListener('resize', this._handleResize);
  },

  _handleResize() {
    if (AppTour.isActive) {
      AppTour.updatePosition();
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

    const isLastStep = this.currentStepIndex === this.steps.length - 1;
    const stepNum = this.currentStepIndex + 1;
    const totalSteps = this.steps.length;

    overlay.innerHTML = `
      <div id="tour-spotlight" class="tour-spotlight-box"></div>
      <div id="tour-tooltip" class="tour-tooltip-card">
        <div class="tour-tooltip-pointer" id="tour-pointer"></div>
        <div class="tour-header">
          <span class="tour-step-badge">Step ${stepNum} of ${totalSteps}</span>
          <button type="button" class="tour-skip-btn" onclick="AppTour.skip()" aria-label="Skip tour">Skip</button>
        </div>
        <h3 class="tour-title">${step.title}</h3>
        <p class="tour-description">${step.description}</p>
        <div class="tour-footer">
          <div class="tour-dots-indicator">
            ${this.steps.map((_, i) => `
              <span class="tour-dot ${i === this.currentStepIndex ? 'active' : ''}"></span>
            `).join('')}
          </div>
          <button type="button" class="primary-pill-btn tour-next-btn" onclick="AppTour.next()">
            <span>${isLastStep ? 'Get Started' : 'Next'}</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    `;

    // Position the spotlight and tooltip
    requestAnimationFrame(() => {
      this.updatePosition();
    });
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

    // Scroll element into view within the screen viewport if scrollable
    const viewport = document.querySelector('.app-screen-viewport');
    if (viewport && targetEl.closest('.app-screen-viewport')) {
      const elRect = targetEl.getBoundingClientRect();
      const vpRect = viewport.getBoundingClientRect();
      if (elRect.top < vpRect.top || elRect.bottom > vpRect.bottom) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    setTimeout(() => {
      const shellRect = shell.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      // Spotlight coordinates relative to shell
      const spotLeft = targetRect.left - shellRect.left;
      const spotTop = targetRect.top - shellRect.top;
      const spotWidth = targetRect.width;
      const spotHeight = targetRect.height;

      spotlight.style.left = `${spotLeft - 6}px`;
      spotlight.style.top = `${spotTop - 6}px`;
      spotlight.style.width = `${spotWidth + 12}px`;
      spotlight.style.height = `${spotHeight + 12}px`;
      spotlight.style.borderRadius = getComputedStyle(targetEl).borderRadius || '16px';

      // Tooltip position
      const tooltipHeight = tooltip.offsetHeight || 190;
      const tooltipWidth = Math.min(shellRect.width - 32, 330);
      tooltip.style.width = `${tooltipWidth}px`;

      let topPos;
      let leftPos = Math.max(16, (shellRect.width - tooltipWidth) / 2);

      if (step.placement === 'top' || spotTop > shellRect.height - 240) {
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
        topPos = spotTop + spotHeight + 16;
        if (pointer) {
          pointer.className = 'tour-tooltip-pointer pointer-up';
          const targetCenterX = spotLeft + (spotWidth / 2);
          const pointerLeft = Math.max(20, Math.min(tooltipWidth - 20, targetCenterX - leftPos));
          pointer.style.left = `${pointerLeft}px`;
        }
      }

      // Constrain within shell boundaries
      topPos = Math.max(16, Math.min(shellRect.height - tooltipHeight - 20, topPos));

      tooltip.style.left = `${leftPos}px`;
      tooltip.style.top = `${topPos}px`;
    }, 50);
  },

  next() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.renderCurrentStep();
    } else {
      this.finish();
    }
  },

  skip() {
    this.finish();
  },

  finish() {
    this.isActive = false;
    const overlay = document.getElementById('app-tour-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 250);
    }
    window.removeEventListener('resize', this._handleResize);
    App.setNotificationMessage("You are all set! Have a gentle, peaceful day.");
  },

  stop() {
    this.finish();
  }
};
