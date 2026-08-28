import { CONTACT, SOCIALS, TESTIMONIALS, REVIEW_STATS } from '../content.js'

const IMG = import.meta.env.BASE_URL + 'images/'

const BOOT_LINES = [
  ['G4F SYSTEMS ONLINE : builder online ', '✓'],
]

const MENU = [
  { label: 'RIG DESIGNER', desc: 'your colors, zone by zone', go: 'designer' },
  { label: 'TESTIMONIALS', desc: 'what our clients say : on Google', go: 'reviews' },
  { label: 'SERVICES & FAQ', desc: 'what we offer + straight answers', go: 'intel' },
  { label: 'CONTACT', desc: 'humans. reachable.', go: 'contact' },
]

export function render(root, ctx) {
  root.innerHTML = `
    <div class="wrap menu-wrap">
      <div class="menu-left">
        <div class="boot-log mini" id="bootLog"></div>
        <span class="kicker">Welcome to Game4FunPCs</span>
        <h1 class="menu-title">Custom-Built Gaming PCs.<br>Zero Compromises. All&nbsp;Fun.</h1>
        <p class="menu-tag body-copy">At Game4FunPCs, we hand-build every PC with precision, passion, and performance
        in mind. Whether you're a casual gamer, competitive player, or content creator, we deliver powerful
        PCs designed around your style : and built to last.</p>
        <button class="btn btn-start" id="startBuildBtn">▶ START MY BUILD</button>
        <nav class="game-menu" id="gameMenu" aria-label="Main menu">
          ${MENU.map((m, i) => `
            <button class="gm-item ${i === 0 ? 'sel' : ''}" data-go="${m.go}" data-i="${i}" style="--d:${i * 70}ms">
              <span class="gm-caret">▶</span>
              <span class="gm-num">0${i + 1}</span>
              <span class="gm-label">${m.label}</span>
              <span class="gm-desc">${m.desc}</span>
            </button>`).join('')}
        </nav>
        <div class="menu-contact">
          <a href="${CONTACT.phoneHref}">${CONTACT.phone}</a>
          <span class="dot">·</span>
          <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>
          <span class="socials">${SOCIALS.map(s => `<a href="${s.href}" target="_blank" rel="noopener">${s.name.slice(0, 2)}</a>`).join('')}</span>
        </div>
        <div class="menu-hint step-hint"><kbd>↑</kbd><kbd>↓</kbd> navigate · <kbd>ENTER</kbd> select</div>
        <div class="partners">
          <span class="partners-label">POWERED BY</span>
          ${['nvidia', 'amd', 'intel', 'msi', 'giga', 'rog'].map(p => `<img src="${IMG}${p}.png" alt="${p}" loading="lazy">`).join('')}
        </div>
      </div>
      <div class="menu-right">
        <img class="hero-img" src="${IMG}img-pc1.png" alt="Purple RGB tower, hand-built by Game4FunPCs">
        <button class="btn-quote" id="quoteBtn">GET FREE QUOTE <span class="circ">→</span></button>
        <button class="mini-reviews" id="miniReviews" title="Read the reviews">
          <div class="mini-head">
            <span class="stars-row">${Array.from({ length: 5 }, () => `<img src="${IMG}Symbol.png" alt="">`).join('')}</span>
            <span class="mini-score"><b>${REVIEW_STATS.rating}</b> · ${REVIEW_STATS.count} Google reviews</span>
          </div>
          <p class="mini-quote">“${TESTIMONIALS[0].text.slice(0, 92)}…”</p>
          <span class="mini-link">READ THEM →</span>
        </button>
      </div>
    </div>`

  // boot log
  const log = root.querySelector('#bootLog')
  let li = 0
  const timer = setInterval(() => {
    if (li >= BOOT_LINES.length) { clearInterval(timer); return }
    const [txt, ok] = BOOT_LINES[li++]
    const div = document.createElement('div')
    div.textContent = txt
    const s = document.createElement('span'); s.className = 'ok'; s.textContent = ok
    div.appendChild(s)
    log.appendChild(div)
  }, 220)

  // menu selection (mouse + keyboard)
  const items = [...root.querySelectorAll('.gm-item')]
  let sel = 0
  function select(i, sound = true) {
    sel = (i + items.length) % items.length
    items.forEach((el, j) => el.classList.toggle('sel', j === sel))
    if (sound) ctx.audio.hover()
  }
  function activate() {
    const go = items[sel].dataset.go
    clearInterval(timer)
    ctx.audio.unlock()
    if (go === 'quiz') ctx.audio.boot(); else ctx.audio.advance()
    ctx.go(go)
  }
  items.forEach((el, i) => {
    el.addEventListener('mouseenter', () => select(i))
    el.addEventListener('click', () => { select(i, false); activate() })
  })
  root.querySelector('#miniReviews').addEventListener('click', () => {
    clearInterval(timer)
    ctx.audio.unlock(); ctx.audio.advance()
    ctx.go('reviews')
  })
  const startBuild = () => {
    clearInterval(timer)
    ctx.audio.unlock(); ctx.audio.boot()
    ctx.go('quiz')
  }
  root.querySelector('#startBuildBtn').addEventListener('click', startBuild)
  root.querySelector('#quoteBtn').addEventListener('click', startBuild)

  return {
    onLeave: () => clearInterval(timer),
    onKey: e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); select(sel + 1) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); select(sel - 1) }
      else if (e.key === 'Enter') { e.preventDefault(); activate() }
    },
  }
}
