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
  import { Button } from "@/components/ui/button"; // ShadCN Button component
  import { IoCloseSharp } from "react-icons/io5";
  import { useMutation, useQueryClient } from "react-query";
  import axios from "@/lib/axios";
  import toast from "react-hot-toast";
  import { useState } from "react";
  
  function DeleteCustomer({ id }: { id: string }) {
    const [open, setOpen] = useState(false); // State for dialog open/close
    const queryClient = useQueryClient();
    const { isLoading, isError, error, mutate, isSuccess } = useMutation(
      () => axios.delete(`/customers/${id}`),
      {
        onSuccess: (res) => {
          toast.success("Customer Sucessfully Delete!");
          queryClient.invalidateQueries("customers");
          setOpen(false);
        },
        onError: (err) => {
          toast.error("Something goes wrong!");
        },
      }
    );
  
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="flex gap-1">
            <div>Delete Customer</div>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-h-[95vh] overflow-y-auto">
          <AlertDialogHeader>
            <div className="flex w-full  justify-between">
              <AlertDialogTitle>Delete Customer</AlertDialogTitle>
              <AlertDialogCancel>
                <IoCloseSharp />
              </AlertDialogCancel>
            </div>
            <AlertDialogDescription>
              Are you sure you want to delete this Customer ?
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                disabled={isLoading}
                variant={"destructive"}
                onClick={() => mutate()}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  
  export default DeleteCustomer;
  