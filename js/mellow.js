// Mellow the Cat Companion & Virtual Cozy Room Engine
// STRICTLY ZERO EMOJIS - Visual vectors and soft typography only.

const MellowCat = {
  currentMood: 'calm',

  // Render highly detailed, warm, fluffy ginger Mellow the Cat SVG (Inspired by FullLogo.jpg)
  render(mood = null, size = 96) {
    const activeMood = mood || this.currentMood || 'calm';
    const isSleepy = activeMood === 'sleepy';
    const isHappy = activeMood === 'happy' || activeMood === 'proud';
    const isFocused = activeMood === 'focused';
    const isCozy = activeMood === 'cozy';

    MellowCat._idCounter = (MellowCat._idCounter || 0) + 1;
    const uid = `mc_${MellowCat._idCounter}_${Math.floor(Math.random() * 10000)}`;

    // Expressions & Mood paths
    let eyesSvg = '';
    let accessoriesSvg = '';
    let moodAccentsSvg = '';

    if (isSleepy) {
      eyesSvg = `
        <!-- Peaceful sleepy closed eyes -->
        <path d="M 48 56 Q 55 63 62 56" fill="none" stroke="#4E2717" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M 78 56 Q 85 63 92 56" fill="none" stroke="#4E2717" stroke-width="2.6" stroke-linecap="round"/>
      `;
      moodAccentsSvg = `
        <!-- Floating gentle dream bubbles -->
        <circle cx="106" cy="36" r="3" fill="#CE93D8" opacity="0.45"/>
        <circle cx="114" cy="26" r="4.5" fill="#CE93D8" opacity="0.55"/>
        <circle cx="123" cy="15" r="6" fill="#CE93D8" opacity="0.65"/>
      `;
    } else if (isHappy) {
      eyesSvg = `
        <!-- Joyful happy smiling crescent eyes (matching FullLogo style) -->
        <path d="M 47 57 Q 55 46 63 57" fill="none" stroke="#4E2717" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M 77 57 Q 85 46 93 57" fill="none" stroke="#4E2717" stroke-width="2.8" stroke-linecap="round"/>
      `;
      moodAccentsSvg = `
        <!-- Cheerful soft star sparkles -->
        <path d="M 33 48 L 35 52 L 39 53 L 35 54 L 33 58 L 31 54 L 27 53 L 31 52 Z" fill="#FFD54F" opacity="0.85"/>
        <path d="M 107 48 L 109 52 L 113 53 L 109 54 L 107 58 L 105 54 L 101 53 L 105 52 Z" fill="#FFD54F" opacity="0.85"/>
      `;
    } else if (isFocused) {
      eyesSvg = `
        <!-- Focused attentive eyes -->
        <ellipse cx="55" cy="55" rx="5" ry="5.5" fill="#4E2717"/>
        <circle cx="53.8" cy="53.2" r="1.8" fill="#FFFFFF"/>
        <path d="M 48 49 Q 55 46 62 50" fill="none" stroke="#6D3722" stroke-width="1.8" stroke-linecap="round"/>
        <ellipse cx="85" cy="55" rx="5" ry="5.5" fill="#4E2717"/>
        <circle cx="83.8" cy="53.2" r="1.8" fill="#FFFFFF"/>
        <path d="M 78 50 Q 85 46 92 49" fill="none" stroke="#6D3722" stroke-width="1.8" stroke-linecap="round"/>
      `;
      accessoriesSvg = `
        <!-- Detailed pastel studio headphones -->
        <path d="M 34 50 C 34 18 106 18 106 50" fill="none" stroke="#B39DDB" stroke-width="5" stroke-linecap="round"/>
        <path d="M 38 46 C 38 24 102 24 102 46" fill="none" stroke="#E1BEE7" stroke-width="2" stroke-linecap="round"/>
        <rect x="28" y="42" width="10" height="18" rx="5" fill="#9575CD"/>
        <rect x="25" y="45" width="4" height="12" rx="2" fill="#D1C4E9"/>
        <rect x="102" y="42" width="10" height="18" rx="5" fill="#9575CD"/>
        <rect x="111" y="45" width="4" height="12" rx="2" fill="#D1C4E9"/>
      `;
    } else if (isCozy) {
      eyesSvg = `
        <!-- Contented relaxed cozy eyes -->
        <path d="M 48 56 Q 55 61 62 56" fill="none" stroke="#4E2717" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M 78 56 Q 85 61 92 56" fill="none" stroke="#4E2717" stroke-width="2.4" stroke-linecap="round"/>
      `;
      accessoriesSvg = `
        <!-- Cozy knitted pastel blanket wrap -->
        <path d="M 28 86 C 45 78 95 78 112 86 C 116 98 108 112 70 112 C 32 112 24 98 28 86 Z" fill="#FFE0B2"/>
        <path d="M 38 90 C 50 85 90 85 102 90" fill="none" stroke="#FFCC80" stroke-width="2" stroke-linecap="round"/>
        <path d="M 42 98 C 55 94 85 94 98 98" fill="none" stroke="#FFCC80" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3,3"/>
      `;
    } else {
      // Default Calm mood: Large gentle warm espresso eyes with dual specular catchlights
      eyesSvg = `
        <!-- Left eye -->
        <ellipse cx="55" cy="55" rx="5.5" ry="6" fill="#4E2717"/>
        <circle cx="53.5" cy="53" r="2.2" fill="#FFFFFF"/>
        <circle cx="57" cy="57" r="1.1" fill="#FFFFFF"/>
        <path d="M 48 51 Q 55 47 62 51" fill="none" stroke="#6D3722" stroke-width="1.6" stroke-linecap="round"/>
        <!-- Right eye -->
        <ellipse cx="85" cy="55" rx="5.5" ry="6" fill="#4E2717"/>
        <circle cx="83.5" cy="53" r="2.2" fill="#FFFFFF"/>
        <circle cx="87" cy="57" r="1.1" fill="#FFFFFF"/>
        <path d="M 78 51 Q 85 47 92 51" fill="none" stroke="#6D3722" stroke-width="1.6" stroke-linecap="round"/>
      `;
    }

    return `
      <div class="mellow-avatar-wrapper" style="width: ${size}px; height: ${size}px;">
        <svg viewBox="0 0 140 130" class="mellow-cat-svg ${activeMood}">
          <defs>
            <!-- Warm ginger / apricot fur inspired by FullLogo.jpg -->
            <linearGradient id="catFurGrad_${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#F8B696"/>
              <stop offset="55%" stop-color="#E9926B"/>
              <stop offset="100%" stop-color="#D4774E"/>
            </linearGradient>
            <!-- Soft vanilla cream bib / chest patch -->
            <linearGradient id="catChestGrad_${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FFF4ED"/>
              <stop offset="100%" stop-color="#FDE5D5"/>
            </linearGradient>
            <!-- Soft warm rose inner ears -->
            <linearGradient id="catEarInner_${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#F6A8B9"/>
              <stop offset="100%" stop-color="#EA8A9F"/>
            </linearGradient>
            <!-- Swaying ginger tail gradient -->
            <linearGradient id="catTailGrad_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#D4774E"/>
              <stop offset="70%" stop-color="#E9926B"/>
              <stop offset="100%" stop-color="#F8B696"/>
            </linearGradient>
          </defs>

          <!-- Tail with rhythmic sway -->
          <g class="mellow-tail">
            <path d="M 34 96 C 14 92 4 75 10 56 C 14 44 26 46 24 57 C 21 68 28 80 42 84" fill="none" stroke="url(#catTailGrad_${uid})" stroke-width="7" stroke-linecap="round"/>
            <circle cx="10" cy="56" r="4.5" fill="#FFF5ED"/>
          </g>

          <!-- Plump Fluffy Body -->
          <g class="mellow-cat-breathe">
            <path d="M 36 94 C 34 72 48 58 70 58 C 92 58 106 72 104 94 C 104 110 92 116 70 116 C 48 116 36 110 36 94 Z" fill="url(#catFurGrad_${uid})"/>
            
            <!-- Fluffy Chest Bib -->
            <path d="M 54 70 C 58 66 66 68 70 74 C 74 68 82 66 86 70 C 90 82 85 98 70 98 C 55 98 50 82 54 70 Z" fill="url(#catChestGrad_${uid})"/>
            <!-- Chest fluff tuft line -->
            <path d="M 64 78 Q 70 82 70 86 Q 70 82 76 78" fill="none" stroke="#ECC9B5" stroke-width="1.3" stroke-linecap="round"/>

            <!-- Front Paws with Toe Creases (matching FullLogo warm ginger paws) -->
            <rect x="52" y="98" width="16" height="12" rx="6" fill="#F7A581" stroke="#8A4A31" stroke-width="1.2"/>
            <line x1="57" y1="104" x2="57" y2="108" stroke="#8A4A31" stroke-width="1.2" stroke-linecap="round"/>
            <line x1="62" y1="104" x2="62" y2="108" stroke="#8A4A31" stroke-width="1.2" stroke-linecap="round"/>

            <rect x="72" y="98" width="16" height="12" rx="6" fill="#F7A581" stroke="#8A4A31" stroke-width="1.2"/>
            <line x1="77" y1="104" x2="77" y2="108" stroke="#8A4A31" stroke-width="1.2" stroke-linecap="round"/>
            <line x1="82" y1="104" x2="82" y2="108" stroke="#8A4A31" stroke-width="1.2" stroke-linecap="round"/>
          </g>

          <!-- Ears -->
          <!-- Left Ear -->
          <path d="M 40 40 C 35 19 51 17 58 32 Z" fill="url(#catFurGrad_${uid})"/>
          <path d="M 44 37 C 40 25 49 23 54 32 Z" fill="url(#catEarInner_${uid})"/>
          <path d="M 47 34 Q 53 32 50 38" fill="none" stroke="#FFF4ED" stroke-width="1.5" stroke-linecap="round"/>

          <!-- Right Ear -->
          <path d="M 100 40 C 105 19 89 17 82 32 Z" fill="url(#catFurGrad_${uid})"/>
          <path d="M 96 37 C 100 25 91 23 86 32 Z" fill="url(#catEarInner_${uid})"/>
          <path d="M 93 34 Q 87 32 90 38" fill="none" stroke="#FFF4ED" stroke-width="1.5" stroke-linecap="round"/>

          <!-- Head with Chubby Cheek Fluff -->
          <path d="M 70 28 C 96 28 108 42 108 56 C 111 60 112 66 107 70 C 110 74 107 78 102 79 C 96 85 84 86 70 86 C 56 86 44 85 38 79 C 33 78 30 74 33 70 C 28 66 29 60 32 56 C 32 42 44 28 70 28 Z" fill="url(#catFurGrad_${uid})"/>

          <!-- Warm Cinnamon Chocolate Whiskers (FullLogo inspo) -->
          <!-- Left Whiskers -->
          <path d="M 48 64 C 36 61 24 63 18 67" fill="none" stroke="#7E412A" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M 47 68 C 35 68 25 71 19 76" fill="none" stroke="#7E412A" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M 48 72 C 37 74 28 79 22 84" fill="none" stroke="#7E412A" stroke-width="1.4" stroke-linecap="round"/>
          <!-- Right Whiskers -->
          <path d="M 92 64 C 104 61 116 63 122 67" fill="none" stroke="#7E412A" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M 93 68 C 105 68 115 71 121 76" fill="none" stroke="#7E412A" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M 92 72 C 103 74 112 79 118 84" fill="none" stroke="#7E412A" stroke-width="1.4" stroke-linecap="round"/>

          <!-- Soft Cheek Blush & Gentle Freckles -->
          <ellipse cx="48" cy="67" rx="7" ry="4.5" fill="#F89CAE" opacity="0.85"/>
          <ellipse cx="92" cy="67" rx="7" ry="4.5" fill="#F89CAE" opacity="0.85"/>
          <circle cx="47" cy="66" r="0.8" fill="#D4607B" opacity="0.5"/>
          <circle cx="50" cy="68" r="0.8" fill="#D4607B" opacity="0.5"/>
          <circle cx="93" cy="66" r="0.8" fill="#D4607B" opacity="0.5"/>
          <circle cx="90" cy="68" r="0.8" fill="#D4607B" opacity="0.5"/>

          <!-- Eyes based on current mood -->
          ${eyesSvg}

          <!-- Rosy Kitten Nose with soft specular catchlight (FullLogo inspo) -->
          <path d="M 68 64.5 C 68 63 72 63 72 64.5 C 72 66 70 67 70 67 C 70 67 68 66 68 64.5 Z" fill="#E76A8B"/>
          <circle cx="69.2" cy="64.2" r="0.7" fill="#FFFFFF"/>

          <!-- Sweet Kitten Mouth -->
          <path d="M 65 67.8 Q 70 71 70 67.8 Q 70 71 75 67.8" fill="none" stroke="#6D3722" stroke-width="1.8" stroke-linecap="round"/>

          <!-- Mood Accents and Accessories -->
          ${moodAccentsSvg}
          ${accessoriesSvg}
        </svg>
      </div>
    `;
  },

  // Contextual supportive phrases (Strictly zero emojis!)
  dialogues: {
    greetingMorning: "Good morning. Let's take today one little step at a time.",
    greetingAfternoon: "Good afternoon. Moving gently through the day.",
    greetingEvening: "Good evening. Whatever you did today is enough.",
    lowEnergy: "We will keep today small. Tiny steps count just as much.",
    okayEnergy: "A steady, quiet day. Just picking one thing is plenty.",
    goodEnergy: "Feeling clear and centered. Let's find one nice step.",
    highEnergy: "Ready for flow. Pick whatever feels inspiring.",
    taskCompleted: "Nice. One thing off your mind.",
    taskBrokenDown: "That looks much more friendly now. Just the first step.",
    focusStarted: "Okay, let's just start gently.",
    focusPaused: "Pausing is good. Catch your breath.",
    focusFinished: "Nice work. Bestie, you deserve a little pause.",
    parkedThought: "Got it. Safely parked so your mind can rest.",
    missedTask: "That is completely okay. Want to move it to another day?",
    breathePrompt: "Soft belly, quiet shoulders. Just breathing.",
    comfortPrompt: "You don't have to do everything today."
  },

  // Collectibles in Mellow's Room (Pure visual collection, NO numerical counter!)
  collectibles: [
    {
      id: 'succulent',
      name: 'Potted Jade Succulent',
      unlocked: true,
      description: 'A resilient little green jade plant in a warm terracotta pot.',
      roomPosition: 'shelf-left'
    },
    {
      id: 'tea_mug',
      name: 'Steaming Ceramic Mug',
      unlocked: true,
      description: 'A warm cup of chamomile tea quietly steaming on the wooden desk.',
      roomPosition: 'desk-left'
    },
    {
      id: 'star_lantern',
      name: 'Star Paper Lantern',
      unlocked: true,
      description: 'A glowing origami star lantern casting a soft honey aura near the window.',
      roomPosition: 'window-hanging'
    },
    {
      id: 'cushion',
      name: 'Loomed Mint Cushion',
      unlocked: false,
      description: 'An extra fluffy tufted floor pillow for gentle pauses beside the rug.',
      roomPosition: 'floor-cushion'
    },
    {
      id: 'plushie',
      name: 'Felt Bear Plushie',
      unlocked: false,
      description: 'A cozy handcrafted felt companion resting on the woven rug.',
      roomPosition: 'rug-plushie'
    },
    {
      id: 'seashell',
      name: 'Smooth Shore Shell',
      unlocked: false,
      description: 'A pearlescent scallop shell with iridescent coral sheen.',
      roomPosition: 'shelf-right'
    },
    {
      id: 'headphones',
      name: 'Lofi Listening Set',
      unlocked: false,
      description: 'Lilac padded headphones resting on the wooden study desk.',
      roomPosition: 'desk-right'
    },
    {
      id: 'fairy_lights',
      name: 'Warm Fairy String Lights',
      unlocked: false,
      description: 'Delicate glowing amber bulbs draped warmly across the window wall.',
      roomPosition: 'wall-lights'
    }
  ],

  getStorageKey(email) {
    if (typeof AuthManager !== 'undefined' && AuthManager.getUserStorageKey) {
      return AuthManager.getUserStorageKey('mellow_collectibles', email);
    }
    return 'mellow_collectibles';
  },

  loadForAccount(email, isNewSignUp) {
    const key = this.getStorageKey(email);
    const baseIds = ['succulent', 'tea_mug', 'star_lantern'];
    if (isNewSignUp) {
      this.collectibles.forEach(c => {
        c.unlocked = baseIds.includes(c.id);
      });
      this.saveCollectibles(email);
    } else {
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          const unlockedIds = JSON.parse(saved);
          this.collectibles.forEach(c => {
            c.unlocked = unlockedIds.includes(c.id);
          });
        } else {
          const legacy = localStorage.getItem('mellow_collectibles');
          const unlockedIds = legacy ? JSON.parse(legacy) : baseIds;
          this.collectibles.forEach(c => {
            c.unlocked = unlockedIds.includes(c.id);
          });
          this.saveCollectibles(email);
        }
      } catch (e) {
        this.collectibles.forEach(c => {
          c.unlocked = baseIds.includes(c.id);
        });
      }
    }
    if (typeof App !== 'undefined' && App.renderFullRoomScreen) {
      App.renderFullRoomScreen();
    }
  },

  resetToDefault() {
    const baseIds = ['succulent', 'tea_mug', 'star_lantern'];
    this.collectibles.forEach(c => {
      c.unlocked = baseIds.includes(c.id);
    });
    if (typeof App !== 'undefined' && App.renderFullRoomScreen) {
      App.renderFullRoomScreen();
    }
  },

  // Load unlocked state from localStorage
  initCollectibles() {
    const email = typeof AuthManager !== 'undefined' && AuthManager.currentUser ? AuthManager.currentUser.email : null;
    this.loadForAccount(email, false);
  },

  saveCollectibles(optionalEmail) {
    const email = optionalEmail || (typeof AuthManager !== 'undefined' && AuthManager.currentUser ? AuthManager.currentUser.email : null);
    const key = this.getStorageKey(email);
    try {
      const unlockedIds = this.collectibles.filter(c => c.unlocked).map(c => c.id);
      localStorage.setItem(key, JSON.stringify(unlockedIds));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  },

  isUnlocked(id) {
    const item = this.collectibles.find(c => c.id === id);
    return item ? item.unlocked : false;
  },

  // Occasionally unlock an item when meaningful progress happens
  maybeUnlockCollectible(triggerName = '') {
    const locked = this.collectibles.filter(c => !c.unlocked);
    if (locked.length === 0) return null;

    const item = locked[0];
    item.unlocked = true;
    this.saveCollectibles();
    this.showGiftModal(item);
    return item;
  },

  // Render the Gift discovery popup
  showGiftModal(item) {
    const modal = document.getElementById('gift-modal');
    if (!modal) return;
    const content = modal.querySelector('.gift-modal-body');
    content.innerHTML = `
      <div class="gift-animation-box">
        <div class="gift-icon-badge">${this.renderCollectibleArtwork(item.id, false, 72)}</div>
      </div>
      <div class="mellow-bubble-gift">
        <span class="mellow-mini-cat">${this.render('happy', 54)}</span>
        <p class="gift-dialogue">I found something cozy for our room.</p>
      </div>
      <div class="discovered-item-card">
        <h4 class="item-title">${item.name}</h4>
        <p class="item-desc">${item.description}</p>
      </div>
      <p class="gift-quiet-note">Placed gently in Mellow's room.</p>
      <button class="primary-pill-btn" onclick="MellowCat.closeGiftModal()">Keep resting</button>
    `;
    modal.classList.add('active');
  },

  closeGiftModal() {
    const modal = document.getElementById('gift-modal');
    if (modal) modal.classList.remove('active');
  },

  showItemDetail(id) {
    const item = this.collectibles.find(c => c.id === id);
    if (!item || !item.unlocked) return;
    const modal = document.getElementById('gift-modal');
    if (!modal) return;
    const content = modal.querySelector('.gift-modal-body');
    content.innerHTML = `
      <div class="gift-animation-box">
        <div class="gift-icon-badge">${this.renderCollectibleArtwork(item.id, false, 80)}</div>
      </div>
      <div class="mellow-bubble-gift">
        <span class="mellow-mini-cat">${this.render('cozy', 50)}</span>
        <p class="gift-dialogue">One of our gentle home memories.</p>
      </div>
      <div class="discovered-item-card">
        <h4 class="item-title">${item.name}</h4>
        <p class="item-desc">${item.description}</p>
      </div>
      <button class="primary-pill-btn" onclick="MellowCat.closeGiftModal()">Close</button>
    `;
    modal.classList.add('active');
  },

  // Render Rich, Colorful, Realistic SVG Home Objects
  renderCollectibleArtwork(id, isSilhouette = false, size = 64) {
    const silClass = isSilhouette ? 'is-silhouette' : '';
    
    switch (id) {
      case 'succulent':
        return `
          <svg viewBox="0 0 80 80" class="real-room-item-svg succulent-art ${silClass}" style="width:${size}px; height:${size}px;">
            <defs>
              <linearGradient id="potGrad_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E57357"/>
                <stop offset="60%" stop-color="#C85237"/>
                <stop offset="100%" stop-color="#9C3620"/>
              </linearGradient>
              <linearGradient id="leafGrad1_${id}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#81C784"/>
                <stop offset="100%" stop-color="#2E7D32"/>
              </linearGradient>
              <linearGradient id="leafGrad2_${id}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#A5D6A7"/>
                <stop offset="100%" stop-color="#388E3C"/>
              </linearGradient>
              <linearGradient id="soilGrad_${id}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#5D4037"/>
                <stop offset="100%" stop-color="#3E2723"/>
              </linearGradient>
            </defs>
            <ellipse cx="40" cy="74" rx="18" ry="4" fill="rgba(0,0,0,0.18)"/>
            <path d="M 24 50 L 28 70 Q 40 73 52 70 L 56 50 Z" fill="url(#potGrad_${id})"/>
            <rect x="22" y="44" width="36" height="8" rx="3" fill="#E57357"/>
            <rect x="23" y="45" width="34" height="2" rx="1" fill="#FFAB91" opacity="0.6"/>
            <ellipse cx="40" cy="46" rx="16" ry="3.5" fill="url(#soilGrad_${id})"/>
            <path d="M 40 45 C 30 35 23 38 27 47 Z" fill="url(#leafGrad1_${id})"/>
            <path d="M 40 45 C 50 35 57 38 53 47 Z" fill="url(#leafGrad1_${id})"/>
            <path d="M 40 45 C 33 24 47 24 40 45 Z" fill="url(#leafGrad2_${id})"/>
            <path d="M 40 45 C 24 42 24 28 37 35 Z" fill="url(#leafGrad2_${id})"/>
            <circle cx="27" cy="33" r="2" fill="#F48FB1"/>
            <path d="M 40 45 C 56 42 56 28 43 35 Z" fill="url(#leafGrad2_${id})"/>
            <circle cx="53" cy="33" r="2" fill="#F48FB1"/>
            <path d="M 33 46 C 35 39 45 39 47 46 Z" fill="#81C784"/>
            <circle cx="40" cy="26" r="1.6" fill="#F48FB1"/>
            <circle cx="38" cy="31" r="1.3" fill="#FFFFFF" opacity="0.75"/>
          </svg>
        `;

      case 'tea_mug':
        return `
          <svg viewBox="0 0 80 80" class="real-room-item-svg tea-mug-art ${silClass}" style="width:${size}px; height:${size}px;">
            <defs>
              <linearGradient id="mugGrad_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFE0B2"/>
                <stop offset="60%" stop-color="#FFCC80"/>
                <stop offset="100%" stop-color="#FFA726"/>
              </linearGradient>
              <linearGradient id="teaGrad_${id}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#D7CCC8"/>
                <stop offset="40%" stop-color="#A1887F"/>
                <stop offset="100%" stop-color="#6D4C41"/>
              </linearGradient>
            </defs>
            <ellipse cx="40" cy="72" rx="20" ry="4" fill="rgba(0,0,0,0.16)"/>
            <path d="M 52 46 C 68 46 68 64 52 64" fill="none" stroke="#FFA726" stroke-width="5" stroke-linecap="round"/>
            <path d="M 52 47 C 65 47 65 63 52 63" fill="none" stroke="#FFE0B2" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M 24 42 C 24 64 28 69 40 69 C 52 69 56 64 56 42 Z" fill="url(#mugGrad_${id})"/>
            <path d="M 28 46 C 27 54 29 62 33 65" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
            <ellipse cx="40" cy="42" rx="16" ry="4.5" fill="#FFE0B2"/>
            <ellipse cx="40" cy="43" rx="14" ry="3.5" fill="url(#teaGrad_${id})"/>
            <path d="M 36 34 Q 32 26 37 20 Q 42 15 37 9" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity="0.75" class="steam-wisp-1"/>
            <path d="M 44 32 Q 48 24 43 18 Q 39 12 44 7" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity="0.6" class="steam-wisp-2"/>
            <path d="M 40 57 C 38 54 35 54 35 56 C 35 58 40 61 40 61 C 40 61 45 58 45 56 C 45 54 42 54 40 57 Z" fill="#E57373" opacity="0.9"/>
          </svg>
        `;

      case 'star_lantern':
        return `
          <svg viewBox="0 0 80 90" class="real-room-item-svg star-lantern-art ${silClass}" style="width:${size}px; height:${Math.round(size * 1.12)}px;">
            <defs>
              <radialGradient id="starGlow_${id}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#FFE082" stop-opacity="0.85"/>
                <stop offset="55%" stop-color="#FFCA28" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#FFA000" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="fGold1_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFF9C4"/>
                <stop offset="100%" stop-color="#FFD54F"/>
              </linearGradient>
              <linearGradient id="fGold2_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFCA28"/>
                <stop offset="100%" stop-color="#FF8F00"/>
              </linearGradient>
              <linearGradient id="fGold3_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFE082"/>
                <stop offset="100%" stop-color="#FFB300"/>
              </linearGradient>
            </defs>
            <line x1="40" y1="0" x2="40" y2="20" stroke="#8D6E63" stroke-width="1.6" stroke-dasharray="2,2"/>
            <circle cx="40" cy="42" r="34" fill="url(#starGlow_${id})" class="lantern-soft-glow"/>
            <g class="origami-star">
              <polygon points="40,22 40,42 33,35" fill="url(#fGold1_${id})"/>
              <polygon points="40,22 40,42 47,35" fill="url(#fGold2_${id})"/>
              <polygon points="58,26 40,42 47,35" fill="url(#fGold3_${id})"/>
              <polygon points="58,26 40,42 52,44" fill="url(#fGold2_${id})"/>
              <polygon points="62,42 40,42 52,44" fill="url(#fGold1_${id})"/>
              <polygon points="62,42 40,42 50,51" fill="url(#fGold2_${id})"/>
              <polygon points="54,58 40,42 50,51" fill="url(#fGold3_${id})"/>
              <polygon points="54,58 40,42 40,54" fill="url(#fGold2_${id})"/>
              <polygon points="40,62 40,42 40,54" fill="url(#fGold1_${id})"/>
              <polygon points="40,62 40,42 33,52" fill="url(#fGold2_${id})"/>
              <polygon points="26,58 40,42 33,52" fill="url(#fGold3_${id})"/>
              <polygon points="26,58 40,42 28,44" fill="url(#fGold2_${id})"/>
              <polygon points="18,42 40,42 28,44" fill="url(#fGold1_${id})"/>
              <polygon points="18,42 40,42 33,35" fill="url(#fGold2_${id})"/>
              <polygon points="24,26 40,42 33,35" fill="url(#fGold3_${id})"/>
              <polygon points="24,26 40,42 40,22" fill="url(#fGold2_${id})"/>
              <circle cx="40" cy="42" r="3.5" fill="#FFFFFF" opacity="0.95"/>
            </g>
            <line x1="40" y1="62" x2="40" y2="70" stroke="#FFB300" stroke-width="2"/>
            <path d="M 37 70 L 43 70 L 41 82 L 39 82 Z" fill="#FF8F00"/>
          </svg>
        `;

      case 'cushion':
        return `
          <svg viewBox="0 0 80 80" class="real-room-item-svg cushion-art ${silClass}" style="width:${size}px; height:${size}px;">
            <defs>
              <linearGradient id="mintCushGrad_${id}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#C8E6C9"/>
                <stop offset="50%" stop-color="#A5D6A7"/>
                <stop offset="100%" stop-color="#66BB6A"/>
              </linearGradient>
              <radialGradient id="tuftShade_${id}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#2E7D32" stop-opacity="0.45"/>
                <stop offset="100%" stop-color="#2E7D32" stop-opacity="0"/>
              </radialGradient>
            </defs>
            <ellipse cx="40" cy="68" rx="26" ry="6" fill="rgba(0,0,0,0.18)"/>
            <rect x="15" y="28" width="50" height="38" rx="18" fill="url(#mintCushGrad_${id})"/>
            <path d="M 22 34 Q 40 47 58 34" fill="none" stroke="#81C784" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M 22 60 Q 40 47 58 60" fill="none" stroke="#81C784" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M 18 47 Q 40 47 62 47" fill="none" stroke="#81C784" stroke-width="1.6" stroke-linecap="round"/>
            <circle cx="40" cy="47" r="7" fill="url(#tuftShade_${id})"/>
            <circle cx="40" cy="47" r="3.2" fill="#388E3C"/>
            <circle cx="39.2" cy="46.2" r="1.2" fill="#C8E6C9"/>
            <rect x="15" y="28" width="50" height="38" rx="18" fill="none" stroke="#C8E6C9" stroke-width="2"/>
          </svg>
        `;

      case 'plushie':
        return `
          <svg viewBox="0 0 80 80" class="real-room-item-svg bear-plushie-art ${silClass}" style="width:${size}px; height:${size}px;">
            <defs>
              <linearGradient id="bearFur_${id}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#D7CCC8"/>
                <stop offset="50%" stop-color="#BCAAA4"/>
                <stop offset="100%" stop-color="#8D6E63"/>
              </linearGradient>
              <linearGradient id="bearSnout_${id}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FFF3E0"/>
                <stop offset="100%" stop-color="#FFE0B2"/>
              </linearGradient>
            </defs>
            <ellipse cx="40" cy="74" rx="20" ry="4" fill="rgba(0,0,0,0.18)"/>
            <ellipse cx="40" cy="54" rx="18" ry="17" fill="url(#bearFur_${id})"/>
            <ellipse cx="40" cy="56" rx="10" ry="11" fill="url(#bearSnout_${id})"/>
            <path d="M 40 50 L 40 62" stroke="#8D6E63" stroke-width="1.2" stroke-dasharray="2,2"/>
            <ellipse cx="26" cy="67" rx="8" ry="6" fill="#8D6E63"/>
            <ellipse cx="26" cy="67" rx="5" ry="3.5" fill="#D7CCC8"/>
            <ellipse cx="54" cy="67" rx="8" ry="6" fill="#8D6E63"/>
            <ellipse cx="54" cy="67" rx="5" ry="3.5" fill="#D7CCC8"/>
            <ellipse cx="25" cy="50" rx="6" ry="5" fill="#A1887F"/>
            <ellipse cx="55" cy="50" rx="6" ry="5" fill="#A1887F"/>
            <circle cx="27" cy="22" r="7" fill="#8D6E63"/>
            <circle cx="27" cy="22" r="4" fill="#FFE0B2"/>
            <circle cx="53" cy="22" r="7" fill="#8D6E63"/>
            <circle cx="53" cy="22" r="4" fill="#FFE0B2"/>
            <ellipse cx="40" cy="32" rx="16" ry="14" fill="url(#bearFur_${id})"/>
            <ellipse cx="40" cy="36" rx="7" ry="5.5" fill="url(#bearSnout_${id})"/>
            <ellipse cx="40" cy="34" rx="2.5" ry="1.8" fill="#3E2723"/>
            <path d="M 40 35.8 L 40 38.5" stroke="#3E2723" stroke-width="1.2"/>
            <circle cx="33" cy="29" r="2.2" fill="#212121"/>
            <circle cx="32.4" cy="28.4" r="0.8" fill="#FFFFFF"/>
            <circle cx="47" cy="29" r="2.2" fill="#212121"/>
            <circle cx="46.4" cy="28.4" r="0.8" fill="#FFFFFF"/>
            <path d="M 28 42 C 34 46 46 46 52 42 C 54 44 50 48 40 48 C 30 48 26 44 28 42 Z" fill="#E57373"/>
            <rect x="44" y="44" width="6" height="12" rx="2" fill="#EF5350"/>
            <line x1="44" y1="54" x2="50" y2="54" stroke="#FFCDD2" stroke-width="1.2"/>
          </svg>
        `;

      case 'seashell':
        return `
          <svg viewBox="0 0 80 80" class="real-room-item-svg seashell-art ${silClass}" style="width:${size}px; height:${size}px;">
            <defs>
              <linearGradient id="shellPearlL_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFF0F5"/>
                <stop offset="30%" stop-color="#FFD1DC"/>
                <stop offset="70%" stop-color="#E1BEE7"/>
                <stop offset="100%" stop-color="#B2EBF2"/>
              </linearGradient>
            </defs>
            <ellipse cx="40" cy="72" rx="22" ry="4" fill="rgba(0,0,0,0.14)"/>
            <path d="M 40 68 C 22 55 12 40 18 28 C 24 16 35 18 40 22 C 45 18 56 16 62 28 C 68 40 58 55 40 68 Z" fill="url(#shellPearlL_${id})"/>
            <path d="M 40 68 Q 28 48 24 30" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" opacity="0.85"/>
            <path d="M 40 68 Q 34 46 32 25" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" opacity="0.85"/>
            <path d="M 40 68 L 40 23" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" opacity="0.9"/>
            <path d="M 40 68 Q 46 46 48 25" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" opacity="0.85"/>
            <path d="M 40 68 Q 52 48 56 30" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" opacity="0.85"/>
            <circle cx="40" cy="62" r="6" fill="#FFFDE7"/>
            <circle cx="38.5" cy="60.5" r="2.2" fill="#FFFFFF"/>
            <circle cx="30" cy="38" r="1.5" fill="#FFFFFF" opacity="0.8"/>
          </svg>
        `;

      case 'headphones':
        return `
          <svg viewBox="0 0 80 80" class="real-room-item-svg headphones-art ${silClass}" style="width:${size}px; height:${size}px;">
            <defs>
              <linearGradient id="headbandL_${id}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#D1C4E9"/>
                <stop offset="60%" stop-color="#B39DDB"/>
                <stop offset="100%" stop-color="#7E57C2"/>
              </linearGradient>
              <linearGradient id="brassM_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFE082"/>
                <stop offset="50%" stop-color="#FFB300"/>
                <stop offset="100%" stop-color="#FF8F00"/>
              </linearGradient>
            </defs>
            <ellipse cx="40" cy="72" rx="24" ry="4" fill="rgba(0,0,0,0.16)"/>
            <path d="M 18 52 C 18 16 62 16 62 52" fill="none" stroke="url(#headbandL_${id})" stroke-width="6.5" stroke-linecap="round"/>
            <path d="M 23 46 C 23 20 57 20 57 46" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
            <rect x="14" y="44" width="7" height="12" rx="2" fill="url(#brassM_${id})"/>
            <rect x="59" y="44" width="7" height="12" rx="2" fill="url(#brassM_${id})"/>
            <rect x="10" y="48" width="15" height="22" rx="7.5" fill="#9575CD"/>
            <rect x="13" y="51" width="9" height="16" rx="4.5" fill="#D1C4E9"/>
            <rect x="55" y="48" width="15" height="22" rx="7.5" fill="#9575CD"/>
            <rect x="58" y="51" width="9" height="16" rx="4.5" fill="#D1C4E9"/>
            <rect x="23" y="51" width="4" height="16" rx="2" fill="#5E35B1"/>
            <rect x="53" y="51" width="4" height="16" rx="2" fill="#5E35B1"/>
            <path d="M 17 70 Q 20 74 24 72 Q 28 70 32 73 Q 36 76 40 73" fill="none" stroke="#7E57C2" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        `;

      case 'fairy_lights':
        return `
          <svg viewBox="0 0 280 44" class="real-room-item-svg fairy-lights-art ${silClass}" style="width: 100%; height: auto;">
            <defs>
              <radialGradient id="bulbGlow_${id}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#FFF9C4" stop-opacity="0.95"/>
                <stop offset="40%" stop-color="#FFD54F" stop-opacity="0.65"/>
                <stop offset="100%" stop-color="#FF8F00" stop-opacity="0"/>
              </radialGradient>
            </defs>
            <path d="M 0 12 Q 35 26 70 14 Q 105 28 140 14 Q 175 28 210 14 Q 245 28 280 12" fill="none" stroke="#5D4037" stroke-width="1.4"/>
            <circle cx="35" cy="24" r="14" fill="url(#bulbGlow_${id})" class="bulb-halo"/>
            <rect x="33.5" y="19" width="3" height="3" rx="1" fill="#8D6E63"/>
            <ellipse cx="35" cy="24" rx="3.5" ry="4.5" fill="#FFE082"/>
            <circle cx="34.2" cy="23" r="1" fill="#FFFFFF"/>
            <circle cx="70" cy="14" r="14" fill="url(#bulbGlow_${id})" class="bulb-halo"/>
            <rect x="68.5" y="9" width="3" height="3" rx="1" fill="#8D6E63"/>
            <ellipse cx="70" cy="14" rx="3.5" ry="4.5" fill="#FFE082"/>
            <circle cx="69.2" cy="13" r="1" fill="#FFFFFF"/>
            <circle cx="105" cy="24" r="14" fill="url(#bulbGlow_${id})" class="bulb-halo"/>
            <rect x="103.5" y="19" width="3" height="3" rx="1" fill="#8D6E63"/>
            <ellipse cx="105" cy="24" rx="3.5" ry="4.5" fill="#FFE082"/>
            <circle cx="104.2" cy="23" r="1" fill="#FFFFFF"/>
            <circle cx="140" cy="14" r="14" fill="url(#bulbGlow_${id})" class="bulb-halo"/>
            <rect x="138.5" y="9" width="3" height="3" rx="1" fill="#8D6E63"/>
            <ellipse cx="140" cy="14" rx="3.5" ry="4.5" fill="#FFE082"/>
            <circle cx="139.2" cy="13" r="1" fill="#FFFFFF"/>
            <circle cx="175" cy="24" r="14" fill="url(#bulbGlow_${id})" class="bulb-halo"/>
            <rect x="173.5" y="19" width="3" height="3" rx="1" fill="#8D6E63"/>
            <ellipse cx="175" cy="24" rx="3.5" ry="4.5" fill="#FFE082"/>
            <circle cx="174.2" cy="23" r="1" fill="#FFFFFF"/>
            <circle cx="210" cy="14" r="14" fill="url(#bulbGlow_${id})" class="bulb-halo"/>
            <rect x="208.5" y="9" width="3" height="3" rx="1" fill="#8D6E63"/>
            <ellipse cx="210" cy="14" rx="3.5" ry="4.5" fill="#FFE082"/>
            <circle cx="209.2" cy="13" r="1" fill="#FFFFFF"/>
            <circle cx="245" cy="24" r="14" fill="url(#bulbGlow_${id})" class="bulb-halo"/>
            <rect x="243.5" y="19" width="3" height="3" rx="1" fill="#8D6E63"/>
            <ellipse cx="245" cy="24" rx="3.5" ry="4.5" fill="#FFE082"/>
            <circle cx="244.2" cy="23" r="1" fill="#FFFFFF"/>
          </svg>
        `;

      default:
        return '';
    }
  },

  // Render a specific collectible slot inside the cozy room
  renderObjectSlot(id, customSize = 48) {
    const item = this.collectibles.find(c => c.id === id);
    if (!item) return '';
    const isSil = !item.unlocked;
    return `
      <div class="room-object-interactive ${item.roomPosition} ${isSil ? 'is-silhouette' : 'is-unlocked'}" 
           onclick="MellowCat.showItemDetail('${item.id}')" 
           title="${item.unlocked ? item.name : 'Quiet Discovery (Unlocks gently)'}">
        ${this.renderCollectibleArtwork(item.id, isSil, customSize)}
      </div>
    `;
  },

  // Render the Visual Cozy Room Scene — authentic, warm home aesthetics
  // NO NUMBER COUNTERS! Pure visual room and visual collection.
  renderRoomView() {
    const fairyLightsUnlocked = this.isUnlocked('fairy_lights');

    return `
      <div class="cozy-room-container">
        <div class="cozy-room-scene">
          
          <!-- ROOM WALL & AMBIENCE -->
          <div class="room-wall-structure">
            <div class="room-wall-accent-strip"></div>
            
            <!-- Mini Framed Wall Picture -->
            <div class="room-mini-wall-art">
              <div class="wall-frame">
                <div class="frame-art-landscape"></div>
              </div>
            </div>

            <!-- Warm Fairy Lights Draped Along Wall -->
            <div class="room-fairy-lights-layer ${fairyLightsUnlocked ? 'is-unlocked' : 'is-silhouette'}" onclick="MellowCat.showItemDetail('fairy_lights')">
              ${this.renderCollectibleArtwork('fairy_lights', !fairyLightsUnlocked, 280)}
            </div>

            <!-- Warm Sunlit / Moonlit Bay Window with Curtains -->
            <div class="room-bay-window">
              <!-- Window Outside View -->
              <div class="window-exterior-sky">
                <div class="window-celestial-sun"></div>
                <div class="window-celestial-moon"></div>
                <div class="window-rolling-meadow"></div>
                <div class="window-drifting-cloud cloud-a"></div>
                <div class="window-drifting-cloud cloud-b"></div>
                <div class="window-night-stars">
                  <span class="star-dot s1"></span>
                  <span class="star-dot s2"></span>
                  <span class="star-dot s3"></span>
                </div>
              </div>

              <!-- Flowing Linen Curtains framing the window -->
              <div class="window-curtain left-curtain"></div>
              <div class="window-curtain right-curtain"></div>

              <!-- Wooden Window Frame with Mullions -->
              <div class="window-wood-frame">
                <div class="window-wood-divider-vert"></div>
                <div class="window-wood-divider-horiz"></div>
              </div>

              <!-- Deep Wooden Window Sill -->
              <div class="window-wooden-sill"></div>
            </div>

            <!-- Hanging Origami Star Lantern from Window Header -->
            <div class="room-hanging-star-slot">
              ${this.renderObjectSlot('star_lantern', 54)}
            </div>

            <!-- Real Wooden Wall Bookshelf -->
            <div class="room-wood-bookshelf">
              <div class="shelf-books-row">
                <span class="deco-book b1"></span>
                <span class="deco-book b2"></span>
                <span class="deco-book b3"></span>
                <span class="deco-book b4"></span>
              </div>
              <div class="shelf-wooden-board"></div>
              <div class="shelf-support-bracket left"></div>
              <div class="shelf-support-bracket right"></div>

              <!-- Collectibles on Shelf: Succulent and Seashell -->
              <div class="shelf-placed-item slot-succulent">
                ${this.renderObjectSlot('succulent', 46)}
              </div>
              <div class="shelf-placed-item slot-seashell">
                ${this.renderObjectSlot('seashell', 42)}
              </div>
            </div>

            <!-- Soft Sunbeam streaming across the room -->
            <div class="room-sunbeam-glow"></div>
          </div>

          <!-- REAL WOODEN FLOOR & HOME FURNISHINGS -->
          <div class="room-floor-structure">
            <!-- Wooden Baseboard Trim -->
            <div class="floor-wood-baseboard"></div>
            
            <!-- Warm Wooden Planks Texture -->
            <div class="floor-wood-planks"></div>

            <!-- Wooden Study Desk Station on Left -->
            <div class="room-wooden-desk">
              <div class="desk-mat"></div>
              <div class="desk-surface-top"></div>
              <div class="desk-drawer-face">
                <span class="brass-drawer-knob"></span>
              </div>
              <div class="desk-wooden-leg leg-left"></div>
              <div class="desk-wooden-leg leg-right"></div>
              <div class="desk-stool"></div>

              <!-- Items on Desk: Steaming Mug & Lofi Headphones -->
              <div class="desk-placed-item slot-tea-mug">
                ${this.renderObjectSlot('tea_mug', 44)}
              </div>
              <div class="desk-placed-item slot-headphones">
                ${this.renderObjectSlot('headphones', 44)}
              </div>
            </div>

            <!-- Soft Handcrafted Boho Rug with Fringe -->
            <div class="room-boho-woven-rug">
              <div class="rug-fringe-left"></div>
              <div class="rug-weave-pattern"></div>
              <div class="rug-fringe-right"></div>

              <!-- Mellow the Ginger Cat on a Plush Velvet Cushion -->
              <div class="room-mellow-cat-throne">
                <div class="mellow-tufted-pouf"></div>
                <div class="mellow-cat-resting">
                  ${this.render('calm', 92)}
                </div>
              </div>

              <!-- Loomed Mint Cushion & Felt Bear Plushie on the Rug -->
              <div class="rug-placed-item slot-cushion">
                ${this.renderObjectSlot('cushion', 48)}
              </div>
              <div class="rug-placed-item slot-plushie">
                ${this.renderObjectSlot('plushie', 50)}
              </div>
            </div>

          </div>
        </div>

        <div class="room-quiet-caption">
          <span class="gentle-icon-wrap">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
          </span>
          <span>A peaceful home that gently grows with your pace. Tap items to admire them.</span>
        </div>

        <!-- Visual Collection Showcase (NO NUMERICAL COUNTERS!) -->
        <div class="visual-collection-tray">
          <div class="tray-header">
            <h4 class="tray-title">Discoveries in Mellow's Room</h4>
            <span class="tray-subtitle">Little treasures collected along the way</span>
          </div>
          <div class="collectibles-grid">
            ${this.collectibles.map(item => `
              <div class="collectible-card ${item.unlocked ? 'unlocked' : 'locked'}" 
                   onclick="${item.unlocked ? `MellowCat.showItemDetail('${item.id}')` : ''}">
                <div class="collectible-artwork-wrap">
                  ${this.renderCollectibleArtwork(item.id, !item.unlocked, 52)}
                </div>
                <span class="collectible-label">${item.unlocked ? item.name : 'Quiet Discovery'}</span>
                <span class="collectible-sub">${item.unlocked ? item.description : 'Appears gently over time'}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
};
