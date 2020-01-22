const { google } = require('googleapis');
const path = require('path');

const auth = google.auth.getClient({
  keyFile: path.join(__dirname, './credentials.json'),
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

module.exports = { auth };
