// lib/scheduler.ts or utils/cron.ts

import cron from 'node-cron';
import axios from 'axios';
import { ENV } from "../config";


const PORT = ENV.PORT;

export const startImportSync = () => {
    cron.schedule('0 * * * *', async () => {
        try {
            const timestamp = new Date().toISOString();
            console.log(`[IMPORT SYNC] Started at ${timestamp}`);

            const response = await axios.get(`http://localhost:${PORT}/api/v1/import-sync`);

            console.log(`[IMPORT SYNC] Completed at ${timestamp}`);
            console.log(`Status: ${response.status} ${response.statusText}`);
            console.log(response.data);
        } catch (error: any) {
            console.error(`[IMPORT SYNC] Failed at ${new Date().toISOString()}:`, error.message);
            console.error(error);
        }
    });

    console.log('Import sync job scheduled to run every 1 hour.');
};
