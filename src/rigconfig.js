// Rig model: part PAINT (physical hardware color) is independent of RGB LIGHTING.
export const ZONES = [
  { id: 'fans', name: 'Front fans ×3' },
  { id: 'cpu',  name: 'CPU cooler' },
  { id: 'ram',  name: 'RAM sticks' },
  { id: 'gpu',  name: 'GPU accent' },
  { id: 'glow', name: 'Case glow' },
]

// Physical paint of the parts : case, fan frames, shrouds, sticks.
export const PAINTS = {
  standard: { label: 'STANDARD',  blurb: 'Stock look : classic dark hardware.', body: '#3c3c42', part: '#5a5a64' },
  white:    { label: 'ALL WHITE', blurb: 'White case, white fans, white cables. Spotless.', body: '#f2f2f2', part: '#e6e6e6' },
  black:    { label: 'ALL BLACK', blurb: 'Murdered out : matte black everything.', body: '#26262b', part: '#33333a' },
}

const DEFAULT_ZONES = {
  fans: { on: true, color: '#c100ff' }, cpu: { on: true, color: '#c100ff' }, ram: { on: true, color: '#c100ff' },
  gpu: { on: true, color: '#c100ff' }, glow: { on: true, color: '#c100ff' },
}

export function defaultRig() {
  return { paint: 'standard', rgb: true, zones: structuredClone(DEFAULT_ZONES) }
}

// Zones that are actually lit, honoring the master RGB choice.
export function litZones(rig) {
  if (!isRigValid(rig) || rig.rgb === false) return []
  return ZONES.filter(z => rig.zones[z.id].on)
}

export function isRigValid(rig) {
  return rig && rig.paint && rig.zones
}

// Name for the whole build (results header, email subject).
export function buildLabel(rig) {
  if (!isRigValid(rig)) return 'SIGNATURE'
  const lit = litZones(rig)
  if (rig.paint !== 'standard') return PAINTS[rig.paint].label + (lit.length ? ' + RGB' : '')
  if (!lit.length) return 'STEALTH'
  const colors = new Set(lit.map(z => rig.zones[z.id].color))
  return colors.size === 1 && colors.has('#c100ff') ? 'SIGNATURE' : 'CUSTOM RGB'
}

// Paint a rig SVG element from a rig config.
export function applyRig(svgEl, rig) {
  if (!svgEl || !isRigValid(rig)) return
  const paint = PAINTS[rig.paint]
  const lit = new Set(litZones(rig).map(z => z.id))
  svgEl.style.setProperty('--p-body', paint.body)
  for (const z of ZONES) {
    const off = z.id === 'glow' ? 'transparent' : paint.part
    svgEl.style.setProperty(`--z-${z.id}`, lit.has(z.id) ? rig.zones[z.id].color : off)
  }
}

// The color that should tint the site while this rig is active.
export function primaryAccent(rig) {
  if (!isRigValid(rig)) return '#c100ff'
  const lit = new Set(litZones(rig).map(z => z.id))
  for (const id of ['glow', 'fans', 'gpu', 'cpu', 'ram']) {
    if (lit.has(id)) return rig.zones[id].color
  }
  return rig.paint === 'white' ? '#e8eaf0' : '#9aa0aa'
}

// Readable summaries for the quote email.
export function paintSummary(rig) {
  return isRigValid(rig) ? PAINTS[rig.paint].label : 'STANDARD'
}
export function rgbSummary(rig) {
  if (!isRigValid(rig)) return 'standard'
  const on = litZones(rig)
  if (!on.length) return 'none : no RGB'
  return on.map(z => `${z.id} ${rig.zones[z.id].color}`).join(' · ')
}
