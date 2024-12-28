"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaPlus } from "react-icons/fa";
import { FC, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { Label } from "@/components/ui/label"; // ShadCN Label component
import { IoCloseSharp } from "react-icons/io5";
import CustomeErrorMessage from "@/components/custom/ErrorMessage";
import { createProductSchema } from "@/validators/product.validator";
import { IDBProduct } from "@/types/IProduct";
import { useMutation, useQueryClient } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

function UpdateProduct({ initialValues }: { initialValues: IDBProduct }) {
  const queryClient = useQueryClient();
  const [err, setErr] = useState<any>(null);
  const [open, setOpen] = useState(false); // State for dialog open/close
  const { isLoading, isError, error, mutate } = useMutation(
    (data: IDBProduct) => axios.patch(`/products/${initialValues.id}`, data),
    {
      onSuccess: (res) => {
        toast.success("Product Sucessfully Updated!");
        queryClient.invalidateQueries("products");
        setOpen(false);
      },
    }
  );
  const handleSubmit = async (values: IDBProduct, { resetForm }: any) => {
    setErr(null);
    mutate(values);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <div>Update Product</div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className=" max-w-[40%] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex w-full justify-between">
            <AlertDialogTitle>Add Product</AlertDialogTitle>
            <AlertDialogCancel>
              <IoCloseSharp />
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription>
            {err && (
              <CustomeErrorMessage message={err.message} topic={"Error"} />
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={createProductSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {/* Product Name */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="name">Product Name</Label>
                      <Field
                        name="name"
                        as={Input}
                        id="name"
                        placeholder="Enter Product Name"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="name"
                        component="name"
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
                        type="string"
                        placeholder="Enter Unit"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="unit"
                        component="unit"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* Shelf Life */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="shelfLife">Shelf Life</Label>
                      <Field
                        name="shelfLife"
                        type="number"
                        as={Input}
                        id="shelfLife"
                        placeholder="Enter Shelf Life"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="shelfLife"
                        component="shelfLife"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* Brand */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="brand">Brand</Label>
                      <Field
                        name="brand"
                        as={Input}
                        id="brand"
                        placeholder="Enter Brand"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="brand"
                        component="brand"
                        className="text-sm text-red-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="mx-auto"
                  >
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
            {isError && (
              <div className="mt-2 text-sm text-red-500">
                {(error as any).response.data.message}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UpdateProduct;
