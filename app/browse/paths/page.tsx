import type { Metadata } from "next";
import { ExampleLearningPath } from "@/components/path/example-learning-path";
import { StudioShell } from "@/components/studio-shell";
import { learningPathExplanation } from "@/lib/demo-discovery";

export const metadata: Metadata = {
  title: "Learning paths | Learning Hub",
  description: "An example guided learning path for new attorneys building practical legal skills.",
};

export default function BrowsePathsPage() {
  return (
    <StudioShell padded={false}>
      <div className="mx-auto max-w-[1120px] px-4 pb-10 pt-6 sm:px-6 sm:pt-9 lg:px-10 lg:pb-14">
        <p className="section-kicker secondary">Discover</p>
        <h1 className="hero-title mt-1 text-3xl text-[color:var(--ink)] sm:text-4xl">
          Learning paths
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[color:var(--ink-muted)]">
          {learningPathExplanation}
        </p>
        <div className="mt-8">
          <ExampleLearningPath />
        </div>
      </div>
    </StudioShell>
  );
}
