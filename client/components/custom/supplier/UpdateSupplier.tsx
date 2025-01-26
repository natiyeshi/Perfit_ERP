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
import { IDBSupplier } from "@/types/ISupplier";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IDBProduct } from "@/types/IProduct";
import { FaX } from "react-icons/fa6";

function UpdateSupplier({ initialValues }: { initialValues: IDBSupplier }) {
  const queryClient = useQueryClient();
  const [err, setErr] = useState<any>(null);
  const [products, setProducts] = useState<IDBProduct[]>([]);
  const [open, setOpen] = useState(false); // State for dialog open/close
  const { isLoading, isError, error, mutate } = useMutation(
    (data: any) => axios.patch(`/suppliers/${initialValues.id}`, data),
    {
      onSuccess: (res) => {
        toast.success("Supplier Successfully Updated!");
        queryClient.invalidateQueries("suppliers");
        setOpen(false);
      },
    }
  );

  const handleSubmit = async (values: IDBSupplier, { resetForm }: any) => {
    setErr(null);
    let a = {...values,deliverableProducts : values.productIDs}
    // delete a.productIDs
    mutate(a);
  };

  const productQuery = useQuery("products", () => axios.get("/products"), {
    onSuccess(data) {
      setProducts(data.data.result || []);
    },
    onError(err) {
      toast.error("Error while loading products!");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <div>Update Supplier</div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className=" max-w-[40%] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex w-full justify-between">
            <AlertDialogTitle>Update Supplier</AlertDialogTitle>
            <AlertDialogCancel>
              <IoCloseSharp />
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription>
            {err && (
              <CustomeErrorMessage message={err.message} topic={"Error"} />
            )}

            <Formik
              initialValues={{
                ...initialValues,
                productIDs: initialValues.deliverableProducts?.map((a) => a.id),
              }}
              validationSchema={createSupplierSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {/* Supplier Name */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="manufacturerName">
                        Manufacturer Name
                      </Label>
                      <Field
                        name="manufacturerName"
                        as={Input}
                        id="manufacturerName"
                        placeholder="Enter Manufacturer Name"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="manufacturerName"
                        component="manufacturerName"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="phoneNumber">Contact Number</Label>
                      <Field
                        name="phoneNumber"
                        as={Input}
                        id="phoneNumber"
                        type="text"
                        placeholder="Enter Contact Number"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* Email Address */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="email">Email Address</Label>
                      <Field
                        name="email"
                        as={Input}
                        id="email"
                        type="email"
                        placeholder="Enter Email Address"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* country */}
                    <div className="flex flex-col space-y-2 w-full">
                      <Label htmlFor="country">Country</Label>
                      <Field
                        name="country"
                        as={Input}
                        id="country"
                        placeholder="Enter country"
                        className="w-full"
                      />
                      <ErrorMessage
                        name="country"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* Product Name */}
                    <ProductSelectCheckBox
                      isLoading={productQuery.isLoading}
                      products={products}
                      setFieldValue={setFieldValue}
                      selectedProductIds={values.productIDs ?? []}
                    />
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

export default UpdateSupplier;

const ProductSelectCheckBox = ({
  isLoading,
  setFieldValue,
  products,
  selectedProductIds,
}: {
  isLoading: boolean;
  setFieldValue: Function;
  products: IDBProduct[];
  selectedProductIds: string[];
}) => {
  const selectProducts = products.filter((pr) =>
    selectedProductIds.includes(pr.id)
  );

  const SelectedProductDiv = ({
    pr,
    onClick,
  }: {
    onClick: Function;
    pr: IDBProduct;
  }) => {
    return (
      <div className="bg-gray-200 w-fit text-gray-800 flex gap-2 px-2 py-1 rounded-full">
        <div>{pr.name}</div>
        <div
          onClick={() => onClick()}
          role="button"
          className="p-1 rounded-full hover:bg-gray-500"
        >
          <FaX className="text-xs" />
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col space-y-2 w-full">
      <Label htmlFor="productId">Product Name</Label>
      <div className="flex gap-2 overflow-auto">
        {selectProducts.map((pr, ind) => (
          <SelectedProductDiv
            key={ind}
            pr={pr}
            onClick={() => {
              setFieldValue(
                "productIDs",
                selectedProductIds.filter((id) => id !== pr.id)
              );
            }}
          />
        ))}
      </div>

      <Select
        disabled={isLoading}
        onValueChange={(value: string) =>
          !selectedProductIds.includes(value) &&
          setFieldValue("productIDs", [...selectedProductIds, value])
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={` ${isLoading ? "Loading..." : "Select"}`}
          />
        </SelectTrigger>
        <SelectContent>
          {products.map((pr, ind) => {
            return (
              <SelectItem key={ind} value={pr.id}>
                {pr.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <ErrorMessage
        name="productIDs"
        component="p"
        className="text-sm text-red-500"
      />
    </div>
  );
};
