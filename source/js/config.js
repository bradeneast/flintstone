export let local_key = 'flintstone_data';
export let local_preferences_key = 'flintstone_preferences';

export let initial_state = {
  expandedAdjustments: [],
  currentUser: {
    documents: [{ id: 'New Document', body: '' }],
    datasets: [{ id: 'New Data', fields: [['', '']] }],
    styles: {}
  }
};

export let initial_preferences = {
  dark: false,
  showStyles: false,
  showMenu: false
};

export let portables = ['documents', 'datasets'];