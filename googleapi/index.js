/*eslint-disable */
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');
const axios = require('axios');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const credentials = require('./credentials.json');

// const getNewToken = (oAuth2Client, callback) => {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) {
//         return console.error('Error while trying to retrieve access token', err);
//       }
//       oAuth2Client.setCredentials(token);
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) {
//           return console.error(err);
//         }
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// };

exports.authorize = () => {
  // eslint-disable-next-line camelcase
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        // getNewToken(oAuth2Client, callback);
        return reject(err);
      }
      oAuth2Client.setCredentials(JSON.parse(token));
      resolve(oAuth2Client);
      // resolve(callback(oAuth2Client));
    })
  });
};

exports.listData = (sheetId, auth) => {
  const sheets = google.sheets({version: 'v4', auth});
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Data!A1:S',
      }, (err, res) => (err
        ? console.log('The API returned an error: ' + err) || reject(err)
        : resolve(res.data.values)
      ))
  });
}
