import { ManagerDashboardView } from "@/components/dashboard/ManagerDashboardView";
import { RequireRole } from "@/components/dashboard/RequireRole";

export default function ManagerDashboardPage() {
  return (
    <RequireRole allow={["manager", "super_admin"]}>
      <ManagerDashboardView />
    </RequireRole>
  );
}
