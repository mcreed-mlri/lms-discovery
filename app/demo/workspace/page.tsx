"use client";

import { useState } from "react";
import {
  BrowserShell,
  defaultWorkspaceHost,
  type WorkspaceCompletion,
} from "@/components/workspace";

/**
 * Demo harness for the exportable workspace kit.
 *
 * Proves the kit renders inside learning-hub and shows the two adapter
 * hooks firing. `onComplete` is the scoring hook - in a real scenario it
 * would advance the learner and record progress; here it just logs so we
 * can see the contract working.
 */
export default function WorkspaceDemoPage() {
  const [events, setEvents] = useState<string[]>([]);

  const log = (line: string) => setEvents((prev) => [line, ...prev].slice(0, 8));

  return (
    <div className="flex h-screen min-h-0 flex-col bg-slate-900">
      <header className="shrink-0 px-5 py-3">
        <h1 className="text-[15px] font-semibold text-white">Workspace kit — demo harness</h1>
        <p className="text-[13px] text-slate-400">
          Interactions below fire the WorkspaceHost adapter hooks.
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden px-5">
        <BrowserShell
          host={{
            ...defaultWorkspaceHost,
            userName: "Alex Chen",
            organizationName: "Harborside Legal Aid",
            onNudge: (message: string) => log(`nudge: ${message}`),
            onComplete: (event: WorkspaceCompletion) =>
              log(
                `complete: ${event.appKey} / ${event.action}` +
                  (event.label ? ` / ${event.label}` : ""),
              ),
          }}
        />
      </div>

      <aside className="h-32 shrink-0 overflow-auto px-5 py-3 font-mono text-[12px] text-slate-300">
        <div className="mb-1 text-slate-500">adapter events</div>
        {events.length === 0 ? (
          <div className="text-slate-600">none yet — click around in the apps above</div>
        ) : (
          events.map((e, i) => <div key={i}>{e}</div>)
        )}
      </aside>
    </div>
  );
}
