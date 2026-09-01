"use client";

import { useState } from "react";
import { Inbox, Paperclip, Send } from "lucide-react";
import { mailMessages } from "../fixtures";
import type { MailMessage, WorkspaceAppProps } from "../types";

export function MailApp({ host }: WorkspaceAppProps) {
  const [selectedId, setSelectedId] = useState(mailMessages[0]?.id ?? "");
  const [composing, setComposing] = useState(false);
  const [body, setBody] = useState("");
  const selected = mailMessages.find((message) => message.id === selectedId) ?? mailMessages[0];
  const c = copy[host.lang];

  const sendReply = () => {
    if (!body.trim()) {
      host.onNudge?.(c.writeFirst);
      return;
    }
    setComposing(false);
    setBody("");
    host.onComplete?.({ appKey: "mail", action: "send-reply", label: selected?.subject });
  };

  return (
    <div
      className="flex h-full min-h-0 flex-1 flex-col bg-white text-[14px] text-[#202124]"
      style={{ fontFamily: "Roboto, Arial, sans-serif" }}
    >
      <div className="flex items-center gap-3 border-b border-[#dadce0] px-4 py-3">
        <Inbox size={24} className="text-[#ea4335]" />
        <span className="text-[22px] font-normal text-[#5f6368]">Mail</span>
        <div className="ml-auto text-[13px] text-[#5f6368]">{host.userName}</div>
      </div>
      <div className="flex min-h-0 flex-1">
        <aside className="w-[240px] shrink-0 border-r border-[#dadce0] bg-[#f8fafd] p-3">
          <button
            onClick={() => setComposing(true)}
            className="mb-4 flex h-12 items-center gap-3 rounded-2xl bg-[#c2e7ff] px-5 text-[14px] font-medium text-[#001d35] shadow-sm"
          >
            <Send size={18} />
            {c.compose}
          </button>
          <div className="space-y-1">
            {mailMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => {
                  setSelectedId(message.id);
                  setComposing(false);
                }}
                className={`grid w-full grid-cols-[1fr_auto] gap-2 rounded-xl px-3 py-2 text-left ${
                  selectedId === message.id ? "bg-[#d3e3fd] font-medium" : "hover:bg-[#e8eaed]"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[13px]">{message.from}</span>
                  <span className="block truncate text-[12px] font-normal text-[#5f6368]">
                    {message.subject}
                  </span>
                </span>
                {message.unread && <span className="mt-1 h-2 w-2 rounded-full bg-[#0b57d0]" />}
              </button>
            ))}
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          {composing ? (
            <ComposePanel
              to={selected?.email ?? ""}
              subject={`Re: ${selected?.subject ?? ""}`}
              body={body}
              setBody={setBody}
              onCancel={() => setComposing(false)}
              onSend={sendReply}
              sendLabel={c.send}
              discardLabel={c.discard}
              placeholder={c.placeholder}
            />
          ) : selected ? (
            <MessageView
              message={selected}
              lang={host.lang}
              onReply={() => setComposing(true)}
              replyLabel={c.reply}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MessageView({
  message,
  lang,
  onReply,
  replyLabel,
}: {
  message: MailMessage;
  lang: "en" | "es";
  onReply: () => void;
  replyLabel: string;
}) {
  return (
    <article className="mx-auto max-w-[760px] px-8 py-6">
      <h1 className="text-[24px] font-normal text-[#202124]">{message.subject}</h1>
      <div className="mt-5 flex items-start gap-3 border-b border-[#eef0f3] pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7e57c2] text-[16px] font-medium text-white">
          {message.from.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{message.from}</span>
            <span className="text-[12px] text-[#5f6368]">&lt;{message.email}&gt;</span>
          </div>
          <div className="mt-1 text-[12px] text-[#5f6368]">{message.time}</div>
        </div>
        <button
          onClick={onReply}
          className="rounded-full border border-[#dadce0] px-4 py-2 text-[13px] font-medium text-[#1a73e8] hover:bg-[#f2f6fc]"
        >
          {replyLabel}
        </button>
      </div>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[#202124]">
        {message.body[lang].map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {message.attachmentName && (
        <button className="mt-6 flex items-center gap-2 rounded-lg border border-[#dadce0] px-3 py-2 text-[13px] hover:bg-[#f8f9fa]">
          <Paperclip size={16} />
          {message.attachmentName}
        </button>
      )}
    </article>
  );
}

function ComposePanel({
  to,
  subject,
  body,
  setBody,
  onSend,
  onCancel,
  sendLabel,
  discardLabel,
  placeholder,
}: {
  to: string;
  subject: string;
  body: string;
  setBody: (value: string) => void;
  onSend: () => void;
  onCancel: () => void;
  sendLabel: string;
  discardLabel: string;
  placeholder: string;
}) {
  return (
    <div className="mx-auto mt-8 w-[min(100%-2rem,680px)] overflow-hidden rounded-2xl border border-[#dadce0] bg-white shadow-[0_4px_14px_rgba(60,64,67,.2)]">
      <div className="bg-[#f2f6fc] px-5 py-3 text-[14px] font-medium">New message</div>
      <div className="px-5">
        <div className="flex gap-3 border-b border-[#e0e3e8] py-2 text-[13px]">
          <span className="w-14 shrink-0 text-[#5f6368]">To</span>
          <span>{to}</span>
        </div>
        <div className="flex gap-3 border-b border-[#e0e3e8] py-2 text-[13px]">
          <span className="w-14 shrink-0 text-[#5f6368]">Subject</span>
          <span>{subject}</span>
        </div>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={placeholder}
          className="min-h-[220px] w-full resize-y border-none py-3 text-[14px] leading-relaxed outline-none placeholder:text-[#767676]"
        />
        <div className="flex items-center gap-2 pb-4">
          <button
            onClick={onSend}
            className="inline-flex min-h-[36px] items-center rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white"
          >
            {sendLabel}
          </button>
          <button onClick={onCancel} className="min-h-[36px] px-3 text-[13px] text-[#5f6368]">
            {discardLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const copy = {
  en: {
    compose: "Compose",
    reply: "Reply",
    send: "Send",
    discard: "Discard",
    placeholder: "Write your message here...",
    writeFirst: "Write a short message before sending.",
  },
  es: {
    compose: "Redactar",
    reply: "Responder",
    send: "Enviar",
    discard: "Descartar",
    placeholder: "Escribe tu mensaje aqui...",
    writeFirst: "Escribe un mensaje corto antes de enviar.",
  },
} as const;
