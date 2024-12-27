"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useMutation } from "react-query";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { addTokenToCookie } from "./_action";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { isLoading, isError, error, mutate } = useMutation(
    () =>
      axios.post("/auth/sign-in", formData, {
        withCredentials: false,
      }),
    {
      onSuccess: (res) => {
        console.log({ res });
        const token = res.data.result.token;
        addTokenToCookie(token).then(() => {
          // Setting cookie header takes time
          setTimeout(() => {
            router.replace("/dashboard");
            toast.success("Signed in successfully");
          }, 400);
        });
        // Cookies.set("token", token, {
        //   expires: 7, // Expires in 7 days
        //   secure: process.env.NODE_ENV === "production", // Secure cookie in production
        // });
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 mt-4">
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
        <Button type={"submit"} disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
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
