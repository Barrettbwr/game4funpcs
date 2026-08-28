import { SERVICES, QUEST, FAQ } from '../content.js'

const IMG = import.meta.env.BASE_URL + 'images/'

const TABS = [
  { id: 'services', label: 'SERVICES' },
  { id: 'quest', label: 'HOW IT WORKS' },
  { id: 'faq', label: 'FAQ' },
]

export function render(root, ctx) {
  let tab = 'services'
  let faqIdx = 0

  root.innerHTML = `
    <div class="wrap sub-scene">
      <div class="sub-head">
        <button class="link-btn back-link" id="backBtn">← MENU</button>
        <span class="kicker">Our Services</span>
        <h2 class="step-title">Here's what we offer</h2>
      </div>
      <div class="tier-tabs intel-tabs">
        ${TABS.map(t => `<button class="tier-tab" data-tab="${t.id}" aria-pressed="${t.id === tab}">${t.label}</button>`).join('')}
      </div>
      <div class="intel-body" id="intelBody"></div>
    </div>`

  const body = root.querySelector('#intelBody')

  function draw() {
    if (tab === 'services') {
      const SVC_IMGS = ['/images/step-1.png', '/images/step-2.png', '/images/step-3.png', '/images/footer-pc.png']
      body.innerHTML = `
        <div class="svc-grid">
          ${SERVICES.map(([t, d], i) => `
            <div class="info-card" style="--d:${i * 60}ms">
              <img class="svc-img" src="${SVC_IMGS[i]}" alt="">
              <span class="n">SVC 0${i + 1}</span>
              <h3>${t}</h3>
              <p>${d}</p>
            </div>`).join('')}
        </div>
        <p class="intel-note">+ Custom air & liquid cooling · RGB synced to your palette · Honest, transparent pricing : no markups, no gimmicks.</p>`
    } else if (tab === 'quest') {
      body.innerHTML = `
        <div class="svc-grid">
          ${QUEST.map(([t, d], i) => `
            <div class="info-card" style="--d:${i * 60}ms">
              <span class="n">STEP 0${i + 1}</span>
              <h3>${t}</h3>
              <p>${d}</p>
            </div>`).join('')}
        </div>`
    } else {
      body.innerHTML = `
        <div class="faq-split">
          <div class="faq-list">
            ${FAQ.map(([q], i) => `
              <button class="faq-q ${i === faqIdx ? 'sel' : ''}" data-i="${i}">
                <span class="gm-caret">▶</span>${q}
              </button>`).join('')}
          </div>
          <div class="faq-answer panel">
            <span class="kicker" style="font-size:10.5px" id="faqQ"></span>
            <p id="faqA"></p>
          </div>
        </div>`
      const syncFaq = () => {
        body.querySelectorAll('.faq-q').forEach((b, i) => b.classList.toggle('sel', i === faqIdx))
        body.querySelector('#faqQ').textContent = FAQ[faqIdx][0].toUpperCase()
        body.querySelector('#faqA').textContent = FAQ[faqIdx][1]
      }
      syncFaq()
      body.querySelectorAll('.faq-q').forEach(b => {
        b.addEventListener('click', () => { faqIdx = +b.dataset.i; syncFaq(); ctx.audio.select() })
        b.addEventListener('mouseenter', () => ctx.audio.hover())
      })
    }
  }
  draw()

  root.querySelectorAll('.intel-tabs .tier-tab').forEach(t => t.addEventListener('click', () => {
    tab = t.dataset.tab
    root.querySelectorAll('.intel-tabs .tier-tab').forEach(x => x.setAttribute('aria-pressed', String(x === t)))
    ctx.audio.select()
    draw()
  }))
  root.querySelector('#backBtn').addEventListener('click', () => { ctx.audio.back(); ctx.go('home') })

  return {
    onKey: e => {
      if (tab !== 'faq') return
      if (e.key === 'ArrowDown') { e.preventDefault(); faqIdx = (faqIdx + 1) % FAQ.length; draw(); ctx.audio.hover() }
      else if (e.key === 'ArrowUp') { e.preventDefault(); faqIdx = (faqIdx - 1 + FAQ.length) % FAQ.length; draw(); ctx.audio.hover() }
    },
  }
}
