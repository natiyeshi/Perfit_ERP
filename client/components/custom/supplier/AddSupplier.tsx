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
import { createSupplierSchema } from "@/validators/supplier.validator";
import { ISupplier } from "@/types/ISupplier"; // Updated to use correct interface
import { useMutation, useQueryClient } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

function AddSupplier() {
  const queryClient = useQueryClient();
  const [err, setErr] = useState<any>(null);
  const [open, setOpen] = useState(false); // State for dialog open/close
  const { isLoading, isError, error, mutate } = useMutation(
    (data: ISupplier) => axios.post("/suppliers", data),
    {
      onSuccess: () => {
        toast.success("Supplier Successfully Added!");
        queryClient.invalidateQueries("suppliers");
        setOpen(false);
      },
    }
  );

  const handleSubmit = async (values: ISupplier, { resetForm }: any) => {
    setErr(null);
    mutate(values);
    resetForm();
  };

  const initialValues: ISupplier = {
    name: "",
    email: "",
    phoneNumber: "",
    country: "",
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <div>Add Supplier</div>
          <FaPlus />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[40%] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex w-full justify-between">
            <AlertDialogTitle>Add Supplier</AlertDialogTitle>
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
              validationSchema={createSupplierSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {/* Full Name */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="name">Name</Label>
                      <Field
                        name="name"
                        as={Input}
                        id="name"
                        placeholder="Enter Full Name"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="name"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="email">Email</Label>
                      <Field
                        name="email"
                        as={Input}
                        id="email"
                        placeholder="Enter Email"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Field
                        name="phoneNumber"
                        as={Input}
                        id="phoneNumber"
                        placeholder="Enter Phone Number"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* Country */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="country">Country</Label>
                      <Field
                        name="country"
                        as={Input}
                        id="country"
                        placeholder="Enter Country"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="country"
                        component="p"
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
                {(error as any).response?.data?.message || "An error occurred"}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AddSupplier;
