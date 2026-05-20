import { AdminDashboardView } from "@/components/dashboard/AdminDashboardView";
import { RequireRole } from "@/components/dashboard/RequireRole";

export default function AdminDashboardPage() {
  return (
    <RequireRole allow={["super_admin"]}>
      <AdminDashboardView />
    </RequireRole>
  );
}
