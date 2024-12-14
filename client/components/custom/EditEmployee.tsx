import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaPlus } from "react-icons/fa";
import { FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { Label } from "@/components/ui/label"; // ShadCN Label component
import { IoCloseSharp } from "react-icons/io5";
import { IDBEmployee } from "@/types/IEmployee";
import { VEmployee } from "@/validation/VEmployee";

function EditEmployee({ initialValues }: { initialValues: IDBEmployee }) {
  const handleSubmit = (values: IDBEmployee) => {
    console.log("Submitted Data:", values);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <div>Edit Employee</div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[95vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex w-full  justify-between">
            <AlertDialogTitle>Add Employee</AlertDialogTitle>
            <AlertDialogCancel>
              <IoCloseSharp />
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription>
            <Formik
              initialValues={initialValues}
              validationSchema={VEmployee}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  {/* First Name */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Field
                      name="first_name"
                      as={Input}
                      id="first_name"
                      placeholder="Enter First Name"
                      className="w-full"
                    />
                    <ErrorMessage
                      name="first_name"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Field
                      name="last_name"
                      as={Input}
                      id="last_name"
                      placeholder="Enter Last Name"
                      className="w-full"
                    />
                    <ErrorMessage
                      name="last_name"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Grandfather Name */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="grand_father_name">Grandfather Name</Label>
                    <Field
                      name="grand_father_name"
                      as={Input}
                      id="grand_father_name"
                      placeholder="Enter Grandfather Name"
                      className="w-full"
                    />
                    <ErrorMessage
                      name="grand_father_name"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Field
                      name="email"
                      as={Input}
                      id="email"
                      type="email"
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
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Field
                      name="phone_number"
                      as={Input}
                      id="phone_number"
                      placeholder="Enter Phone Number"
                      className="w-full"
                    />
                    <ErrorMessage
                      name="phone_number"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Position */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Field
                      name="position"
                      as={Input}
                      id="position"
                      placeholder="Enter Position"
                      className="w-full"
                    />
                    <ErrorMessage
                      name="position"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Department */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Field
                      name="department"
                      as={Input}
                      id="department"
                      placeholder="Enter Department"
                      className="w-full"
                    />
                    <ErrorMessage
                      name="department"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Date Hired */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="date_hired">Date Hired</Label>
                    <Field
                      name="date_hired"
                      as={Input}
                      id="date_hired"
                      type="date"
                      className="w-full"
                    />
                    <ErrorMessage
                      name="date_hired"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditEmployee;
