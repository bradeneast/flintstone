export let tags = {
  h1: 'Level 1 Headings',
  h2: 'Level 2 Headings',
  h3: 'Level 3 Headings',
  h4: 'Level 4 Headings',
  h5: 'Level 5 Headings',
  h6: 'Level 6 Headings',
  a: 'Links',
  strong: 'Bold Text',
  del: 'Strikethroughs',
  em: 'Italic Text',
}
export let properties = [
  {
    name: 'font-size',
    type: 'range',
    min: 8,
    max: 72,
    step: 1,
    unit: 'px'
  },
  {
    name: 'font-weight',
    type: 'range',
    min: 300,
    max: 900,
    step: 50,
    unit: ''
  },
  {
    name: 'letter-spacing',
    type: 'range',
    min: -5,
    max: 5,
    step: .2,
    unit: 'px'
  },
  {
    name: 'line-height',
    type: 'range',
    min: .5,
    max: 2.5,
    step: .1,
    unit: ''
  },
  {
    name: 'text-transform',
    type: 'select',
    defaultValue: 'none',
    options: [
      'capitalize',
      'uppercase',
      'lowercase',
      'none'
    ]
  },
  {
    name: 'color',
    type: 'text',
    placeholder: 'tomato'
  },
];