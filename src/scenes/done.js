import { burst } from '../bg.js'

export function render(root, ctx) {
  const first = (ctx.state.contact.name || 'friend').split(' ')[0]
  const code = 'G4F-' + Math.random().toString(36).slice(2, 6).toUpperCase()

  root.innerHTML = `
    <div class="wrap done">
      <div class="done-badge">✓</div>
      <span class="kicker">QUEST ACCEPTED</span>
      <h1 style="margin-top:14px">WE'RE ON IT,<br>${escapeHtml(first).toUpperCase()}.</h1>
      <p class="sub">Your loadout is locked in. A real builder : not a bot : will email you within
      <b style="color:var(--text)">24 hours</b> with a fully itemized quote. You don't pay a cent until you approve it.</p>
      <div class="order-code"><small>BUILD CODE</small>${code}</div>
      <div class="done-steps">
        <div class="done-step"><span class="n">STEP 01</span><p>We email your transparent parts quote : every component priced, nothing hidden.</p></div>
        <div class="done-step"><span class="n">STEP 02</span><p>You approve. We build, and you watch it happen on your live build-log page.</p></div>
        <div class="done-step"><span class="n">STEP 03</span><p>24h stress test, thermal report, foam-packed shipping. Then you game.</p></div>
      </div>
      <div class="boot-cta" style="margin-top:26px">
        <button class="btn btn-ghost" id="againBtn">⌂ BACK TO BASE</button>
      </div>
    </div>`

  ctx.audio.fanfare()
  setTimeout(() => burst(window.innerWidth / 2, window.innerHeight * 0.3, 80), 200)
  setTimeout(() => burst(window.innerWidth * 0.3, window.innerHeight * 0.5, 40), 600)
  setTimeout(() => burst(window.innerWidth * 0.7, window.innerHeight * 0.5, 40), 900)

  root.querySelector('#againBtn').addEventListener('click', () => {
    ctx.resetAll()
    ctx.go('home')
  })
  return {}
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}
