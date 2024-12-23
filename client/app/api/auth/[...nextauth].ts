import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, {
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
            // const res = await axios.post("/auth/sign-in'", {
            //   method: "POST",
            //   body: JSON.stringify({
            //     email: credentials.email,
            //     password: credentials.password,
            //   }),
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            // });
            console.log("_____________Signingin___________________")
            console.log(credentials,req)
            // redirect("/sign-in?error=working")
            return null;
            // if (user) {
            //   return user
            // } else {
            //   return null
            // }
          }
        })
      ]
      
  })
}


