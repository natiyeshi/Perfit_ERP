// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface boxInf {
//   name: string;
//   disabled?: boolean;
//   loading?: boolean;
//   values: string[];
// }

// const SelectBox = () => {
//   return (
//     <div className="flex flex-col space-y-2 w-full">
//       <Label htmlFor="competitorId">Competitor Name</Label>
//       <Select
//         disabled={disabled}
//         onValueChange={(value: string) => setFieldValue("competitorId", value)}
//       >
//         <SelectTrigger className="w-full">
//           <SelectValue placeholder={` ${disabled ? "Loading..." : "Select"}`} />
//         </SelectTrigger>
//         <SelectContent>
//           {competitors.map((pr) => {
//             return <SelectItem value={pr.id}>{pr.name}</SelectItem>;
//           })}
//         </SelectContent>
//       </Select>
//       <ErrorMessage
//         name="productId"
//         component="p"
//         className="text-sm text-red-500"
//       />
//     </div>
//   );
// };
