"use client";

import { useUser, User } from "@/context/userContext";
import DashboardWrapper from "../_components/DashboardWrapper";

export default function Layout({ children }: { children: any }) {
  const { user } = useUser();
  return <DashboardWrapper role="admin" user={user} children={children} />;
}
