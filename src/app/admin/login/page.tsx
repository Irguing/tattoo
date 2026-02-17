import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm.client";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return <AdminLoginForm />;
}
