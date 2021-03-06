export let local_key = 'flintstone_data';
export let local_preferences_key = 'flintstone_preferences';

export let initial_state = {
  /** Adjustment modules expanded in the style editor */
  expandedAdjustments: [],
  /** Keeps track if control key is pressed */
  shortcutReady: false,
  /** Selected items for exporting */
  exportSelection: {},
  /** All importable items from an uploaded file */
  forImport: {},
  /** Selected items for importing */
  importSelection: {},
  intellisense: {
    logger: '',
    suggestions: [],
  },
  /** User data that actually gets saved */
  currentUser: {
    documents: [{ id: 'New Document', body: '' }],
    datasets: [{ id: 'New Data', fields: [['', '']] }],
    styles: {}
  }
};

export let initial_preferences = {
  dark: false,
  open_pane: undefined,
  show_header_nav: false
};

export let portables = ['documents', 'datasets'];