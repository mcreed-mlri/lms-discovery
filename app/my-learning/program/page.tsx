import { ProgramDashboardView } from "@/components/dashboard/ProgramDashboardView";
import { RequireRole } from "@/components/dashboard/RequireRole";

export default function ProgramDashboardPage() {
  return (
    <RequireRole allow={["program", "super_admin"]}>
      <ProgramDashboardView />
    </RequireRole>
  );
}
