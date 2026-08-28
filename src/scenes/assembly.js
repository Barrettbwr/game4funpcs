import { GAMES, STYLES, DISPLAYS, estimateFps, fpsLabel, tierForBudget } from '../data.js'
import { applyRig, defaultRig, isRigValid, paintSummary, litZones } from '../rigconfig.js'
import { rigSvg } from '../rig.js'

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function render(root, ctx) {
  const s = ctx.state
  const tier = tierForBudget(s.budgetMin, s.budgetMax)
  if (!isRigValid(s.rig)) s.rig = defaultRig()
  const style = STYLES.find(x => x.id === s.style)
  const display = DISPLAYS.find(d => d.id === s.display)
  const games = GAMES.filter(g => s.games.includes(g.id))
  const theme = [...s.themeTags, s.themeText].filter(Boolean).join(', ')

  root.innerHTML = `
    <div class="wrap">
      <div class="step-head" style="margin-bottom:24px">
        <span class="kicker">BUILD SEQUENCE INITIATED</span>
        <h2 class="step-title">ASSEMBLING YOUR RIG</h2>
      </div>
      <div class="asm">
        <div class="rig-box">${rigSvg()}</div>
        <div>
          <div class="term" id="term"></div>
          <div class="reveal-list" id="reveals"></div>
          <div id="stampBox"></div>
        </div>
      </div>
    </div>
    <button class="skip-hint" id="skipBtn">CLICK TO FAST-FORWARD ⏩</button>`

  const term = root.querySelector('#term')
  const reveals = root.querySelector('#reveals')
  const rig = root.querySelector('.rig-svg')
  let speed = reduced ? 6 : 1
  let alive = true

  root.querySelector('#skipBtn').addEventListener('click', e => {
    speed = 8
    e.currentTarget.textContent = 'FAST-FORWARDING…'
  })

  const wait = ms => new Promise(r => setTimeout(r, ms / speed))

  async function typeLine(parts) {
    // parts: array of [text, cls]
    const ln = document.createElement('div')
    ln.className = 'ln'
    const caret = document.createElement('span')
    caret.className = 'caret'
    const prefix = document.createElement('span')
    prefix.className = 'p'
    prefix.textContent = '> '
    ln.appendChild(prefix)
    ln.appendChild(caret)
    term.querySelectorAll('.caret').forEach(c => c.remove())
    term.appendChild(ln)
    for (const [text, cls] of parts) {
      const span = document.createElement('span')
      if (cls) span.className = cls
      ln.insertBefore(span, caret)
      for (const ch of text) {
        if (!alive) return
        span.textContent += ch
        if (Math.random() < 0.25) ctx.audio.tick()
        await wait(13)
      }
    }
  }

  function showPart(id) {
    const el = rig.querySelector('#' + id)
    if (el) el.classList.add('in')
  }

  async function revealGame(g) {
    if (g.other) {
      const row = document.createElement('div')
      row.className = 'reveal-row'
      row.innerHTML = `
        <span class="rg">Other titles</span>
        <span class="rf">✓</span>
        <span class="rs">tuned & optimized per game before shipping</span>`
      reveals.appendChild(row)
      ctx.audio.select()
      return
    }
    const r = estimateFps(g, tier, s.display, s.style)
    const row = document.createElement('div')
    row.className = 'reveal-row'
    row.innerHTML = `
      <span class="rg">${g.name}</span>
      <span class="rf">0 FPS</span>
      <span class="rs">@ ${display.name} · ${style.settings}${r.capNote ? ` · ${r.capNote}` : ''}</span>`
    reveals.appendChild(row)
    const fv = row.querySelector('.rf')
    const target = r.fps
    const dur = 620 / speed
    const t0 = performance.now()
    // interval-driven (not rAF) so the sequence still completes in a backgrounded tab
    await new Promise(res => {
      const iv = setInterval(() => {
        const t = Math.min(1, (performance.now() - t0) / dur)
        const eased = 1 - Math.pow(1 - t, 3)
        fv.textContent = `${Math.round(target * eased)} FPS`
        if (Math.random() < 0.4) ctx.audio.tick()
        if (t >= 1 || !alive) { clearInterval(iv); res() }
      }, 30)
    })
    fv.textContent = fpsLabel(r)
    ctx.audio.select()
  }

  async function run() {
    await wait(400)
    await typeLine([['loadout received. parsing…']])
    showPart('p-case')
    await wait(500)
    await typeLine([[`${games.length} game${games.length > 1 ? 's' : ''} registered · `], [style.name, 'hl'], [' profile · '], [display.name, 'hl']])
    await wait(350)
    await typeLine([['selecting core : '], [tier.cpu, 'hl']])
    showPart('p-cpu')
    await wait(450)
    await typeLine([['seating memory : '], [tier.ram, 'hl']])
    showPart('p-ram')
    await wait(400)
    await typeLine([['mounting graphics : '], [tier.gpu, 'hl']])
    showPart('p-gpu')
    await wait(500)
    await typeLine([['applying paint : '], [`${paintSummary(s.rig)} FINISH`, 'hl']])
    applyRig(rig, s.rig)
    await wait(400)
    const zonesOn = litZones(s.rig).length
    await typeLine([['rgb lighting : '], [zonesOn ? `${zonesOn} zone${zonesOn > 1 ? 's' : ''} lit & synced` : 'off : stealth mode', 'hl']])
    rig.classList.add('lit')
    showPart('p-fans')
    showPart('p-psu')
    rig.classList.add('powered')
    ctx.audio.boot()
    await wait(600)
    await typeLine(theme
      ? [['theming around : '], [theme, 'hl']]
      : [['final polish : '], ['cables combed, glass wiped', 'hl']])
    await wait(450)
    await typeLine([['cable discipline pass… '], ['immaculate', 'hl']])
    await wait(350)
    await typeLine([['stress test : 24h simulated · '], ['max 68°C · whisper quiet', 'hl']])
    await wait(500)
    await typeLine([['calculating '], ['your new life', 'hl'], ['…']])
    await wait(500)
    term.querySelectorAll('.caret').forEach(c => c.remove())
    for (const g of games) {
      if (!alive) return
      await revealGame(g)
      await wait(240)
    }
    await wait(500)
    const stamp = document.createElement('div')
    stamp.className = 'stamp'
    stamp.textContent = '✓ BUILD COMPLETE'
    root.querySelector('#stampBox').appendChild(stamp)
    ctx.audio.stamp()
    root.querySelector('#skipBtn').remove()
    await wait(1400)
    if (alive) ctx.go('results')
  }

  run()
  return { onLeave: () => { alive = false } }
}
