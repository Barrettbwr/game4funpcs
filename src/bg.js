// Ambient particle field on a fixed canvas, tinted by the active accent.
const canvas = document.getElementById('bg')
const ctx = canvas.getContext('2d')
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

let W = 0, H = 0, dpr = 1
let accent = [74, 222, 128]
let dust = []
let sparks = []
let mx = 0.5, my = 0.5

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  W = window.innerWidth; H = window.innerHeight
  canvas.width = W * dpr; canvas.height = H * dpr
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function makeDust() {
  const n = reduced ? 26 : Math.min(70, Math.round((W * H) / 22000))
  dust = Array.from({ length: n }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: 0.6 + Math.random() * 1.7,
    vy: -(0.08 + Math.random() * 0.3),
    vx: (Math.random() - 0.5) * 0.08,
    a: 0.08 + Math.random() * 0.3,
    depth: 0.3 + Math.random() * 0.7,
    tw: Math.random() * Math.PI * 2,
  }))
}

export function setBgAccent(hex) {
  const h = hex.replace('#', '')
  accent = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

export function burst(cx, cy, count = 60) {
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2
    const sp = 2 + Math.random() * 7
    sparks.push({
      x: cx, y: cy,
      vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 2.5,
      life: 1, decay: 0.008 + Math.random() * 0.015,
      r: 1 + Math.random() * 2.5,
    })
  }
}

function frame() {
  ctx.clearRect(0, 0, W, H)
  const [r, g, b] = accent
  for (const p of dust) {
    if (!reduced) {
      p.x += p.vx + (mx - 0.5) * p.depth * 0.25
      p.y += p.vy * p.depth
      p.tw += 0.02
      if (p.y < -8) { p.y = H + 8; p.x = Math.random() * W }
      if (p.x < -8) p.x = W + 8
      if (p.x > W + 8) p.x = -8
    }
    const alpha = p.a * (reduced ? 1 : (0.6 + 0.4 * Math.sin(p.tw)))
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
  }
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i]
    s.x += s.vx; s.y += s.vy; s.vy += 0.12; s.vx *= 0.99; s.life -= s.decay
    if (s.life <= 0) { sparks.splice(i, 1); continue }
    ctx.fillStyle = `rgba(${r},${g},${b},${s.life * 0.9})`
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2); ctx.fill()
  }
  requestAnimationFrame(frame)
}

export function initBg() {
  resize(); makeDust()
  window.addEventListener('resize', () => { resize(); makeDust() })
  window.addEventListener('pointermove', e => { mx = e.clientX / W; my = e.clientY / H })
  requestAnimationFrame(frame)
}
