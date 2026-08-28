export const state = {
  games: [],        // array of game ids
  style: null,      // style id
  display: null,    // display id
  monitor: false,   // wants a monitor too
  rig: null,        // lighting config (see rigconfig.js), initialized on first designer mount
  themeTags: [],    // interest chips (superheroes, anime, ...)
  themeText: '',
  budgetMin: null,
  budgetMax: null,
  otherGames: '',
  contact: { name: '', email: '', notes: '' },
}

export function resetState() {
  state.games = []
  state.style = null
  state.display = null
  state.monitor = false
  state.rig = null
  state.themeTags = []
  state.themeText = ''
  state.budgetMin = null
  state.budgetMax = null
  state.otherGames = ''
  state.contact = { name: '', email: '', notes: '' }
}
