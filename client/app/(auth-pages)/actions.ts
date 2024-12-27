"use server";

import axios from "@/lib/axios";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";

export const signUpAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const fullName = formData.get("fullName")?.toString();
    const origin = (await headers()).get("origin");
    let redirectDetail = {
        name : "",
        message : "",
        path : "/sign-up",
    }
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
        redirectDetail.name = "success"
        redirectDetail.message = "Thanks for signing up"
        redirectDetail.path = "/sign-in"
        
    } catch (err) {
        console.error("Error response:", (err as any).response?.data.message ?? (err as any).response?.data.message ?? (err as any));
        redirectDetail.name = "error"
        redirectDetail.message = (err as any).response?.data.message ?? (err as any).response?.data.message
    }
    return encodedRedirect(
        redirectDetail.name as "error" | "success",
        redirectDetail.path,
        redirectDetail.message,
    );
};

