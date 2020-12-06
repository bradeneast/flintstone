const { default: GoTrue } = require("gotrue-js");

const auth = new GoTrue({
  APIUrl: 'https://flintstone-app.netlify.app/.netlify/identity',
  audience: '',
  setCookie: false
})

exports.handler = async function signupUser(email, password) {
  return await auth.signup(email, password);
}