// Interactive Onboarding Tour Engine for Mellow
// STRICTLY ZERO EMOJIS - Clean vectors, soft typography, gentle spotlights.

const AppTour = {
  isActive: false,
  currentStepIndex: 0,
  _boundHandleResize: null,
  _boundHandleScroll: null,

  steps: [
    {
      targetId: 'home-mellow-illustration',
      fallbackSelector: '.home-hero-card',
      title: 'Meet Mellow',
      description: 'Your cozy companion rests quietly beside you throughout the day. No streaks, no guilt, no pressure—just gentle support at your own pace.',
      placement: 'bottom'
    },
    {
      targetId: 'energy-checkin-section',
      fallbackSelector: '.energy-checkin-section',
      title: 'Energy Check-In',
      description: 'Tap how your brain feels today. Mellow automatically softens your tasks and pacing to match your natural energy without overwhelm.',
      placement: 'bottom'
    },
    {
      targetId: 'home-right-now-container',
      fallbackSelector: '.right-now-section',
      title: 'One Gentle Step',
      description: 'To prevent cognitive overload, Mellow highlights only your single "Right Now" task, broken into tiny, manageable micro-steps.',
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
      description: 'Open the sidebar anytime to explore peaceful focus timers, soothing ambient soundscapes, reset tools, and supportive peer sharing.',
      placement: 'bottom'
    },
    {
      targetId: 'bottom-mellow-home-bar',
      fallbackSelector: '#bottom-mellow-home-bar',
      title: "Mellow's Cozy Sanctuary",
      description: 'Tap here to visit Mellow in her cozy room. As you complete little tasks, comforting room treasures naturally unlock over time.',
      placement: 'top'
    }
  ],

  start() {
    this.isActive = true;
    this.currentStepIndex = 0;

    // Ensure we are on the home screen
    if (typeof App !== 'undefined' && App.switchScreen) {
      App.switchScreen('home');
      if (App.closeSidebar) App.closeSidebar();
    }

    // Ensure overlay exists
    this.ensureOverlayExists();

    // Scroll viewport to top so tour starts from top smoothly
    const viewport = document.querySelector('.app-screen-viewport');
    if (viewport) {
      viewport.scrollTop = 0;
    }

    // Attach listener bindings
    this._boundHandleResize = () => {
      if (this.isActive) this.updatePosition();
    };
    this._boundHandleScroll = () => {
      if (this.isActive) this.updatePosition();
    };

    window.addEventListener('resize', this._boundHandleResize);
    if (viewport) {
      viewport.addEventListener('scroll', this._boundHandleScroll, { passive: true });
    }

    // Render first step
    setTimeout(() => {
      this.renderCurrentStep();
    }, 50);
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

    // Position the spotlight and tooltip immediately, and re-verify after DOM layout
    this.updatePosition();
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

    const shellRect = shell.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    // Ensure target element is reasonably visible within the viewport
    const viewport = document.querySelector('.app-screen-viewport');
    if (viewport && targetEl.closest('.app-screen-viewport')) {
      const vpRect = viewport.getBoundingClientRect();
      if (targetRect.top < vpRect.top + 10 || targetRect.bottom > vpRect.bottom - 10) {
        targetEl.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      }
    }

    // Recalculate targetRect after potential scroll adjustment
    const updatedTargetRect = targetEl.getBoundingClientRect();

    // Spotlight coordinates relative to shell
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
    const tooltipWidth = Math.min(shellRect.width - 32, 330);
    tooltip.style.width = `${tooltipWidth}px`;
    const tooltipHeight = tooltip.offsetHeight || 190;

    let leftPos = Math.max(16, (shellRect.width - tooltipWidth) / 2);
    let topPos;

    // Check if we place above or below
    const fitsBelow = (spotTop + spotHeight + tooltipHeight + 20) <= shellRect.height;
    const preferTop = step.placement === 'top' || !fitsBelow;

    if (preferTop && (spotTop - tooltipHeight - 16) >= 10) {
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

    // Keep tooltip strictly inside the phone frame
    topPos = Math.max(16, Math.min(shellRect.height - tooltipHeight - 16, topPos));

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

    if (this._boundHandleResize) {
      window.removeEventListener('resize', this._boundHandleResize);
    }
    const viewport = document.querySelector('.app-screen-viewport');
    if (viewport && this._boundHandleScroll) {
      viewport.removeEventListener('scroll', this._boundHandleScroll);
    }

    if (typeof App !== 'undefined' && App.setNotificationMessage) {
      App.setNotificationMessage("You are all set! Have a gentle, peaceful day.");
    }
  },

  stop() {
    this.finish();
  }
};

// Global export for inline event handlers and multi-module access
window.AppTour = AppTour;

