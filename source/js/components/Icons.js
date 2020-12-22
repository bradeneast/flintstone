import { svg } from "lit-html";
import Icon from "./Icon";


export default {
  add: Icon({
    content: svg`<line x1="36" y1="108" x2="180" y2="108" /><line x1="108" y1="180" x2="108" y2="36" />`,
    className: 'line'
  }),
  delete: Icon({
    className: 'line',
    content: svg`<line x1="48" y1="48" x2="168" y2="168"/><line x1="48" y1="168" x2="168" y2="48"/>`
  }),
  duplicate: Icon({
    className: 'line',
    content: svg`<rect x="90.4" y="90.71" width="105.31" height="105.31" rx="21.57"/><path d="M157.59,65.77V41.29A21.58,21.58,0,0,0,136,19.71H41A21.58,21.58,0,0,0,19.4,41.29v95A21.58,21.58,0,0,0,41,157.9H65.46"/>`
  }),
  up: Icon({
    className: 'line',
    content: svg`<polyline points="184.69 146.81 108 70.12 31.31 146.81" />`
  }),
  down: Icon({
    className: 'line',
    content: svg`<polyline points="184.69 70.12 108 146.81 31.31 70.12" />`
  }),
  right: Icon({
    className: 'line',
    content: svg`<path d="M73.67,26.62,155.05,108,73.67,189.38" />`
  }),
  reset: Icon({
    className: 'line',
    content: svg`<polyline points="37 11.6 37 71.34 96.75 71.34"/><path d="M47.33,172.61a81.82,81.82,0,1,0,0-115.72l-5.77,5.77"/>`
  })
}