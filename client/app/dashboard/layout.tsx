"use client";
import { useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios"; // Axios setup
import { roleMap, useUser } from "@/context/userContext"; // Custom hook to access context
import Loading from "@/components/custom/loading";

// Function to fetch user data
const fetchUserData = async () => {
  const response = await axios.get("/auth/verify");
  return response.data.result.user; // Adjust this depending on the response structure
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setUser } = useUser(); // Access the context function to set user data
  const { data, isLoading, isError, error } = useQuery("user", fetchUserData, {
    onSuccess: (user) => {
      console.log(user, "__ROLE__");
    },
    staleTime: 1000 * 60 * 10 * 2, // 20 minutes
  });

  useEffect(() => {
    if (data) {
      setUser({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: roleMap[data.role],
      });
    }
  }, [data, setUser]);

  return isLoading ? (
    <div className="w-full h-screen flex">
      <Loading className="m-auto" />
    </div>
  ) : isError ? (
    <div>Error: {(error as any).message}</div>
  ) : (
    <div>
      {/* Render your layout content */}
      {children}
    </div>
  );
}
