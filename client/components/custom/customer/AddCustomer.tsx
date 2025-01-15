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
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { Label } from "@/components/ui/label"; // ShadCN Label component
import { IoCloseSharp } from "react-icons/io5";
import CustomeErrorMessage from "@/components/custom/ErrorMessage";
import { createCustomerSchema } from "@/validators/customer.validator";
import { ICustomer } from "@/types/ICustomer";
import { useMutation, useQueryClient } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

function AddCustomer() {
  const queryClient = useQueryClient();
  const [err, setErr] = useState<any>(null);
  const [open, setOpen] = useState(false); // State for dialog open/close
  const { isLoading, isError, error, mutate, isSuccess } = useMutation(
    (data: ICustomer) => axios.post("/customers", data),
    {
      onSuccess: (res) => {
        toast.success("Customer Successfully Added!");
        queryClient.invalidateQueries("customers");
        setOpen(false);
      },
    }
  );

  const handleSubmit = async (values: ICustomer, { resetForm }: any) => {
    setErr(null);
    console.log("Submitted values:", values);
    mutate(values);
  };

  const initialValues: ICustomer = {
    organizationName: "",
    phoneNumber: "",
    city: "",
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <div>Add Customer</div>
          <FaPlus />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[40%] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex w-full justify-between">
            <AlertDialogTitle>Add Customer</AlertDialogTitle>
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
              validationSchema={createCustomerSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {/* Organization Name */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="organizationName">
                        Organization Name
                      </Label>
                      <Field
                        name="organizationName"
                        as={Input}
                        id="organizationName"
                        placeholder="Enter Organization Name"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="organizationName"
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

                    {/* City */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="city">City</Label>
                      <Field
                        name="city"
                        as={Input}
                        id="city"
                        placeholder="Enter City"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="city"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* Catagory */}
                    {/* 
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="catagory">Catagory</Label>
                      <Field
                        name="catagory"
                        as={Input}
                        id="catagory"
                        placeholder="Enter Catagory"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="catagory"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div> */}
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

export default AddCustomer;
