"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Storyboard frames 01 and 09: the cinematic bookends.
 *
 * A full-bleed photograph with text animating in over a scrim. `image` is
 * optional - with no file present the panel falls back to a warm gradient
 * that still reads as a deliberate design rather than a broken image.
 *
 * Animation is plain CSS transitions with staggered delays, so this needs
 * no additions to tailwind.config.
 */
export function Bookend({
  image,
  imageAlt = "",
  children,
  align = "left",
  minHeight = 420,
}: {
  image?: string;
  imageAlt?: string;
  children: ReactNode[];
  align?: "left" | "center";
  minHeight?: number;
}) {
  const [shown, setShown] = useState(false);
  const [imageOk, setImageOk] = useState(Boolean(image));

  // Wait one frame so the transition has an initial state to animate from.
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Verify the file exists rather than showing a broken image.
  useEffect(() => {
    if (!image) return;
    let cancelled = false;
    fetch(image, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setImageOk(res.ok);
      })
      .catch(() => {
        if (!cancelled) setImageOk(false);
      });
    return () => {
      cancelled = true;
    };
  }, [image]);

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#2b2622]" style={{ minHeight }}>
      {imageOk && image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={imageAlt}
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${
              shown ? "scale-105" : "scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_15%_20%,#4a3f36_0%,#2b2622_55%,#1c1917_100%)]" />
      )}

      <div
        className={`relative flex h-full flex-col justify-center gap-4 p-10 ${
          align === "center" ? "items-center text-center" : "items-start"
        }`}
        style={{ minHeight }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className={`transition-all duration-700 ease-out ${
              shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: `${i * 260}ms` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
