"use client";

import { useState, type ReactNode } from "react";
import { Download, Minus, Plus, Printer } from "lucide-react";
import { pdfDocuments } from "../fixtures";
import type { PdfDocument, WorkspaceAppProps } from "../types";

const letter = { widthIn: 8.5, heightIn: 11 } as const;

/**
 * `documents` and `initialId` are optional so a scenario step can scope the
 * reader to one document. Omitted, it behaves as before and shows every
 * fixture document - which is what BrowserShell passes.
 */
export function PdfReaderApp({
  host,
  documents,
  initialId,
  initialZoom = 100,
  showSidebar = true,
}: WorkspaceAppProps & {
  documents?: PdfDocument[];
  initialId?: string;
  /** Scenario embeds are narrower than a browser tab, so they start zoomed out. */
  initialZoom?: number;
  /** Hide the Downloads list when the step already scopes to one document. */
  showSidebar?: boolean;
}) {
  const docs = documents ?? pdfDocuments;
  const [activeId, setActiveId] = useState(initialId ?? docs[0]?.id ?? "");
  const [zoom, setZoom] = useState(initialZoom);
  const active = docs.find((doc) => doc.id === activeId) ?? docs[0];
  const scale = zoom / 100;
  const notAvailable = () =>
    host.onNudge?.("This simulated reader only supports viewing fixture documents.");

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-[#eef0f3]">
      <div className="flex min-h-0 flex-1">
        {showSidebar && (
          <aside className="flex w-[260px] shrink-0 flex-col border-r border-[#dadce0] bg-white">
            <div className="px-4 py-3 text-[13px] font-medium text-[#5f6368]">Downloads</div>
            <div className="flex-1 overflow-y-auto">
              {docs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setActiveId(doc.id);
                    host.onComplete?.({
                      appKey: "pdf",
                      action: "open-document",
                      label: doc.name,
                    });
                  }}
                  className={`flex w-full items-center gap-3 border-b border-[#eef0f3] px-4 py-3 text-left ${
                    doc.id === activeId ? "bg-[#fce8e6]" : "hover:bg-[#f8f9fa]"
                  }`}
                >
                  <span className="shrink-0 rounded bg-[#d93025] px-1.5 py-0.5 text-[10px] font-bold text-white">
                    PDF
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] text-[#202124]">{doc.name}</span>
                    <span className="block text-[12px] text-[#5f6368]">
                      {doc.size} - {doc.date}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </aside>
        )}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-center gap-1 border-b border-[#3a3d40] bg-[#323639] px-3 py-1.5">
            <span className="mr-3 truncate text-[13px] text-white/80">{active?.name}</span>
            <button
              onClick={() => setZoom((value) => Math.max(40, value - 10))}
              className="flex h-7 w-7 items-center justify-center rounded text-white/85 hover:bg-white/10"
              aria-label="Zoom out"
            >
              <Minus size={15} />
            </button>
            <span className="w-11 text-center text-[12px] text-white/85">{zoom}%</span>
            <button
              onClick={() => setZoom((value) => Math.min(150, value + 10))}
              className="flex h-7 w-7 items-center justify-center rounded text-white/85 hover:bg-white/10"
              aria-label="Zoom in"
            >
              <Plus size={15} />
            </button>
            <span className="mx-2 h-4 w-px bg-white/20" />
            <span className="text-[12px] text-white/70">Page 1 / 1</span>
            <span className="mx-2 h-4 w-px bg-white/20" />
            <button
              onClick={notAvailable}
              className="flex h-7 w-7 items-center justify-center rounded text-white/85 hover:bg-white/10"
              aria-label="Print"
            >
              <Printer size={15} />
            </button>
            <button
              onClick={notAvailable}
              className="flex h-7 w-7 items-center justify-center rounded text-white/85 hover:bg-white/10"
              aria-label="Download"
            >
              <Download size={15} />
            </button>
          </div>
          <div className="relative min-h-0 flex-1 bg-[#525659]">
            <div className="absolute inset-0 overflow-auto">
              <div className="flex justify-center" style={{ padding: 28, minWidth: "min-content" }}>
                <div
                  className="shrink-0"
                  style={{
                    width: `${letter.widthIn * scale}in`,
                    height: `${letter.heightIn * scale}in`,
                  }}
                >
                  <div
                    className="origin-top-left overflow-hidden bg-white"
                    style={{
                      width: `${letter.widthIn}in`,
                      height: `${letter.heightIn}in`,
                      transform: `scale(${scale})`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.22)",
                    }}
                  >
                    <PdfPage footer={active?.kind === "legal" ? active.footer : undefined}>
                      {active?.kind === "report" ? (
                        <ReportPage doc={active} />
                      ) : active?.kind === "legal" ? (
                        <LegalPage doc={active} />
                      ) : active ? (
                        <PayStubPage doc={active} />
                      ) : null}
                    </PdfPage>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function PdfPage({ children, footer }: { children: ReactNode; footer?: string }) {
  return (
    <div
      className="relative box-border h-full w-full"
      style={{
        padding: "1in 1in 1.15in",
        fontFamily: '"Times New Roman", Times, Georgia, serif',
        fontSize: "12pt",
        lineHeight: 1.35,
        color: "#1a1a1a",
      }}
    >
      {children}
      <div
        className="absolute flex items-center justify-between border-t border-[#1a1a1a]/30 text-[9pt] text-[#444]"
        style={{ left: "1in", right: "1in", bottom: "0.55in", paddingTop: "0.2in" }}
      >
        <span>{footer ?? "Harborside Cafe - Internal"}</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  );
}

function Letterhead({ org, address }: { org?: string; address?: string } = {}) {
  return (
    <div className="mb-[14pt] border-b-[1.5pt] border-[#1a1a1a] pb-[8pt]">
      <div className="text-[16pt] font-bold tracking-[0.14em]">{org ?? "HARBORSIDE CAFE"}</div>
      <div className="mt-[2pt] text-[10pt] tracking-wide text-[#333]">
        {address ?? "142 Main Street - Harborside"}
      </div>
    </div>
  );
}

function LegalPage({ doc }: { doc: Extract<PdfDocument, { kind: "legal" }> }) {
  return (
    <>
      <Letterhead org={doc.letterhead.org} address={doc.letterhead.address} />
      <h1 className="mb-[12pt] text-center text-[15pt] font-bold uppercase tracking-[0.06em]">
        {doc.title}
      </h1>
      {doc.dateLine && <p className="mb-[14pt] text-[11pt]">{doc.dateLine}</p>}
      {doc.meta && doc.meta.length > 0 && (
        <table className="mb-[14pt] w-full border-collapse text-[11pt]">
          <tbody>
            <tr>
              {doc.meta.map((item) => (
                <td
                  key={item.label}
                  className="border border-[#1a1a1a] px-[8pt] py-[6pt] align-top"
                >
                  <div className="text-[9pt] font-bold">{item.label}</div>
                  <div className="mt-[0.1em]">{item.value}</div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
      {doc.intro?.map((para, i) => (
        <p key={`intro-${i}`} className="mb-[10pt] text-[12pt] leading-[1.45]">
          {para}
        </p>
      ))}
      {doc.clauses?.map((clause) => (
        <section key={clause.heading} className="mb-[12pt]">
          <h2 className="mb-[4pt] text-[12pt] font-bold">{clause.heading}</h2>
          {clause.body.map((line, i) => (
            <p key={i} className="mb-[6pt] text-[12pt] leading-[1.45]">
              {line}
            </p>
          ))}
        </section>
      ))}
      {doc.closing?.map((para, i) => (
        <p key={`closing-${i}`} className="mb-[10pt] text-[12pt] leading-[1.45]">
          {para}
        </p>
      ))}
      {doc.signedBy && (
        <p className="mt-[22pt] text-[12pt] leading-relaxed">
          Sincerely,
          <br />
          <span className="italic">{doc.signedBy}</span>
        </p>
      )}
      {doc.disclaimer && (
        <p className="mt-[20pt] text-[9pt] italic leading-[1.35] text-[#555]">{doc.disclaimer}</p>
      )}
    </>
  );
}

function ReportPage({ doc }: { doc: Extract<PdfDocument, { kind: "report" }> }) {
  return (
    <>
      <Letterhead />
      <h1 className="mb-[16pt] text-center text-[16pt] font-bold tracking-wide">{doc.title}</h1>
      <table className="mb-[16pt] w-full border-collapse text-[12pt]">
        <tbody>
          <tr>
            {doc.meta.map((item) => (
              <td key={item.label} className="border border-[#1a1a1a] px-[8pt] py-[6pt] align-top">
                <div className="text-[9pt] font-bold">{item.label}</div>
                <div className="mt-[0.1em]">{item.value}</div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <h2 className="mb-[6pt] text-[12pt] font-bold">{doc.sectionHeading}</h2>
      <ol className="m-0 flex list-decimal flex-col gap-[8pt] pl-[18pt] text-[12pt] leading-[1.35]">
        {doc.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      <p className="mt-[28pt] text-[12pt] leading-relaxed">
        Prepared by
        <br />
        <span className="italic">{doc.signedBy}</span>
      </p>
    </>
  );
}

function PayStubPage({ doc }: { doc: Extract<PdfDocument, { kind: "paystub" }> }) {
  return (
    <>
      <Letterhead />
      <h1 className="mb-[0.7em] text-center text-[1.35em] font-bold tracking-[0.08em]">
        EARNINGS STATEMENT
      </h1>
      <table className="mb-[0.85em] w-full border-collapse text-[1em]">
        <tbody>
          <tr>
            <InfoCell label="Employee" value={doc.employee} />
            <InfoCell label="Pay period" value={doc.payPeriod} />
            <InfoCell label="Pay date" value={doc.payDate} />
          </tr>
        </tbody>
      </table>
      <h2 className="mb-[0.2em] text-[1em] font-bold">Earnings</h2>
      <table className="mb-[0.75em] w-full border-collapse text-[0.95em]">
        <thead>
          <tr className="bg-[#f3f3f3]">
            <th className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-left font-bold">
              Description
            </th>
            <th className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-left font-bold">
              Detail
            </th>
            <th className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-right font-bold">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {doc.earnings.map((earning) => (
            <tr key={earning.label}>
              <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em]">{earning.label}</td>
              <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em]">{earning.detail}</td>
              <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-right tabular-nums">
                {earning.amount}
              </td>
            </tr>
          ))}
          <tr>
            <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] font-bold" colSpan={2}>
              Gross pay
            </td>
            <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-right font-bold tabular-nums">
              {doc.grossPay}
            </td>
          </tr>
        </tbody>
      </table>
      <h2 className="mb-[0.2em] text-[1em] font-bold">Deductions</h2>
      <table className="mb-[0.75em] w-full border-collapse text-[0.95em]">
        <tbody>
          {doc.deductions.map((deduction) => (
            <tr key={deduction.label}>
              <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em]">{deduction.label}</td>
              <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-right tabular-nums">
                {deduction.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="w-full border-collapse text-[1em]">
        <tbody>
          <tr>
            <td className="border-[2px] border-[#1a1a1a] px-[0.7em] py-[0.45em] font-bold">
              Net pay
            </td>
            <td className="border-[2px] border-[#1a1a1a] px-[0.7em] py-[0.45em] text-right text-[1.25em] font-bold tabular-nums">
              {doc.netPay}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <td className="border border-[#1a1a1a] px-[0.7em] py-[0.4em]">
      <div className="text-[0.78em] font-bold">{label}</div>
      <div className="mt-[0.1em]">{value}</div>
    </td>
  );
}
