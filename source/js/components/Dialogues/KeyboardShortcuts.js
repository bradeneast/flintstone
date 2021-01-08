import { html } from "lit-html";
import shortcuts from '../../shortcuts';
import { renderAll } from "../../state";
import Button from "../Button";

export default () => html`
<div class=form>
  <table>
    <thead>
      <td>Shortcut</td>
      <td>Description</td>
    </thead>
    ${Object.entries(shortcuts).map(([key, { prefix, description }]) => html`
    <tr>
      <td>
        <span class=light>${prefix}</span> <strong>${key.toLowerCase()}</strong>
      </td>
      <td>${description}</td>
    </tr>
    `)}
  </table>
  <br />
  ${
    Button({
      className: 'link',
      content: "Close Keyboard Shortcuts",
      action: () => renderAll(),
    })
  }
</div>`;