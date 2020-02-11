const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');

const { authorize, listData } = require('./googleapi/index');
const { convertData } = require('./utils/processData');
const { projectQuestions, sprintQuestions } = require('./utils/questions');

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

    const {
      sheetProjectId,
      tabProjectId,
      sheetSprintId,
      tabSprintId,
    } = body;
    const auth = await authorize();
    const dataProject = await listData(sheetProjectId, tabProjectId, auth);
    const dataSprint = await listData(sheetSprintId, tabSprintId, auth);
    const processDataProject = await convertData(dataProject, projectQuestions);
    const processDataSprint = await convertData(dataSprint, sprintQuestions);

    if (!processDataProject || !processDataSprint) return next(404);

    return res.json({ projectCheckout: processDataProject, sprintCheckout: processDataSprint });
  } catch (err) {
    return next(err);
  }
});

app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port 3000', '');
});
