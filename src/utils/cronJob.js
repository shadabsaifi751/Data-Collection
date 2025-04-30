import cron from 'node-cron';
import { fetchAndStoreUsers } from './fetchUsers.js';

// Function to schedule a cron job
export const scheduleJob = () => {
  // Schedule the job to run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('Running cron job every 5 minutes...');
    
    // Call the function to fetch users and store them in the database
    await fetchAndStoreUsers();
  });
};
