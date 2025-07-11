import { Router } from "express";
import axios from "axios";
import FormData from "form-data";
import { db, zodErrorFmt } from "../libs";

const router = Router();


export default router;

export interface ImportPermitResponse {
  recordsTotal: number;
  recordsFiltered: number;
  draw: number;
  error: string | null;
  totalRecords: number;
  totalRecordsFiltered: number;
  data: ImportPermit[];
  additionalParameters: any; // or define specific structure if known
}
export interface ImportPermit {
  agentID: number;
  delivery: string;
  importPermitNumber: string;
  portOfEntryID: number;
  paymentModeID: number;
  shippingMethodID: number;
  currencyID: number;
  importPermitStatusID: number;
  performaInvoiceNumber: string;
  requestedDate: string;
  expiryDate: string;
  freightCost: number;
  discount: number | null;
  insurance: number | null;
  amount: number;
  createdByUserID: number;
  assignedUserID: number;
  remark: string;
  agentName: string;
  supplierName: string;
  portOfEntry: string;
  portOfEntrySH: string;
  paymentMode: string;
  paymentModeSH: string;
  shippingMethod: string;
  shippingMethodSH: string;
  currency: string;
  currencySymbol: string;
  currencySH: string;
  importPermitStatus: string;
  importPermitStatusCode: string;
  importPermitStatusSH: string;
  importPermitStatusPriority: number;
  importPermitStatusDisplayName: string;
  createdByUsername: string;
  assignedUser: string;
  submissionDate: string;
  assignedDate: string;
  decisionDate: string;
  isAccessory: boolean;
  maintenanceCost: number | null;
  turnkeyCost: number | null;
  installationCost: number | null;
  submoduleTypeCode: string;
  applicationId: string;
  id: number;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
  rowGuid: string;
}
const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJuYmYiOjE3NTIyMjkwNDUsImV4cCI6MTc1MjMxNTQ0NSwiaXNzIjoiaHR0cHM6Ly9pZC5lcmlzLmVmZGEuZ292LmV0IiwiYXVkIjoiaHR0cHM6Ly9pZC5lcmlzLmVmZGEuZ292LmV0L3Jlc291cmNlcyIsImNsaWVudF9pZCI6ImVyaXMtcG9ydGFsLXNwYSIsInN1YiI6IjA5NzA0MTM5NDYiLCJhdXRoX3RpbWUiOjE3NTIyMjkwMjMsImlkcCI6ImxvY2FsIiwicGhvbmVfbnVtYmVyIjoiOTcwNDEzOTQ2IiwiZW1haWwiOiJhdHR0MjAwN0BnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiQW50ZW5laCBUYXllIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9wcmltYXJ5c2lkIjoiMTQ0NDgiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDk3MDQxMzk0NiIsInVzZXJJZCI6IjE0NDQ4IiwiYnJhbmNoSWQiOiIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJJUCBBcHBsaWNhbnQiLCJyb2xlQ29kZXMiOiJJUEEiLCJqdGkiOiJDNjZBMkUyOTg3RTRFMEVDNkQ4RUEyN0Y4MjUwNDgzOCIsInNpZCI6IkVEQzg1QzRGQjZDNjEyNEU3MTk1NTE0QkFDNkE0RTg1IiwiaWF0IjoxNzUyMjI5MDQ1LCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIl0sImFtciI6WyJwd2QiXX0.TxroLLx6K24oZKnBD2YFNXSWLfzy4hf2UimiFayqVNaOnsGpi-GTl0WkilH8TEKCth69Yu4ea_cNtOiElmvGlLAK9p89a0GWi4ZEjj29k7tq4KfMpjysTYZFSd70aiU55g5hZJSS5xM_etJVcUMBOIW9upZ8ECyfgc6wMLnVzg0nPmWHPejKqAEn9Xs2WLbh_cUmwt_O6LbLOrc0IWXN9_tju2m8xaqk-4573Pc0ElSgi44sX-qT_9H1Eeyg0Mk1Qix6_4_7CdpDlG8w4ZO2KaA9bsdDSN31NKgGKRctHO631G8QDX7D6pkFZmajiyR-opKni-hHb7njoO4LCVDaDw"

const getLists = async (): Promise<ImportPermitResponse | null> => {
  const form = new FormData();
  form.append("start", "0");
  form.append("length", "100");
  form.append("search[value]", "");
  form.append("draw", "0");
  form.append("submoduleTypeCode", "MDCN");
  form.append("userId", "14448");

  const columns = [
    "id", "importPermitNumber", "applicationId", "importPermitStatusCode",
    "requestedDate", "importPermitStatusDisplayName", "performaInvoiceNumber",
    "assignedUser", "portOfEntrySH", "supplierName", "agentName",
    "submissionDate", "decisionDate", "amount"
  ];

  columns.forEach((col, i) => {
    form.append(`columns[${i}][data]`, col);
    form.append(`columns[${i}][orderable]`, "true");
    form.append(`columns[${i}][searchable]`, "true");
  });

  try {
    const response = await axios.post(
      "https://api.eris.efda.gov.et/api/ImportPermit/List",
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Replace with your actual token
          ...form.getHeaders(), // Required for multipart/form-data boundary
        },
      }
    );

    console.log("✅ EFDA API Response:");
    const data : ImportPermitResponse = response.data;
    return data;
  } catch (error ) {
    console.log((error as any).response)
    if ((error as any).response) {
      console.error("❌ EFDA API Error:", (error as any).response.data);
    } else {
      console.error("❌ Request Error:", (error as any).message);
    }
  }
  return null;
}

