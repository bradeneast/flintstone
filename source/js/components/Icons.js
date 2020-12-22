import { svg } from "lit-html";
import Icon from "./Icon";


export default {

  add: Icon({
    content: svg`<line x1="36" y1="108" x2="180" y2="108" /><line x1="108" y1="180" x2="108" y2="36" />`,
  }),

  delete: Icon({
    content: svg`<line x1="48" y1="48" x2="168" y2="168"/><line x1="48" y1="168" x2="168" y2="48"/>`,
    color: 'error'
  }),

  duplicate: Icon({
    content: svg`<rect x="90.4" y="90.71" width="105.31" height="105.31" rx="21.57"/><path d="M157.59,65.77V41.29A21.58,21.58,0,0,0,136,19.71H41A21.58,21.58,0,0,0,19.4,41.29v95A21.58,21.58,0,0,0,41,157.9H65.46"/>`,
  }),

  up: Icon({
    content: svg`<polyline points="184.69 146.81 108 70.12 31.31 146.81" />`,
  }),

  down: Icon({
    content: svg`<polyline points="184.69 70.12 108 146.81 31.31 70.12" />`,
  }),

  right: Icon({
    content: svg`<path d="M73.67,26.62,155.05,108,73.67,189.38" />`,
  }),

  reset: Icon({
    content: svg`<polyline points="37 11.6 37 71.34 96.75 71.34"/><path d="M47.33,172.61a81.82,81.82,0,1,0,0-115.72l-5.77,5.77"/>`,
  }),

  check: Icon({
    content: svg`<polyline points="182.48 34.41 89.53 182.33 36.66 138.35" />`,
    color: 'green'
  }),

  export: Icon({
    content: svg`<line x1="119.65" y1="65.2" x2="162.5" y2="65.2"/><circle cx="184.18" cy="65.2" r="21.05"/><line x1="103.79" y1="103.51" x2="134.08" y2="133.81"/><circle cx="149.42" cy="149.14" r="21.05"/><line x1="65.48" y1="119.38" x2="65.48" y2="162.22"/><circle cx="65.48" cy="183.91" r="21.05"/><circle cx="65.48" cy="65.2" r="53.54"/>`,
    color: 'purple'
  }),

  import: Icon({
    content: svg`<line x1="89.77" y1="126.49" x2="69.49" y2="146.77"/><circle cx="32.16" cy="183.47" r="21.04"/><circle cx="32.16" cy="92.12" r="21.04"/><circle cx="123.51" cy="183.47" r="21.04"/><circle cx="151.05" cy="64.58" r="53.5"/>`,
    color: 'green'
  }),

  theme: Icon({
    content: svg`<circle cx="108" cy="108" r="80"/><line x1="108" y1="28" x2="108" y2="188"/><path d="M173,147.3H111M186,108H111m62-39.3H111"/>`,
  }),

  adjust: Icon({
    content: svg`<path d="M108,108l59.4-59.4M126.81,26.13a84,84,0,1,0,63.05,63.06" />`,
    color: 'yellow'
  }),

  print: Icon({
    content: svg`<path d="M158.2,173,108,195.41,57.8,173"/><rect x="31" y="97.95" width="154" height="48.28"/><polyline points="57.8 70.34 57.8 29.34 158.21 29.34 158.21 70.34"/>`,
    color: 'primary-80'
  }),
}