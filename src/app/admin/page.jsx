"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLogin from "./components/AdminLogin";
import { getAdminToken, getAdminUser } from "@/lib/adminApi";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getAdminToken();
    const user = getAdminUser();
    if (token && user) {
      router.replace("/admin/overview");
    }
  }, [router]);

  const handleLoginSuccess = () => {
    router.replace("/admin/overview");
  };

  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}
