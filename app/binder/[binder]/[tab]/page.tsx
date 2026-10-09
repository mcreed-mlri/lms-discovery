import { notFound } from "next/navigation";

import { BinderSectionView } from "@/components/binder-section-view";
import { binders, getBinder, getSectionTab, getSectionTabs } from "@/lib/binder";

export function generateStaticParams() {
  return binders.flatMap((binder) =>
    getSectionTabs(binder).map((tab) => ({ binder: binder.id, tab: tab.id })),
  );
}

export default async function BinderSectionPage({
  params,
}: {
  params: Promise<{ binder: string; tab: string }>;
}) {
  const { binder: binderId, tab } = await params;
  const binder = getBinder(binderId);
  if (!binder || !getSectionTab(binder, tab)) notFound();
  return <BinderSectionView binderId={binderId} tabId={tab} />;
}
