import { notFound } from "next/navigation";

import { PracticeRoomPage } from "@/components/practice-room-page";
import { getDrill, practiceDrills } from "@/lib/practice";

export function generateStaticParams() {
  return practiceDrills.map((drill) => ({
    binder: drill.binderId,
    tab: drill.tabId,
    drill: drill.id,
  }));
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ binder: string; tab: string; drill: string }>;
}) {
  const { binder, tab, drill: drillId } = await params;
  const drill = getDrill(drillId);
  if (!drill || drill.binderId !== binder || drill.tabId !== tab) notFound();
  return <PracticeRoomPage drillId={drill.id} />;
}
