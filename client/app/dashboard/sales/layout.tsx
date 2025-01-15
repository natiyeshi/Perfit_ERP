"use client";

import { useUser, User } from "@/context/userContext";
import DashboardWrapper from "../_components/DashboardWrapper";

export default function Layout({ children }: { children: any }) {
  const { user } = useUser();
  return <DashboardWrapper role="sales" user={user} children={children} />;
}
