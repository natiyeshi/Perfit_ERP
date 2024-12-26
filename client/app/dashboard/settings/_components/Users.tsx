"use client";
import { Button } from "@/components/ui/button";
import { useQueries } from "react-query";
import axios from "@/lib/axios";
import { useMutation, useQuery } from "react-query";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { IUser } from "@/types/IUser";

const Users = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  const query = useQuery(
    "users",
    () => axios.get("/users", { withCredentials: true }),
    {
      onSuccess(res) {
        setUsers(res.data.result || []);
      },
      onError(err) {
        const error =
          (err as any).response.data.message ?? "Error while loading users!";
        toast.error(error);
      },
    }
  );
  return (
    <div className="flex gap-4 flex-wrap pt-12 px-6">
      {query.isLoading
        ? "Loading"
        : users.map((user) => <User key={user.id} />)}
    </div>
  );
};

const User = () => {
  return (
    <div className="flex flex-col bg-gray-900 rounded-lg px-2 py-2 min-w-44">
      <div className="text-sm text-gray-300">Full Name</div>
      <div>Full Name</div>

      <div className="text-sm text-gray-300 mt-2">Role</div>
      <div>UNKNOWN</div>

      <Button className="mt-3">Update Role</Button>
    </div>
  );
};

export default Users;
