"use client";

import type { ComponentType, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type WorkspaceLang = "en" | "es";

export type WorkspaceLocalized<T = string> = Record<WorkspaceLang, T>;

export interface WorkspaceHost {
  lang: WorkspaceLang;
  userName: string;
  organizationName: string;
  onNudge?: (message: string) => void;
  onComplete?: (event: WorkspaceCompletion) => void;
}

export interface WorkspaceCompletion {
  appKey: WorkspaceAppKey;
  action: string;
  label?: string;
}

export type WorkspaceAppKey = "mail" | "drive" | "calendar" | "portal" | "pdf";

export interface WorkspaceTab {
  key: WorkspaceAppKey;
  label: string;
  url: string;
  color: string;
  icon: LucideIcon;
}

export interface WorkspaceAppDefinition extends WorkspaceTab {
  component: ComponentType<WorkspaceAppProps>;
}

export interface WorkspaceAppProps {
  host: WorkspaceHost;
}

export interface MailMessage {
  id: string;
  from: string;
  email: string;
  subject: string;
  time: string;
  body: WorkspaceLocalized<string[]>;
  unread?: boolean;
  attachmentName?: string;
}

export interface DriveFile {
  id: string;
  name: string;
  folder: string;
  owner: string;
  date: string;
  type: "pdf" | "doc" | "sheet";
}

export interface CalendarEvent {
  id: string;
  title: string;
  day: number;
  time: string;
  calendar: "work" | "personal" | "company";
  color: string;
  description?: string;
}

export interface PortalSection {
  key: string;
  label: string;
  icon: LucideIcon;
  render: (host: WorkspaceHost) => ReactNode;
}

interface PdfBase {
  id: string;
  name: string;
  size: string;
  date: string;
}

export interface ReportDoc extends PdfBase {
  kind: "report";
  title: string;
  meta: { label: string; value: string }[];
  sectionHeading: string;
  items: string[];
  signedBy: string;
}

export interface PayStubDoc extends PdfBase {
  kind: "paystub";
  employee: string;
  payPeriod: string;
  payDate: string;
  earnings: { label: string; detail: string; amount: string }[];
  grossPay: string;
  deductions: { label: string; amount: string }[];
  netPay: string;
}

/**
 * A legal document (notice, lease, court form). Flexible enough to cover
 * both a Notice to Vacate and a lease agreement: `intro` carries running
 * prose, `clauses` carries numbered/headed sections.
 */
export interface LegalDoc extends PdfBase {
  kind: "legal";
  /** Overrides the default letterhead so documents can come from any party. */
  letterhead: { org: string; address: string };
  /** Overrides the page footer. */
  footer?: string;
  title: string;
  dateLine?: string;
  meta?: { label: string; value: string }[];
  intro?: string[];
  clauses?: { heading: string; body: string[] }[];
  closing?: string[];
  signedBy?: string;
  /** Small print set apart at the foot of the document body. */
  disclaimer?: string;
}

export type PdfDocument = ReportDoc | PayStubDoc | LegalDoc;
