// "use client";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { IoCloseSharp } from "react-icons/io5";
// import { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { updateInventorySchema } from "@/validators/inventory.validator";
// import { IDBInventory } from "@/types/IInventory";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import axios from "@/lib/axios";
// import toast from "react-hot-toast";
// import CustomeErrorMessage from "@/components/custom/ErrorMessage";
// import { IDBProduct } from "@/types/IProduct";
// import { IDBSupplier } from "@/types/ISupplier";
// import { IDBCompetitor } from "@/types/ICompetitor";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// function UpdateInventory({ initialValues }: { initialValues: IDBInventory }) {
//   const queryClient = useQueryClient();
//   const [err, setErr] = useState<any>(null);
//   const [open, setOpen] = useState(false); // State for dialog open/close
//   const [products, setProducts] = useState<IDBProduct[]>([]);
//   const [suppliers, setSuppliers] = useState<IDBSupplier[]>([]);
//   const [competitors, setCompetitors] = useState<IDBCompetitor[]>([]);

//   const { isLoading, isError, error, mutate } = useMutation(
//     (data: Partial<IDBInventory>) =>
//       axios.patch(`/inventories/${initialValues.id}`, data),
//     {
//       onSuccess: () => {
//         toast.success("Inventory successfully updated!");
//         queryClient.invalidateQueries("inventories");
//         setOpen(false);
//       },
//     }
//   );

//   const handleSubmit = async (
//     values: Partial<IDBInventory>,
//     { resetForm }: any
//   ) => {
//     setErr(null);
//     mutate(values);
//   };

//   const productQuery = useQuery("products", () => axios.get("/products"), {
//     onSuccess(data) {
//       setProducts(data.data.result || []);
//     },
//     onError(err) {
//       toast.error("Error while loading products!");
//     },
//   });

//   const competitorQuery = useQuery(
//     "competitors",
//     () => axios.get("/competitors"),
//     {
//       onSuccess(data) {
//         setCompetitors(data.data.result || []);
//       },
//       onError(err) {
//         toast.error("Error while loading competitors!");
//       },
//     }
//   );

//   const supplierQuery = useQuery("suppliers", () => axios.get("/suppliers"), {
//     onSuccess(data) {
//       setSuppliers(data.data.result || []);
//     },
//     onError(err) {
//       toast.error("Error while loading suppliers!");
//     },
//   });

//   return (
//     <AlertDialog open={open} onOpenChange={setOpen}>
//       <AlertDialogTrigger asChild>
//         <Button variant="outline" className="flex gap-1">
//           <div>Update Inventory</div>
//         </Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent className="max-w-[60%] overflow-y-auto">
//         <AlertDialogHeader>
//           <div className="flex w-full justify-between">
//             <AlertDialogTitle>Update Inventory</AlertDialogTitle>
//             <AlertDialogCancel>
//               <IoCloseSharp />
//             </AlertDialogCancel>
//           </div>
//           <AlertDialogDescription>
//             {err && (
//               <CustomeErrorMessage message={err.message} topic={"Error"} />
//             )}

//             <Formik
//               initialValues={initialValues}
//               validationSchema={updateInventorySchema}
//               onSubmit={handleSubmit}
//             >
//               {({ isSubmitting, setFieldValue, values }) => (
//                 <Form className="space-y-6">
//                   <div className="grid grid-cols-2 gap-4 w-full">
//                     {/* Product Name */}
//                     <div className="flex flex-col space-y-2 w-full">
//                       <Label htmlFor="productId">Product Name</Label>
//                       <Select
//                         disabled={productQuery.isLoading}
//                         onValueChange={(value: string) =>
//                           setFieldValue("productId", value)
//                         }
//                         value={values.productId}
//                       >
//                         <SelectTrigger className="w-full">
//                           <SelectValue
//                             placeholder={` ${productQuery.isLoading ? "Loading..." : "Select"}`}
//                           />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {products.map((pr) => {
//                             return (
//                               <SelectItem value={pr.id}>{pr.name}</SelectItem>
//                             );
//                           })}
//                         </SelectContent>
//                       </Select>
//                       <ErrorMessage
//                         name="productId"
//                         component="p"
//                         className="text-sm text-red-500"
//                       />
//                     </div>
//                     {/* Supplier Name */}
//                     <div className="flex flex-col space-y-2 w-full">
//                       <Label htmlFor="supplierId">Supplier Name</Label>
//                       <Select
//                         disabled={supplierQuery.isLoading}
//                         onValueChange={(value: string) =>
//                           setFieldValue("supplierId", value)
//                         }
//                         value={values.supplierId}
//                       >
//                         <SelectTrigger className="w-full">
//                           <SelectValue
//                             placeholder={` ${supplierQuery.isLoading ? "Loading..." : "Select"}`}
//                           />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {suppliers.map((pr) => {
//                             return (
//                               <SelectItem value={pr.id}>{pr.name}</SelectItem>
//                             );
//                           })}
//                         </SelectContent>
//                       </Select>
//                       <ErrorMessage
//                         name="supplierId"
//                         component="p"
//                         className="text-sm text-red-500"
//                       />
//                     </div>

