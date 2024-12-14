"use client";
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
import { FC, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { Label } from "@/components/ui/label"; // ShadCN Label component
import { IoCloseSharp } from "react-icons/io5";
import { IEmployee } from "@/types/IEmployee";
import { VEmployee } from "@/validation/VEmployee";
import { createEmployee } from "@/app/dashboard/hr/_actions/employee";
import CustomeErrorMessage from "@/components/custom/ErrorMessage";
import { createClient } from "@/utils/supabase/client";
import { formatISO } from "date-fns";

const initialValues: IEmployee = {
  first_name: "",
  last_name: "",
  grand_father_name: "",
  email: "",
  phone_number: "",
  position: "",
  department: "",
  status: "Active",
  date_hired: "",
  birth_date: "",
  gender: "",
};

function AddEmployee({ setEmployees }: { setEmployees: Function }) {
  const [err, setErr] = useState<any>(null);
  const today = formatISO(new Date(), { representation: "date" });
  const maxBirthDate = formatISO(
    new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
    { representation: "date" }
  ); // At least 18 years old

  const [open, setOpen] = useState(false); // State for dialog open/close

  const handleSubmit = async (values: IEmployee, { resetForm }: any) => {
    setErr(null);
    const supabase = createClient();
    const { data: NewEmployee, error }: any = await supabase
      .from("Employee")
      .insert([values])
      .select();
    if (error && NewEmployee && NewEmployee.length > 0) {
      setErr(error);
    } else {
      console.log(NewEmployee);
      NewEmployee && setEmployees((data: any) => [NewEmployee[0], ...data]);
      resetForm(); // Reset form after submission
      setOpen(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <div>Add Employee</div>
          <FaPlus />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[95vh] h-[95vh] max-w-[40%] w-[] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex w-full  justify-between">
            <AlertDialogTitle>Add Employee</AlertDialogTitle>
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
              validationSchema={VEmployee}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {/* First Name */}
                    <div className="flex flex-col space-y-2 w-full">
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
                    <div className="flex flex-col space-y-2 w-full">
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
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="grand_father_name">
                        Grandfather Name
                      </Label>
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
                    <div className="flex flex-col space-y-2 w-full">
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
                    <div className="flex flex-col space-y-2 w-full">
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
                    <div className="flex flex-col space-y-2 w-full">
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
                    <div className="flex flex-col space-y-2 w-full">
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

                    {/* Gender Field */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="gender">Gender</Label>
                      <Field
                        as="select"
                        name="gender"
                        id="gender"
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Field>
                      <ErrorMessage
                        name="gender"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* Date Hired Field with Max Date */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="date_hired">Date Hired</Label>
                      <Field
                        name="date_hired"
                        as={Input}
                        id="date_hired"
                        type="date"
                        max={today} // Max date as today
                        className="w-full"
                      />
                      <ErrorMessage
                        name="date_hired"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* Birth Date Field with Min and Max Date */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="birth_date">Birth Date</Label>
                      <Field
                        name="birth_date"
                        as={Input}
                        id="birth_date"
                        type="date"
                        max={maxBirthDate} // Max birth date (18 years ago)
                        className="w-full"
                      />
                      <ErrorMessage
                        name="birth_date"
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
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AddEmployee;
