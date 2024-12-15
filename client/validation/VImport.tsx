import * as Yup from "yup";

export const VImport = Yup.object({
  product_name: Yup.string().required("Product name is required"),
  product_brand: Yup.string().required("Product brand is required"),
  quantity: Yup.number()
    .positive("Must be positive")
    .required("Quantity is required"),
  unit: Yup.string().required("Unit is required"),
  unit_price: Yup.number()
    .positive("Must be positive")
    .required("Unit price is required"),
  total_price: Yup.number().positive("Must be positive"),
  order_date: Yup.date().required("Order date is required"),
  shelf_life: Yup.string().required("Shelf life is required"),
  mode_of_shipment: Yup.string().required("Mode of shipment is required"),
  company_name: Yup.string().required("Company name is required"),
});
