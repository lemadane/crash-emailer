import { schedule } from 'node-cron';
import * as log from 'fancy-log';
import * as nodemailer from 'nodemailer';
import * as redis from './common/redis';

const cronjob = () => {

   const EVERY_MINUTE = '* * * * *';

   try {

      const { EMAIL_SERVICE, EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env;

      const transporter = nodemailer.createTransport(
         {
            service: EMAIL_SERVICE,
            auth: {
               user: EMAIL_ADDRESS,
               pass: EMAIL_PASSWORD,
            }
         }
      );

      schedule(
         EVERY_MINUTE,
         async () => {
            log('-----------------------');
            log('   Running Cron Job    ');
            log('-----------------------');

            const logs = await redis.readAll('logs') as any[];
            if (!logs || !logs.length) {
               log('No crash or error logs to email.');
               return;
            }

            const recipients = await redis.readAll('email-recipients') as any[];
            if (!recipients || !recipients.length) {
               log('No email recipients.');
               return;
            }

            recipients.forEach((recipient) => {
               const mail = {
                  from: EMAIL_ADDRESS,
                  to: recipient.email,
                  subject: 'Crash/Error Report from Crash Panda',
                  text: JSON.stringify(logs),
               };

               transporter.sendMail(
                  mail,
                  (error: Error) => {
                     if (error) {
                        throw error;
                     } else {
                        log('Email successfully sent!');
                     }
                  }
               );
            });

            logs.forEach((log) => {
               redis.deleteByID('logs', log.id.toString());
            });

         });

   } catch (error) {
      log.error(error.message);
   }
};

export default cronjob;