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
import { Label } from "@/components/ui/label"; // ShadCN Label component
import { IoCloseSharp } from "react-icons/io5";
import { IDBEmployee } from "@/types/IEmployee";
import { VEmployee } from "@/validation/VEmployee";

function DeleteEmployee() {
  const handleSubmit = (values: IDBEmployee) => {
    console.log("Submitted Data:", values);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <div>Delete Employee</div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[95vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex w-full  justify-between">
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogCancel>
              <IoCloseSharp />
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription>
            Are you sure you want to delete this Employee ?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant={"destructive"} onClick={() => {}}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}



export default DeleteEmployee;
