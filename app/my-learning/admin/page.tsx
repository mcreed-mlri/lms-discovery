import { redirect } from "next/navigation";
import { getBrightspaceManagerUrl } from "@/lib/brightspace-manager";

export default function AdminDashboardPage() {
  redirect(getBrightspaceManagerUrl());
}
