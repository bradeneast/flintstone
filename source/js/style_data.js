let headingAdjustments = ['font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform', 'color'];
let inlineElementAdjustments = ['font-weight', 'letter-spacing', 'text-transform', 'color'];

export let tags = {
  '.preview__wrapper': {
    normieName: 'Global',
    useAdjustments: ['font-size', 'line-height', '--space']
  },
  h1: {
    normieName: 'Level 1 Headings',
    useAdjustments: headingAdjustments,
  },
  h2: {
    normieName: 'Level 2 Headings',
    useAdjustments: headingAdjustments,
  },
  h3: {
    normieName: 'Level 3 Headings',
    useAdjustments: headingAdjustments,
  },
  h4: {
    normieName: 'Level 4 Headings',
    useAdjustments: headingAdjustments,
  },
  h5: {
    normieName: 'Level 5 Headings',
    useAdjustments: headingAdjustments,
  },
  h6: {
    normieName: 'Level 6 Headings',
    useAdjustments: headingAdjustments,
  },
  a: {
    normieName: 'Links',
    useAdjustments: inlineElementAdjustments,
  },
  strong: {
    normieName: 'Bold Text',
    useAdjustments: inlineElementAdjustments,
  },
  em: {
    normieName: 'Italic Text',
    useAdjustments: inlineElementAdjustments,
  },
  del: {
    normieName: 'Strikethroughs',
    useAdjustments: inlineElementAdjustments,
  },
}


class Adjustment {
  constructor(type) {
    this.type = type;
  }
}

class Text extends Adjustment {
  constructor({ placeholder }) {
    super('text');
    this.placeholder = placeholder || '';
  }
}

class Range extends Adjustment {
  constructor({
    min, max, step, unit
  }) {
    super('range');
    this.min = min || 0;
    this.max = max || 100;
    this.step = step || 1;
    this.unit = unit || '';
  }
}

class Select extends Adjustment {
  constructor({
    options, defaultValue
  }) {
    super('select');
    this.options = options || [];
    this.defaultValue = defaultValue || '';
  }
}


export let adjustments = {
  'font-size': new Range({
    min: 8,
    max: 72,
    step: 1,
    unit: 'px'
  }),
  'font-weight': new Range({
    min: 300,
    max: 900,
    step: 50,
    unit: ''
  }),
  'letter-spacing': new Range({
    type: 'range',
    min: -5,
    max: 5,
    step: .2,
    unit: 'px'
  }),
  'line-height': new Range({
    type: 'range',
    min: .5,
    max: 2.5,
    step: .1,
    unit: ''
  }),
  '--space': new Range({
    type: 'range',
    min: 0,
    max: 56,
    step: 1,
    unit: 'px'
  }),
  'text-transform': new Select({
    type: 'select',
    defaultValue: 'none',
    options: [
      'capitalize',
      'uppercase',
      'lowercase',
      'none'
    ]
  }),
  'color': new Text({
    type: 'text',
    placeholder: 'tomato'
  }),
}