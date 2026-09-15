import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PathJourney } from "@/components/path/path-journey";
import { StudioShell } from "@/components/studio-shell";
import { getMockPath } from "@/lib/mocks/core-curriculum";

type PathPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [{ slug: "intake-to-verdict" }];
}

export async function generateMetadata({ params }: PathPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = getMockPath(slug);
  if (!path) return { title: "Path not found | Learning Hub" };
  return {
    title: `${path.title} | Learning Hub`,
    description: path.description,
  };
}

export default async function BrowsePathPage({ params }: PathPageProps) {
  const { slug } = await params;
  const path = getMockPath(slug);
  if (!path) notFound();

  return (
    <StudioShell padded={false}>
      <PathJourney path={path} />
    </StudioShell>
  );
}
