// Stylized outline rig, shared by the assembly playback and the rig designer.
// Each lighting zone is driven by a CSS variable (--z-*) so callers can color
// zones independently; unset vars fall back to the site accent.
export function rigSvg() {
  return `
  <svg class="rig-svg" viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="glowg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style="stop-color:var(--z-glow, rgb(var(--accent-rgb)))" stop-opacity="0.22"/>
        <stop offset="1" style="stop-color:var(--z-glow, rgb(var(--accent-rgb)))" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    <rect class="glow" x="24" y="20" width="272" height="360" rx="12" fill="url(#glowg)"/>
    <!-- case -->
    <g id="p-case" class="part">
      <rect x="18" y="14" width="284" height="372" rx="14" stroke="var(--p-body, var(--line2))" stroke-width="2"/>
      <rect x="32" y="28" width="256" height="344" rx="8" stroke="var(--line)" stroke-width="1" stroke-dasharray="3 5"/>
      <circle cx="286" cy="32" r="3" fill="rgb(var(--accent-rgb))" opacity="0.9"/>
    </g>
    <!-- front fans -->
    <g id="p-fans" class="part">
      ${[92, 172, 252].map(cy => `
      <g class="spin">
        <circle cx="66" cy="${cy}" r="27" stroke="var(--p-body, var(--line2))" stroke-width="2"/>
        <path d="M66 ${cy - 20} A20 20 0 0 1 66 ${cy}  M${66 + 17.3} ${cy + 10} A20 20 0 0 1 66 ${cy} M${66 - 17.3} ${cy + 10} A20 20 0 0 1 66 ${cy}"
          class="fanblade" stroke="var(--z-fans, var(--faint))" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="66" cy="${cy}" r="5" fill="var(--line2)"/>
      </g>`).join('')}
    </g>
    <!-- CPU + cooler -->
    <g id="p-cpu" class="part">
      <rect x="150" y="64" width="76" height="76" rx="8" stroke="var(--p-body, var(--line2))" stroke-width="2"/>
      <g class="spin">
        <circle cx="188" cy="102" r="26" stroke="var(--z-cpu, var(--faint))" stroke-width="2"/>
        <path d="M188 84 A18 18 0 0 1 188 102 M203.6 111 A18 18 0 0 1 188 102 M172.4 111 A18 18 0 0 1 188 102" class="fanblade" stroke="var(--z-cpu, var(--faint))" stroke-width="2.2" stroke-linecap="round"/>
      </g>
      <text x="188" y="156" text-anchor="middle" font-family="var(--font-m)" font-size="9" letter-spacing="2" fill="var(--faint)">CPU</text>
    </g>
    <!-- RAM -->
    <g id="p-ram" class="part">
      <rect x="244" y="60" width="9" height="88" rx="3" stroke="var(--p-body, var(--line2))" stroke-width="2"/>
      <rect x="262" y="60" width="9" height="88" rx="3" stroke="var(--p-body, var(--line2))" stroke-width="2"/>
      <rect x="246" y="66" width="5" height="10" rx="1" fill="var(--z-ram, rgb(var(--accent-rgb)))" opacity="0.85"/>
      <rect x="264" y="66" width="5" height="10" rx="1" fill="var(--z-ram, rgb(var(--accent-rgb)))" opacity="0.85"/>
    </g>
    <!-- GPU -->
    <g id="p-gpu" class="part">
      <rect x="118" y="210" width="180" height="48" rx="8" stroke="var(--p-body, var(--line2))" stroke-width="2.5"/>
      <rect x="118" y="210" width="180" height="7" rx="3.5" fill="var(--z-gpu, rgb(var(--accent-rgb)))" opacity="0.9"/>
      <circle cx="160" cy="236" r="14" stroke="var(--faint)" stroke-width="2"/>
      <circle cx="210" cy="236" r="14" stroke="var(--faint)" stroke-width="2"/>
      <text x="272" y="240" text-anchor="middle" font-family="var(--font-m)" font-size="9" letter-spacing="1.5" fill="var(--faint)">GPU</text>
    </g>
    <!-- PSU shroud -->
    <g id="p-psu" class="part">
      <rect x="118" y="316" width="180" height="52" rx="8" stroke="var(--p-body, var(--line2))" stroke-width="2"/>
      <text x="208" y="347" text-anchor="middle" font-family="var(--font-m)" font-weight="700" font-size="14" letter-spacing="4" fill="var(--faint)">G4F</text>
    </g>
    <!-- click targets for the designer (inert elsewhere) -->
    <rect class="zone-hit" data-zone="fans" x="32" y="58" width="70" height="226" fill="transparent"/>
    <rect class="zone-hit" data-zone="cpu" x="144" y="58" width="88" height="96" fill="transparent"/>
    <rect class="zone-hit" data-zone="ram" x="238" y="54" width="40" height="100" fill="transparent"/>
    <rect class="zone-hit" data-zone="gpu" x="112" y="204" width="192" height="60" fill="transparent"/>
    <rect class="zone-hit" data-zone="glow" x="112" y="312" width="192" height="62" fill="transparent"/>
  </svg>`
}
