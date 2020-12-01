/**A shorthand for `querySelector`*/
export let $ = (selector, context = document) => context.querySelector(selector);


/**A shorthand for `querySelectorAll`*/
export let $$ = (selector, context = document) => context.querySelectorAll(selector);

/**Returns an unlinked deep copy of the object passed */
export let deepCopy = obj => JSON.parse(JSON.stringify(obj));

/**A shorthand for `localStorage`
 * @param {string} key
 * @param {string} value
*/
export let ls = (key, value) => value == undefined
  ? JSON.parse(localStorage.getItem(key))
  : localStorage.setItem(key, JSON.stringify(value));