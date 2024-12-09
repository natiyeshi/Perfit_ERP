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
import { FC } from "react";
// import { Card } from "@/components/ui/card"; // ShadCN Card
// import { Text } from "@/components/ui/text"; // ShadCN Text
// import { Divider } from "@/components/ui/divider"; // ShadCN Divider

function DetailEmployee({ employee }: { employee: IDBEmployee }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <div>See Detail</div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[95vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex w-full  justify-between">
            <AlertDialogTitle>Employee Detail</AlertDialogTitle>
            <AlertDialogCancel>
              <IoCloseSharp />
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription>
            <div className="p6 max-w-lg mx-auto">
              <div className="space-y-4">
                <div>
                  <div className="font-semibold">Name:</div>
                  <div className="text-white">
                    {employee.first_name} {employee.last_name}
                  </div>
                </div>

                <div>
                  <div className="font-semibold">Email:</div>
                  <div className="text-white">{employee.email}</div>
                </div>

                <div>
                  <div className="font-semibold">Phone Number:</div>
                  <div className="text-white">{employee.phone_number}</div>
                </div>

                <div>
                  <div className="font-semibold">Position:</div>
                  <div className="text-white">{employee.position}</div>
                </div>

                {employee.department && (
                  <div>
                    <div className="font-semibold">Department:</div>
                    <div className="text-white">{employee.department}</div>
                  </div>
                )}

                <div>
                  <div className="font-semibold">Status:</div>
                  <div className="text-white">{employee.status}</div>
                </div>
              </div>

              {/* <Divider className="my-4" /> */}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DetailEmployee;
