import Link from "next/link";
import type { Metadata } from "next";

import { ArrowIcon, ClockIcon, PathIcon } from "@/components/icons";
import { StudioShell } from "@/components/studio-shell";
import { getLearningItemUrl, getLearningItems, type LearningItem } from "@/lib/data";
import { intakeToVerdictPath } from "@/lib/mocks/core-curriculum";
import { getSearchMetadata, type SearchAudience } from "@/lib/search-metadata";

export const metadata: Metadata = {
  title: "Paths | Learning Hub",
  description: "Curated learning sequences, grouped by who they're for.",
};

type PathTileData = {
  id: string;
  title: string;
  description: string;
  meta: string;
  href: string;
  badge?: string;
};

const SECTIONS: { audience: SearchAudience; label: string; blurb: string }[] = [
  {
    audience: "New attorneys",
    label: "New attorneys",
    blurb: "Full onboarding, from your first referral through the verdict.",
  },
  {
    audience: "Experienced attorneys",
    label: "Experienced attorneys",
    blurb: "Advanced practice areas beyond the core litigation lifecycle.",
  },
  {
    audience: "Non-attorney staff",
    label: "Non-attorney staff",
    blurb: "Case lifecycle, intake, and research for advocates and paralegals.",
  },
  {
    audience: "Program staff",
    label: "Program staff",
    blurb: "Building and maintaining Learning Hub content.",
  },
];

function isPathItem(item: LearningItem): item is Extract<LearningItem, { type: "PATH" }> {
  return item.type === "PATH";
}

function PathTile({ path }: { path: PathTileData }) {
  return (
    <Link
      href={path.href}
      className="interactive-tile group flex flex-col gap-3 p-4 focus-ring sm:p-5"
    >
      {path.badge ? (
        <p className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[color:var(--brand)]">
          <PathIcon className="h-3.5 w-3.5" />
          {path.badge}
        </p>
      ) : null}
      <div className="min-w-0">
        <h3 className="section-title text-[16px] text-[color:var(--ink)] sm:text-[17px]">
          {path.title}
        </h3>
        <p className="mt-1.5 text-[13px] leading-snug text-[color:var(--ink-muted)] sm:text-[14px]">
          {path.description}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[color:var(--ink-soft)]">
          <ClockIcon className="h-3.5 w-3.5" />
          {path.meta}
        </span>
        <ArrowIcon className="h-4 w-4 text-[color:var(--ink-soft)] transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export default function BrowsePathsPage() {
  const pathItems = getLearningItems().filter(isPathItem);

  const grouped = SECTIONS.map((section) => {
    const tiles: PathTileData[] = pathItems
      .filter((item) => getSearchMetadata(item).audience.includes(section.audience))
      .map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        meta: `${item.level} · ${item.totalDuration}`,
        href: getLearningItemUrl(item),
      }));

    if (section.audience === "New attorneys") {
      tiles.unshift({
        id: intakeToVerdictPath.slug,
        title: intakeToVerdictPath.title,
        description: intakeToVerdictPath.description,
        meta: intakeToVerdictPath.summary,
        href: intakeToVerdictPath.href,
        badge: "Full guided journey",
      });
    }

    return { ...section, tiles };
  }).filter((section) => section.tiles.length > 0);

  return (
    <StudioShell padded={false}>
      <div className="mx-auto max-w-[1120px] px-4 pb-10 pt-6 sm:px-6 sm:pt-9 lg:px-10 lg:pb-14">
        <p className="section-kicker secondary">Discover</p>
        <h1 className="hero-title mt-1 text-3xl text-[color:var(--ink)] sm:text-4xl">Paths</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[color:var(--ink-muted)]">
          Curated sequences through the catalog, grouped by who they&rsquo;re for — whether
          you&rsquo;re brand new, building on years of practice, or supporting the work as staff.
        </p>

        {grouped.map((section) => (
          <div key={section.audience} className="mt-10 sm:mt-12">
            <p className="section-label text-[color:var(--ink-soft)]">{section.label}</p>
            <p className="mt-1 text-[13px] text-[color:var(--ink-muted)]">{section.blurb}</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              {section.tiles.map((tile) => (
                <PathTile key={tile.id} path={tile} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </StudioShell>
  );
}
