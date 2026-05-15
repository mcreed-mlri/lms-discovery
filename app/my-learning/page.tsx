"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowIcon, BookIcon, HomeIcon, SearchIcon } from "@/components/icons";
import { ContentCard, ContentListRow, PathCard } from "@/components/content-card";
import { DetailModal } from "@/components/detail-modal";
import { continueLearning, courses, getLearningItems, modules, type LearningItem } from "@/lib/data";
import { getSavedItemKey, useSavedLearning } from "@/lib/saved-learning";
import { useAuth } from "@/lib/auth";

function SavedSection({
  title,
  eyebrow,
  items,
  onOpen,
}: {
  title: string;
  eyebrow: string;
  items: LearningItem[];
  onOpen: (item: LearningItem) => void;
}) {
  if (items.length === 0) return null;

  return (
    <section className="mt-9">
      <div className="mb-4 flex items-end justify-between gap-4 border-b border-[color:var(--border-subtle)] pb-3">
        <div>
          <p className="section-kicker secondary">{eyebrow}</p>
          <h2 className="section-title mt-1 text-xl leading-tight text-[#25221d]">{title}</h2>
        </div>
        <p className="metadata rounded-full border border-[color:var(--border-subtle)] bg-[#fffdf7] px-2.5 py-1 text-[#706a5f]">
          {items.length} saved
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) =>
          item.type === "PATH" ? (
            <PathCard key={getSavedItemKey(item)} item={item} onOpen={onOpen} />
          ) : (
            <ContentCard key={getSavedItemKey(item)} item={item} onOpen={onOpen} />
          ),
        )}
      </div>
    </section>
  );
}

