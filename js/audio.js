const FocusAudio = {
  ctx: null,
  masterGain: null,
  currentTrack: 'silence',
  isPlaying: false,
  volume: 0.45,
  activeNodes: [],
  lofiInterval: null,

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, parseFloat(val)));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  },

  stopAll() {
    if (this.lofiInterval) {
      clearInterval(this.lofiInterval);
      this.lofiInterval = null;
    }
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
    this.isPlaying = false;
  },

  selectTrack(trackName) {
    this.currentTrack = trackName;
    if (trackName === 'silence') {
      this.stopAll();
      this.updateUI();
      return;
    }
    if (this.isPlaying) {
      this.playCurrent();
    }
    this.updateUI();
  },

  togglePlay() {
    if (this.currentTrack === 'silence') {
      this.currentTrack = 'brown'; 
    }
    if (this.isPlaying) {
      this.stopAll();
    } else {
      this.initContext();
      this.playCurrent();
    }
    this.updateUI();
  },

  playCurrent() {
    this.stopAll();
    this.initContext();
    if (this.currentTrack === 'silence') return;

    this.isPlaying = true;
    switch (this.currentTrack) {
      case 'brown':
        this.startBrownNoise();
        break;
      case 'rain':
        this.startRain();
        break;
      case 'lofi':
        this.startLofi();
        break;
      case 'ocean':
        this.startOcean();
        break;
      case 'cafe':
        this.startCafe();
        break;
      case 'ambient':
        this.startAmbient();
        break;
      default:
        this.stopAll();
    }
  },

 
  startBrownNoise() {
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; 
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

  
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(0);
    this.activeNodes.push(whiteNoise, filter, gain);
  },


  startRain() {
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1000, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(0.8, this.ctx.currentTime);

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1800, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    rainSource.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(this.masterGain);

    rainSource.start(0);
    this.activeNodes.push(rainSource, bandpass, lowpass, gain);
  },

  
  startLofi() {
    const chords = [
      [261.63, 329.63, 392.00, 493.88],
      [220.00, 261.63, 329.63, 392.00], 
      [174.61, 220.00, 261.63, 329.63], 
      [196.00, 246.94, 293.66, 349.23] 
    ];
    let chordIdx = 0;

    const playChord = () => {
      if (!this.isPlaying || this.currentTrack !== 'lofi') return;
      const notes = chords[chordIdx % chords.length];
      chordIdx++;

      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, this.ctx.currentTime);

        
        const now = this.ctx.currentTime + (i * 0.04);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 3.5);
      });
    };

    playChord();
    this.lofiInterval = setInterval(playChord, 3800);
  },

 
  startOcean() {
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);

    
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); 

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(0);
    lfo.start(0);
    this.activeNodes.push(noise, filter, lfo, lfoGain, gain);
  },

 
  startCafe() {
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const band1 = this.ctx.createBiquadFilter();
    band1.type = 'bandpass';
    band1.frequency.setValueAtTime(450, this.ctx.currentTime);
    band1.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    noise.connect(band1);
    band1.connect(gain);
    gain.connect(this.masterGain);

    noise.start(0);
    this.activeNodes.push(noise, band1, gain);
  },

 
  startAmbient() {
    const freqs = [130.81, 196.00, 261.63]; 
    freqs.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(0);
      this.activeNodes.push(osc, filter, gain);
    });
  },

  updateUI() {
    const playBtn = document.getElementById('audio-play-toggle');
    const trackLabel = document.getElementById('audio-current-name');
    const trackPills = document.querySelectorAll('.sound-chip');

    if (playBtn) {
      playBtn.innerHTML = this.isPlaying ? Icons.pause : Icons.play;
      playBtn.setAttribute('aria-label', this.isPlaying ? 'Pause soundscape' : 'Play soundscape');
    }
    if (trackLabel) {
      const nameMap = {
        silence: 'Silence',
        brown: 'Brown noise',
        rain: 'Soft rain',
        lofi: 'Lofi chords',
        ocean: 'Ocean waves',
        cafe: 'Quiet cafe',
        ambient: 'Ambient drone'
      };
      trackLabel.textContent = nameMap[this.currentTrack] || 'Silence';
    }
    trackPills.forEach(pill => {
      const track = pill.getAttribute('data-track');
      if (track === this.currentTrack) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }
};
