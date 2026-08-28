# GAME4FUN PCs

A game-like site for Game4FunPCs (game4funpcs.com) — no traditional scrolling pages.
The whole site is a set of full-screen scenes, navigated like a game:

**MAIN MENU** (arrow keys / Enter or mouse, live rig render, real contact info) →
- **START YOUR BUILD** — 5-level quiz (games · graphics style · display · palette · budget)
  → "assembling your rig" playback with typed terminal log and per-game FPS reveals
  → loadout card with honest FPS table + tier switcher → claim form (Formspree) → quest accepted
- **THE LOOKS** — palette showcase; picking one re-themes the entire site live
- **PLAYER REVIEWS** — carousel of the real Google reviews from the live site
- **SERVICES & INTEL** — tabs: services / how it works / FAQ (inventory-style Q&A)
- **CONTACT** — real phone, emails, and socials

Escape backs out of any scene. Synth sound effects (mutable), particle background,
responsive, respects `prefers-reduced-motion`. Business content (testimonials, services,
FAQ, contact) lives in `src/content.js`, pulled from the live game4funpcs.com site.

## Run it

```bash
npm install
npm run dev        # local dev at http://localhost:5173
npm run build      # production build → dist/
```

Deploy `dist/` anywhere static (Netlify, Vercel, Cloudflare Pages, GitHub Pages).

## Receiving leads

Claims POST as JSON to the Formspree endpoint in `FORM_ENDPOINT` at the bottom of
`src/data.js` (currently wired to `https://formspree.io/f/mnpqarzr`), with `_subject`
set so each email arrives as `⚡ Build claim — HULK / PRO — <name>`. If the POST fails,
the visitor sees a retry message instead of a false success. A backup copy of every
claim is also kept in the visitor's browser `localStorage` (inspect with `G4F.leads()`
in the console).

Each lead includes the full loadout: games, style, display, monitor-needed flag,
palette (+ custom theme text), budget class, and **which tier they were viewing
when they claimed** — if they picked a Starter budget but claimed while looking
at PRO numbers, that's your upsell.

## Tuning the numbers

Everything lives in `src/data.js`: game roster and how heavy each game is to run,
the three build tiers (parts + power + price), palettes and their included perks,
and the FPS formula. Adjust `power` per tier as real GPU generations change.
