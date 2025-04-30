// pages/api/cron.js
import { scheduleJob } from '@/utils/cronJob';

let jobStarted = false; // Ensure the job starts only once

export default function handler(req, res) {
  if (!jobStarted) {
    scheduleJob(); // Start the cron job
    jobStarted = true;
    console.log('Cron job scheduled');
  }
  res.status(200).json({ message: 'Cron started' }); // Respond to the API call
}