const getSingleImport = async (id: number) => {
  const result = await axios.get(`https://api.eris.efda.gov.et/api/ImportPermit/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Replace with your actual token
      "Content-Type": "application/json"
    },
  });
  return result.data;
}

const syncToDb = async (data: any) => {
  console.log("Start Syncing to DB for import ID:", data.id);
  try {
    let newImport = {
      supplierId: "",
      competitorId: "",
      importId: data.id,
      amount: data.amount,
      modeOfShipment: data.shippingMethod.name,
      currency: data.currency.name,
      paymentMode: data.paymentMode.name,
      date: data.createdDate,
      products: [] as string[] // or use number[] or a specific type if needed
    };

    const existingSupplier = await db.supplier.findUnique({
      where: {
        manufacturerId: data.supplier.id.toString()
      }
    });

    if (!existingSupplier) {
      const supplier = {
        manufacturerName: data.supplier.name,
        description: data.supplier.description,
        country: data.supplier?.address?.country?.name ?? "",
        phoneNumber: data.supplier?.phone ?? "",
        email: data.supplier?.email ?? "",
        manufacturerId: data.supplier?.id.toString() ?? "",
      };

      const newSupplier = await db.supplier.create({
        data: supplier
      });
      newImport.supplierId = newSupplier.id;
    } else {
      newImport.supplierId = existingSupplier.id;
    }

    let existingCompetitor = null;
    const competitorIdStr = data.agent.id?.toString().trim();
    const competitorEmail = data.agent.email?.toString().trim();
    if (competitorIdStr) {
      existingCompetitor = await db.competitor.findUnique({
        where: { competitorId: competitorIdStr }
      });
    }
    if (!existingCompetitor && competitorEmail) {
      existingCompetitor = await db.competitor.findUnique({
        where: { email: competitorEmail }
      });
    }

    if (!existingCompetitor) {
      const competitor = {
        name: data.agent.name,
        email: competitorEmail,
        phoneNumber: data.agent.phone,
        tin: data.agent.tin,
        licenseNumber: data.agent.licenseNumber,
        competitorId: competitorIdStr
      };
      try {
        const newCompetitor = await db.competitor.create({
          data: competitor,
        });
        newImport.competitorId = newCompetitor.id;
      } catch (error: any) {
        if (error.code === 'P2002' && competitorEmail) {
          // Unique constraint failed, fetch by email
          const existingByEmail = await db.competitor.findUnique({
            where: { email: competitorEmail }
          });
          if (existingByEmail) {
            newImport.competitorId = existingByEmail.id;
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
    } else {
      newImport.competitorId = existingCompetitor.id;
    }

    await Promise.all(
      data.importPermitDetails.map(async (d: any) => {
        let productId = "";
        const productIdStr = d.productID?.toString().trim();
        if (!productIdStr) {
          throw new Error(`Invalid productID: ${d.productID}`);
        }
        const existingProduct = await db.product.findUnique({
          where: {
            productId: productIdStr
          }
        });

        if (!existingProduct) {
          try {
            const newProduct = await db.product.create({
              data: {
                productId: productIdStr,
                genericName: d.product.genericName ?? "",
                brandName: d.product.brandName ?? "",
                description: d.product.description ?? "",
                intendedUse: d.product.intendedUse ?? "",
              }
            });
            productId = newProduct.id;
          } catch (error: any) {
            if (error.code === 'P2002') {
              // Unique constraint failed, fetch the product again
              const existingProductRetry = await db.product.findUnique({
                where: { productId: productIdStr }
              });
              if (existingProductRetry) {
                productId = existingProductRetry.id;
              } else {
                throw error;
              }
            } else {
              console.error("Error creating product:", error);
              throw new Error(`*******************Failed to create product with ID ${d.productID}: ${error}`);
            }
          }
        } else {
          productId = existingProduct.id;
        }

        const newProductWithPrice = await db.productWithPrice.create({
          data: {
            productId: productId,
            unitPrice: d.unitPrice,
            quantity: d.quantity,
          }
        });
        newImport.products.push(newProductWithPrice.id.toString());
      })
    );

    const newImportEntry = await db.competitorImport.create({
      data: {
        supplierId: newImport.supplierId,
        competitorId: newImport.competitorId,
        importId: newImport.importId.toString(),
        amount: newImport.amount,
        modeOfShipment: newImport.modeOfShipment,
        currency: newImport.currency,
        paymentMode: newImport.paymentMode,
        date: newImport.date,
        products: {
          connect: newImport.products.map(id => ({ id  }))
        }
      }
    });
    console.log("New Import Entry Created:", newImportEntry);
    return newImportEntry;
  } catch (error) {
    console.error("Error syncing to DB:", error);
    throw error;
  }
};
 
const syncData = async () => {
  // Sync data with the external API
  try {
    const result = await getLists();
      const ids = result?.data.map(item => item.id) || [];
      ids.map(async (id)=>{
        const existingImport = await db.competitorImport.findUnique({
          where: { importId: id.toString() }
        })
        
        if(!existingImport){
          console.log("Syncing import with ID: ", id);
          const data = await getSingleImport(id)
          await syncToDb(data)
          console.log("Finalized Syncing import with ID: ", id);
        } else {
          console.log("Already synced! ", id);
        }
      })

    return {ids};

  }catch (error) {
    console.error("Error during syncData:", error);
    throw error;
  }
  

}

router.get("/", async (req, res) => {
  try{
    await syncData()
    res.json({ "okay" : "okay"});
  }catch(err){
    res.json({ err });
  }
});

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

