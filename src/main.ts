import { config } from 'dotenv';
import * as express from 'express';
import * as log from 'fancy-log';
import cronjob from './cronjob';

config();
const app = express();
const { PORT, NODE_ENV } = process.env;
app.listen(PORT || 12000, () => {
    log(`Server is running in '${NODE_ENV}' mode at port ${PORT || 12000}.`);
});

cronjob();
