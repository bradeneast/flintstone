import { html } from "lit-html";
import { handleFormInput } from "../../utils";


export default ({ fields, formData }) => fields.map(fieldName => html`
<label>
  ${fieldName}
  <input required=true @input=${event=> handleFormInput(event, formData)}
  type=${/email|password/.test(fieldName) ? fieldName : 'text'}
  name=${fieldName} />
</label>`
);