"use server";

import axios from "@/lib/axios";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";

export const signUpAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const fullName = formData.get("fullName")?.toString();
    const origin = (await headers()).get("origin");

    if (!email || !password || !fullName) {
        return encodedRedirect(
            "error",
            "/sign-up",
            "All fields are required",
        );
    }

    try {
        const payload = { email, password, fullName };
        const res = await axios.post("/auth/sign-up", payload, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("Response:", res.data);

        return encodedRedirect(
            "success",
            "/sign-up",
            "Thanks for signing up! Please check your email for a verification link.",
        );
    } catch (err) {
        console.error("Error response:", (err as any).response?.data);
        return encodedRedirect(
            "error",
            "/sign-up",
            (err as any).response?.data.message ?? "Something went wrong. Please try again later.",
        );
    }
};
