
import { Router } from "express";
import { syncRouter } from "../controllers/sync.controller";

const router = Router();

router.get("/", syncRouter);

export default router;

/*
 {
      "agentID": 12766,
      "delivery": "Not Set",
      "importPermitNumber": "22762/IP/2025",
      "portOfEntryID": 1,
      "paymentModeID": 1,
      "shippingMethodID": 2,
      "currencyID": 1,
      "importPermitStatusID": 7,
      "performaInvoiceNumber": "AL/PI/ Exp./06-04",
      "requestedDate": "2025-07-05T09:23:53.488298Z",
      "expiryDate": "2026-07-05T09:23:56.308681Z",
      "freightCost": 0,
      "discount": null,
      "insurance": null,
      "amount": 3020.4,
      "createdByUserID": 35077,
      "assignedUserID": 35077,
      "remark": "Permit Request from Electronic Single Window",
      "agentName": "Droga Pharma PLC",
      "supplierName": "Aegis Lifescences Pvt. Ltd.",
      "portOfEntry": "Bole International Airport",
      "portOfEntrySH": "Bole",
      "paymentMode": "Letter of Credit (LC)",
      "paymentModeSH": "LC",
      "shippingMethod": "By Air",
      "shippingMethodSH": "Air",
      "currency": "US Dollar",
      "currencySymbol": "$",
      "currencySH": "USD",
      "importPermitStatus": "Approved",
      "importPermitStatusCode": "APR",
      "importPermitStatusSH": "Approved",
      "importPermitStatusPriority": 8,
      "importPermitStatusDisplayName": "Approved",
      "createdByUsername": "Jayadeta",
      "assignedUser": "Jalale Yadeta",
      "submissionDate": "2025-07-05T09:23:53.488335Z",
      "assignedDate": "2025-07-05T09:23:53.488245Z",
      "decisionDate": "2025-07-05T09:24:00.358243Z",
      "isAccessory": false,
      "maintenanceCost": null,
      "turnkeyCost": null,
      "installationCost": null,
      "submoduleTypeCode": "MD",
      "applicationId": "25/13442",
      "id": 60149,
      "isActive": true,
      "createdDate": "2025-07-05T09:23:53.488335Z",
      "modifiedDate": "2025-07-05T09:23:53.488335Z",
      "rowGuid": "42a1ee0f-063f-49ef-8944-dc77e2b64e3a"
    },

*/

