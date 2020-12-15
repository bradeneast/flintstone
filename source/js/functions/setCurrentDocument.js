import state, { setState } from "../state";

export default index => {
  setState('currentDocument', state.currentUser.documents[index]);
}