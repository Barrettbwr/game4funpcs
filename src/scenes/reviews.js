import { TESTIMONIALS, REVIEW_STATS } from '../content.js'

const IMG = import.meta.env.BASE_URL + 'images/'

const STARS = Array.from({ length: 5 }, () => '<img src="${IMG}Symbol.png" alt="">').join('')

export function render(root, ctx) {
  root.innerHTML = `
    <div class="wrap sub-scene">
      <div class="sub-head">
        <button class="link-btn back-link" id="backBtn">← MENU</button>
        <span class="kicker">Testimonials</span>
        <h2 class="step-title">What our respectable<br>clients say</h2>
        <p class="sub">${REVIEW_STATS.rating} ★ across ${REVIEW_STATS.count} Google reviews. Here are a few of them.</p>
      </div>
      <div class="carousel" id="carousel">
        <button class="car-arrow" id="prevBtn" aria-label="Previous review">‹</button>
        <div class="car-stage">
          <div class="review-card" id="reviewCard">
            <div class="review-top">
              <img class="avatar" src="${IMG}male.png" alt="">
              <div>
                <span class="review-name" id="revName"></span>
                <div class="stars-row" aria-label="5 out of 5 stars">${STARS}</div>
              </div>
            </div>
            <blockquote class="review-text" id="revText"></blockquote>
            <div class="review-meta">
              <span class="review-src">POSTED ON <b>GOOGLE</b></span>
            </div>
          </div>
        </div>
        <button class="car-arrow" id="nextBtn" aria-label="Next review">›</button>
      </div>
      <div class="proof-strip">
        <img src="${IMG}build-1493.png" alt="A real customer build by Game4FunPCs" class="proof-img">
        <img src="${IMG}img-pc1.png" alt="Purple RGB tower hand-built by Game4FunPCs" class="proof-img proof-tall">
        <span class="proof-cap">↑ actual customer builds, not stock renders</span>
      </div>
      <div class="car-dots" id="dots">
        ${TESTIMONIALS.map((_, i) => `<button class="dot-btn" data-i="${i}" aria-label="Review ${i + 1}"></button>`).join('')}
      </div>
      <div class="sub-cta">
        <button class="btn-quote" id="buildBtn">BECOME THE NEXT REVIEW <span class="circ">→</span></button>
        <span class="step-hint"><kbd>←</kbd><kbd>→</kbd> to browse</span>
      </div>
    </div>`

  const card = root.querySelector('#reviewCard')
  const dots = [...root.querySelectorAll('.dot-btn')]
  let idx = 0
  let auto = setInterval(() => show(idx + 1, false), 9000)

  function show(i, sound = true) {
    idx = (i + TESTIMONIALS.length) % TESTIMONIALS.length
    const t = TESTIMONIALS[idx]
    card.classList.remove('flip')
    void card.offsetWidth
    card.classList.add('flip')
    root.querySelector('#revText').textContent = `“${t.text}”`
    root.querySelector('#revName').textContent = t.name
    dots.forEach((d, j) => d.classList.toggle('on', j === idx))
    if (sound) ctx.audio.select()
  }
  function manual(i) {
    clearInterval(auto)
    auto = setInterval(() => show(idx + 1, false), 9000)
    show(i)
  }
  show(0, false)

  root.querySelector('#prevBtn').addEventListener('click', () => manual(idx - 1))
  root.querySelector('#nextBtn').addEventListener('click', () => manual(idx + 1))
  dots.forEach(d => d.addEventListener('click', () => manual(+d.dataset.i)))
  root.querySelector('#backBtn').addEventListener('click', () => { ctx.audio.back(); ctx.go('home') })
  root.querySelector('#buildBtn').addEventListener('click', () => { ctx.audio.boot(); ctx.go('quiz') })

  return {
    onLeave: () => clearInterval(auto),
    onKey: e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); manual(idx + 1) }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); manual(idx - 1) }
    },
  }
}
