// lib/scheduler.ts or utils/cron.ts

import cron from 'node-cron';
import { syncRouterFunction } from '../controllers/sync.controller';

export const startImportSync = () => {
    cron.schedule('0 * * * *', async () => {
        const timestamp = new Date().toISOString();
        console.log(`[IMPORT SYNC] Started at ${timestamp}`);
        try {
            // Directly call the sync function
            const result = await syncRouterFunction(40); // Using a default length of 40
            console.log(`[IMPORT SYNC] Completed at ${new Date().toISOString()}`);
            console.log(result);
        } catch (error: any) {
            console.error(`[IMPORT SYNC] Failed at ${new Date().toISOString()}:`, error.message);
            console.error(error);
        }
    });

    console.log('Import sync job scheduled to run every hour.');
};
