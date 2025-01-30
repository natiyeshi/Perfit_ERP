"use client";
import { FC, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { Label } from "@/components/ui/label"; // ShadCN Label component
import { useMutation, useQuery } from "react-query";
import axios from "@/lib/axios";
import { changePasswordSchema } from "@/validators/change-password.validator";

const page = () => {
  const { isLoading, mutate } = useMutation(
    (data: any) =>
      axios.patch("/auth/change-password", {
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
  const handleSubmit = (data: any) => {
    mutate({
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  return (
    <div className="px-12 overflow-y-auto pb-20">
      <div className="big-topic py-8">Change Password</div>
      <Formik
        initialValues={initialValues}
        validationSchema={changePasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 gap-4 w-full">
              {/* CurrentPassword */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="currentpassword">Current Password</Label>
                <Field
                  type="password"
                  name="currentPassword"
                  as={Input}
                  id="currentPassword"
                  placeholder="Enter CurrentPassword"
                  className="w-2/3"
                />
                <ErrorMessage
                  name="currentPassword"
                  component="currentPassword"
                  className="text-sm text-red-500"
                />
              </div>
              {/* NewPassword */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="newpassword">New Password</Label>
                <Field
                  type="password"
                  name="newPassword"
                  as={Input}
                  id="newPassword"
                  placeholder="Enter NewPassword"
                  className="w-2/3"
                />
                <ErrorMessage
                  name="newPassword"
                  component="newPassword"
                  className="text-sm text-red-500"
                />
              </div>
              {/* ConfirmNewPassword */}
              <div className="flex flex-col space-y-2 w-full">
                <Label htmlFor="confirmnewpassword">Confirm New Password</Label>
                <Field
                  type="password"
                  name="confirmNewPassword"
                  as={Input}
                  id="confirmNewPassword"
                  placeholder="Enter ConfirmNewPassword"
                  className="w-2/3"
                />
                <ErrorMessage
                  name="confirmNewPassword"
                  component="confirmNewPassword"
                  className="text-sm text-red-500"
                />
              </div>
            </div>

            <Button
              disabled={isLoading}
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
