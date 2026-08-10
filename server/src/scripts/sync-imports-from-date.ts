import "../config/env";
import axios from "axios";
import FormData from "form-data";
import { db } from "../libs";
import { getCachedErisAccessToken } from "../utils/eris-auth-store";
import { getSingleImport, ImportPermit, ImportPermitResponse, syncToDb } from "../utils/im-sync";

const DEFAULT_START_DATE = "2026-07-17";
const PAGE_SIZE = 100;

type SyncResult = {
  id: number;
  date: string | null;
  status: "synced" | "skipped" | "failed";
  error?: string;
};

const parseDateArg = (value: string | undefined, fallback: string) => {
  const raw = value || fallback;
  const date = new Date(`${raw}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date "${raw}". Use YYYY-MM-DD.`);
  }
  return date;
};

const endOfDayUtc = (value?: string) => {
  const raw = value || new Date().toISOString().slice(0, 10);
  const date = new Date(`${raw}T23:59:59.999Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid end date "${raw}". Use YYYY-MM-DD.`);
  }
  return date;
};

const getImportDate = (item: ImportPermit) => {
  return item.requestedDate || item.submissionDate || item.createdDate || null;
};

const isWithinRange = (item: ImportPermit, startDate: Date, endDate: Date) => {
  const rawDate = getImportDate(item);
  if (!rawDate) return false;

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return false;

  return date >= startDate && date <= endDate;
};

const isBeforeRange = (item: ImportPermit, startDate: Date) => {
  const rawDate = getImportDate(item);
  if (!rawDate) return false;

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return false;

  return date < startDate;
};

const buildListForm = (start: number, length: number) => {
  const form = new FormData();
  form.append("start", start.toString());
  form.append("length", length.toString());
  form.append("search[value]", "");
  form.append("draw", "0");
  form.append("submoduleTypeCode", "MDCN");
  form.append("userId", "14448");

  const columns = [
    "id",
    "importPermitNumber",
    "applicationId",
    "importPermitStatusCode",
    "requestedDate",
    "importPermitStatusDisplayName",
    "performaInvoiceNumber",
    "assignedUser",
    "portOfEntrySH",
    "supplierName",
    "agentName",
    "submissionDate",
    "decisionDate",
    "amount",
  ];

  columns.forEach((col, i) => {
    form.append(`columns[${i}][data]`, col);
    form.append(`columns[${i}][orderable]`, "true");
    form.append(`columns[${i}][searchable]`, "true");
  });

  return form;
};

const getImportPage = async (token: string, start: number, length: number) => {
  const form = buildListForm(start, length);
  const response = await axios.post<ImportPermitResponse>(
    "https://api.eris.efda.gov.et/api/ImportPermit/List",
    form,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders(),
      },
    }
  );

  return response.data;
};

const syncImport = async (id: number, token: string, date: string | null): Promise<SyncResult> => {
  try {
    const existingImport = await db.competitorImport.findUnique({
      where: { importId: id.toString() },
    });

    if (existingImport) {
      console.log(`[BACKFILL] Skipped already-synced import ${id}`);
      return { id, date, status: "skipped" };
    }

    console.log(`[BACKFILL] Syncing import ${id}`);
    const data = await getSingleImport(id, token);
    await syncToDb(data);
    console.log(`[BACKFILL] Synced import ${id}`);
    return { id, date, status: "synced" };
  } catch (error: any) {
    const message = error?.message || String(error);
    console.error(`[BACKFILL] Failed import ${id}: ${message}`);
    return { id, date, status: "failed", error: message };
  }
};

const run = async () => {
  const startDate = parseDateArg(process.argv[2], DEFAULT_START_DATE);
  const endDate = endOfDayUtc(process.argv[3]);
  const token = await getCachedErisAccessToken();

  if (!token) {
    throw new Error("ERIS crawler token is missing or expired. Save a fresh token from the admin settings page first.");
  }

  console.log(`[BACKFILL] Started at ${new Date().toISOString()}`);
  console.log(`[BACKFILL] Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
  console.log(`[BACKFILL] Page size: ${PAGE_SIZE}`);

  const results: SyncResult[] = [];
  let pageStart = 0;
  let pageCount = 0;
  let totalRecords: number | null = null;

  while (true) {
    pageCount += 1;
    console.log(`[BACKFILL] Fetching page ${pageCount}, start=${pageStart}`);

    const page = await getImportPage(token, pageStart, PAGE_SIZE);
    const records = page.data || [];
    totalRecords = page.recordsTotal ?? page.totalRecords ?? totalRecords;

    if (!records.length) {
      console.log("[BACKFILL] No more records returned.");
      break;
    }

    const matchingRecords = records.filter((item) => isWithinRange(item, startDate, endDate));
    for (const item of matchingRecords) {
      results.push(await syncImport(item.id, token, getImportDate(item)));
    }

    const allRecordsBeforeRange = records.every((item) => isBeforeRange(item, startDate));
    if (allRecordsBeforeRange) {
      console.log("[BACKFILL] Reached records older than start date. Stopping.");
      break;
    }

    pageStart += records.length;
    if (totalRecords !== null && pageStart >= totalRecords) {
      console.log("[BACKFILL] Reached EFDA total record count. Stopping.");
      break;
    }
  }

  const synced = results.filter((result) => result.status === "synced");
  const skipped = results.filter((result) => result.status === "skipped");
  const failed = results.filter((result) => result.status === "failed");

  console.log(`[BACKFILL] Completed at ${new Date().toISOString()}`);
  console.log(
    "[BACKFILL] Summary:",
    JSON.stringify(
      {
        consideredInRange: results.length,
        syncedCount: synced.length,
        skippedCount: skipped.length,
        failedCount: failed.length,
      },
      null,
      2
    )
  );

  if (failed.length) {
    console.error("[BACKFILL] Errors:", JSON.stringify(failed, null, 2));
    process.exitCode = 1;
  }
};

run()
  .catch((error: any) => {
    console.error(`[BACKFILL] Fatal error at ${new Date().toISOString()}`);
    console.error(error?.stack || error?.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
