"use client";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { IUser } from "@/types/IUser";
import axios from "@/lib/axios";
import { useQuery } from "react-query";
import UpdateRole from "./UpdateRole";

const Users = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const query = useQuery("users", () => axios.get("/users"), {
    onSuccess(data) {
      setUsers(data.data.result);
    },
    onError(err) {
      toast.error("Something went wrong");
    },
  });
  const roles = ["UNKNOWN", "DATA_AGGREGATOR", "SALES_PERSON", "ADMIN"];

  return ( 
    <div className="flex flex-col  px-6 pb-20">
      {query.isLoading ? (
        <div className="mt-10">Loading...</div>
      ) : (
        <div className="w-full">
          {roles.map((role) => (
            <>
              <div className="mt-10 mb-4">{role} Roles</div>
              <div className="flex gap-4 flex-wrap">
                {users.map(
                  (user) =>
                    user.role == role && <User key={user.id} user={user} />
                )}
              </div>
            </>
          ))}
        </div>
      )}
      <Toaster />
    </div>
  );
};

const UsersContainer = () => {
  return <div></div>;
};

const User = ({ user }: { user: IUser }) => {
  return (
    <div className="flex flex-col bg-secondary text-white rounded-lg px-2 py-2 min-w-44">
      <div className="text-xs text-gray-300 ">Full Name</div>
      <div className="capitalize">{user.fullName}</div>
      <div className="text-xs text-gray-300 mt-2">Role</div>
      <div>{user.role}</div>
      <UpdateRole user={user} />
      {/* {user.role == "UNKNOWN" && ( */}
      {/* )} */}
    </div>
  );
};

export default Users;
