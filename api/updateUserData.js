import GoTrue from 'gotrue-js';

// Instantiate the GoTrue auth client with an optional configuration
const auth = new GoTrue({
  APIUrl: 'https://flintstone.app/.netlify/identity',
  audience: '',
  setCookie: false,
});

exports.handler = async (event, context) => {
  return await auth
    .currentUser()
    .update({ flintstone_data: JSON.stringify(event.body) });
}