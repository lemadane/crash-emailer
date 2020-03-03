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

// process.on('uncaughtException', (err: Error) => {
//     log.error('uncaughtException', err);
//     process.exit(1);
// });

// process.on('unhandledRejection', (err: Error) => {
//     redis.disconnect();
//     log.error('unhandledRejection', err);
//     process.exit(1);
// });

// process.on('warning', (err) => {
//     log.error('warning', err);
// });