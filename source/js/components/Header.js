import toggleDarkMode from "../functions/toggleDarkMode";
import { html } from "../lit-html/lit-html";
import state, { setState } from "../state";
import Button from "./Button";

export default () => html`
<div id=logo>
  <img alt="Flintstone logo" src="logo${state.dark ? '-white' : ''}.svg" />
</div>
<nav>
  ${
    Button({
      title: `${state.showStyles ? 'Close' : 'Open'} style editor`,
      content: '✨',
      className: 'icon',
      action: () => setState('showStyles', !state.showStyles)
    })
  }
  ${
    Button({
      title: "Print the current document",
      className: 'icon',
      content: '🖨️',
      action: () => {
        document.documentElement.classList.add('loading');
        setState('showPreview', true);
        setTimeout(() => {
          print();
          document.documentElement.classList.remove('loading');
        }, 500)
      }
    })
  }
  ${
    Button({
      title: `Switch to ${state.dark ? 'light' : 'dark'} theme`,
      content: state.dark ? "🌝" : "🌞",
      className: 'icon',
      action: toggleDarkMode
    })
  }
</nav>
`;