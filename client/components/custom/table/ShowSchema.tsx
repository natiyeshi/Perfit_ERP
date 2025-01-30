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
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";

interface DisplayProps<T extends Record<string, any>> {
  data: T;
  text: string;
  type?: string;
}
const ShowSchema: any = <T extends Record<string, any>>({
  data,
  text,
  type = "",
}: DisplayProps<T>) => {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div className="text-blue-500 hover:cursor-pointer hover:underline">
          {text}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[95vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex w-full  justify-between">
            <AlertDialogTitle>{type}</AlertDialogTitle>
            <AlertDialogCancel>
              <IoCloseSharp />
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription className="flex flex-col gap-1">
            {Object.entries(data).length == 0 ? (
              <div>Nothing Found</div>
            ) : (
              Object.entries(data).map(([key, value]) => (
                <div className="capitalize border-b pb-1" key={key}>
                  <strong>{key}: </strong>
                  {String(value)}
                </div>
              ))
            )}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ShowSchema;
