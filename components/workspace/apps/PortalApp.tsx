"use client";

import { useState } from "react";
import { portalSections } from "../fixtures";
import type { WorkspaceAppProps } from "../types";

export function PortalApp({ host }: WorkspaceAppProps) {
  const [sectionKey, setSectionKey] = useState(portalSections[0]?.key ?? "");
  const active = portalSections.find((section) => section.key === sectionKey) ?? portalSections[0];
  const ActiveIcon = active?.icon;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-[#f8fafd] text-[15px] text-[#202124]">
      <div className="flex items-center gap-3 border-b border-[#dadce0] bg-white px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8430ce] text-white">
          {ActiveIcon && <ActiveIcon size={16} />}
        </span>
        <span className="text-[15px] font-medium">{host.organizationName} Employee Portal</span>
      </div>
      <div className="flex gap-1 border-b border-[#dadce0] bg-white px-4 pt-2">
        {portalSections.map((section) => (
          <button
            key={section.key}
            onClick={() => setSectionKey(section.key)}
            className={`rounded-t-lg px-4 py-2.5 text-[14px] font-medium ${
              section.key === active?.key
                ? "border-b-2 border-[#8430ce] text-[#8430ce]"
                : "text-[#5f6368] hover:text-[#202124]"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
      <main className="min-h-0 flex-1 overflow-y-auto p-6">{active?.render(host)}</main>
    </div>
  );
}
