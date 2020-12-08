import GoTrue from 'gotrue-js';

// Instantiate the GoTrue auth client with an optional configuration
export default new GoTrue({
  APIUrl: 'https://flintstone-app.netlify.app/.netlify/identity',
  audience: '',
  setCookie: false,
});