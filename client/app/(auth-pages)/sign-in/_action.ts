"use server";

import { cookies } from "next/headers";

export const addTokenToCookie = async (token: string) => {
  (await cookies()).set("token", token);
};
