import { GAMES, STYLES, DISPLAYS, BUDGET_MARKET, tierForBudget, fmtUsd } from '../data.js'
import { mountDesigner } from './designer.js'

const ICONS = {
  crosshair: `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>`,
  diamond: `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2.5 21.5 12 12 21.5 2.5 12Z"/><path d="M12 7.5 16.5 12 12 16.5 7.5 12Z"/></svg>`,
  sparkle: `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3c.6 4.8 1.8 6.2 7 7-5.2.8-6.4 2.2-7 7-.6-4.8-1.8-6.2-7-7 5.2-.8 6.4-2.2 7-7Z"/><path d="M19 15.5c.3 2 .8 2.6 3 3-2.2.4-2.7 1-3 3-.3-2-.8-2.6-3-3 2.2-.4 2.7-1 3-3Z"/></svg>`,
}

const STEPS = [
  {
    id: 'games', level: 1, title: 'PICK YOUR GAMES',
    sub: 'Select everything you play : this tunes your whole build. Grab as many as you want.',
    valid: s => s.games.length > 0,
    cta: 'LOCK IN',
    render(box, ctx) {
      box.innerHTML = `<div class="tile-grid">${GAMES.map(g => `
        <button class="tile" data-id="${g.id}" style="--h:${g.hue}" aria-pressed="${ctx.state.games.includes(g.id)}">
          <span class="code">${g.code}</span>
          <span class="g-name">${g.name}</span>
          <span class="g-tag">${g.tag}</span>
          <span class="check">✓</span>
        </button>`).join('')}</div>
        <div class="custom-input" id="otherBox" ${ctx.state.games.includes('other') ? '' : 'hidden'}>
          <input type="text" id="otherTxt" maxlength="140"
            placeholder="What else do you play? e.g. 'Sims 4, Baldur's Gate 3, flight sims'"
            value="${escapeHtml(ctx.state.otherGames)}">
        </div>`
      box.querySelectorAll('.tile').forEach(t => {
        t.addEventListener('click', () => {
          const id = t.dataset.id
          const on = ctx.state.games.includes(id)
          if (on) { ctx.state.games = ctx.state.games.filter(x => x !== id); ctx.audio.deselect() }
          else { ctx.state.games.push(id); ctx.audio.select() }
          t.setAttribute('aria-pressed', String(!on))
          if (id === 'other') {
            box.querySelector('#otherBox').hidden = on
            if (!on) box.querySelector('#otherTxt').focus()
          }
          ctx.refresh()
        })
      })
      box.querySelector('#otherTxt').addEventListener('input', e => { ctx.state.otherGames = e.target.value })
    },
  },
  {
    id: 'style', level: 2, title: 'HOW SHOULD IT LOOK?',
    sub: 'Graphics philosophy. There is no wrong answer : only wrong frame rates.',
    valid: s => !!s.style,
    render(box, ctx) {
      box.innerHTML = `<div class="card-grid">${STYLES.map(s => `
        <button class="card" data-id="${s.id}" aria-pressed="${ctx.state.style === s.id}">
          ${s.popular ? '<span class="badge">MOST PICKED</span>' : ''}
          <span class="c-icon">${ICONS[s.icon]}</span>
          <span class="c-name">${s.name}</span>
          <span class="c-blurb">${s.blurb}</span>
          <span class="radio"></span>
        </button>`).join('')}</div>`
      wireSingle(box, ctx, 'style')
    },
  },
  {
    id: 'display', level: 3, title: 'YOUR BATTLEFIELD',
    sub: 'What screen are we feeding frames to?',
    valid: s => !!s.display,
    render(box, ctx) {
      box.innerHTML = `
        <div class="card-grid">${DISPLAYS.map(d => `
          <button class="card" data-id="${d.id}" aria-pressed="${ctx.state.display === d.id}">
            ${d.popular ? '<span class="badge">MOST PICKED</span>' : ''}
            <span class="c-name">${d.name}</span>
            <span class="c-blurb">${d.blurb}</span>
            <span class="radio"></span>
          </button>`).join('')}</div>
        <label class="toggle-row">
          <input type="checkbox" id="monitorChk" ${ctx.state.monitor ? 'checked' : ''}>
          I NEED A MONITOR TOO : INCLUDE ONE IN MY QUOTE
        </label>`
      wireSingle(box, ctx, 'display')
      box.querySelector('#monitorChk').addEventListener('change', e => {
        ctx.state.monitor = e.target.checked
        ctx.audio.select()
      })
    },
  },
  {
    id: 'rig', level: 4, title: 'DESIGN YOUR RIG',
    sub: 'Pick a preset : or flip zones on and choose your own colors. All white, all black, or full custom RGB.',
    valid: () => true,
    render(box, ctx) {
      mountDesigner(box, ctx)
    },
  },
  {
    id: 'theme', level: 5, title: 'THEME IT AROUND YOU',
    sub: "Into superheroes? Anime? A favorite game? Tell us and we'll design the whole build around it : figures, decals, color story, the works. (Optional)",
    valid: () => true,
    render(box, ctx) {
      const TAGS = ['SUPERHEROES', 'ANIME', 'GAME WORLDS', 'SCI-FI', 'FANTASY', 'RACING', 'SPORTS', 'MUSIC', 'RETRO', 'MINIMAL / CLEAN']
      box.innerHTML = `
        <div class="theme-chips">
          ${TAGS.map(t => `<button class="theme-chip" data-tag="${t}" aria-pressed="${ctx.state.themeTags.includes(t)}">${t}</button>`).join('')}
        </div>
        <div class="custom-input" style="margin-top:20px">
          <input type="text" id="themeTxt" maxlength="180"
            placeholder="Anything specific? e.g. 'green rage monster vibes with a figure holding the GPU', 'clean Miami sunset look'"
            value="${escapeHtml(ctx.state.themeText)}">
        </div>`
      box.querySelectorAll('.theme-chip').forEach(c => {
        c.addEventListener('click', () => {
          const tag = c.dataset.tag
          const on = ctx.state.themeTags.includes(tag)
          if (on) { ctx.state.themeTags = ctx.state.themeTags.filter(x => x !== tag); ctx.audio.deselect() }
          else { ctx.state.themeTags.push(tag); ctx.audio.select() }
          c.setAttribute('aria-pressed', String(!on))
        })
        c.addEventListener('mouseenter', () => ctx.audio.hover())
      })
      box.querySelector('#themeTxt').addEventListener('input', e => { ctx.state.themeText = e.target.value })
    },
  },
  {
    id: 'budget', level: 6, title: 'SET YOUR BUDGET',
    sub: "Real talk: the AI boom has parts prices inflated : RAM alone costs 3–5× what it did last year, and GPUs took three price hikes in 2026. Right now capable 1080p rigs start around $1,300, high-refresh 1440p runs $2,500–$2,900, and no-limits 4K goes $5,000+. Set your range : we build to it, parts at transparent cost + a flat build fee.",
    valid: s => s.budgetMin != null && s.budgetMax != null && s.budgetMin < s.budgetMax,
    cta: 'BUILD IT ⚡',
    render(box, ctx) {
      const M = BUDGET_MARKET
      if (ctx.state.budgetMin == null) ctx.state.budgetMin = M.defMin
      if (ctx.state.budgetMax == null) ctx.state.budgetMax = M.defMax
      box.innerHTML = `
        <div class="budget-box">
          <div class="range-row">
            <div class="range-head"><span class="range-label">MIN BUDGET</span><output id="minOut"></output></div>
            <input type="range" id="minR" min="${M.floor}" max="${M.ceil}" step="${M.step}" value="${ctx.state.budgetMin}">
          </div>
          <div class="range-row">
            <div class="range-head"><span class="range-label">MAX BUDGET</span><output id="maxOut"></output></div>
            <input type="range" id="maxR" min="${M.floor}" max="${M.ceil}" step="${M.step}" value="${ctx.state.budgetMax}">
          </div>
          <div class="budget-hint" id="budgetHint"></div>
        </div>`
      const minR = box.querySelector('#minR'), maxR = box.querySelector('#maxR')
      const sync = (sound) => {
        ctx.state.budgetMin = +minR.value
        ctx.state.budgetMax = +maxR.value
        box.querySelector('#minOut').textContent = fmtUsd(ctx.state.budgetMin)
        box.querySelector('#maxOut').textContent = fmtUsd(ctx.state.budgetMax, true)
        const tier = tierForBudget(ctx.state.budgetMin, ctx.state.budgetMax)
        box.querySelector('#budgetHint').textContent = `→ that range builds you a ${tier.name}-class rig (${tier.gpu})`
        if (sound) ctx.audio.tick()
        ctx.refresh()
      }
      minR.addEventListener('input', () => {
        if (+minR.value > +maxR.value - M.step) maxR.value = Math.min(M.ceil, +minR.value + M.step)
        sync(true)
      })
      maxR.addEventListener('input', () => {
        if (+maxR.value < +minR.value + M.step) minR.value = Math.max(M.floor, +maxR.value - M.step)
        sync(true)
      })
      sync(false)
    },
  },
]

