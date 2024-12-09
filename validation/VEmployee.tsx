import * as Yup from "yup";

export const VEmployee = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    grand_father_name: Yup.string().required("Grandfather name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone_number: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    position: Yup.string().required("Position is required"),
    department: Yup.string().optional(),
    date_hired: Yup.string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .required("Date hired is required"),
    status: Yup.string().oneOf(["Active", "Inactive"], "Invalid status").required("Status is required"),
});