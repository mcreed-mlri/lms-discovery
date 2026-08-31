import type { Config } from "tailwindcss";

/* Semantic colours are backed by the CSS variables in app/globals.css so the
   token system has a single source of truth. Use these for new work; existing
   `[color:var(--token)]` arbitrary classes keep working unchanged. */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{js,ts,jsx,tsx,mdx}",
    "./mocks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral base
        paper: "var(--paper)",
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
          sunken: "var(--surface-sunken)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          muted: "var(--ink-muted)",
          soft: "var(--ink-soft)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
          soft: "var(--line-soft)",
        },
        brand: {
          DEFAULT: "var(--brand)",
          ink: "var(--brand-ink)",
          fill: "var(--brand-fill)",
          tint: "var(--brand-tint)",
        },
        // Topic families — orientation signal
        topic: {
          court: {
            DEFAULT: "var(--topic-court)",
            soft: "var(--topic-court-soft)",
            ink: "var(--topic-court-ink)",
          },
          client: {
            DEFAULT: "var(--topic-client)",
            soft: "var(--topic-client-soft)",
            ink: "var(--topic-client-ink)",
          },
          ethics: {
            DEFAULT: "var(--topic-ethics)",
            soft: "var(--topic-ethics-soft)",
            ink: "var(--topic-ethics-ink)",
          },
          research: {
            DEFAULT: "var(--topic-research)",
            soft: "var(--topic-research-soft)",
            ink: "var(--topic-research-ink)",
          },
          drafting: {
            DEFAULT: "var(--topic-drafting)",
            soft: "var(--topic-drafting-soft)",
            ink: "var(--topic-drafting-ink)",
          },
          trauma: {
            DEFAULT: "var(--topic-trauma)",
            soft: "var(--topic-trauma-soft)",
            ink: "var(--topic-trauma-ink)",
          },
          foundations: {
            DEFAULT: "var(--topic-foundations)",
            soft: "var(--topic-foundations-soft)",
            ink: "var(--topic-foundations-ink)",
          },
          neutral: {
            DEFAULT: "var(--topic-neutral)",
            soft: "var(--topic-neutral-soft)",
            ink: "var(--topic-neutral-ink)",
          },
        },
        // Status — lifecycle / progress signal
        status: {
          progress: {
            DEFAULT: "var(--status-progress)",
            soft: "var(--status-progress-soft)",
            ink: "var(--status-progress-ink)",
          },
          next: {
            DEFAULT: "var(--status-next)",
            soft: "var(--status-next-soft)",
            ink: "var(--status-next-ink)",
          },
          done: {
            DEFAULT: "var(--status-done)",
            soft: "var(--status-done-soft)",
            ink: "var(--status-done-ink)",
          },
          new: {
            DEFAULT: "var(--status-new)",
            soft: "var(--status-new-soft)",
            ink: "var(--status-new-ink)",
          },
          updated: {
            DEFAULT: "var(--status-updated)",
            soft: "var(--status-updated-soft)",
            ink: "var(--status-updated-ink)",
          },
          changed: {
            DEFAULT: "var(--status-changed)",
            soft: "var(--status-changed-soft)",
            ink: "var(--status-changed-ink)",
          },
          later: {
            DEFAULT: "var(--status-later)",
            soft: "var(--status-later-soft)",
            ink: "var(--status-later-ink)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
