const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');

const { authorize, listData } = require('./googleapi/index');
const { convertData } = require('./utils/processData');

app.use(
    cors({
        credentials: true,
        origin: true
    })
);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.options('*', cors());

app.get('/', (req, res) => res.send('Working!!!'));

app.post('/get_data', async ({ body }, res, next) => {
  try {
    if (!Object.keys(body).length) return next(400);

    const { sheetId, tabId } = body;
    const auth = await authorize();
    const data = await listData(sheetId, tabId, auth);
    const processData = await convertData(data);

    if (!processData) return next(404);

    return res.json(processData);
  } catch (err) {
    return next(err);
  }
});

app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port 3000', '');
});
