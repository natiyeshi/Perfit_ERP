"use client";
import { FaPlus } from "react-icons/fa";
import { FC, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { Label } from "@/components/ui/label"; // ShadCN Label component
import { VImport } from "@/validation/VImport";

const page = () => {
  const handleSubmit = () => {};
  const initialValues = {
    product: "",
    supplier: "",
    quantity: "",
    unit: "",
    unit_price: "",
    total_price: "",
    order_date: "",
    shelf_life: "",
    mode_of_shipment: "",
    product_name: "",
    product_brand: "",
    company_name: "",
    productId: "",
    supplierId: "",
  };
  return (
    <div className="px-12 overflow-y-auto pb-20">
      <div
        onClick={() => {
          toast.success("Here is your toast.", {
            position: "top-right",
          });
        }}
        className="big-topic py-8"
      >
        Register Import Data
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={VImport}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Product Name */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="product_name">Product Name</Label>
                <Field
                  name="product_name"
                  as={Input}
                  id="product_name"
                  placeholder="Enter Product Name"
                  className="w-full"
                />
                <ErrorMessage
                  name="product_name"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Product Brand */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="product_brand">Product Brand</Label>
                <Field
                  name="product_brand"
                  as={Input}
                  id="product_brand"
                  placeholder="Enter Product Brand"
                  className="w-full"
                />
                <ErrorMessage
                  name="product_brand"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Quantity */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="quantity">Quantity</Label>
                <Field
                  name="quantity"
                  as={Input}
                  id="quantity"
                  type="number"
                  placeholder="Enter Quantity"
                  className="w-full"
                />
                <ErrorMessage
                  name="quantity"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Unit */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="unit">Unit</Label>
                <Field
                  name="unit"
                  as={Input}
                  id="unit"
                  placeholder="Enter Unit"
                  className="w-full"
                />
                <ErrorMessage
                  name="unit"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Unit Price */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="unit_price">Unit Price</Label>
                <Field
                  name="unit_price"
                  as={Input}
                  id="unit_price"
                  type="number"
                  placeholder="Enter Unit Price"
                  className="w-full"
                />
                <ErrorMessage
                  name="unit_price"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Total Price */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="total_price">Total Price</Label>
                <Field
                  name="total_price"
                  as={Input}
                  id="total_price"
                  type="number"
                  placeholder="Enter Total Price"
                  className="w-full"
                />
                <ErrorMessage
                  name="total_price"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Order Date */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="order_date">Order Date</Label>
                <Field
                  name="order_date"
                  as={Input}
                  id="order_date"
                  type="date"
                  className="w-full"
                />
                <ErrorMessage
                  name="order_date"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Shelf Life */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="shelf_life">Shelf Life</Label>
                <Field
                  name="shelf_life"
                  as={Input}
                  id="shelf_life"
                  placeholder="Enter Shelf Life"
                  className="w-full"
                />
                <ErrorMessage
                  name="shelf_life"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Mode of Shipment */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="mode_of_shipment">Mode of Shipment</Label>
                <Field
                  name="mode_of_shipment"
                  as={Input}
                  id="mode_of_shipment"
                  placeholder="Enter Mode of Shipment"
                  className="w-full"
                />
                <ErrorMessage
                  name="mode_of_shipment"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Company Name */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="company_name">Company Name</Label>
                <Field
                  name="company_name"
                  as={Input}
                  id="company_name"
                  placeholder="Enter Company Name"
                  className="w-full"
                />
                <ErrorMessage
                  name="company_name"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Product ID */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="productId">Product ID</Label>
                <Field
                  name="productId"
                  as={Input}
                  id="productId"
                  placeholder="Enter Product ID"
                  className="w-full"
                />
                <ErrorMessage
                  name="productId"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Supplier ID */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="supplierId">Supplier ID</Label>
                <Field
                  name="supplierId"
                  as={Input}
                  id="supplierId"
                  placeholder="Enter Supplier ID"
                  className="w-full"
                />
                <ErrorMessage
                  name="supplierId"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mx-auto mr-auto"
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
