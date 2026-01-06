#!/usr/bin/env node

import reportScheduler from '../lib/scheduler';

async function main() {
  console.log('Starting WhatsApp report scheduler...');

  try {
    await reportScheduler.scheduleAllReports();
    console.log('Report scheduler started successfully');

    // Keep the process running
    process.on('SIGINT', () => {
      console.log('Shutting down report scheduler...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('Shutting down report scheduler...');
      process.exit(0);
    });

    // Keep alive
    setInterval(() => {
      console.log(`Report scheduler running - ${reportScheduler.getScheduledJobsCount()} jobs scheduled`);
    }, 60000); // Log every minute

  } catch (error) {
    console.error('Error starting report scheduler:', error);
    process.exit(1);
  }
}

main();
