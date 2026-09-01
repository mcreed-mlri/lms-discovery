"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, PhoneOff, User, Volume2, VolumeX } from "lucide-react";

export interface CallLine {
  who: "Client" | "You";
  text: string;
  /** Basename of the clip in public/audio, e.g. "call-0". */
  audioId?: string;
  /** Fact id this line establishes, revealed in the case notes as it lands. */
  revealsFact?: string;
}

/** Rough read time, used when a clip is missing or audio is muted. */
function fallbackMs(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1700, Math.min(7000, words * 380));
}

/**
 * Storyboard frame 02: the incoming-call interface with a live transcript.
 *
 * Each line is voiced by its own clip - the client and the advocate are
 * different speakers - and the transcript advances when a clip finishes
 * rather than on a fixed timer, so voice and text stay in step. Muted or
 * missing audio falls back to a read-time estimate, so the call always
 * progresses.
 */
export function PhoneCall({
  callerName = "Client",
  lines,
  onRevealFact,
  onFinished,
}: {
  callerName?: string;
  lines: CallLine[];
  onRevealFact?: (factId: string) => void;
  onFinished?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(0);
  const [typing, setTyping] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const advance = useCallback(() => {
    setIndex((i) => i + 1);
  }, []);

  // Call duration ticker.
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Drive the transcript.
  useEffect(() => {
    clearTimers();

    if (index >= lines.length) {
      setTyping(false);
      onFinished?.();
      return;
    }

    const line = lines[index];
    const typingBeat = line.who === "Client" ? 850 : 450;

    setTyping(true);

    const reveal = setTimeout(() => {
      setTyping(false);
      setVisible(index + 1);
      if (line.revealsFact) onRevealFact?.(line.revealsFact);

      const el = audioRef.current;
      if (el && !muted && line.audioId) {
        el.src = `/audio/${line.audioId}.mp3`;
        el.play().catch(() => {
          // Autoplay blocked or clip missing - fall back to read time.
          const t = setTimeout(advance, fallbackMs(line.text));
          timersRef.current.push(t);
        });
      } else {
        const t = setTimeout(advance, fallbackMs(line.text));
        timersRef.current.push(t);
      }
    }, typingBeat);

    timersRef.current.push(reveal);
    return clearTimers;
    // onRevealFact/onFinished are treated as stable; re-running on them would
    // restart the line.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, lines, muted, advance, clearTimers]);

  // Keep the newest line in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visible, typing]);

  const skip = () => {
    clearTimers();
    const el = audioRef.current;
    if (el) el.pause();
    setVisible(lines.length);
    setTyping(false);
    lines.forEach((l) => l.revealsFact && onRevealFact?.(l.revealsFact));
    setIndex(lines.length);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    const el = audioRef.current;
    if (el && next) el.pause();
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const done = index >= lines.length;

  return (
    <div className="overflow-hidden rounded-xl bg-[#0d1b2a]">
      <audio ref={audioRef} onEnded={advance} preload="auto" />

      <div className="flex flex-col gap-7 p-7 md:flex-row md:items-start">
        {/* Phone */}
        <div className="mx-auto w-[268px] shrink-0 rounded-[28px] border border-white/10 bg-[#141f2e] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col items-center">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Incoming call
            </div>
            <div className="mt-1.5 text-[21px] font-medium text-white">{callerName}</div>

            <div className="mt-5 flex h-[86px] w-[86px] items-center justify-center rounded-full bg-white/10">
              <User size={40} strokeWidth={1.5} color="rgba(255,255,255,0.55)" />
            </div>

            <div className="mt-4 font-mono text-[15px] tabular-nums text-white/70">
              {mm}:{ss}
            </div>

            <div className="mt-6 flex items-start justify-center gap-5">
              <CallButton icon={<Mic size={17} />} label="Mute" />
              <CallButton icon={<PhoneOff size={17} />} label="End" danger />
              <CallButton icon={<Volume2 size={17} />} label="Speaker" />
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Live transcript
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute call audio" : "Mute call audio"}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/60 hover:bg-white/10"
              >
                {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
              {!done && (
                <button
                  type="button"
                  onClick={skip}
                  className="text-[12px] text-white/50 underline hover:text-white/80"
                >
                  Skip ahead
                </button>
              )}
            </div>
          </div>

          <div ref={scrollRef} className="mt-3 max-h-[300px] overflow-y-auto pr-1">
            <div className="flex flex-col gap-3.5">
              {lines.slice(0, visible).map((line, i) => (
                <div key={i}>
                  <div
                    className={`text-[12px] font-medium ${
                      line.who === "Client" ? "text-[#68abdf]" : "text-white/55"
                    }`}
                  >
                    {line.who}
                  </div>
                  <p className="mt-0.5 text-[14.5px] leading-relaxed text-white">{line.text}</p>
                </div>
              ))}

              {typing && <TypingDots />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CallButton({
  icon,
  label,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full ${
          danger ? "bg-[#e0463c] text-white" : "bg-white/10 text-white/80"
        }`}
      >
        {icon}
      </span>
      <span className="text-[10.5px] text-white/50">{label}</span>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60"
          style={{ animationDelay: `${i * 180}ms` }}
        />
      ))}
    </div>
  );
}
