import { notFound } from "next/navigation";

import { BinderContentsView } from "@/components/binder-contents-view";
import { binders, getBinder } from "@/lib/binder";

export function generateStaticParams() {
  return binders.map((binder) => ({ binder: binder.id }));
}

export default async function BinderContentsPage({
  params,
}: {
  params: Promise<{ binder: string }>;
}) {
  const { binder } = await params;
  if (!getBinder(binder)) notFound();
  return <BinderContentsView binderId={binder} />;
}
