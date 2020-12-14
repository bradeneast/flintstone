import { setCustomProp } from "./utils";

export default class UIAnimation {
  constructor(elements, modifier = () => null) {
    this.elements = Array.isArray(elements) ? elements : [elements];
    this.modifier = modifier;
    this.duration = 300;
  }


  /**Shows the addition of a UI element */
  added() {

    let element = this.elements[0];
    element.style.transition = 'none';
    element.style.opacity = 0;
    setCustomProp(element, 'translateY', 1);
    setCustomProp(element, 'scaleY', 0);

    setTimeout(() => {
      element.style.transition = '';
      element.style.opacity = 1;
      setCustomProp(element, 'translateY', 0);
      setCustomProp(element, 'scaleY', 1);
    }, 10);

  }


  /**Shows the deletion of a UI element */
  removed() {

    let { elements, duration, modifier } = this;
    let element = elements[0];
    element.style.opacity = 0;
    setCustomProp(element, 'scaleY', 0);

    setTimeout(() => {
      modifier();
      element.style.transition = 'none';
      element.style.opacity = 1;
      setCustomProp(element, 'scaleY', 1);
      setTimeout(() => element.style.transition = '', duration);
    }, duration);

  }


  /**Shows the addition of a UI element */
  swapped(difference) {

    let [elem1, elem2] = this.elements;

    setCustomProp(elem1, 'translateY', difference);
    setCustomProp(elem2, 'translateY', difference * -1);
    this.elements.map(elem => elem.style.transition = 'none');

    setTimeout(() => {
      this.elements.map(elem => {
        elem.style.transition = '';
        setCustomProp(elem, 'translateY', 0);
      })
      this.modifier();
    }, 10)

  }
}