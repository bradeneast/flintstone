import { html } from "lit-html";
import { renderAll } from "../state";
import Button from "./Button";
import Login from "./Login";
import Modal from "./Modal";


export default () => html`
<span>
  Your email or password may be invalid.
  ${
    Button({
      content: 'Try logging in again',
      className: 'link underline',
      action: () => renderAll(Modal(Login()))
    })
  }
  or
  ${
    Button({
      content: 'continue using anonymously.', 
      className: 'link underline', 
      action: () => renderAll()
    })
  }
</span>`;