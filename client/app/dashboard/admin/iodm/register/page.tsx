"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { Label } from "@/components/ui/label"; // ShadCN Label component
import { createIODMSchema } from "@/validators/Iodm.validator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "react-query";
import axios from "@/lib/axios";
import { IIodm } from "@/types/IIodm";
import { IDBSupplier } from "@/types/ISupplier";
import { useState } from "react";
import { IDBProduct } from "@/types/IProduct";

const page = () => {
  const { isLoading, mutate } = useMutation(
    (data: any) =>
      axios.post("/IODMs", {
        ...data,
      }),
    {
      onSuccess() {
        toast.success("Data Successfully Registered!");
      },
      onError(err) {
        toast.error(
          (err as any).response.data.message ?? "Something goes wrong!"
        );
      },
    }
  );

  const [products, setProducts] = useState<IDBProduct[]>([]);
  const [suppliers, setSuppliers] = useState<IDBSupplier[]>([]);

  const productQuery = useQuery("products", () => axios.get("/products"), {
    onSuccess(data) {
      setProducts(data.data.result || []);
    },
    onError(err) {
      toast.error("Error while loading products!");
    },
  });
  const supplierQuery = useQuery("suppliers", () => axios.get("/suppliers"), {
    onSuccess(data) {
      setSuppliers(data.data.result || []);
    },
    onError(err) {
      toast.error("Error while loading suppliers!");
    },
  });

  const handleSubmit = (data: IIodm) => mutate(data);

  const initialValues: IIodm = {
    expiryDate: new Date().toISOString(),
    manufactureDate: new Date().toISOString(),
    purchasePriceUsd: 0,
    currentSellingPrice: 0,
    productMovement: "MEDIUM",
    transportCost: 0,
    grossWeight: 0,
    cbm: 0,
    freightCost: 0,
    dutyTax: 0,
    bsc: 0,
    shipmentAmount: 0,
    insuranceCharge: 0,
    loadingUnloading: 0,
    exchangeRate: 0,
    supplierId: "",
    productId: "",
  };

  return (
    <div className="px-12 overflow-y-auto pb-20">
      <div className="big-topic py-8">Register IODM Data</div>
      <Formik
        initialValues={initialValues}
        validationSchema={createIODMSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Expiry Date */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Field
                  name="expiryDate"
                  as={Input}
                  type="date"
                  id="expiryDate"
                  className="w-full"
                />
                <ErrorMessage
                  name="expiryDate"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Manufacture Date */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="manufactureDate">Manufacture Date</Label>
                <Field
                  name="manufactureDate"
                  as={Input}
                  type="date"
                  id="manufactureDate"
                  className="w-full"
                />
                <ErrorMessage
                  name="manufactureDate"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Supplier */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="supplierId">Supplier</Label>
                <Select
                  onValueChange={(value) => setFieldValue("supplierId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier: IDBSupplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.manufacturerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="supplierId"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Product */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="productId">Product</Label>
                <Select
                  onValueChange={(value) => setFieldValue("productId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product: IDBProduct) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="productId"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Purchase Price */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="purchasePriceUsd">Purchase Price (USD)</Label>
                <Field
                  name="purchasePriceUsd"
                  as={Input}
                  type="number"
                  className="w-full"
                />
                <ErrorMessage
                  name="purchasePriceUsd"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Product Movement */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="productMovement">Product Movement</Label>
                <Field
                  name="productMovement"
                  as="select"
                  className="w-full border rounded-md p-2"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </Field>
                <ErrorMessage
                  name="productMovement"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Additional Costs */}
              {[
                "transportCost",
                "grossWeight",
                "cbm",
                "freightCost",
                "dutyTax",
                "bsc",
                "shipmentAmount",
                "insuranceCharge",
                "loadingUnloading",
                "exchangeRate",
                "currentSellingPrice",
              ].map((field) => (
                <div className="flex flex-col space-y-2 w-full" key={field}>
                  <Label htmlFor={field}>
                    {field.split(/(?=[A-Z])/).join(" ")}
                  </Label>
                  <Field
                    name={field}
                    as={Input}
                    type="number"
                    className="w-full"
                  />
                  <ErrorMessage
                    name={field}
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>
              ))}
            </div>

            <Button
              type="submit"
              onClick={() => handleSubmit(values)}
              disabled={isLoading}
              className="mx-auto"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default page;
