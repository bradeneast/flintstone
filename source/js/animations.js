import { setCustomProp } from "./utils";

export default class UIAnimation {
  constructor(elements, callback = () => null) {
    this.elements = Array.isArray(elements) ? elements : [elements];
    this.callback = callback;
    this.duration = 300;
    this.tick = 10;
  }


  /**Shows the addition of a UI element */
  added() {

    let { elements, tick } = this;
    let element = elements[0];

    element.style.transition = 'none';
    element.style.opacity = 0;
    setCustomProp(element, 'translateY', 1);
    setCustomProp(element, 'scaleY', 0);

    setTimeout(() => {
      // Reset styles
      element.style.transition = '';
      element.style.opacity = 1;
      setCustomProp(element, 'translateY', 0);
      setCustomProp(element, 'scaleY', 1);
    }, tick);
  }


  /**Shows the deletion of a UI element */
  removed() {

    let { elements, duration, callback } = this;
    let element = elements[0];

    element.style.opacity = 0;
    setCustomProp(element, 'scaleY', 0);

    setTimeout(() => {
      // Reset styles
      callback();
      element.style.transition = 'none';
      element.style.opacity = 1;
      setCustomProp(element, 'scaleY', 1);
      setTimeout(() => element.style.transition = '', duration);
    }, duration);
  }


  /**Shows the addition of a UI element */
  swapped(difference) {

    let { elements, callback, tick } = this;
    let [elem1, elem2] = elements;

    setCustomProp(elem1, 'translateY', difference);
    setCustomProp(elem2, 'translateY', difference * -1);
    this.elements.map(elem => elem.style.transition = 'none');

    setTimeout(() => {
      // Reset styles
      this.elements.map(elem => {
        elem.style.transition = '';
        setCustomProp(elem, 'translateY', 0);
      })
      callback();
    }, tick)
  }
}