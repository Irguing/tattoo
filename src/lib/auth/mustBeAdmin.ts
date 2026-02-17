import { redirect } from "next/navigation";
import { getCurrentAdmin } from "./getCurrentAdmin";

export async function mustBeAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
