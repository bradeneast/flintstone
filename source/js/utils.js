import { unsafeHTML } from "./lit-html/directives/unsafe-html";
import { directive } from "./lit-html/lit-html";

/**A shorthand for `querySelector`*/
export let $ = (selector, context = document) => context.querySelector(selector);


/**A shorthand for `querySelectorAll`*/
export let $$ = (selector, context = document) => context.querySelectorAll(selector);


/**Returns an unlinked deep copy of the object passed */
export let deepCopy = obj => JSON.parse(JSON.stringify(obj));


/**Validates an input */
export let validate = event => {

  let targetInput = event.target;
  let currentForm = targetInput.closest('form');

  window.forms = window.forms || {};
  window.forms[currentForm.id] = window.forms[currentForm.id] || {};
  window.forms[currentForm.id][targetInput.name] = targetInput.value;

  currentForm.reportValidity();
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


export let resolvePromise = directive(promise => part => {
  part.setValue(unsafeHTML('<loader></loader>'));
  Promise.resolve(promise).then(resolvedValue => {
    part.setValue(resolvedValue);
    part.commit();
  })
})