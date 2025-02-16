import { USER_ROLE } from "@prisma/client";
import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        _role: USER_ROLE;
      };
    }
  }
}
