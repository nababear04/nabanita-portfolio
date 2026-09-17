// Web Audio API Sound Engine for BTS Dreamy Lo-Fi & UI Chimes

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.noteIndex = 0;
    this.masterGain = null;
    this.isMuted = false;
    
    // Pentatonic & dream chords inspired by BTS "Spring Day" & "Magic Shop"
    // Fmaj7 - C - Dm7 - Bb
    this.melodyNotes = [
      349.23, // F4
      392.00, // G4
      440.00, // A4
      523.25, // C5
      587.33, // D5
      659.25, // E5
      698.46, // F5
      587.33, // D5
      523.25, // C5
      440.00  // A4
    ];
    this.chordPads = [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
      [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
      [146.83, 174.61, 220.00, 261.63], // Dm7 (D3, F3, A3, C4)
      [116.54, 146.83, 174.61, 220.00]  // Bbmaj7 (Bb2, D3, F3, A3)
    ];
    this.currentChord = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChime(freq = 587.33, duration = 0.4, type = 'sine') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy catch
    }
  }

  playLoginChime(index = 0) {
    if (this.isMuted) return;
    const baseFreqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 523.25];
    const f = baseFreqs[index % baseFreqs.length];
    this.playChime(f, 0.45, 'triangle');
  }

  playSparkle() {
    if (this.isMuted) return;
    [659.25, 783.99, 987.77, 1174.66].forEach((f, i) => {
      setTimeout(() => this.playChime(f, 0.25, 'sine'), i * 60);
    });
  }

  toggleBgm() {
    this.init();
    if (!this.ctx) return false;

    if (this.isPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  startBgm() {
    this.init();
    if (!this.ctx) return;
    this.isPlaying = true;
    this.step();
  }

  step() {
    if (!this.isPlaying) return;

    try {
      const noteFreq = this.melodyNotes[this.noteIndex % this.melodyNotes.length];
      this.noteIndex++;

      // Play soft dream bell tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.8);

      // Trigger chord pad every 4 notes
      if (this.noteIndex % 4 === 0) {
        this.playPad(this.chordPads[this.currentChord % this.chordPads.length]);
        this.currentChord++;
      }
    } catch (e) {}

    this.timer = setTimeout(() => this.step(), 420);
  }

  playPad(frequencies) {
    if (!this.ctx || !this.isPlaying) return;
    frequencies.forEach(freq => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.0);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 2.0);
      } catch (e) {}
    });
  }

  stopBgm() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

export const soundEngine = new SoundEngine();
