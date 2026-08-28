// Tiny WebAudio synth : no assets, just oscillator blips with envelopes.
class G4FAudio {
  constructor() {
    this.ctx = null
    this.enabled = localStorage.getItem('g4f-sound') !== 'off'
  }
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (AC) this.ctx = new AC()
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume()
  }
  setEnabled(on) {
    this.enabled = on
    localStorage.setItem('g4f-sound', on ? 'on' : 'off')
  }
  tone(freq, dur, { type = 'sine', gain = 0.04, delay = 0, slide = null } = {}) {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return
    const t0 = this.ctx.currentTime + delay
    const osc = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t0)
    if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t0 + dur)
    g.gain.setValueAtTime(0, t0)
    g.gain.linearRampToValueAtTime(gain, t0 + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    osc.connect(g).connect(this.ctx.destination)
    osc.start(t0)
    osc.stop(t0 + dur + 0.05)
  }
  hover()   { this.tone(1900, 0.03, { gain: 0.01 }) }
  select()  { this.tone(520, 0.07, { type: 'square', gain: 0.025 }); this.tone(780, 0.09, { type: 'square', gain: 0.02, delay: 0.05 }) }
  deselect(){ this.tone(420, 0.06, { type: 'square', gain: 0.02 }) }
  advance() { this.tone(300, 0.18, { type: 'sawtooth', gain: 0.03, slide: 900 }) }
  back()    { this.tone(600, 0.12, { type: 'sawtooth', gain: 0.02, slide: 250 }) }
  deny()    { this.tone(180, 0.12, { type: 'square', gain: 0.03 }) }
  tick()    { this.tone(1400, 0.02, { type: 'square', gain: 0.012 }) }
  stamp()   { this.tone(220, 0.2, { type: 'square', gain: 0.045 }); this.tone(440, 0.25, { delay: 0.02, gain: 0.03 }) }
  boot()    { this.tone(160, 0.5, { type: 'sawtooth', gain: 0.025, slide: 640 }) }
  fanfare() {
    const notes = [392, 523, 659, 784]
    notes.forEach((f, i) => {
      this.tone(f, 0.28, { type: 'triangle', gain: 0.05, delay: i * 0.11 })
      this.tone(f * 2, 0.2, { type: 'sine', gain: 0.018, delay: i * 0.11 })
    })
  }
}
export const audio = new G4FAudio()
