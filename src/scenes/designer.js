import { rigSvg } from '../rig.js'
import { ZONES, PAINTS, defaultRig, isRigValid, applyRig, primaryAccent } from '../rigconfig.js'

// Mounts the interactive rig designer into `el`. Used by this scene and the quiz step.
export function mountDesigner(el, ctx) {
  if (!isRigValid(ctx.state.rig)) ctx.state.rig = defaultRig()
  const rig = ctx.state.rig
  if (rig.rgb === undefined) rig.rgb = ZONES.some(z => rig.zones[z.id].on)

  el.innerHTML = `
    <div class="designer">
      <div class="dz-stage">
        <div class="rig-box rig-live">${rigSvg()}</div>
        <p class="dz-hint">Tap a part of the PC to jump to its controls</p>
      </div>
      <div class="dz-panel">
        <span class="dz-sec">PART PAINT : the physical hardware</span>
        <div class="preset-chips">
          ${Object.entries(PAINTS).map(([id, p]) => `
            <button class="tier-tab" data-paint="${id}" aria-pressed="${rig.paint === id}">${p.label}</button>`).join('')}
        </div>
        <p class="dz-blurb" id="dzBlurb"></p>
        <span class="dz-sec" style="margin-top:20px">LIGHTING : any paint, with or without RGB</span>
        <div class="preset-chips">
          <button class="tier-tab" data-rgb="on" aria-pressed="${rig.rgb}">RGB LIGHTING</button>
          <button class="tier-tab" data-rgb="off" aria-pressed="${!rig.rgb}">NO RGB</button>
        </div>
        <div class="zone-list" id="zoneWrap" style="margin-top:12px">
          ${ZONES.map(z => `
            <div class="zone-row" data-row="${z.id}">
              <span class="zone-name">${z.name}</span>
              <label class="zone-toggle"><input type="checkbox" data-on="${z.id}" ${rig.zones[z.id].on ? 'checked' : ''}> RGB</label>
              <input type="color" class="zone-color" data-color="${z.id}" value="${rig.zones[z.id].color}" title="${z.name} color">
            </div>`).join('')}
        </div>
      </div>
    </div>`

  const svg = el.querySelector('.rig-svg')
  svg.querySelectorAll('.part').forEach(p => p.classList.add('in'))
  svg.classList.add('powered', 'lit', 'designable')

  function sync() {
    applyRig(svg, rig)
    ctx.setAccent({ accent: primaryAccent(rig) })
    el.querySelectorAll('[data-paint]').forEach(c =>
      c.setAttribute('aria-pressed', String(c.dataset.paint === rig.paint)))
    el.querySelectorAll('[data-rgb]').forEach(c =>
      c.setAttribute('aria-pressed', String((c.dataset.rgb === 'on') === rig.rgb)))
    el.querySelector('#zoneWrap').hidden = !rig.rgb
    el.querySelector('#dzBlurb').textContent = PAINTS[rig.paint].blurb
    ZONES.forEach(z => {
      el.querySelector(`[data-on="${z.id}"]`).checked = rig.zones[z.id].on
      el.querySelector(`[data-color="${z.id}"]`).value = rig.zones[z.id].color
      el.querySelector(`[data-row="${z.id}"]`).classList.toggle('is-off', !rig.zones[z.id].on)
    })
  }

  el.querySelectorAll('[data-paint]').forEach(chip => chip.addEventListener('click', () => {
    rig.paint = chip.dataset.paint
    ctx.audio.select()
    sync()
  }))
  el.querySelectorAll('[data-rgb]').forEach(chip => chip.addEventListener('click', () => {
    rig.rgb = chip.dataset.rgb === 'on'
    if (rig.rgb && !ZONES.some(z => rig.zones[z.id].on)) ZONES.forEach(z => { rig.zones[z.id].on = true })
    ctx.audio.select()
    sync()
  }))
  ZONES.forEach(z => {
    el.querySelector(`[data-on="${z.id}"]`).addEventListener('change', e => {
      rig.zones[z.id].on = e.target.checked
      ctx.audio.select()
      sync()
    })
    el.querySelector(`[data-color="${z.id}"]`).addEventListener('input', e => {
      rig.zones[z.id].color = e.target.value
      rig.zones[z.id].on = true
      rig.rgb = true
      sync()
    })
  })

  // click the PC itself to jump to that zone's controls
  svg.querySelectorAll('.zone-hit').forEach(hit => hit.addEventListener('click', () => {
    const row = el.querySelector(`[data-row="${hit.dataset.zone}"]`)
    if (!row) return
    row.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    row.classList.remove('pulse'); void row.offsetWidth; row.classList.add('pulse')
    ctx.audio.hover()
  }))

  sync()
}

export function render(root, ctx) {
  root.innerHTML = `
    <div class="wrap sub-scene">
      <div class="sub-head">
        <button class="link-btn back-link" id="backBtn">← MENU</button>
        <span class="kicker">Rig Designer</span>
        <h2 class="step-title">Paint it. Light it. Yours.</h2>
        <p class="sub">Pick the paint : all white, all black, or standard : then decide which parts glow, and in what colors.</p>
      </div>
      <div id="dzMount"></div>
      <div class="sub-cta">
        <button class="btn-quote" id="buildBtn">BUILD THIS RIG <span class="circ">→</span></button>
      </div>
    </div>`

  mountDesigner(root.querySelector('#dzMount'), ctx)
  root.querySelector('#backBtn').addEventListener('click', () => { ctx.audio.back(); ctx.go('home') })
  root.querySelector('#buildBtn').addEventListener('click', () => { ctx.audio.boot(); ctx.go('quiz') })
  return {}
}
