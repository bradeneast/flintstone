import { html } from "lit-html";
import { renderAll } from "../../state";
import Button from "../Button";
import SignIn from "./SignIn";
import Modal from "../Modal";


export default (message = 'Your email or password may be invalid') => html`
<span>
  ${message}.
  ${
    Button({
      content: 'Try logging in again',
      className: 'link underline',
      action: () => renderAll(Modal(SignIn()))
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