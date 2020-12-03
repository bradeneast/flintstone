/**A shorthand for `querySelector`*/
export let $ = (selector, context = document) => context.querySelector(selector);


/**A shorthand for `querySelectorAll`*/
export let $$ = (selector, context = document) => context.querySelectorAll(selector);


/**Returns an unlinked deep copy of the object passed */
export let deepCopy = obj => JSON.parse(JSON.stringify(obj));


/**A shorthand for setting CSS custom properties */
export let setCustomProp = (elem, propertyName, value) => elem.style.setProperty(`--${propertyName}`, value);


/**A shorthand for `localStorage`
 * @param {string} key
 * @param {string} value
*/
export let ls = (key, value) => value == undefined
  ? JSON.parse(localStorage.getItem(key))
  : localStorage.setItem(key, JSON.stringify(value));


let frameLength = 60;
let lastFrame = 0;
/**Debaunces a callback function */
export let debounce = (callback) =>
  requestAnimationFrame(thisFrame => {
    if (thisFrame - lastFrame > frameLength) {
      callback();
      lastFrame = thisFrame;
    }
  });