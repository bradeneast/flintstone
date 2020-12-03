let headingAdjustments = ['font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform', 'color'];
let inlineElementAdjustments = ['font-weight', 'letter-spacing', 'text-transform', 'color'];
let headerFooterAdjustments = ['content', 'color', 'font-size', 'font-weight', 'text-transform', 'letter-spacing', 'text-align'];
let listAdjustments = ['padding-left', 'padding-right', 'color', 'list-style']


export let tags = {
  '.preview__wrapper': {
    normieName: 'Global',
    useAdjustments: ['font-size', 'line-height', '--vertical-space']
  },
  '.preview__page': {
    normieName: 'Pages',
    useAdjustments: ['padding-top', 'padding-bottom', 'padding-left', 'padding-right']
  },
  '.preview__page::before': {
    normieName: 'Header',
    useAdjustments: headerFooterAdjustments
  },
  '.preview__page::after': {
    normieName: 'Footer',
    useAdjustments: headerFooterAdjustments
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
  ul: {
    normieName: 'Unordered Lists',
    useAdjustments: listAdjustments,
  },
  ol: {
    normieName: 'Ordered Lists',
    useAdjustments: listAdjustments,
  },
  del: {
    normieName: 'Strikethroughs',
    useAdjustments: inlineElementAdjustments,
  },
  blockquote: {
    normieName: 'Block Quotes',
    useAdjustments: ['color', 'padding-left', 'padding-right', 'border-width', 'border-color']
  }
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
  'content': new Text({
    placeholder: '{ date }',
  }),
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
  }),
  'letter-spacing': new Range({
    min: -5,
    max: 5,
    step: .2,
    unit: 'px'
  }),
  'line-height': new Range({
    min: .5,
    max: 3,
    step: .1,
  }),
  '--vertical-space': new Range({
    min: 0,
    max: 56,
    step: 1,
    unit: 'px'
  }),
  'text-transform': new Select({
    defaultValue: 'none',
    options: [
      'capitalize',
      'uppercase',
      'lowercase',
      'none'
    ]
  }),
  'text-align': new Select({
    defaultValue: 'left',
    options: [
      'left',
      'center',
      'right'
    ]
  }),
  'list-style': new Select({
    defaultValue: 'disc',
    options: [
      'disc',
      'circle',
      'square',
      'decimal',
      'lower-alpha',
      'upper-alpha',
      'lower-roman',
      'upper-roman',
      'none'
    ]
  }),
  'color': new Text({
    placeholder: 'tomato'
  }),
  'border-color': new Text({
    placeholder: 'dodgerblue'
  }),
  'border-width': new Range({
    min: 0,
    max: 10,
    step: .5,
    unit: 'px'
  }),
  'padding-top': new Range({
    min: 0,
    max: 56,
    step: 1,
    unit: 'px'
  }),
  'padding-bottom': new Range({
    min: 0,
    max: 56,
    step: 1,
    unit: 'px'
  }),
  'padding-left': new Range({
    min: 0,
    max: 56,
    step: 1,
    unit: 'px'
  }),
  'padding-right': new Range({
    min: 0,
    max: 56,
    step: 1,
    unit: 'px'
  }),
}