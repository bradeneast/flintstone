import { html } from "lit-html";
import togglePane from "../functions/togglePane";
import { preferences } from "../state";
import Button from "./Button";
import Icons from "./Icons";

export default () => html`
<nav class=mobile-nav>
  ${
    Button({
      title: 'Open documents',
      className: 'icon',
      icon: Icons.edit,
      action: () => togglePane('documents', preferences.open_pane != 'documents')
    })
  }
  ${
    Button({
      title: 'Open data',
      className: 'icon',
      icon: Icons.export,
      action: () => togglePane('data', preferences.open_pane != 'data')
    })
  }
  ${
    Button({
      title: 'Open styles',
      className: 'icon',
      icon: Icons.adjust,
      action: () => togglePane('styles', preferences.open_pane != 'styles')
    })
  }
</nav>`