import { StatusCodes } from "http-status-codes";
import { db } from "../libs";
import { asyncWrapper, sendApiResponse } from "../utils";
import { syncData } from "../utils/im-sync";
import { getAccessToken } from "../utils/getToken";

export const syncRouter = asyncWrapper(async (req, res) => {
    try {
        const token = await getAccessToken();
        // Get and validate length parameter
        let length = 40; // default value
        if (req.query?.len) {
            const len = Number(req.query.len);
            length = isNaN(len) ? 40 : Math.max(1, len);
        }
        const results = await syncData(token, length);
        const synced = results.filter(r => r.status === 'synced');
        const skipped = results.filter(r => r.status === 'skipped');
        const failed = results.filter(r => r.status === 'failed');

        if (failed.length > 0) {
            console.error(`[SYNC] Completed with errors. Synced: ${synced.length}, Failed: ${failed.length}, Skipped: ${skipped.length}`);
            return res.status(500).json({
                message: "Some imports failed to sync.",
                syncedCount: synced.length,
                failedCount: failed.length,
                skippedCount: skipped.length,
                errors: failed
            });
        }

        console.log(`[SYNC] All imports processed. Synced: ${synced.length}, Skipped: ${skipped.length}`);
        return res.json({
            message: "All imports processed.",
            syncedCount: synced.length,
            skippedCount: skipped.length
        });

    } catch (err: any) {
        console.error("[SYNC] Fatal error in route:", err);
        return res.status(500).json({ error: err?.message || String(err) });
    }
})



export const syncRouterFunction = async (len : number) => {
    try {
        const token = await getAccessToken();
        // Get and validate length parameter
        let length = len ? len : 40; // default value
        const results = await syncData(token, length);
        const synced = results.filter(r => r.status === 'synced');
        const skipped = results.filter(r => r.status === 'skipped');
        const failed = results.filter(r => r.status === 'failed');

        if (failed.length > 0) {
            console.error(`[SYNC] Completed with errors. Synced: ${synced.length}, Failed: ${failed.length}, Skipped: ${skipped.length}`);
            return {
                message: "Some imports failed to sync.",
                syncedCount: synced.length,
                failedCount: failed.length,
                skippedCount: skipped.length,
                errors: failed
            };
        }

        console.log(`[SYNC] All imports processed. Synced: ${synced.length}, Skipped: ${skipped.length}`);
        return {
            message: "All imports processed.",
            syncedCount: synced.length,
            skippedCount: skipped.length
        };

    } catch (err: any) {
        console.error("[SYNC] Fatal error in route:", err);
        return {
            error: err?.message || String(err)
        };
    }
}
