"use client";

import { useMemo, useRef, useState } from "react";
import { Search, Star } from "lucide-react";
import { workspaceApps } from "./fixtures";
import type { WorkspaceAppDefinition, WorkspaceAppKey, WorkspaceHost, WorkspaceTab } from "./types";

interface OpenTab extends WorkspaceTab {
  instanceKey: string;
}

export function BrowserShell({
  host,
  apps = workspaceApps,
  initialAppKey = "mail",
  allowNewTabs = true,
}: {
  host: WorkspaceHost;
  apps?: WorkspaceAppDefinition[];
  initialAppKey?: WorkspaceAppKey;
  allowNewTabs?: boolean;
}) {
  const appByKey = useMemo(() => new Map(apps.map((app) => [app.key, app])), [apps]);
  const initialApp = appByKey.get(initialAppKey) ?? apps[0];
  const [tabs, setTabs] = useState<OpenTab[]>(() => (initialApp ? [toOpenTab(initialApp)] : []));
  const [activeKey, setActiveKey] = useState(tabs[0]?.instanceKey ?? "");
  const newTabCounter = useRef(0);
  const active = tabs.find((tab) => tab.instanceKey === activeKey) ?? tabs[0];
  const activeApp = active ? appByKey.get(active.key) : undefined;
  const ActiveComponent = activeApp?.component;

  const openApp = (app: WorkspaceAppDefinition) => {
    const existing = tabs.find((tab) => tab.key === app.key);
    if (existing) {
      setActiveKey(existing.instanceKey);
      return;
    }
    const next = toOpenTab(app);
    setTabs((current) => [...current, next]);
    setActiveKey(next.instanceKey);
  };

  const openBlankTab = () => {
    if (!allowNewTabs) return;
    const next: OpenTab = {
      instanceKey: `blank-${++newTabCounter.current}`,
      key: "mail",
      label: "New Tab",
      url: "newtab",
      color: "#dadce0",
      icon: Search,
    };
    setTabs((current) => [...current, next]);
    setActiveKey(next.instanceKey);
  };

  const closeTab = (instanceKey: string) => {
    setTabs((current) => {
      const index = current.findIndex((tab) => tab.instanceKey === instanceKey);
      const remaining = current.filter((tab) => tab.instanceKey !== instanceKey);
      if (remaining.length === 0) {
        const fallback = apps[0] ? [toOpenTab(apps[0])] : [];
        setActiveKey(fallback[0]?.instanceKey ?? "");
        return fallback;
      }
      if (activeKey === instanceKey) {
        const nextIndex = Math.min(index, remaining.length - 1);
        setActiveKey(remaining[nextIndex]?.instanceKey ?? "");
      }
      return remaining;
    });
  };

  return (
    <div className="flex min-h-[620px] flex-1 flex-col overflow-hidden rounded-lg border border-[#c7c9cc] bg-[#dee1e6] text-[#202124] shadow-sm">
      <div className="flex items-end bg-[#dee1e6] pl-2 pr-1 pt-1.5">
        <div className="flex min-w-0 flex-1 items-end overflow-x-auto">
          {tabs.map((tab) => (
            <ShellTab
              key={tab.instanceKey}
              tab={tab}
              active={tab.instanceKey === active?.instanceKey}
              canClose={tabs.length > 1}
              onSelect={() => setActiveKey(tab.instanceKey)}
              onClose={() => closeTab(tab.instanceKey)}
            />
          ))}
          <button
            className="mb-[3px] ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[20px] font-light text-[#3c4043] hover:bg-black/10"
            onClick={openBlankTab}
            aria-label="New tab"
            title="New tab"
          >
            +
          </button>
        </div>
        <div className="mb-1 flex gap-1 px-2 text-[#5f6368]">
          <span className="h-3 w-3 rounded-full bg-[#dadce0]" />
          <span className="h-3 w-3 rounded-full bg-[#dadce0]" />
          <span className="h-3 w-3 rounded-full bg-[#dadce0]" />
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white px-2 py-1.5">
        <ToolbarButton label="Back">‹</ToolbarButton>
        <ToolbarButton label="Forward">›</ToolbarButton>
        <ToolbarButton label="Reload">↻</ToolbarButton>
        <div className="flex h-9 flex-1 items-center gap-2 rounded-full bg-[#e9eef6] px-3 text-[14px]">
          {active?.url === "newtab" ? (
            <Search size={16} className="text-[#5f6368]" />
          ) : (
            <LockIcon />
          )}
          <span
            className={`min-w-0 flex-1 truncate ${active?.url === "newtab" ? "text-[#5f6368]" : "text-[#202124]"}`}
          >
            {active?.url === "newtab" ? "Search or type a URL" : active?.url}
          </span>
          {active?.url !== "newtab" && <Star size={16} className="fill-[#f9ab00] text-[#f9ab00]" />}
        </div>
      </div>

      <div className="flex items-center gap-0.5 border-b border-[#dadce0] bg-white px-3 py-[3px]">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.key}
              onClick={() => openApp(app)}
              className={`flex items-center gap-1.5 rounded-md px-2 py-[5px] text-[13px] ${
                active?.key === app.key && active.url !== "newtab"
                  ? "bg-[#e8eaed] text-[#202124]"
                  : "text-[#3c4043] hover:bg-[#f1f3f4]"
              }`}
            >
              <span
                className="flex h-4 w-4 items-center justify-center rounded-[3px] text-white"
                style={{ background: app.color }}
              >
                <Icon size={10} strokeWidth={2.5} />
              </span>
              {app.label}
            </button>
          );
        })}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
        {active?.url === "newtab" ? (
          <NewTab apps={apps} onOpen={openApp} />
        ) : ActiveComponent ? (
          <ActiveComponent host={host} />
        ) : null}
      </div>
    </div>
  );
}

