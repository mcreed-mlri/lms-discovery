"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

/**
 * Plays the narration for the current scenario step.
 *
 * Files come from `npm run voiceover`, which writes public/audio/<step>.mp3.
 * A missing file is not an error - the control simply reports that there is
 * no narration for that step, so the scenario stays usable before any audio
 * has been generated.
 */
export function Narration({ stepId }: { stepId: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);

  const src = `/audio/${stepId}.mp3`;

  // On step change, load the new clip and autoplay unless muted.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    setPlaying(false);
    el.load();

    // Probe the file directly. The <audio> error event is unreliable here:
    // a dev-server 404 can return an HTML body that never raises an error
    // until playback is attempted, which would mislabel a missing clip as
    // "ready".
    let cancelled = false;
    fetch(src, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setMissing(!res.ok);
      })
      .catch(() => {
        if (!cancelled) setMissing(true);
      });

    if (muted)
      return () => {
        cancelled = true;
      };
    // Browsers block autoplay until the user interacts with the page. The
    // first step will usually fail here and that is fine - the learner
    // presses play, and later steps autoplay normally.
    el.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));

    return () => {
      cancelled = true;
    };
    // `muted` is deliberately excluded: toggling mute should not restart audio.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId, src]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el || missing) return;
    if (el.paused) {
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setMissing(true));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const el = audioRef.current;
    const next = !muted;
    setMuted(next);
    if (el) {
      el.muted = next;
      if (next) {
        el.pause();
        setPlaying(false);
      }
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onEnded={() => setPlaying(false)}
        onError={() => setMissing(true)}
      />

      <button
        type="button"
        onClick={togglePlay}
        disabled={missing}
        aria-label={playing ? "Pause narration" : "Play narration"}
        className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
          missing
            ? "cursor-default border-[#e3e2df] text-[#c4c7cb]"
            : "border-[#cfd6de] text-[#2f6098] hover:bg-[#eef2f7]"
        }`}
      >
        {playing ? <Pause size={14} /> : <Play size={14} />}
      </button>

      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute narration" : "Mute narration"}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#cfd6de] text-[#6f7680] hover:bg-[#eef2f7]"
      >
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>

      <span className="text-[12px] text-[#8a8f96]">
        {missing
          ? "no narration for this step"
          : muted
            ? "narration muted"
            : playing
              ? "narrating"
              : "narration ready"}
      </span>
    </div>
  );
}
