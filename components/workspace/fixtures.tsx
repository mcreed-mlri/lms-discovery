"use client";

import {
  Banknote,
  CalendarDays,
  Clock,
  FileText,
  FolderOpen,
  Mail,
  Table2,
  Users,
} from "lucide-react";
import { CalendarApp } from "./apps/CalendarApp";
import { DriveApp } from "./apps/DriveApp";
import { MailApp } from "./apps/MailApp";
import { PortalApp } from "./apps/PortalApp";
import { PdfReaderApp } from "./apps/PdfReaderApp";
import type {
  CalendarEvent,
  DriveFile,
  MailMessage,
  PdfDocument,
  PortalSection,
  WorkspaceAppDefinition,
  WorkspaceHost,
} from "./types";

export const workspaceApps: WorkspaceAppDefinition[] = [
  {
    key: "mail",
    label: "Mail",
    url: "mail.workplace.local",
    color: "#ea4335",
    icon: Mail,
    component: MailApp,
  },
  {
    key: "drive",
    label: "Drive",
    url: "drive.workplace.local",
    color: "#fbbc04",
    icon: FolderOpen,
    component: DriveApp,
  },
  {
    key: "calendar",
    label: "Calendar",
    url: "calendar.workplace.local",
    color: "#34a853",
    icon: CalendarDays,
    component: CalendarApp,
  },
  {
    key: "portal",
    label: "Portal",
    url: "portal.workplace.local",
    color: "#8430ce",
    icon: Table2,
    component: PortalApp,
  },
  {
    key: "pdf",
    label: "PDF Reader",
    url: "downloads.workplace.local",
    color: "#ea4335",
    icon: FileText,
    component: PdfReaderApp,
  },
];

export const mailMessages: MailMessage[] = [
  {
    id: "client-notice",
    from: "Client",
    email: "client@example.org",
    subject: "Notice from my landlord",
    time: "9:14 AM",
    unread: true,
    attachmentName: "Document from Client.pdf",
    body: {
      en: [
        "Hi, I need some help.",
        "I just got a notice from my landlord. He says I have to move out by the end of the month. He said he is renovating and moving in.",
        "He gave me this yesterday. I am attaching it here.",
      ],
      es: [
        "Hola, necesito ayuda.",
        "Acabo de recibir un aviso de mi arrendador. Dice que tengo que mudarme antes de fin de mes. Dijo que va a renovar y mudarse.",
        "Me lo dio ayer. Lo adjunto aqui.",
      ],
    },
  },
  {
    id: "client-lease",
    from: "Client",
    email: "client@example.org",
    subject: "Re: Do you have a lease?",
    time: "9:41 AM",
    attachmentName: "Lease.pdf",
    body: {
      en: ["Yes, here it is. It's a one-year lease that started last September."],
      es: ["Si, aqui esta. Es un contrato de un ano que empezo en septiembre pasado."],
    },
  },
  {
    id: "supervisor-checkin",
    from: "Supervising Attorney",
    email: "supervisor@legalaid.local",
    subject: "Intake checklist reminder",
    time: "Yesterday",
    body: {
      en: [
        "Reminder: capture the notice date, the move-out deadline, the stated reason, and the notice type before advising.",
      ],
      es: [
        "Recordatorio: registra la fecha del aviso, el plazo de salida, la razon indicada y el tipo de aviso antes de asesorar.",
      ],
    },
  },
];

export const driveFiles: DriveFile[] = [
  {
    id: "notice",
    name: "Document from Client.pdf",
    folder: "Client Intake",
    owner: "Client",
    date: "May 20",
    type: "pdf",
  },
  {
    id: "lease",
    name: "Lease.pdf",
    folder: "Client Intake",
    owner: "Client",
    date: "Sep 1",
    type: "pdf",
  },
  {
    id: "intake-form",
    name: "intake_form_blank.pdf",
    folder: "Forms",
    owner: "Legal Aid",
    date: "Jan 8",
    type: "pdf",
  },
  {
    id: "notice-guide",
    name: "notice_types_reference.doc",
    folder: "Reference",
    owner: "Legal Aid",
    date: "Mar 2",
    type: "doc",
  },
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: "shift-21",
    title: "Opening shift",
    day: 21,
    time: "7:00 AM",
    calendar: "work",
    color: "#0b8043",
  },
  {
    id: "shift-22",
    title: "Saturday shift",
    day: 22,
    time: "8:00 AM",
    calendar: "work",
    color: "#0b8043",
  },
  {
    id: "lead-huddle",
    title: "Weekly Lead Huddle",
    day: 26,
    time: "9:00 AM",
    calendar: "company",
    color: "#1a73e8",
    description: "A short weekly check-in with the shift leads.",
  },
  {
    id: "appointment",
    title: "School pickup",
    day: 26,
    time: "8:45 AM",
    calendar: "personal",
    color: "#d93025",
  },
];