//                     {/* Quantity */}
//                     <div className="flex flex-col space-y-2 w-full">
//                       <Label htmlFor="quantity">Quantity</Label>
//                       <Field
//                         name="quantity"
//                         as={Input}
//                         id="quantity"
//                         type="number"
//                         placeholder="Enter Quantity"
//                         className="w-full"
//                       />
//                       <ErrorMessage
//                         name="quantity"
//                         component="p"
//                         className="text-sm text-red-500"
//                       />
//                     </div>

//                     {/* Unit */}
//                     <div className="flex flex-col space-y-2 w-full">
//                       <Label htmlFor="unit">Unit</Label>
//                       <Field
//                         name="unit"
//                         as={Input}
//                         id="unit"
//                         placeholder="Enter Unit"
//                         className="w-full"
//                       />
//                       <ErrorMessage
//                         name="unit"
//                         component="p"
//                         className="text-sm text-red-500"
//                       />
//                     </div>

//                     {/* Unit Price */}
//                     <div className="flex flex-col space-y-2 w-full">
//                       <Label htmlFor="unitPrice">Unit Price</Label>
//                       <Field
//                         name="unitPrice"
//                         as={Input}
//                         id="unitPrice"
//                         type="number"
//                         placeholder="Enter Unit Price"
//                         className="w-full"
//                       />
//                       <ErrorMessage
//                         name="unitPrice"
//                         component="p"
//                         className="text-sm text-red-500"
//                       />
//                     </div>

//                     {/* Total Price */}
//                     <div className="flex flex-col space-y-2 w-full">
//                       <Label htmlFor="totalPrice">Total Price</Label>
//                       <Field
//                         name="totalPrice"
//                         as={Input}
//                         id="totalPrice"
//                         type="number"
//                         placeholder="Enter Total Price"
//                         className="w-full"
//                       />
//                       <ErrorMessage
//                         name="totalPrice"
//                         component="p"
//                         className="text-sm text-red-500"
//                       />
//                     </div>

//                     {/* Order Date */}
//                     <div className="flex flex-col space-y-2 w-full">
//                       <Label htmlFor="orderDate">Order Date</Label>
//                       <Field
//                         name="orderDate"
//                         as={Input}
//                         id="orderDate"
//                         type="date"
//                         className="w-full"
//                         value={values["orderDate"]}
//                       />
//                       <ErrorMessage
//                         name="orderDate"
//                         component="p"
//                         className="text-sm text-red-500"
//                       />
//                     </div>

//                     {/* Shelf Life */}
//                     <div className="flex flex-col space-y-2 w-full">
//                       <Label htmlFor="shelfLife">Shelf Life</Label>
//                       <Field
//                         name="shelfLife"
//                         type="number"
//                         as={Input}
//                         id="shelfLife"
//                         placeholder="Enter Shelf Life"
//                         className="w-full"
//                       />
//                       <ErrorMessage
//                         name="shelfLife"
//                         component="p"
//                         className="text-sm text-red-500"
//                       />
//                     </div>

//                     {/* Mode of Shipment */}
//                     <div className="flex flex-col space-y-2 w-full">
//                       <Label htmlFor="modeOfShipment">Mode of Shipment</Label>
//                       <Field
//                         name="modeOfShipment"
//                         as={Input}
//                         id="modeOfShipment"
//                         placeholder="Enter Mode of Shipment"
//                         className="w-full"
//                       />
//                       <ErrorMessage
//                         name="modeOfShipment"
//                         component="p"
//                         className="text-sm text-red-500"
//                       />
//                     </div>
//                   </div>

//                   <Button
//                     type="submit"
//                     disabled={isLoading}
//                     className="mx-auto"
//                   >
//                     Submit
//                   </Button>
//                 </Form>
//               )}
//             </Formik>
//             {isError && (
//               <div className="mt-2 text-sm text-red-500">
//                 {(error as any).response.data.message}
//               </div>
//             )}
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }

// export default UpdateInventory;

const fun = () => {
  return <></>
}

export default fun