function toOpenTab(app: WorkspaceAppDefinition): OpenTab {
  return { ...app, instanceKey: app.key };
}

function ShellTab({
  tab,
  active,
  canClose,
  onSelect,
  onClose,
}: {
  tab: OpenTab;
  active: boolean;
  canClose: boolean;
  onSelect: () => void;
  onClose: () => void;
}) {
  const Icon = tab.icon;
  return (
    <div
      className={`group relative flex h-[34px] min-w-[92px] max-w-[220px] flex-1 items-center ${active ? "z-10" : "z-0"}`}
    >
      <span
        className={`absolute ${active ? "inset-0 rounded-t-[10px] bg-white" : "inset-[3px_2px] rounded-lg group-hover:bg-black/[0.08]"}`}
      />
      <button
        onClick={onSelect}
        title={tab.label}
        className="relative z-10 flex h-full min-w-0 flex-1 items-center gap-2 pl-3 pr-1"
      >
        <span
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] text-white"
          style={{ background: tab.color }}
        >
          <Icon size={11} strokeWidth={2.5} />
        </span>
        <span
          className={`min-w-0 flex-1 truncate text-left text-[13px] ${active ? "text-[#202124]" : "text-[#474747]"}`}
        >
          {tab.label}
        </span>
      </button>
      {canClose && (
        <button
          aria-label={`Close ${tab.label}`}
          onClick={onClose}
          className={`relative z-10 mr-2 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[11px] text-[#5f6368] hover:bg-black/10 ${
            active ? "opacity-70" : "opacity-0 group-hover:opacity-70"
          }`}
        >
          x
        </button>
      )}
    </div>
  );
}

function ToolbarButton({ label, children }: { label: string; children: string }) {
  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-full text-[20px] text-[#5f6368] hover:bg-black/[0.06]"
      aria-label={label}
    >
      {children}
    </button>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#188038" className="shrink-0" aria-hidden>
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}

function NewTab({
  apps,
  onOpen,
}: {
  apps: WorkspaceAppDefinition[];
  onOpen: (app: WorkspaceAppDefinition) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center bg-white pt-[12vh]">
      <div className="select-none text-[64px] font-medium leading-none">
        <span className="text-[#4285f4]">W</span>
        <span className="text-[#ea4335]">o</span>
        <span className="text-[#fbbc05]">r</span>
        <span className="text-[#4285f4]">k</span>
      </div>
      <div className="mt-8 flex w-[min(584px,92%)] items-center gap-3 rounded-full bg-white px-5 py-[13px] text-[16px] text-[#5f6368] shadow-[0_1px_6px_rgba(32,33,36,0.28)]">
        <Search size={20} className="shrink-0 text-[#9aa0a6]" />
        Search or type a URL
      </div>
      <div className="mt-8 grid grid-cols-4 gap-4">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.key}
              onClick={() => onOpen(app)}
              className="flex w-20 flex-col items-center gap-2 rounded-lg p-2 text-[12px] text-[#3c4043] hover:bg-[#f1f3f4]"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                style={{ background: app.color }}
              >
                <Icon size={20} />
              </span>
              {app.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
