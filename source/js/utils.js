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


/**Ensures properties exist on an object, filling them with an empty object if they do not exist. */
export let ensureProps = (properties, obj, defaultValue = {}) =>
  properties.forEach(prop =>
    obj[prop] = obj[prop] || defaultValue
  );


/**Refreshes the window */
export let refresh = () => location = location.href;


/**Dedupes an array */
export let dedupe = arr => [...new Set(arr)];


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

/**A shorthand for toggling a class on the documentElement */
export let toggleRootClass = (className, force) => document.documentElement.classList.toggle(className, force);