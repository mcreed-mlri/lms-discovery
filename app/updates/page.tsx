"use client";

import { StudioShell } from "@/components/studio-shell";
import { UpdatesView } from "@/components/updates-view";

export default function UpdatesPage() {
  return (
    <StudioShell padded={false}>
      <UpdatesView />
    </StudioShell>
  );
}
