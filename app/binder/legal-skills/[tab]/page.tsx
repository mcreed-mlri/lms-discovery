import { notFound } from "next/navigation";

import { BinderSectionView } from "@/components/binder-section-view";
import { getSectionTab, getSectionTabs } from "@/lib/binder";

export function generateStaticParams() {
  return getSectionTabs().map((tab) => ({ tab: tab.id }));
}

export default async function BinderSectionPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  if (!getSectionTab(tab)) notFound();
  return <BinderSectionView tabId={tab} />;
}
