import { GAMES, STYLES, DISPLAYS, TIERS, estimateFps, fpsLabel, tierForBudget, fmtUsd, FORM_ENDPOINT } from '../data.js'
import { PAINTS, buildLabel, paintSummary, rgbSummary, litZones, defaultRig, isRigValid } from '../rigconfig.js'

export function render(root, ctx) {
  const s = ctx.state
  if (!isRigValid(s.rig)) s.rig = defaultRig()
  const style = STYLES.find(x => x.id === s.style)
  const display = DISPLAYS.find(d => d.id === s.display)
  const games = GAMES.filter(g => s.games.includes(g.id))
  let tierId = tierForBudget(s.budgetMin, s.budgetMax).id

  const rigName = buildLabel(s.rig)
  const theme = [...s.themeTags, s.themeText].filter(Boolean).join(', ')
  const zoneColors = litZones(s.rig).map(z => s.rig.zones[z.id].color)
  const swatches = [PAINTS[s.rig.paint].body, ...(zoneColors.length ? zoneColors : ['#26262b', '#141416'])]

  root.innerHTML = `
    <div class="wrap">
      <div class="res-head">
        <div>
          <span class="kicker">LOADOUT CONFIRMED</span>
          <h2 class="loadout-name" style="margin-top:10px">THE <span class="accent">${rigName}</span> : <span id="klassName"></span> CLASS</h2>
          <div class="loadout-sub">${theme ? `Themed around: ${escapeHtml(theme)}` : 'Your lighting. Your spec. Your rig.'}</div>
          <div class="swatch-strip">${swatches.map(c => `<i style="background:${c}"></i>`).join('')}</div>
        </div>
      </div>
      <div class="res-grid">
        <div>
          <div class="panel">
            <span class="kicker" style="font-size:10.5px">YOUR FRAME RATES : @ ${display.name} · ${style.settings}</span>
            <div class="tier-tabs" id="tierTabs">
              ${Object.values(TIERS).map(t => `<button class="tier-tab" data-id="${t.id}" aria-pressed="${t.id === tierId}">${t.name}</button>`).join('')}
            </div>
            <div class="fps-table" id="fpsTable"></div>
            <div class="fps-note" id="fpsNote"></div>
          </div>
        </div>
        <div>
          <div class="panel">
            <span class="kicker" style="font-size:10.5px">EVERY G4F BUILD INCLUDES</span>
            <ul class="included" style="margin-top:12px">
              <li><span class="tick">✓</span><span><b>${paintSummary(s.rig)} paint spec</b> : case, fans, and cables color-matched</span></li>
              <li><span class="tick">✓</span><span><b>RGB set to your spec</b> : ${zoneColors.length ? 'every zone in your exact colors, synced' : 'lights off, stealth build'}</span></li>
              ${theme ? `<li><span class="tick">✓</span><span><b>Custom theme design</b> : built around: ${escapeHtml(theme)}</span></li>` : ''}
              <li><span class="tick">✓</span><span><b>Hand-assembled + cable discipline</b> : back-panel photo proof</span></li>
              <li><span class="tick">✓</span><span><b>24-hour stress test</b> : thermal + noise report shipped with your rig</span></li>
              <li><span class="tick">✓</span><span><b>Live build log</b> : photos at every stage while we build</span></li>
              <li><span class="tick">✓</span><span><b>Limited warranty + post-sale support</b> : remote help included</span></li>
            </ul>
          </div>
          <div class="panel" style="margin-top:18px">
            <span class="kicker" style="font-size:10.5px">CLAIM THIS BUILD</span>
            <p class="sub" style="font-size:13px; margin-top:10px">Your range: <b style="color:var(--text)">${fmtUsd(s.budgetMin)} – ${fmtUsd(s.budgetMax, true)}</b>.
            No payment now : a real builder emails you a transparent, itemized quote within 24 hours.${s.monitor ? ' Matching monitor included in the quote.' : ''}</p>
            <form class="claim-form" id="claimForm" novalidate>
              <div><label for="fName">YOUR NAME</label><input id="fName" name="name" autocomplete="name" value="${escapeHtml(s.contact.name)}"></div>
              <div><label for="fEmail">EMAIL</label><input id="fEmail" name="email" type="email" autocomplete="email" value="${escapeHtml(s.contact.email)}"></div>
              <div><label for="fNotes">ANYTHING ELSE? (OPTIONAL)</label><textarea id="fNotes" name="notes" placeholder="Timeline, theme ideas, questions…">${escapeHtml(s.contact.notes)}</textarea></div>
              <div class="form-err" id="formErr"></div>
              <button class="btn btn-primary" type="submit" id="claimBtn">CLAIM THIS BUILD →</button>
            </form>
          </div>
        </div>
      </div>
      <div class="res-back">
        <button class="link-btn" id="editBtn">← tweak my answers</button>
      </div>
    </div>`

  function renderTier() {
    const tier = TIERS[tierId]
    root.querySelector('#klassName').textContent = tier.name
    const rows = games.filter(g => !g.other).map(g => {
      const r = estimateFps(g, tier, s.display, s.style)
      return { g, r }
    })
    const otherRow = games.some(g => g.other)
      ? `<div class="fps-row">
          <span class="fg">Other titles</span>
          ${s.otherGames ? `<span class="fn">${escapeHtml(s.otherGames)}</span>` : ''}
          <span class="fv">TUNED ✓</span>
        </div>`
      : ''
    root.querySelector('#fpsTable').innerHTML = rows.map(({ g, r }) => `
      <div class="fps-row">
        <span class="fg">${g.name}</span>
        ${r.capNote ? `<span class="fn">${r.capNote}</span>` : ''}
        <span class="fv ${r.fps < 45 && !r.capped ? 'low' : ''}">${fpsLabel(r)}</span>
      </div>`).join('') + otherRow
    const lows = rows.filter(({ r }) => r.fps < 45 && !r.capped)
    const note = root.querySelector('#fpsNote')
    if (lows.length && tierId !== 'ultra') {
      note.className = 'fps-note warn'
      note.textContent = `⚠ ${lows.map(l => l.g.name).join(', ')} will struggle at these settings on ${TIERS[tierId].name} : tap a higher class above, or we'll tune settings for you.`
    } else {
      note.className = 'fps-note'
      note.textContent = 'Honest estimates for your games at your settings : we benchmark every build and ship the receipts.'
    }
  }
  renderTier()

  root.querySelectorAll('.tier-tab').forEach(t => t.addEventListener('click', () => {
    tierId = t.dataset.id
    root.querySelectorAll('.tier-tab').forEach(x => x.setAttribute('aria-pressed', String(x === t)))
    ctx.audio.select()
    renderTier()
  }))

  root.querySelector('#editBtn').addEventListener('click', () => { ctx.audio.back(); ctx.go('quiz') })

  root.querySelector('#claimForm').addEventListener('submit', async e => {
    e.preventDefault()
    const name = root.querySelector('#fName').value.trim()
    const email = root.querySelector('#fEmail').value.trim()
    const notes = root.querySelector('#fNotes').value.trim()
    const err = root.querySelector('#formErr')
    if (!name) { err.textContent = '! we need a name to put on the build log'; ctx.audio.deny(); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = '! that email doesn\'t look right'; ctx.audio.deny(); return }
    err.textContent = ''
    s.contact = { name, email, notes }
    const btn = root.querySelector('#claimBtn')
    btn.disabled = true
    btn.textContent = 'TRANSMITTING…'
    const tier = TIERS[tierId]
    // flat, readable fields so the Formspree notification email reads like a work order
    const lead = {
      _subject: `⚡ Build claim : ${rigName} / ${tier.name} : ${name}`,
      name,
      email,
      notes: notes || 'none',
      games: games.filter(g => !g.other).map(g => g.name).join(', ') || 'none listed',
      other_titles: s.games.includes('other') ? (s.otherGames || 'yes (unspecified)') : 'none',
      graphics_style: `${style.name} (${style.settings})`,
      display: display.name,
      needs_monitor: s.monitor ? 'yes' : 'no',
      parts_paint: paintSummary(s.rig),
      rgb_lighting: rgbSummary(s.rig),
      theme_interests: theme || 'none',
      budget_range: `${fmtUsd(s.budgetMin)} – ${fmtUsd(s.budgetMax, true)}`,
      tier_viewed_at_claim: `${tier.name} : ${tier.price} (${tier.gpu} / ${tier.cpu})`,
      fps_shown: games.filter(g => !g.other).map(g => `${g.name} ${fpsLabel(estimateFps(g, tier, s.display, s.style))}`).join(' · '),
      submitted_at: new Date().toISOString(),
    }
    // local backup copy regardless of transport outcome
    try {
      const leads = JSON.parse(localStorage.getItem('g4f-leads') || '[]')
      leads.push(lead)
      localStorage.setItem('g4f-leads', JSON.stringify(leads))
    } catch (_) { /* storage unavailable : not worth blocking on */ }
    if (FORM_ENDPOINT) {
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(lead),
        })
        if (!res.ok) throw new Error(`status ${res.status}`)
      } catch (_) {
        err.textContent = '! transmission failed : check your connection and hit the button again'
        btn.disabled = false
        btn.textContent = 'CLAIM THIS BUILD →'
        ctx.audio.deny()
        return
      }
    }
    ctx.audio.advance()
    ctx.go('done')
  })

  root.querySelectorAll('.btn, .tier-tab').forEach(el =>
    el.addEventListener('mouseenter', () => ctx.audio.hover()))

  return {}
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}
