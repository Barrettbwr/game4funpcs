import './styles.css'
import { initBg, setBgAccent } from './bg.js'
import { audio } from './audio.js'
import { state, resetState } from './state.js'
import * as home from './scenes/home.js'
import * as designer from './scenes/designer.js'
import * as reviews from './scenes/reviews.js'
import * as intel from './scenes/intel.js'
import * as contact from './scenes/contact.js'
import * as quiz from './scenes/quiz.js'
import * as assembly from './scenes/assembly.js'
import * as results from './scenes/results.js'
import * as done from './scenes/done.js'

const SCENES = { home, designer, reviews, intel, contact, quiz, assembly, results, done }
const root = document.getElementById('scene')
const hudProgress = document.getElementById('hudProgress')
const hudLevel = document.getElementById('hudLevel')
const hudPips = document.getElementById('hudPips')
const soundBtn = document.getElementById('soundBtn')
const logoBtn = document.getElementById('logoBtn')

let current = { }
let currentName = ''
let transitioning = false

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return `${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}`
}

function lighten(hex, amt) {
  const h = hex.replace('#', '')
  const mix = c => Math.round(c + (255 - c) * amt)
  const [r, g, b] = [0, 2, 4].map(i => mix(parseInt(h.slice(i, i + 2), 16)))
  return `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`
}

function setAccent(pal) {
  const r = document.documentElement
  r.style.setProperty('--accent', pal.accent)
  r.style.setProperty('--accent-rgb', hexToRgb(pal.accent))
  r.style.setProperty('--accent2', pal.accent2 || lighten(pal.accent, 0.55))
  setBgAccent(pal.accent)
}

function setProgress(step, total) {
  if (!step) { hudProgress.hidden = true; return }
  hudProgress.hidden = false
  hudLevel.textContent = `LVL 0${step}/0${total}`
  hudPips.innerHTML = Array.from({ length: total }, (_, i) => `<i class="${i < step ? 'on' : ''}"></i>`).join('')
}

const ctx = {
  state, audio, setAccent, setProgress,
  go, resetAll,
}

function go(name, opts) {
  if (transitioning) return
  transitioning = true
  current.onLeave?.()
  const draw = () => {
    if (name !== 'quiz') setProgress(null)
    currentName = name
    current = SCENES[name].render(root, ctx, opts) || {}
    root.firstElementChild?.classList.add('scene-enter')
    window.scrollTo({ top: 0, behavior: 'instant' })
    transitioning = false
  }
  const old = root.firstElementChild
  if (old) {
    old.classList.add('scene-exit')
    setTimeout(draw, 200)
  } else draw()
}

const BRAND = { accent: '#c100ff', accent2: '#ffbe96' }

function resetAll() {
  resetState()
  setAccent(BRAND)
}

// HUD wiring
function syncSoundBtn() {
  soundBtn.textContent = audio.enabled ? 'SOUND: ON' : 'SOUND: OFF'
  soundBtn.setAttribute('aria-pressed', String(audio.enabled))
}
soundBtn.addEventListener('click', () => {
  audio.unlock()
  audio.setEnabled(!audio.enabled)
  if (audio.enabled) audio.select()
  syncSoundBtn()
})
logoBtn.addEventListener('click', () => {
  if (currentName !== 'home') go('home')
})

// keyboard: scenes get first pick via onKey; Enter advances; Escape backs out of sub-scenes
document.addEventListener('keydown', e => {
  if (['TEXTAREA', 'INPUT'].includes(document.activeElement?.tagName)) return
  if (current.onKey) {
    current.onKey(e)
    if (e.defaultPrevented) return
  }
  if (e.key === 'Escape' && ['designer', 'reviews', 'intel', 'contact'].includes(currentName)) {
    audio.back()
    go('home')
  } else if (e.key === 'Enter' && current.onEnter && !['A', 'BUTTON'].includes(document.activeElement?.tagName)) {
    e.preventDefault()
    current.onEnter()
  }
})
// unlock audio on any first interaction
document.addEventListener('pointerdown', () => audio.unlock(), { once: true })

// boot it
syncSoundBtn()
initBg()
setAccent(BRAND)
go('home')

// expose lead export for the shop owner: run G4F.leads() in the console
window.G4F = {
  leads: () => JSON.parse(localStorage.getItem('g4f-leads') || '[]'),
}
