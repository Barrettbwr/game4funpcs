import { CONTACT, SOCIALS } from '../content.js'

export function render(root, ctx) {
  root.innerHTML = `
    <div class="wrap sub-scene">
      <div class="sub-head">
        <button class="link-btn back-link" id="backBtn">← MENU</button>
        <span class="kicker">Contact</span>
        <h2 class="step-title">Get in touch with us</h2>
        <p class="sub">Have questions, feedback, or need assistance? We're here to help : reach out and let's connect.</p>
      </div>
      <div class="contact-grid">
        <a class="info-card contact-card" href="${CONTACT.phoneHref}">
          <span class="n">CALL / TEXT</span>
          <h3>${CONTACT.phone}</h3>
          <p>Fastest way to reach a builder.</p>
        </a>
        <a class="info-card contact-card" href="mailto:${CONTACT.email}">
          <span class="n">EMAIL</span>
          <h3 class="break">${CONTACT.email}</h3>
          <p>Quotes, questions, anything else.</p>
        </a>
        <a class="info-card contact-card" href="mailto:${CONTACT.warrantyEmail}">
          <span class="n">WARRANTY & SUPPORT</span>
          <h3 class="break">${CONTACT.warrantyEmail}</h3>
          <p>Post-sale support, remote help, warranty claims.</p>
        </a>
        <div class="info-card">
          <span class="n">FOLLOW THE BUILDS</span>
          <div class="social-row">
            ${SOCIALS.map(s => `<a class="btn btn-ghost social-btn" href="${s.href}" target="_blank" rel="noopener">${s.name}</a>`).join('')}
          </div>
        </div>
      </div>
      <div class="sub-cta">
        <button class="btn btn-primary" id="buildBtn">▶ OR JUST START YOUR BUILD</button>
      </div>
    </div>`

  root.querySelector('#backBtn').addEventListener('click', () => { ctx.audio.back(); ctx.go('home') })
  root.querySelector('#buildBtn').addEventListener('click', () => { ctx.audio.boot(); ctx.go('quiz') })
  return {}
}
