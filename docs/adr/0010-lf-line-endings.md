# 0010 — Line endings are normalized to LF

**Status:** Accepted

## Context

`npm run format:check` passed in CI and could never pass on a Windows checkout.

Cause: git stores these blobs as LF, `core.autocrlf=true` checks them out as CRLF
on Windows, and Prettier defaults to `endOfLine: "lf"` — so every file was
reported as unformatted locally. CI runs on Linux, where the checkout is already
LF, so it was green there. `npm run format` would rewrite files that git then
re-converted on the next checkout, producing a loop.

## Decision

Add `.gitattributes` with `* text=auto eol=lf`, so the working tree is LF on every
platform, and set `endOfLine: "lf"` explicitly in `.prettierrc`.

## Consequences

- `format:check` is now a real gate rather than one that only worked on one OS.
- Because git already stored LF, **the index did not change** — this was a
  checkout-behaviour fix, not a repo-wide renormalization, so there was no
  blame-destroying commit.
- Binary types are marked `binary` in `.gitattributes` so they are never touched.
- Anyone with an existing clone may see spurious "modified" entries once, until
  git refreshes its stat cache. Content is identical; `git add --renormalize .`
  settles it.
