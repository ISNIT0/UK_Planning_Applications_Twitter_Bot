const PORT = process.env.PORT || 8080;

require('dotenv').config();

import express from 'express';
import logger from 'morgan';
import { getLatestApplications } from './planit';
import { tweetApplications } from './twitter';

const app = express();

app.use(logger('tiny'));

app.get('/trigger', async (req, res) => {
    const newApplications = await getLatestApplications();
    await tweetApplications(newApplications);
    res.send('OK');
});

app.listen(PORT, () => {
    console.info(`Server listening on port [${PORT}]`);
});
