# 0003 — Two session verifiers, kept honest by a parity test

**Status:** Accepted

## Context

`lib/session.ts` verifies tokens with `node:crypto`. The route gate in `proxy.ts`
runs on Next's Edge runtime, where `node:crypto` is unavailable.

Options were: pin the proxy to the Node runtime, rewrite the single verifier on
Web Crypto and make it async (breaking existing synchronous callers and their
tests), or maintain a second Edge-safe verifier.

## Decision

Keep both. `lib/session-edge.ts` verifies the same token format using Web Crypto
and a hand-rolled constant-time comparison.

Two implementations of one security check is a drift risk, so it is not left to
discipline: `tests/session-edge.test.ts` asserts both verifiers reach the **same
verdict** on valid, tampered, wrong-secret, expired, and malformed tokens. If
someone changes the token format in one and not the other, those tests fail.

## Consequences

- The proxy is not tied to a specific Next runtime.
- Shared constants live in `lib/session-constants.ts`, because importing the
  cookie name from `lib/session.ts` would pull `node:crypto` into the Edge bundle.
- Any change to the token format means changing two files. The parity test is
  what makes that safe rather than merely intended.
