// ————— Game roster —————
// factor = how easy the game is to run (higher = more FPS per unit of GPU power)
export const GAMES = [
  { id: 'fortnite',  name: 'Fortnite',          code: 'FN', hue: 262, factor: 1.6,  tag: 'Battle Royale' },
  { id: 'valorant',  name: 'Valorant',          code: 'VA', hue: 350, factor: 3.2,  tag: 'Tac Shooter' },
  { id: 'warzone',   name: 'Warzone',           code: 'WZ', hue: 88,  factor: 1.05, tag: 'Battle Royale' },
  { id: 'cs2',       name: 'Counter-Strike 2',  code: 'CS', hue: 35,  factor: 2.4,  tag: 'Tac Shooter' },
  { id: 'apex',      name: 'Apex Legends',      code: 'AP', hue: 8,   factor: 1.5,  tag: 'Battle Royale' },
  { id: 'minecraft', name: 'Minecraft',         code: 'MC', hue: 120, factor: 2.6,  tag: 'Sandbox' },
  { id: 'roblox',    name: 'Roblox',            code: 'RB', hue: 0,   factor: 2.8,  tag: 'Platform' },
  { id: 'gtav',      name: 'GTA V',             code: 'GT', hue: 150, factor: 1.5,  tag: 'Open World' },
  { id: 'cyberpunk', name: 'Cyberpunk 2077',    code: 'CP', hue: 55,  factor: 0.7,  tag: 'RPG · Heavy' },
  { id: 'eldenring', name: 'Elden Ring',        code: 'ER', hue: 42,  factor: 1.0,  cap: 60, capNote: 'engine cap', tag: 'Souls' },
  { id: 'league',    name: 'League of Legends', code: 'LG', hue: 190, factor: 3.0,  tag: 'MOBA' },
  { id: 'rocket',    name: 'Rocket League',     code: 'RL', hue: 210, factor: 2.5,  tag: 'Sports' },
  { id: 'other',     name: 'Other titles',      code: '++', hue: 280, factor: 1.5,  tag: 'Tell us what', other: true },
]

// ————— Graphics styles —————
export const STYLES = [
  {
    id: 'competitive', name: 'COMPETITIVE',
    blurb: 'Every frame is a weapon. Performance settings, max FPS, tournament-ready.',
    settings: 'Performance settings', factor: 1.5, icon: 'crosshair',
  },
  {
    id: 'balanced', name: 'BALANCED',
    blurb: 'High settings, high frames. The way most people should play.',
    settings: 'High settings', factor: 1.0, icon: 'diamond', popular: true,
  },
  {
    id: 'cinematic', name: 'CINEMATIC',
    blurb: 'Ultra everything. Ray tracing on. Screenshots that look like trailers.',
    settings: 'Ultra + ray tracing', factor: 0.62, icon: 'sparkle',
  },
]

// ————— Displays —————
export const DISPLAYS = [
  { id: 'p1080', name: '1080p', blurb: 'Esports standard · up to 240Hz+', factor: 1.0 },
  { id: 'p1440', name: '1440p', blurb: 'The sweet spot. Sharp AND fast.', factor: 0.72, popular: true },
  { id: 'uw',    name: 'ULTRAWIDE', blurb: '1440p ultrawide · full immersion', factor: 0.62 },
  { id: 'p4k',   name: '4K', blurb: 'Maximum fidelity. No compromise.', factor: 0.42 },
]

// ————— Budget (current market) —————
export const BUDGET_MARKET = { floor: 800, ceil: 6000, step: 100, defMin: 1500, defMax: 2800 }

export function tierForBudget(min, max) {
  const mid = (min + max) / 2
  if (mid < 1900) return TIERS.starter
  if (mid < 3800) return TIERS.pro
  return TIERS.ultra
}

export function fmtUsd(n, ceilPlus = false) {
  return `$${n.toLocaleString('en-US')}${ceilPlus && n >= BUDGET_MARKET.ceil ? '+' : ''}`
}

export const TIERS = {
  starter: {
    id: 'starter', name: 'STARTER', power: 100, price: '$1,299 – $1,599',
    gpu: 'GeForce RTX 5060', cpu: 'AMD Ryzen 5 9600X', ram: '16GB DDR5-5600 (open upgrade path)', ssd: '1TB NVMe Gen4',
  },
  pro: {
    id: 'pro', name: 'PRO', power: 175, price: '$2,499 – $2,899',
    gpu: 'GeForce RTX 5070 Ti', cpu: 'AMD Ryzen 7 9800X3D', ram: '32GB DDR5-6000', ssd: '2TB NVMe Gen4',
  },
  ultra: {
    id: 'ultra', name: 'ULTRA', power: 300, price: '$5,299+',
    gpu: 'GeForce RTX 5090', cpu: 'AMD Ryzen 7 9800X3D', ram: '64GB DDR5-6000', ssd: '4TB NVMe Gen5',
  },
}

// ————— FPS math —————
export function estimateFps(game, tier, displayId, styleId) {
  const display = DISPLAYS.find(d => d.id === displayId)
  const style = STYLES.find(s => s.id === styleId)
  let fps = tier.power * game.factor * display.factor * style.factor
  fps = Math.round(fps / 5) * 5
  let capped = false
  if (game.cap && fps >= game.cap) { fps = game.cap; capped = true }
  const plus = !capped && fps >= 240
  if (plus) fps = 240
  return { fps, plus, capped, capNote: capped ? game.capNote : null }
}

export function fpsLabel(r) {
  if (r.capped) return `${r.fps} FPS`
  return r.plus ? '240+ FPS' : `${r.fps} FPS`
}

// Where quiz submissions go. Point this at a Formspree/backend endpoint to
// receive leads by email; empty = leads are kept in localStorage only.
export const FORM_ENDPOINT = 'https://formspree.io/f/mnpqarzr'