function wireSingle(box, ctx, key) {
  box.querySelectorAll('.card').forEach(c => {
    c.addEventListener('click', () => {
      ctx.state[key] = c.dataset.id
      box.querySelectorAll('.card').forEach(x => x.setAttribute('aria-pressed', String(x === c)))
      ctx.audio.select()
      ctx.refresh()
    })
  })
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

export function render(root, ctx, opts = {}) {
  let idx = opts.step ?? 0

  function draw() {
    const step = STEPS[idx]
    ctx.setProgress(idx + 1, STEPS.length)
    root.innerHTML = `
      <div class="wrap">
        <div class="step-head">
          <span class="kicker">LEVEL 0${step.level} / 0${STEPS.length}</span>
          <h2 class="step-title">${step.title}</h2>
          <p class="sub">${step.sub}</p>
        </div>
        <div id="stepBody"></div>
        <div class="step-nav">
          <button class="btn btn-ghost" id="backBtn">${idx === 0 ? '← MAIN MENU' : '← BACK'}</button>
          <span class="step-hint"><kbd>ENTER</kbd> to continue</span>
          <button class="btn btn-primary" id="nextBtn" disabled>${step.cta || 'NEXT →'}</button>
        </div>
      </div>`

    const stepCtx = { ...ctx, refresh: updateNext }
    step.render(root.querySelector('#stepBody'), stepCtx)
    updateNext()

    root.querySelector('#backBtn').addEventListener('click', () => {
      ctx.audio.back()
      if (idx === 0) ctx.go('home')
      else { idx--; swap() }
    })
    root.querySelector('#nextBtn').addEventListener('click', next)

    function updateNext() {
      root.querySelector('#nextBtn').disabled = !step.valid(ctx.state)
    }
    function next() {
      if (!step.valid(ctx.state)) { ctx.audio.deny(); return }
      ctx.audio.advance()
      if (idx === STEPS.length - 1) ctx.go('assembly')
      else { idx++; swap() }
    }
    // sound on hover
    root.querySelectorAll('.tile, .card, .btn').forEach(el =>
      el.addEventListener('mouseenter', () => ctx.audio.hover()))
    return next
  }

  function swap() {
    const wrap = root.firstElementChild
    wrap.classList.add('scene-exit')
    setTimeout(() => {
      const n = draw()
      root.firstElementChild.classList.add('scene-enter')
      current.onEnter = n
    }, 180)
  }

  const current = { onEnter: draw() }
  return current
}

export const STEP_COUNT = STEPS.length
