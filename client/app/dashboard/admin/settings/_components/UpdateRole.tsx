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
import { useMutation, useQueryClient } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IUser } from "@/types/IUser";

function UpdateRole({ user }: { user: IUser }) {
  const queryClient = useQueryClient();
  const [err, setErr] = useState<any>(null);
  const [open, setOpen] = useState(false); // State for dialog open/close
  const { isLoading, isError, error, mutate, isSuccess } = useMutation(
    (role: string) =>
      axios.patch("/auth/role", {
        userId: user.id,
        role: role,
      }),
    {
      onSuccess: (res) => {
        toast.success("Roel updated Sucessfully!");
        queryClient.invalidateQueries("users");
        setOpen(false);
      },
      onError: (err) => {
        toast.error("Error");
      },
    }
  );
  const handleSubmit = async (values: any) => {
    setErr(null);
    console.log("Submitted values:", values);
    mutate(values.role);
  };

  const initialValues = {
    role: user.role,
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"} size="sm" className="mt-3  text-xs">
          Update Role
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

            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {({ isSubmitting, setFieldValue }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 w-full">
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="name">Role</Label>
                      <Select
                        onValueChange={(value: string) =>
                          setFieldValue("role", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`Select Roles`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"UNKNOWN"}>UNKNOWN</SelectItem>
                          <SelectItem value={"DATA_AGGREGATOR"}>
                            DATA_AGGREGATOR
                          </SelectItem>
                          <SelectItem value={"SALES_PERSON"}>
                            SALES_PERSON
                          </SelectItem>
                          <SelectItem value={"ADMIN"}>ADMIN</SelectItem>
                        </SelectContent>
                      </Select>
                      <ErrorMessage
                        name="name"
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
                {(error as any).response.data.message}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UpdateRole;
