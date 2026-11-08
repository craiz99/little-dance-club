/* Local MIDI synthesis. Midi is provided by the bundled @tonejs/midi parser. */
(() => {
  'use strict';

  class ThemeSongPlayer {
    constructor(encodedMidi) {
      this.encodedMidi = encodedMidi;
      this.context = null;
      this.notes = null;
      this.duration = 0;
      this.origin = null;
      this.nextNote = 0;
      this.timer = null;
      this.request = 0;
      this.running = false;
      this.voices = new Set();
      this._volume = .45;
      this._muted = false;
    }

    get muted() { return this._muted; }
    set muted(value) { this._muted = Boolean(value); this.updateGain(); }
    get volume() { return this._volume; }
    set volume(value) {
      this._volume = Math.max(0, Math.min(1, Number(value) || 0));
      this.updateGain();
    }
    get currentTime() {
      if (this.origin === null || !this.context) return 0;
      return Math.max(0, this.context.currentTime - this.origin) % this.duration;
    }

    updateGain() {
      if (this.master) {
        this.master.gain.setTargetAtTime(this._muted ? 0 : this._volume, this.context.currentTime, .015);
      }
    }

    prepare() {
      if (!this.notes) {
        if (!this.encodedMidi || typeof window.Midi !== 'function') throw new Error('Theme song data or MIDI parser is missing');
        const bytes = Uint8Array.from(atob(this.encodedMidi), char => char.charCodeAt(0));
        const midi = new window.Midi(bytes);
        this.notes = midi.tracks.flatMap(track => track.notes).sort((a, b) => a.time - b.time);
        this.duration = Math.max(midi.duration, ...midi.tracks.map(track => midi.header.ticksToSeconds(track.endOfTrackTicks || 0)));
        if (!this.notes.length || !Number.isFinite(this.duration) || this.duration <= 0) {
          this.notes = null;
          throw new Error('Theme song contains no playable MIDI notes');
        }
      }
      if (!this.context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) throw new Error('Web Audio is unavailable');
        this.context = new AudioContext();
        this.compressor = this.context.createDynamicsCompressor();
        this.compressor.threshold.value = -15;
        this.compressor.knee.value = 15;
        this.compressor.ratio.value = 6;
        this.compressor.attack.value = .003;
        this.compressor.release.value = .12;
        this.master = this.context.createGain();
        this.master.gain.value = this._muted ? 0 : this._volume;
        this.compressor.connect(this.master);
        this.master.connect(this.context.destination);
      }
    }

    async play() {
      const request = ++this.request;
      // Decode and unlock audio synchronously within the first dance tap.
      this.prepare();
      await this.context.resume();
      if (request !== this.request) return;
      if (this.origin === null) this.origin = this.context.currentTime + .035;
      this.running = true;
      if (this.timer !== null) clearInterval(this.timer);
      this.schedule();
      this.timer = setInterval(() => this.schedule(), 40);
    }

    pause() {
      ++this.request;
      this.running = false;
      if (this.timer !== null) clearInterval(this.timer);
      this.timer = null;
      // Freezing the audio clock also freezes active and queued notes.
      if (this.context && this.context.state !== 'closed') this.context.suspend().catch(() => {});
    }

    schedule() {
      if (!this.running || this.context.state !== 'running') return;
      const now = this.context.currentTime;
      if (now >= this.origin + this.duration) {
        const loops = Math.floor((now - this.origin) / this.duration);
        this.origin += loops * this.duration;
        this.nextNote = 0;
      }
      const horizon = now + .15;
      while (true) {
        if (this.nextNote >= this.notes.length) {
          if (this.origin + this.duration > horizon) break;
          this.origin += this.duration;
          this.nextNote = 0;
        }
        const note = this.notes[this.nextNote];
        const start = this.origin + note.time;
        if (start >= horizon) break;
        const end = start + note.duration;
        if (end > now + .01) this.synthesize(note, Math.max(start, now + .004), end);
        ++this.nextNote;
      }
    }

    synthesize(note, start, end) {
      const oscillator = this.context.createOscillator();
      const envelope = this.context.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(440 * 2 ** ((note.midi - 69) / 12), start);
      const duration = end - start;
      const attack = Math.min(.008, duration / 4);
      const release = Math.min(.07, duration / 3);
      const peak = Math.max(.001, note.velocity * .16);
      envelope.gain.setValueAtTime(0, start);
      envelope.gain.linearRampToValueAtTime(peak, start + attack);
      envelope.gain.exponentialRampToValueAtTime(Math.max(.001, peak * .45), end - release);
      envelope.gain.exponentialRampToValueAtTime(.0001, end);
      oscillator.connect(envelope);
      envelope.connect(this.compressor);
      this.voices.add(oscillator);
      oscillator.onended = () => {
        oscillator.disconnect();
        envelope.disconnect();
        this.voices.delete(oscillator);
      };
      oscillator.start(start);
      oscillator.stop(end);
    }
  }

  window.ThemeSongPlayer = ThemeSongPlayer;
})();
