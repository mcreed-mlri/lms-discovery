"use client";

import { useEffect } from "react";

/* Last-resort boundary: fires when the root layout itself throws, which is the
   one case app/error.tsx cannot catch (it renders *inside* that layout).

   Deliberately dependency-free — no globals.css import, no design tokens, no
   shared components. Whatever broke the root layout may well be the stylesheet
   or the theme script, so this page uses inline styles that cannot fail. It is
   the only screen in the app allowed to look unbranded; being readable matters
   more than being on-system here.

   global-error must supply its own <html> and <body>: it replaces the root
   layout rather than nesting inside it. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[lace] global error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          background: "#faf9f7",
          color: "#14161b",
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <main
          role="alert"
          style={{
            maxWidth: "28rem",
            width: "100%",
            textAlign: "center",
            border: "1px solid #d9d4cc",
            borderRadius: "14px",
            background: "#ffffff",
            padding: "1.75rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#6d675e",
            }}
          >
            LACE Learning Hub
          </p>
          <h1 style={{ margin: "0.75rem 0 0", fontSize: "1.5rem", lineHeight: 1.25 }}>
            The Hub failed to load
          </h1>
          <p style={{ margin: "0.75rem 0 0", lineHeight: 1.6, color: "#4a453e" }}>
            This is a problem on our side, not with your account. Your training records in
            Brightspace are unaffected.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              minHeight: "2.75rem",
              padding: "0 1.25rem",
              borderRadius: "9px",
              border: "none",
              background: "#14161b",
              color: "#ffffff",
              fontSize: "0.875rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reload the Hub
          </button>
          {error.digest ? (
            <p style={{ margin: "1rem 0 0", fontSize: "0.75rem", color: "#6d675e" }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
