import { redirect } from "next/navigation";

export default function DashboardAdminRedirect() {
  redirect("/my-learning/admin");
}
