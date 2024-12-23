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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { updateCompetitorImportSchema } from "@/validators/competitor-import.validator";
import { IDBImport } from "@/types/IImport";
import { useMutation, useQueryClient } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import CustomeErrorMessage from "@/components/custom/ErrorMessage";

function UpdateImport({ initialValues }: { initialValues: IDBImport }) {
  const queryClient = useQueryClient();
  const [err, setErr] = useState<any>(null);
  const [open, setOpen] = useState(false); // State for dialog open/close

  const { isLoading, isError, error, mutate } = useMutation(
    (data: Partial<IDBImport>) =>
      axios.patch(`/competitor-imports/${initialValues.id}`, data),
    {
      onSuccess: () => {
        toast.success("Import successfully updated!");
        queryClient.invalidateQueries("competitor-imports");
        setOpen(false);
      },
    }
  );

  const handleSubmit = async (
    values: Partial<IDBImport>,
    { resetForm }: any
  ) => {
    setErr(null);
    mutate(values);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <div>Update Import</div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[40%] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex w-full justify-between">
            <AlertDialogTitle>Update Import</AlertDialogTitle>
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
              validationSchema={updateCompetitorImportSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {/* Full Name */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Field
                        name="fullName"
                        as={Input}
                        id="fullName"
                        placeholder="Enter Full Name"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="fullName"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* Label */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="label">Label</Label>
                      <Field
                        name="label"
                        as={Input}
                        id="label"
                        placeholder="Enter Label"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="label"
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

export default UpdateImport;
