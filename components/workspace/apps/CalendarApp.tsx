"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { calendarEvents } from "../fixtures";
import type { CalendarEvent, WorkspaceAppProps } from "../types";

const monthCells = [
  { day: 26, other: true },
  { day: 27, other: true },
  { day: 28, other: true },
  { day: 29, other: true },
  { day: 30, other: true },
  { day: 31, other: true },
  ...Array.from({ length: 31 }, (_, index) => ({ day: index + 1, other: false })),
  { day: 1, other: true },
  { day: 2, other: true },
  { day: 3, other: true },
  { day: 4, other: true },
  { day: 5, other: true },
];

export function CalendarApp({ host }: WorkspaceAppProps) {
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const c = copy[host.lang];

  return (
    <div
      className="flex h-full min-h-0 flex-1 flex-col bg-white text-[14px] text-[#3c4043]"
      style={{ fontFamily: "Roboto, Arial, sans-serif" }}
    >
      <div className="flex items-center gap-3 px-3 py-2">
        <CalendarMark />
        <span className="w-[190px] shrink-0 text-[22px] font-normal text-[#5f6368]">
          {c.calendar}
        </span>
        <div className="flex h-12 flex-1 items-center gap-3 rounded-full bg-[#e9eef6] px-4 text-[#444746]">
          <Search size={20} />
          <span className="text-[16px]">{c.search}</span>
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1">
        <aside className="flex w-[220px] shrink-0 flex-col gap-4 px-3 pt-1">
          <button
            onClick={() => host.onNudge?.(c.createLater)}
            className="flex h-14 items-center gap-3 rounded-2xl bg-white px-4 text-[14px] font-medium shadow-sm ring-1 ring-[#dadce0]"
          >
            <span className="text-[22px] leading-none text-[#c5221f]">+</span>
            {c.create}
          </button>
          <MiniMonth labels={c.weekdays} />
          <div>
            <div className="mb-1 px-2 text-[12px] font-medium text-[#5f6368]">{c.myCalendars}</div>
            <CalCheck color="#1a73e8" label={host.userName} />
            <CalCheck color="#0b8043" label={c.workShifts} />
            <CalCheck color="#8e24aa" label={host.organizationName} />
          </div>
        </aside>
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2 px-2 py-1">
            <button
              onClick={() => host.onNudge?.(c.todayOnly)}
              className="inline-flex h-9 items-center rounded-full border border-[#dadce0] px-4 text-[14px] font-medium hover:bg-[#f8f9fa]"
            >
              {c.today}
            </button>
            <h1 className="text-[22px] font-normal text-[#3c4043]">{c.month}</h1>
            <div className="flex-1" />
            <div className="flex items-center rounded-lg border border-[#dadce0] text-[13px]">
              {[c.day, c.week, c.monthView].map((label, index) => (
                <button
                  key={label}
                  className={`h-8 px-3 ${index === 2 ? "bg-[#e8f0fe] font-medium text-[#1967d2]" : "hover:bg-[#f1f3f4]"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-7 border-t border-[#dadce0] text-center text-[11px] font-medium text-[#70757a]">
            {c.weekdays.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
            {monthCells.map((cell, index) => {
              const events = cell.other
                ? []
                : calendarEvents.filter((event) => event.day === cell.day);
              return (
                <div
                  key={index}
                  className="flex flex-col gap-0.5 border-b border-r border-[#dadce0] p-1"
                >
                  <span
                    className={`self-center flex h-6 w-6 items-center justify-center rounded-full text-[12px] ${cell.day === 21 && !cell.other ? "bg-[#1a73e8] font-medium text-white" : cell.other ? "text-[#bdc1c6]" : "text-[#3c4043]"}`}
                  >
                    {cell.day}
                  </span>
                  {events.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelected(event)}
                      className="truncate rounded px-1 py-0.5 text-left text-[11px] font-medium text-white"
                      style={{ background: event.color }}
                    >
                      {event.time} {event.title}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </main>
        {selected && (
          <EventDialog
            event={selected}
            closeLabel={c.close}
            onClose={() => setSelected(null)}
            onComplete={() =>
              host.onComplete?.({ appKey: "calendar", action: "open-event", label: selected.title })
            }
          />
        )}
      </div>
    </div>
  );
}

function EventDialog({
  event,
  closeLabel,
  onClose,
  onComplete,
}: {
  event: CalendarEvent;
  closeLabel: string;
  onClose: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="absolute inset-0 z-10 flex items-start justify-center bg-black/20 pt-16">
      <div className="w-[min(100%-2rem,420px)] overflow-hidden rounded-3xl bg-white shadow-[0_4px_8px_3px_rgba(60,64,67,.15)]">
        <div className="h-2" style={{ background: event.color }} />
        <div className="px-6 pb-5 pt-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h2 className="text-[22px] font-normal">{event.title}</h2>
            <button
              onClick={onClose}
              aria-label={closeLabel}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#5f6368] hover:bg-[#f1f3f4]"
            >
              x
            </button>
          </div>
          <p>{`Aug ${event.day}, 2026 - ${event.time}`}</p>
          {event.description && <p className="mt-3 leading-relaxed">{event.description}</p>}
          <button
            onClick={onComplete}
            className="mt-4 rounded-full bg-[#1a73e8] px-4 py-2 text-[13px] font-medium text-white"
          >
            Mark reviewed
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniMonth({ labels }: { labels: readonly string[] }) {
  return (
    <div>
      <div className="mb-1 px-2 text-[12px] font-medium text-[#5f6368]">August 2026</div>
      <div className="grid grid-cols-7 text-center text-[10px] text-[#70757a]">
        {labels.map((day) => (
          <div key={day}>{day[0]}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center text-[11px]">
        {monthCells.slice(0, 42).map((cell, index) => (
          <span key={index} className={`py-1 ${cell.other ? "text-[#bdc1c6]" : "text-[#3c4043]"}`}>
            {cell.day}
          </span>
        ))}
      </div>
    </div>
  );
}

function CalendarMark() {
  return (
    <span className="flex h-8 w-8 flex-col overflow-hidden rounded-[6px] border border-[#dadce0] bg-white shadow-sm">
      <span className="h-2 bg-[#ea4335]" />
      <span className="flex flex-1 items-center justify-center text-[13px] font-medium leading-none text-[#3c4043]">
        31
      </span>
    </span>
  );
}

function CalCheck({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-full px-2 py-1.5 text-[13px]">
      <span className="h-4 w-4 rounded-[2px]" style={{ background: color }} />
      {label}
    </div>
  );
}

const copy = {
  en: {
    calendar: "Calendar",
    search: "Search for people",
    create: "Create",
    createLater: "Creating new events is available in the host app when wired.",
    todayOnly: "This fixture is set to August 2026.",
    today: "Today",
    month: "August 2026",
    day: "Day",
    week: "Week",
    monthView: "Month",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    myCalendars: "My calendars",
    workShifts: "Work shifts",
    close: "Close",
  },
  es: {
    calendar: "Calendario",
    search: "Buscar personas",
    create: "Crear",
    createLater: "Crear eventos nuevos esta disponible cuando la app anfitriona lo conecte.",
    todayOnly: "Esta demo esta configurada para agosto de 2026.",
    today: "Hoy",
    month: "Agosto de 2026",
    day: "Dia",
    week: "Semana",
    monthView: "Mes",
    weekdays: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    myCalendars: "Mis calendarios",
    workShifts: "Turnos",
    close: "Cerrar",
  },
} as const;
