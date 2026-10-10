"use client";

import { PracticeRoom } from "@/components/practice-room";
import { StudioShell } from "@/components/studio-shell";
import { getDrill } from "@/lib/practice";

/** Client wrapper: the shell and the room both need the browser. */
export function PracticeRoomPage({ drillId }: { drillId: string }) {
  const drill = getDrill(drillId);
  if (!drill) return null;
  return (
    <StudioShell>
      <PracticeRoom drill={drill} />
    </StudioShell>
  );
}
