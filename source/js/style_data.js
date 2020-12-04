let headingAdjustments = ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform', 'text-align', 'color'];
let inlineElementAdjustments = ['font-weight', 'text-transform', 'color'];
let headerFooterAdjustments = ['content', 'color', 'font-size', 'font-weight', 'text-transform', 'letter-spacing', 'text-align'];
let listAdjustments = ['padding-left', 'padding-right', 'color', 'list-style'];
let tableAdjustments = ['font-size', 'font-weight', 'text-transform', 'text-align', 'color'];


export let tags = {
  '.preview__wrapper': {
    normieName: 'global',
    useAdjustments: ['font-family', 'font-size', 'line-height', '--vertical-space']
  },
  '.preview__page': {
    normieName: 'pages',
    useAdjustments: ['padding-top', 'padding-bottom', 'padding-left', 'padding-right']
  },
  '.preview__wrapper::before': {
    normieName: 'header',
    useAdjustments: headerFooterAdjustments
  },
  '.preview__wrapper::after': {
    normieName: 'footer',
    useAdjustments: headerFooterAdjustments
  },
  h1: {
    normieName: 'level 1 headings',
    useAdjustments: headingAdjustments,
  },
  h2: {
    normieName: 'level 2 headings',
    useAdjustments: headingAdjustments,
  },
  h3: {
    normieName: 'level 3 headings',
    useAdjustments: headingAdjustments,
  },
  h4: {
    normieName: 'level 4 headings',
    useAdjustments: headingAdjustments,
  },
  h5: {
    normieName: 'level 5 headings',
    useAdjustments: headingAdjustments,
  },
  h6: {
    normieName: 'level 6 headings',
    useAdjustments: headingAdjustments,
  },
  a: {
    normieName: 'links',
    useAdjustments: inlineElementAdjustments,
  },
  strong: {
    normieName: 'bold text',
    useAdjustments: inlineElementAdjustments,
  },
  em: {
    normieName: 'italic Text',
    useAdjustments: inlineElementAdjustments,
  },
  del: {
    normieName: 'strikethroughs',
    useAdjustments: inlineElementAdjustments,
  },
  ul: {
    normieName: 'unordered lists',
    useAdjustments: listAdjustments,
  },
  ol: {
    normieName: 'ordered lists',
    useAdjustments: listAdjustments,
  },
  blockquote: {
    normieName: 'block quotes',
    useAdjustments: ['color', 'padding-left', 'padding-right', 'border-width', 'border-color']
  },
  img: {
    normieName: 'images',
    useAdjustments: ['width']
  },
  th: {
    normieName: 'table headings',
    useAdjustments: tableAdjustments
  },
  td: {
    normieName: 'table cells',
    useAdjustments: tableAdjustments
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
  'content': new Text({
    placeholder: '{ date }',
  }),
  'font-family': new Text({
    placeholder: 'Helvetica'
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
  'width': new Range({
    min: 0,
    max: 100,
    step: 1,
    unit: '%'
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
    placeholder: 'Tomato'
  }),
  'border-color': new Text({
    placeholder: 'DodgerBlue'
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