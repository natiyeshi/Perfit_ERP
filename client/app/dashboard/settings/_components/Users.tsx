"use client";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { IUser } from "@/types/IUser";

const Users = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:4040/api/v1/users", {
          method: "GET",
          credentials: "include", // Ensures cookies are sent with the request
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error while loading users!");
        }

        const data = await response.json();
        // setUsers(data.result || []);
        console.log(data);
      } catch (err) {
        const error = (err as Error).message ?? "Error while loading users!";
        toast.error(error);
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex gap-4 flex-wrap pt-12 px-6">
      {isLoading
        ? "Loading"
        : users.map((user) => <User key={user.id} user={user} />)}
      <Toaster />
    </div>
  );
};

const User = ({ user }: { user: IUser }) => {
  return (
    <div className="flex flex-col bg-gray-900 rounded-lg px-2 py-2 min-w-44">
      <div className="text-sm text-gray-300">Full Name</div>
      <div>{user.fullName}</div>

      <div className="text-sm text-gray-300 mt-2">Role</div>
      <div>{user.role || "UNKNOWN"}</div>

      <Button className="mt-3">Update Role</Button>
    </div>
  );
};

export default Users;
