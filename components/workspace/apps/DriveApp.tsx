"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Folder, Home, Plus, Search, Users } from "lucide-react";
import { driveFiles } from "../fixtures";
import type { DriveFile, WorkspaceAppProps } from "../types";

const folders = ["Schedules", "Forms", "Manager Memos"];

export function DriveApp({ host }: WorkspaceAppProps) {
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState<string | null>(null);
  const [selected, setSelected] = useState<DriveFile | null>(null);
  const c = copy[host.lang];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return driveFiles.filter((file) => {
      if (folder && file.folder !== folder) return false;
      if (normalized && !file.name.toLowerCase().includes(normalized)) return false;
      return true;
    });
  }, [folder, query]);

  const share = (access: "view" | "edit") => {
    if (!selected) return;
    host.onComplete?.({ appKey: "drive", action: `share-${access}`, label: selected.name });
    setSelected(null);
  };

  return (
    <div
      className="flex h-full min-h-0 flex-1 flex-col bg-white text-[14px] text-[#1f1f1f]"
      style={{ fontFamily: "Roboto, Arial, sans-serif" }}
    >
      <div className="flex items-center gap-3 px-3 py-2">
        <DriveMark />
        <span className="w-[190px] shrink-0 text-[22px] font-normal text-[#5f6368]">Drive</span>
        <div className="flex h-12 flex-1 items-center gap-3 rounded-full bg-[#e9eef6] px-4 text-[#444746]">
          <Search size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={c.search}
            className="h-full w-full bg-transparent text-[16px] outline-none placeholder:text-[#444746]"
          />
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[220px] shrink-0 flex-col gap-0.5 px-3 pt-1">
          <button
            onClick={() => host.onNudge?.(c.notAvailable)}
            className="mb-3 flex h-14 items-center gap-3 rounded-2xl bg-white px-4 text-[14px] font-medium shadow-sm ring-1 ring-[#dadce0]"
          >
            <Plus size={20} />
            {c.new}
          </button>
          <NavButton
            active={!folder}
            icon={<Home size={18} />}
            label={c.home}
            onClick={() => setFolder(null)}
          />
          <NavButton
            active={false}
            icon={<Folder size={18} />}
            label={c.myDrive}
            onClick={() => host.onNudge?.(c.useShared)}
          />
          <NavButton
            active={Boolean(folder)}
            icon={<Users size={18} />}
            label={c.shared}
            onClick={() => setFolder(null)}
          />
        </aside>
        <main className="relative min-w-0 flex-1 overflow-y-auto px-4 pb-6 pt-2">
          <h2 className="mb-3 mt-2 text-[16px] font-medium">{c.folders}</h2>
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {folders.map((name) => (
              <button
                key={name}
                onClick={() => setFolder(name)}
                className="flex items-center gap-3 rounded-xl bg-[#f0f4f9] px-4 py-3 text-left hover:bg-[#e8eaed]"
              >
                <Folder size={20} className="text-[#5f6368]" />
                <span className="truncate text-[14px] font-medium">{name}</span>
              </button>
            ))}
          </div>
          <FileTable files={filtered} onSelect={setSelected} emptyLabel={c.empty} />
          {selected && (
            <ShareDialog
              file={selected}
              labels={c}
              onCancel={() => setSelected(null)}
              onShare={share}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function FileTable({
  files,
  onSelect,
  emptyLabel,
}: {
  files: DriveFile[];
  onSelect: (file: DriveFile) => void;
  emptyLabel: string;
}) {
  return (
    <div>
      <div className="grid grid-cols-[1fr_140px_88px] gap-2 border-b border-[#e0e3e8] px-3 py-2 text-[12px] font-medium text-[#444746]">
        <span>Name</span>
        <span>Owner</span>
        <span className="text-right">Date</span>
      </div>
      {files.map((file) => (
        <button
          key={file.id}
          onClick={() => onSelect(file)}
          className="grid w-full grid-cols-[1fr_140px_88px] items-center gap-2 rounded-xl px-3 py-2.5 text-left hover:bg-[#f1f3f4]"
        >
          <span className="flex min-w-0 items-center gap-3">
            <FileType type={file.type} />
            <span className="truncate text-[14px]">{file.name}</span>
          </span>
          <span className="truncate text-[13px] text-[#444746]">{file.owner}</span>
          <span className="text-right text-[13px] text-[#444746]">{file.date}</span>
        </button>
      ))}
      {files.length === 0 && <p className="px-3 py-8 text-[14px] text-[#5f6368]">{emptyLabel}</p>}
    </div>
  );
}

function ShareDialog({
  file,
  labels,
  onCancel,
  onShare,
}: {
  file: DriveFile;
  labels: ShareDialogLabels;
  onCancel: () => void;
  onShare: (access: "view" | "edit") => void;
}) {
  return (
    <div className="absolute inset-0 z-10 flex items-start justify-center bg-black/32 pt-16">
      <div className="w-[min(100%-2rem,420px)] rounded-3xl bg-white p-6 shadow-[0_4px_8px_3px_rgba(60,64,67,.15)]">
        <h2 className="mb-2 text-[22px] font-normal">{labels.share}</h2>
        <p className="mb-4 text-[13px] text-[#444746]">{file.name}</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onShare("view")}
            className="flex min-h-[44px] items-center justify-between rounded-lg border border-[#dadce0] px-3 text-left text-[14px] hover:bg-[#f8f9fa]"
          >
            <span>{labels.canView}</span>
            <span className="text-[12px] text-[#5f6368]">Viewer</span>
          </button>
          <button
            onClick={() => onShare("edit")}
            className="flex min-h-[44px] items-center justify-between rounded-lg border border-[#dadce0] px-3 text-left text-[14px] hover:bg-[#f8f9fa]"
          >
            <span>{labels.canEdit}</span>
            <span className="text-[12px] text-[#5f6368]">Editor</span>
          </button>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onCancel}
            className="h-10 rounded-full px-4 text-[14px] font-medium text-[#0b57d0] hover:bg-[#f2f6fc]"
          >
            {labels.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}

function FileType({ type }: { type: DriveFile["type"] }) {
  const label = type.toUpperCase();
  const color = type === "pdf" ? "#ea4335" : type === "sheet" ? "#0f9d58" : "#4285f4";
  return (
    <span
      className="flex h-6 w-8 shrink-0 items-center justify-center rounded-[2px] text-[8px] font-bold text-white"
      style={{ background: color }}
    >
      {label}
    </span>
  );
}

function NavButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 items-center gap-3 rounded-full px-4 text-[14px] ${active ? "bg-[#c2e7ff] font-medium text-[#041e49]" : "text-[#444746] hover:bg-[#e8eaed]"}`}
    >
      {icon}
      {label}
    </button>
  );
}

function DriveMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
      <path fill="#0f9d58" d="M1.5 21 8.25 21 15.5 8 8.75 8z" />
      <path fill="#4285f4" d="M15.5 8 22.5 21 15.75 21 8.75 8z" />
      <path fill="#fbbc04" d="M8.25 21 15.75 21 12 14.5z" />
    </svg>
  );
}

const copy = {
  en: {
    search: "Search files...",
    new: "New",
    home: "Home",
    myDrive: "My Drive",
    shared: "Shared with me",
    folders: "Folders",
    empty: "No files match.",
    share: "Share",
    canView: "Can view",
    canEdit: "Can edit",
    cancel: "Cancel",
    notAvailable: "Creating files is not part of this export demo.",
    useShared: "Open a shared folder or search for a file.",
  },
  es: {
    search: "Buscar archivos...",
    new: "Nuevo",
    home: "Inicio",
    myDrive: "Mi unidad",
    shared: "Compartido conmigo",
    folders: "Carpetas",
    empty: "No hay archivos que coincidan.",
    share: "Compartir",
    canView: "Puede ver",
    canEdit: "Puede editar",
    cancel: "Cancelar",
    notAvailable: "Crear archivos no es parte de esta demo exportada.",
    useShared: "Abre una carpeta compartida o busca un archivo.",
  },
} as const;

type ShareDialogLabels = {
  share: string;
  canView: string;
  canEdit: string;
  cancel: string;
};
