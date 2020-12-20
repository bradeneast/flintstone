/**A shorthand for `querySelector`*/
export let $ = (selector, context = document) => context.querySelector(selector);


/**A shorthand for `querySelectorAll`*/
export let $$ = (selector, context = document) => context.querySelectorAll(selector);


/**Returns an unlinked deep copy of the object passed */
export let deepCopy = obj => JSON.parse(JSON.stringify(obj));


/**Populates one object with the key/value pairs of another object (additive) */
export let serialize = (fromObject, intoObject) => Object.keys(fromObject).forEach(key =>
  intoObject[key] = fromObject[key]
);


/**Selects a list item elemtnt by its data-index attribute */
export let selectByIndex = (index, context) => $(`[data-index="${index}"]`, context);


/**Sets a custom property on an element */
export let setCustomProp = (elem, prop, value) => elem.style.setProperty(`--${prop}`, value);


/**A shorthand for toggling a class on the documentElement */
export let toggleRootClass = (className, force) => document.documentElement.classList.toggle(className, force);


/**Ensures properties exist on an object, filling them with an empty object if they do not exist. */
export let ensureProps = (properties, obj, defaultValue = {}) =>
  properties.forEach(prop =>
    obj[prop] = obj[prop] || defaultValue
  );


/**Refreshes the window */
export let refresh = () => location = location.href;


/**Dedupes an array */
export let dedupe = arr => [...new Set(arr)];


/**Alternative to String.indexOf() that accepts a Regular Expression*/
export let indexOfExp = (str, exp) => str.split(exp)[0].length;


/**Escape string for use in Regular Expression */
export let escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


/**Figures out if a keydown/keyup event was a character-producing key */
export let isCharacterKey = event => event.which && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey && event.which != 8;


/**Alternative to String.indexOf() that accepts a Regular Expression*/
export let lastIndexOfExp = (str, exp) => str.lastIndexOf(str.match(new RegExp(exp, 'g')).pop());


/**Stringifies an object and returns a temporary blob url */
export let createDownload = (item) => {
  let blob = new Blob([JSON.stringify(item)], { type: 'application/json' });
  return URL.createObjectURL(blob);
}


/**A shorthand for setting CSS custom properties */
export let sanitizeCSS = string => string
  .replace(/</g, '%3C')
  .replace(/{/g, '\007B')
  .replace(/expression\(.+?\)/g, '');


/**A shorthand for `localStorage`
 * @param {string} key
 * @param {string} value
*/
export let ls = (key, value) => value == undefined
  ? JSON.parse(localStorage.getItem(key))
  : localStorage.setItem(key, JSON.stringify(value));


export let handleFormInput = (event, formData) => {
  let target = event.target;
  formData[target.name] = target.value;
}


/**Gets the selection or selection word from an element */
export let getSelectionData = (inputOrTextareaElement) => {

  let wordBoundary = /\s/;
  let { selectionEnd, selectionStart, value } = inputOrTextareaElement;
  let before = value.substr(0, selectionStart);
  let after = value.substr(selectionEnd);

  let selection = selectionEnd - selectionStart
    ? value.substring(selectionStart, selectionEnd)
    : before.split(wordBoundary).pop() + after.split(wordBoundary).shift();

  return {
    selection,
    selectionStart,
    selectionEnd,
    before,
    after
  }
}