export default function MyLearningPage() {
  const { user, logout } = useAuth();
  const savedLearning = useSavedLearning();
  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);

  const allItems = useMemo(() => getLearningItems(), []);
  const savedItems = useMemo(
    () => allItems.filter((item) => savedLearning.savedKeySet.has(getSavedItemKey(item))),
    [allItems, savedLearning.savedKeySet],
  );

  const savedPaths = savedItems.filter((item) => item.type === "PATH");
  const savedCourses = savedItems.filter((item) => item.type === "COURSE");
  const savedModules = savedItems.filter((item) => item.type === "MODULE");

  const progressSummary = {
    completedCourses: 1,
    totalCourses: courses.length,
    completedModules: 4,
    totalModules: modules.length,
    hoursThisMonth: 6.5,
  };

  if (!user) return null;

  return (
    <div className="hub-shell min-h-screen pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-[color:var(--border-subtle)] bg-[color:var(--bg-surface-soft)]/92 text-[color:var(--ink)] shadow-[0_8px_26px_rgba(40,32,20,0.055)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[4.75rem] max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-fit items-center gap-3 rounded-md focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" aria-label="LACE Learning Hub home">
            <span className="leading-none">
              <span className="block text-[1.85rem] font-normal tracking-[-0.055em]">LACE</span>
              <span className="nav-label mt-1 block text-[#786f62]">Learning Hub</span>
            </span>
          </Link>

          <nav className="nav-label ml-auto hidden items-center gap-5 text-[#3a352d] md:flex" aria-label="Account">
            <Link className="rounded-md transition hover:text-[#9d7a35] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" href="/">
              Library
            </Link>
            <span className="text-[#9d7a35]">My Learning</span>
            <div className="flex items-center gap-3 border-l border-[color:var(--lace-hairline)] pl-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f1d19] text-xs font-bold text-[#fffaf0]">
                {user.initials}
              </div>
              <button onClick={logout} className="text-[#706a5f] transition hover:text-[#1f1d19] focus:outline-none" aria-label={`Sign out ${user.firstName}`}>
                Sign out
              </button>
            </div>
          </nav>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-[4.75rem] z-30 hidden w-44 border-r border-[color:var(--border-subtle)] bg-[color:var(--bg-surface-soft)]/88 shadow-[16px_0_34px_rgba(40,32,20,0.035)] backdrop-blur lg:block">
        <nav className="flex h-full flex-col gap-2 px-3 py-5" aria-label="Primary">
          <Link href="/" className="group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold text-[#5f5a4f] transition hover:bg-[#fffaf0] hover:text-[#171713] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15">
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link href="/#browse" className="group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold text-[#5f5a4f] transition hover:bg-[#fffaf0] hover:text-[#171713] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15">
            <SearchIcon className="h-5 w-5" />
            <span>Browse</span>
          </Link>
          <Link href="/my-learning" className="group relative flex h-11 items-center gap-3 rounded-lg bg-[#e5d7c2] px-3 text-sm font-bold text-[#171713] shadow-[inset_0_0_0_1px_rgba(23,23,19,0.08)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" aria-current="page">
            <BookIcon className="h-5 w-5" />
            <span>My Learning</span>
          </Link>
          <div className="mt-auto border-t border-[color:var(--lace-hairline)] pt-4">
            <p className="text-sm font-bold text-[#25221d]">{user.name}</p>
            <p className="text-xs font-semibold text-[#81786a]">{user.title}</p>
          </div>
        </nav>
      </aside>

      <main className="lg:pl-44">
        <section className="border-b border-[color:var(--border-subtle)]">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-9 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:px-8">
            <div>
              <p className="section-kicker primary">My learning</p>
              <h1 className="hero-title mt-3 max-w-2xl text-[2.35rem] text-[#171713] sm:text-[3rem]">Track progress. Keep your list close.</h1>
              <p className="mt-3 max-w-2xl text-base font-semibold text-[color:var(--lace-muted-strong)]">
                Your current readings, saved courses, and modules to return to when the day gets busy.
              </p>
            </div>
            <div className="editorial-panel rounded-[var(--radius-card)] p-5">
              <p className="section-kicker secondary">Sarah's progress</p>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div>
                  <dd className="text-2xl font-bold text-[#171713]">{progressSummary.completedCourses}/{progressSummary.totalCourses}</dd>
                  <dt className="stat-label text-[#7d7467]">Courses</dt>
                </div>
                <div>
                  <dd className="text-2xl font-bold text-[#171713]">{progressSummary.completedModules}/{progressSummary.totalModules}</dd>
                  <dt className="stat-label text-[#7d7467]">Modules</dt>
                </div>
                <div>
                  <dd className="text-2xl font-bold text-[#171713]">{progressSummary.hoursThisMonth}</dd>
                  <dt className="stat-label text-[#7d7467]">Hours</dt>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {continueLearning.map((item) => (
              <div key={`${item.type}-${item.id}`} className="editorial-card p-5">
                <p className="section-kicker secondary">{item.type === "MODULE" ? "In progress" : "Continue"}</p>
                <h2 className="card-title mt-3 text-lg">{item.title}</h2>
                <p className="mt-2 text-sm font-medium text-[color:var(--ink-muted)]">{item.detail}</p>
                {"progress" in item && (
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e6dccb]">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,#a97824,#c89a3f)]" style={{ width: `${item.progress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {savedItems.length === 0 ? (
            <div className="editorial-panel mt-9 rounded-[var(--radius-card)] p-8 text-center">
              <p className="section-kicker primary">My list</p>
              <h2 className="section-title mt-2 text-2xl text-[#171713]">No saved learning yet</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm font-medium text-[color:var(--ink-muted)]">
                Open any path, course, or module from the library and choose Add to my list. Saved items will appear here for quick return.
              </p>
              <Link href="/#browse" className="mt-6 inline-flex h-11 items-center gap-2 rounded-[var(--radius-control)] bg-[#171713] px-5 text-sm font-bold text-[#fffaf0] shadow-[0_10px_22px_rgba(23,23,19,0.16)]">
                Browse library <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <SavedSection title="Saved Learning Paths" eyebrow="My list" items={savedPaths} onOpen={setSelectedItem} />
              <SavedSection title="Saved Courses" eyebrow="Courses to take" items={savedCourses} onOpen={setSelectedItem} />
              <SavedSection title="Saved Modules" eyebrow="Readings to revisit" items={savedModules} onOpen={setSelectedItem} />
            </>
          )}
        </section>
      </main>

      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isSaved={selectedItem ? savedLearning.isSaved(selectedItem) : false}
        onToggleSaved={savedLearning.toggleSaved}
      />
    </div>
  );
}
