import { DM_Mono, DM_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { LaceDevRoleProvider } from "@/lib/lace-dev-role";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${dmSans.variable} ${dmMono.variable} lace-dashboard-root`}>
      <LaceDevRoleProvider>
        <DashboardShell>{children}</DashboardShell>
      </LaceDevRoleProvider>
    </div>
  );
}