export const portalSections: PortalSection[] = [
  {
    key: "schedule",
    label: "Schedule",
    icon: CalendarDays,
    render: (host: WorkspaceHost) => (
      <div className="grid gap-2">
        {[
          "Mon Aug 24 - 7:00 AM to 3:00 PM",
          "Tue Aug 25 - 7:00 AM to 3:00 PM",
          "Wed Aug 26 - Off",
          "Thu Aug 27 - 10:00 AM to 6:00 PM",
        ].map((shift) => (
          <div
            key={shift}
            className="rounded-lg border border-[#dadce0] bg-white px-4 py-3 text-[14px] text-[#202124]"
          >
            {shift}
          </div>
        ))}
        <p className="text-[13px] text-[#5f6368]">
          {host.lang === "en"
            ? "Use this section when another app asks you to check your shifts."
            : "Usa esta seccion cuando otra app te pida revisar tus turnos."}
        </p>
      </div>
    ),
  },
  {
    key: "timeclock",
    label: "Time Clock",
    icon: Clock,
    render: () => (
      <div className="max-w-[360px] rounded-xl border border-[#dadce0] bg-white p-5">
        <div className="text-[13px] text-[#5f6368]">Current shift</div>
        <div className="mt-1 text-[28px] font-medium text-[#202124]">7:00 AM - 3:00 PM</div>
        <button className="mt-5 h-10 rounded-full bg-[#1a73e8] px-5 text-[14px] font-medium text-white">
          Clock in
        </button>
      </div>
    ),
  },
  {
    key: "paystubs",
    label: "Pay Stubs",
    icon: Banknote,
    render: () => (
      <div className="overflow-hidden rounded-xl border border-[#dadce0] bg-white">
        {["Aug 30, 2026", "Aug 16, 2026", "Aug 2, 2026"].map((date) => (
          <button
            key={date}
            className="flex w-full items-center justify-between border-b border-[#eef0f3] px-4 py-3 text-left last:border-b-0"
          >
            <span className="text-[14px] text-[#202124]">{date}</span>
            <span className="text-[13px] text-[#1a73e8]">View PDF</span>
          </button>
        ))}
      </div>
    ),
  },
  {
    key: "team",
    label: "Team",
    icon: Users,
    render: () => (
      <div className="grid gap-3 sm:grid-cols-2">
        {["Maria Delgado - Manager", "Jordan Kim - New hire", "Darnell Price - Lead"].map(
          (person) => (
            <div
              key={person}
              className="rounded-xl border border-[#dadce0] bg-white p-4 text-[14px] text-[#202124]"
            >
              {person}
            </div>
          ),
        )}
      </div>
    ),
  },
];

/**
 * Storyboard frames 04 and 07: the notice the client received, and the
 * lease that answers the open questions in the case notes.
 *
 * PLACEHOLDER LEGAL CONTENT. Dates, amounts, and notice requirements are
 * illustrative only and must be reviewed by an attorney before this is
 * used with learners.
 */
export const pdfDocuments: PdfDocument[] = [
  {
    kind: "legal",
    id: "notice-to-vacate",
    name: "Document from Client.pdf",
    size: "142 KB",
    date: "May 20, 2024",
    letterhead: {
      org: "HARBOR PROPERTY MANAGEMENT",
      address: "88 Wharf Road - Harborside",
    },
    footer: "Notice to Vacate - Harbor Property Management",
    title: "Notice to Vacate",
    dateLine: "Date: May 20, 2024",
    intro: [
      "You are hereby required to vacate the premises located at 123 Harbor Street, Unit 4B, by May 31, 2024.",
    ],
    clauses: [
      {
        heading: "Reason for Notice",
        body: ["Owner intends to renovate and occupy the unit."],
      },
    ],
    signedBy: "Harbor Property Management",
    disclaimer: "This notice is provided in accordance with applicable laws.",
  },
  {
    kind: "legal",
    id: "lease-agreement",
    name: "Lease.pdf",
    size: "318 KB",
    date: "Sep 1, 2023",
    letterhead: {
      org: "HARBOR PROPERTY MANAGEMENT",
      address: "88 Wharf Road - Harborside",
    },
    footer: "Standard Lease Agreement",
    title: "Standard Lease Agreement",
    meta: [
      { label: "Premises", value: "123 Harbor Street, Unit 4B" },
      { label: "Tenant", value: "Client" },
    ],
    clauses: [
      {
        heading: "1. TERM",
        body: [
          "The term of this lease shall begin on September 1, 2023 and end on August 31, 2024.",
        ],
      },
      {
        heading: "2. RENT",
        body: [
          "The tenant agrees to pay rent of $1,450.00 per month, due on the first day of each month.",
        ],
      },
      {
        heading: "3. NOTICE",
        body: [
          "Any notice required under this lease shall be delivered in writing to the address stated above.",
        ],
      },
    ],
    signedBy: "Harbor Property Management",
  },
];

export const defaultWorkspaceHost: WorkspaceHost = {
  lang: "en",
  userName: "Intake Advocate",
  organizationName: "Harborside Legal Aid",
};
