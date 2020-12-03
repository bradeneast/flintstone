export default (tagName) => {

  let style = document.createElement('style');

  style.id = 'temp';
  style.innerHTML = `
  .preview ${tagName} {
    box-shadow: 0 0 0 2px var(--primary-60);
    border-radius: var(--radius);
    transition: box-shadow var(--transition);
  }`;

  document.body.appendChild(style);
}