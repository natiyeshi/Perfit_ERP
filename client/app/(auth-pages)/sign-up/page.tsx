"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FormMessage, Message } from "@/components/form-message";
import { useState } from "react";

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isLoading, isError, error, mutate, isSuccess } = useMutation(
    (data: any) => axios.post("/auth/sign-up", data),
    {
      onSuccess: () => {
        toast.success("Signed up successfully");
        router.push("/sign-in");
      },
      onError: (err) => {
        // toast.error((err as any).)
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <form method="POST" className="flex flex-col min-w-64 max-w-64 mx-auto">
      <h1 className="text-2xl font-medium">Sign up</h1>
      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <Link className="text-primary font-medium underline" href="/sign-in">
          Sign in
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="name">Your Name</Label>
        <Input
          name="fullName"
          placeholder="John"
          required
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          placeholder="you@example.com"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          minLength={6}
          required
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <Button onClick={handleSubmit} type={"submit"}>
          {isLoading ? "Signing up..." : "Sign up"}
        </Button>
        {isError && (
          <div className="mt-2 text-sm text-red-500">
            {(error as any).response.data.message}
          </div>
        )}
      </div>
    </form>
  );
}
